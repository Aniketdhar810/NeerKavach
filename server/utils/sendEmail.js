const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send verification code email
const sendEmail = async (email, code) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${code}`,
    });

    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

// Send water quality alert email to users in the same region
const sendWaterAlertEmail = async (emails, reportData) => {
  if (!emails || emails.length === 0) {
    console.log("No recipients for water alert");
    return;
  }

  try {
    const transporter = createTransporter();

    const { locationName, riskPercent, riskLevel, diseases, waterSource, pH, turbidity, temperature, reportId, region } = reportData;

    // Risk level styling
    const riskColor = riskLevel === "high" ? "#dc2626" : riskLevel === "moderate" ? "#d97706" : "#059669";
    const riskBg = riskLevel === "high" ? "#fef2f2" : riskLevel === "moderate" ? "#fffbeb" : "#ecfdf5";

    // Format diseases list
    const diseasesList = diseases && diseases.length > 0
      ? diseases.map(d => `<li style="margin: 5px 0;"><strong>${d.name}</strong>: ${d.probability}% probability</li>`).join("")
      : "<li>No specific diseases identified</li>";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Water Quality Alert</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">NeerKavach - Water Disease Prediction System</p>
        </div>
        
        <!-- Alert Banner -->
        <div style="background-color: ${riskBg}; border-left: 4px solid ${riskColor}; padding: 20px; margin-top: 0;">
          <div style="display: flex; align-items: center;">
            <span style="font-size: 32px; margin-right: 15px;">🚨</span>
            <div>
              <h2 style="margin: 0; color: ${riskColor}; font-size: 20px; text-transform: uppercase;">
                ${riskLevel} Risk Detected
              </h2>
              <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">
                A water quality report in your region requires attention
              </p>
            </div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="background-color: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Risk Score -->
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="display: inline-block; background-color: ${riskBg}; border: 3px solid ${riskColor}; border-radius: 50%; width: 100px; height: 100px; line-height: 94px;">
              <span style="font-size: 32px; font-weight: bold; color: ${riskColor};">${riskPercent}%</span>
            </div>
            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Risk Score</p>
          </div>
          
          <!-- Location Info -->
          <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">📍 Location Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${locationName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Region:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${region || "Not specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Report ID:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${reportId}</td>
              </tr>
            </table>
          </div>
          
          <!-- Water Parameters -->
          <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">💧 Water Parameters</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Water Source:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${waterSource}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">pH Level:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${pH}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Turbidity:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${turbidity} NTU</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Temperature:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${temperature}°C</td>
              </tr>
            </table>
          </div>
          
          <!-- Disease Risks -->
          <div style="background-color: #fef2f2; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #991b1b; font-size: 16px;">🦠 Potential Disease Risks</h3>
            <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px;">
              ${diseasesList}
            </ul>
          </div>
          
          <!-- Precautions -->
          <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">✅ Recommended Precautions</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px;">
              <li style="margin: 5px 0;">Boil water before drinking or cooking</li>
              <li style="margin: 5px 0;">Use water purification tablets if available</li>
              <li style="margin: 5px 0;">Avoid direct consumption of untreated water</li>
              <li style="margin: 5px 0;">Report any illness symptoms to local health authorities</li>
            </ul>
          </div>
          
          <!-- Footer Note -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This is an automated alert from NeerKavach Water Quality Monitoring System.<br>
              You received this email because you are registered in the ${region || "affected"} region.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} NeerKavach. All rights reserved.<br>
            Water Disease Prediction & Surveillance System
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    const plainText = `
⚠️ WATER QUALITY ALERT - ${riskLevel.toUpperCase()} RISK

A water quality report in your region shows ${riskPercent}% risk level.

LOCATION: ${locationName}
REGION: ${region || "Not specified"}
REPORT ID: ${reportId}

WATER PARAMETERS:
- Water Source: ${waterSource}
- pH Level: ${pH}
- Turbidity: ${turbidity} NTU
- Temperature: ${temperature}°C

POTENTIAL DISEASE RISKS:
${diseases && diseases.length > 0 ? diseases.map(d => `- ${d.name}: ${d.probability}% probability`).join("\n") : "- No specific diseases identified"}

RECOMMENDED PRECAUTIONS:
- Boil water before drinking or cooking
- Use water purification tablets if available
- Avoid direct consumption of untreated water
- Report any illness symptoms to local health authorities

Stay safe!
NeerKavach Team
    `;

    // Send to all recipients
    const info = await transporter.sendMail({
      from: `"NeerKavach Alert" <${process.env.EMAIL_USER}>`,
      to: emails.join(", "),
      subject: `⚠️ Water Quality Alert: ${riskLevel.toUpperCase()} Risk (${riskPercent}%) in ${region || locationName}`,
      text: plainText,
      html: htmlContent,
    });

    console.log(`Water alert emails sent to ${emails.length} users:`, info.response);
    return { success: true, count: emails.length };
  } catch (error) {
    console.error("Water alert email sending failed:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, sendWaterAlertEmail };