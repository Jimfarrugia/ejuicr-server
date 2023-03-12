const asyncHandler = require("express-async-handler");
const Settings = require("../models/settings");

// @desc      Get a user's settings
// @route     GET /api/settings/
// @access    Private
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne({ user: req.user.id });
  if (!settings) return res.status(200).json({});
  res.status(200).json(settings);
});

// @desc      Update a user's settings
// @route     POST /api/settings/
// @access    Private
const updateSettings = asyncHandler(async (req, res) => {
  const user = req.user.id;
  const settings = await Settings.findOne({ user });
  if (!settings) {
    const newSettings = await Settings.create({ ...req.body, user });
    res.status(200).json(newSettings);
  } else {
    const updatedSettings = await Settings.findOneAndUpdate(
      { user },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedSettings);
  }
});

module.exports = {
  getSettings,
  updateSettings,
};
