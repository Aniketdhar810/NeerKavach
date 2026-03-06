const axios = require("axios");
const Report = require("../models/Report");

const ML_API_URL = process.env.ML_API_URL || "http://localhost:5001/predict";

// POST /api/prediction/:reportId — Trigger AI prediction for a report
exports.getPrediction = async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Build payload for the ML model
    const payload = {
      pH: report.pH,
      turbidity: report.turbidity,
      dissolvedOxygen: report.dissolvedOxygen,
      nitrateLevel: report.nitrateLevel,
      contaminantLevel: report.contaminantLevel,
      bacteriaCount: report.bacteriaCount,
      fecalColiform: report.fecalColiform,
      totalColiform: report.totalColiform,
      waterSource: report.waterSource,
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
    const reports = await Report.find({ "prediction.riskLevel": { $exists: true } })
      .select("reportId locationName latitude longitude prediction waterSource pH turbidity createdAt")
      .sort({ createdAt: -1 });
    res.json(reports);
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
