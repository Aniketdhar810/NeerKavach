const Report = require("../models/Report");

// Generate unique report ID
const generateReportId = () => {
  const year = new Date().getFullYear();
  const seq = Math.floor(100 + Math.random() * 900);
  return `WQ-IND-${year}-${seq}`;
};

// POST /api/reports — Reporter submits a water test report
exports.createReport = async (req, res) => {
  try {
    const {
      waterSource,
      pH,
      turbidity,
      dissolvedOxygen,
      nitrateLevel,
      contaminantLevel,
      bacteriaCount,
      fecalColiform,
      totalColiform,
      locationName,
      latitude,
      longitude,
    } = req.body;

    if (!waterSource || pH == null || turbidity == null || !locationName || latitude == null || longitude == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const report = new Report({
      reportId: generateReportId(),
      submittedBy: req.user._id,
      waterSource,
      pH: Number(pH),
      turbidity: Number(turbidity),
      dissolvedOxygen: dissolvedOxygen != null ? Number(dissolvedOxygen) : undefined,
      nitrateLevel: nitrateLevel != null ? Number(nitrateLevel) : undefined,
      contaminantLevel: contaminantLevel != null ? Number(contaminantLevel) : undefined,
      bacteriaCount: bacteriaCount != null ? Number(bacteriaCount) : undefined,
      fecalColiform,
      totalColiform: totalColiform != null ? Number(totalColiform) : undefined,
      locationName,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    await report.save();
    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/reports — Get all reports (any authenticated user)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("submittedBy", "username email region")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/reports/my — Get reporter's own reports
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ submittedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (error) {
    console.error("Get my reports error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/reports/:id — Get single report by reportId
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.id }).populate(
      "submittedBy",
      "username email region"
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(report);
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/reports/:id/status — Update report status (reporter only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "reviewed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const report = await Report.findOneAndUpdate(
      { reportId: req.params.id },
      { status },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(report);
  } catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
