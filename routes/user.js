const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  resetPassword,
  updatePassword,
} = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", updatePassword);
router.get("/me", protect, getUser);

module.exports = router;
