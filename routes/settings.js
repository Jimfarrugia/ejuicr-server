const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settings");
const { protect } = require("../middleware/auth");

router.get("/", protect, getSettings);

router.post("/", protect, updateSettings);

module.exports = router;
