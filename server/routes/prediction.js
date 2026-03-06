const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const predictionController = require("../controllers/predictionController");

// Reporter-only: trigger prediction for a report
router.post(
  "/:reportId",
  authMiddleware,
  roleMiddleware("reporter"),
  predictionController.getPrediction
);

// Any authenticated user: get hotspot data
router.get("/hotspots", authMiddleware, predictionController.getHotspots);

module.exports = router;
