const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  resetPassword,
  updatePassword,
  changePassword,
  removeGoogle,
  removeTwitter,
} = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", updatePassword);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, getUser);
router.delete("/", protect, deleteUser);
router.delete("/google", protect, removeGoogle);
router.delete("/twitter", protect, removeTwitter);

module.exports = router;
