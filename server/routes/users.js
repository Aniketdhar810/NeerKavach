const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Get current user profile
router.get("/me", authMiddleware, userController.getProfile);

// Update current user profile
router.patch("/me", authMiddleware, userController.updateProfile);

module.exports = router;
