const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  resetPassword,
  updatePassword,
  changePassword,
} = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", updatePassword);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, getUser);

module.exports = router;
