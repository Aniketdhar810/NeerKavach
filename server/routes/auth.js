const router = require("express").Router();
const passport = require("passport");
const auth = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send-code", auth.sendCode);
router.post("/verify-code", auth.verifyCode);
router.post("/complete-signup", auth.completeSignup);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  auth.login
);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      department: req.user.department,
      region: req.user.region,
    },
  });
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

module.exports = router;