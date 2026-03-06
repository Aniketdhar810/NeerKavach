const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const reportController = require("../controllers/reportController");

// Reporter-only: submit a new report
router.post(
  "/",
  authMiddleware,
  roleMiddleware("reporter"),
  reportController.createReport
);

// Any authenticated user: view all reports
router.get("/", authMiddleware, reportController.getAllReports);

// Reporter-only: view own reports
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("reporter"),
  reportController.getMyReports
);

// Any authenticated user: view a single report
router.get("/:id", authMiddleware, reportController.getReportById);

// Reporter-only: update report status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("reporter"),
  reportController.updateReportStatus
);

module.exports = router;
