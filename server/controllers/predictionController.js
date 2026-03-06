const axios = require("axios");
const Report = require("../models/Report");
const User = require("../models/User");
const { sendWaterAlertEmail } = require("../utils/sendEmail");

const ML_API_URL = process.env.ML_API_URL || "http://localhost:5001/predict";

// Indian states mapping (with common variations/typos)
const INDIAN_STATES = {
  "andhra pradesh": "Andhra Pradesh",
  "arunachal pradesh": "Arunachal Pradesh",
  "assam": "Assam",
  "bihar": "Bihar",
  "chhattisgarh": "Chhattisgarh",
  "chattisgarh": "Chhattisgarh",
  "goa": "Goa",
  "gujarat": "Gujarat",
  "gujrat": "Gujarat",
  "haryana": "Haryana",
  "himachal pradesh": "Himachal Pradesh",
  "jharkhand": "Jharkhand",
  "jahrkhand": "Jharkhand", // common typo
  "jharkhnd": "Jharkhand",
  "karnataka": "Karnataka",
  "kerala": "Kerala",
  "madhya pradesh": "Madhya Pradesh",
  "maharashtra": "Maharashtra",
  "manipur": "Manipur",
  "meghalaya": "Meghalaya",
  "mizoram": "Mizoram",
  "nagaland": "Nagaland",
  "odisha": "Odisha",
  "orissa": "Odisha",
  "punjab": "Punjab",
  "rajasthan": "Rajasthan",
  "sikkim": "Sikkim",
  "tamil nadu": "Tamil Nadu",
  "tamilnadu": "Tamil Nadu",
  "telangana": "Telangana",
  "tripura": "Tripura",
  "uttar pradesh": "Uttar Pradesh",
  "up": "Uttar Pradesh",
  "uttarakhand": "Uttarakhand",
  "west bengal": "West Bengal",
  "wb": "West Bengal",
  "delhi": "Delhi",
  "new delhi": "Delhi",
};

// Helper function to extract state from location name
const extractState = (locationName) => {
  if (!locationName) return null;
  
  const locationLower = locationName.toLowerCase().trim();
  
  // Check each state pattern
  for (const [pattern, stateName] of Object.entries(INDIAN_STATES)) {
    if (locationLower.includes(pattern)) {
      return stateName;
    }
  }
  
  return null;
};

// Helper function to extract city/district from location
const extractCity = (locationName) => {
  if (!locationName) return null;
  const parts = locationName.split(/[,\-]/);
  return parts[0]?.trim().toLowerCase() || null;
};

// Send alerts to users in the same state/region
const sendRegionalAlerts = async (report, prediction) => {
  try {
    // Only send alerts if risk is >= 40%
    if (prediction.riskPercent < 40) {
      console.log(`Risk ${prediction.riskPercent}% is below 40% threshold, no alerts sent`);
      return;
    }

    // Extract state from report location
    const reportState = extractState(report.locationName);
    const reportCity = extractCity(report.locationName);
    
    console.log(`\n=== ALERT SYSTEM ===`);
    console.log(`Report location: "${report.locationName}"`);
    console.log(`Extracted state: "${reportState}"`);
    console.log(`Extracted city: "${reportCity}"`);
    console.log(`Risk: ${prediction.riskPercent}%`);

    // Build query to find users in the same state
    // Match users whose region contains the same state name
    const queryConditions = [];
    
    if (reportState) {
      // Match the state name in user's region
      queryConditions.push({ region: { $regex: new RegExp(reportState, "i") } });
      
      // Also match common variations/typos of the state
      for (const [pattern, stateName] of Object.entries(INDIAN_STATES)) {
        if (stateName === reportState) {
          queryConditions.push({ region: { $regex: new RegExp(pattern, "i") } });
        }
      }
    }
    
    // Also try matching by city name
    if (reportCity) {
      queryConditions.push({ region: { $regex: new RegExp(reportCity, "i") } });
    }

    if (queryConditions.length === 0) {
      console.log(`Could not extract region from location: ${report.locationName}`);
      return;
    }

    // Find all verified users matching any condition
    const usersInRegion = await User.find({
      isVerified: true,
      $or: queryConditions
    }).select("email region");

    console.log(`Query conditions: ${JSON.stringify(queryConditions.slice(0, 3))}...`);
    console.log(`Found ${usersInRegion.length} matching users`);
    
    if (usersInRegion.length === 0) {
      // Log all users for debugging
      const allUsers = await User.find({ isVerified: true }).select("email region");
      console.log(`All verified users: ${JSON.stringify(allUsers.map(u => ({ email: u.email, region: u.region })))}`);
      return;
    }

    usersInRegion.forEach(u => {
      console.log(`  - ${u.email} (region: ${u.region})`);
    });

    const emails = usersInRegion.map(u => u.email);

    // Prepare report data for email
    const reportData = {
      locationName: report.locationName,
      riskPercent: prediction.riskPercent,
      riskLevel: prediction.riskLevel,
      diseases: prediction.diseases,
      waterSource: report.waterSource,
      pH: report.pH,
      turbidity: report.turbidity,
      temperature: report.temperature || 25,
      reportId: report.reportId,
      region: reportState || report.locationName,
    };

    // Send alert emails
    console.log(`Sending alerts to ${emails.length} users...`);
    const result = await sendWaterAlertEmail(emails, reportData);
    console.log(`Alert email result:`, result);
    console.log(`=== END ALERT ===\n`);

  } catch (error) {
    console.error("Error sending regional alerts:", error);
  }
};

// POST /api/prediction/:reportId — Trigger AI prediction for a report
exports.getPrediction = async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Build payload for the ML model
    const payload = {
      waterSource: report.waterSource,
      pH: report.pH,
      turbidity: report.turbidity,
      dissolvedOxygen: report.dissolvedOxygen || 8.0,
      nitrateLevel: report.nitrateLevel || 0.5,
      contaminantLevel: report.contaminantLevel || 10.0,
      bacteriaCount: report.bacteriaCount || 1000,
      fecalColiform: report.fecalColiform || "Absent",
      totalColiform: report.totalColiform || 100,
      temperature: report.temperature || 25.0,
    };

    let prediction;
    try {
      const mlResponse = await axios.post(ML_API_URL, payload, {
        timeout: 10000,
      });
      prediction = mlResponse.data;
    } catch {
      // Fallback: simple rule-based prediction if ML service is unavailable
      prediction = generateFallbackPrediction(report);
    }

    // Save prediction to report
    report.prediction = {
      riskLevel: prediction.riskLevel,
      riskPercent: prediction.riskPercent,
      diseases: prediction.diseases || [],
    };
    await report.save();

    // Send email alerts to users in the same region if risk >= 40%
    // Run asynchronously to not block the response
    sendRegionalAlerts(report, report.prediction).catch(err => {
      console.error("Failed to send regional alerts:", err);
    });

    res.json({
      reportId: report.reportId,
      prediction: report.prediction,
      waterTestSummary: {
        waterSource: report.waterSource,
        pH: report.pH,
        turbidity: report.turbidity,
        dissolvedOxygen: report.dissolvedOxygen,
        nitrateLevel: report.nitrateLevel,
        contaminantLevel: report.contaminantLevel,
        bacteriaCount: report.bacteriaCount,
        fecalColiform: report.fecalColiform,
        totalColiform: report.totalColiform,
        temperature: report.temperature,
        locationName: report.locationName,
        latitude: report.latitude,
        longitude: report.longitude,
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ message: "Prediction failed" });
  }
};

// GET /api/prediction/hotspots — Get all reports with predictions for hotspot map
exports.getHotspots = async (req, res) => {
  try {
    // First try to get reports from database
    const reports = await Report.find({ "prediction.riskLevel": { $exists: true } })
      .select("reportId locationName latitude longitude prediction waterSource pH turbidity temperature createdAt")
      .sort({ createdAt: -1 });
    
    // If we have reports, return them
    if (reports && reports.length > 0) {
      return res.json(reports);
    }

    // No reports found - fetch sample hotspots from ML service (uses dataset)
    try {
      const ML_HOTSPOTS_URL = process.env.ML_API_URL?.replace('/predict', '/hotspots') || "http://localhost:5001/hotspots";
      const mlResponse = await axios.get(ML_HOTSPOTS_URL, { timeout: 10000 });
      
      if (mlResponse.data && mlResponse.data.length > 0) {
        // Transform ML hotspot data to match frontend expected format
        const hotspots = mlResponse.data
          .filter(h => h.riskLevel === "high" || h.riskPercent >= 40) // Only high-risk
          .slice(0, 20) // Limit to 20 hotspots
          .map((h, index) => ({
            _id: `ml-${h.id || index}`,
            reportId: `DATASET-${h.id || index}`,
            locationName: `${h.waterSource} Source #${h.id || index + 1}`,
            latitude: 20 + Math.random() * 10, // Random India lat range
            longitude: 73 + Math.random() * 15, // Random India lng range  
            waterSource: h.waterSource,
            pH: h.pH,
            turbidity: h.turbidity,
            temperature: h.temperature,
            prediction: {
              riskLevel: h.riskLevel,
              riskPercent: h.riskPercent,
              diseases: [
                { name: "Diarrhea", probability: h.diarrhea },
                { name: "Cholera", probability: h.cholera },
                { name: "Typhoid", probability: h.typhoid }
              ]
            },
            createdAt: new Date()
          }));
        
        return res.json(hotspots);
      }
    } catch (mlError) {
      console.error("ML hotspots fetch failed:", mlError.message);
    }

    // Return empty array if both fail
    res.json([]);
  } catch (error) {
    console.error("Hotspots error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Simple rule-based fallback when ML service is down
function generateFallbackPrediction(report) {
  let riskScore = 0;

  // pH risk (ideal: 6.5-8.5)
  if (report.pH < 6.5 || report.pH > 8.5) riskScore += 20;
  if (report.pH < 5.5 || report.pH > 9.5) riskScore += 15;

  // Turbidity risk (ideal: < 1 NTU)
  if (report.turbidity > 5) riskScore += 25;
  else if (report.turbidity > 1) riskScore += 10;

  // Bacteria count
  if (report.bacteriaCount > 100) riskScore += 25;
  else if (report.bacteriaCount > 10) riskScore += 10;

  // Fecal coliform
  if (report.fecalColiform === "Present (Significant)") riskScore += 20;
  else if (report.fecalColiform === "Present (Trace)") riskScore += 10;

  // Contaminant level
  if (report.contaminantLevel > 100) riskScore += 15;
  else if (report.contaminantLevel > 50) riskScore += 8;

  const riskPercent = Math.min(riskScore, 100);
  let riskLevel = "low";
  if (riskPercent >= 60) riskLevel = "high";
  else if (riskPercent >= 30) riskLevel = "moderate";

  const diseases = [
    { name: "Diarrhea", probability: Math.min(riskPercent + 5, 100) },
    { name: "Cholera", probability: Math.min(Math.round(riskPercent * 0.6), 100) },
    { name: "Typhoid", probability: Math.min(Math.round(riskPercent * 0.4), 100) },
  ];

  return { riskLevel, riskPercent, diseases };
}

// Test endpoint to manually trigger alerts for an existing report
const triggerAlertsManually = async (req, res) => {
  const { reportId } = req.params;
  
  try {
    const Report = require("../models/Report");
    // Try both MongoDB _id and reportId field
    let report = await Report.findById(reportId).catch(() => null);
    if (!report) {
      report = await Report.findOne({ reportId: reportId });
    }
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    if (!report.prediction) {
      return res.status(400).json({ message: "Report has no prediction" });
    }
    
    const riskPercent = report.prediction.riskPercent || 0;
    const location = report.locationName || report.location || "Unknown";
    
    console.log("=== MANUAL ALERT TRIGGER ===");
    console.log("Report ID:", reportId);
    console.log("Location:", location);
    console.log("Risk:", riskPercent + "%");
    
    if (riskPercent < 40) {
      return res.json({ 
        message: "Risk too low for alerts", 
        riskPercent,
        threshold: 40 
      });
    }
    
    // Get all users to see what regions are stored
    const allUsers = await User.find({}, 'email region isVerified');
    console.log("All users in database:");
    allUsers.forEach(u => {
      console.log(`  - ${u.email}: region="${u.region}", verified=${u.isVerified}`);
    });
    
    // Try to send alerts using the same logic as real prediction
    await sendRegionalAlerts(report, report.prediction);
    
    return res.json({
      message: "Alert trigger completed",
      location,
      riskPercent,
      usersInDb: allUsers.map(u => ({ email: u.email, region: u.region, isVerified: u.isVerified }))
    });
    
  } catch (error) {
    console.error("Manual alert trigger error:", error);
    return res.status(500).json({ message: "Error triggering alerts", error: error.message });
  }
};

// Simple test endpoint to check email functionality
const testEmail = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email address required" });
  }
  
  try {
    console.log("Testing email to:", email);
    
    const reportData = {
      locationName: "Test Location, Test State",
      riskPercent: 65,
      riskLevel: "high",
      diseases: [
        { name: "Diarrhea", probability: 70 },
        { name: "Cholera", probability: 40 },
        { name: "Typhoid", probability: 30 }
      ],
      waterSource: "Test River",
      pH: 7.5,
      turbidity: 10,
      temperature: 25,
      reportId: "TEST-001",
      region: "Test State"
    };
    
    const result = await sendWaterAlertEmail([email], reportData);
    
    if (result.success) {
      return res.json({ message: "Test email sent successfully to " + email, result });
    } else {
      return res.status(500).json({ message: "Email sending failed", result });
    }
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({ message: "Email sending failed", error: error.message });
  }
};

// Export the test functions
exports.triggerAlertsManually = triggerAlertsManually;
exports.testEmail = testEmail;
