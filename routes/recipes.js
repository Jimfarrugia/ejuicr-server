const express = require("express");
const router = express.Router();
const {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipes");
const { protect } = require("../middleware/auth");

router.get("/", protect, getRecipes);

router.post("/", protect, createRecipe);

router.put("/:id", protect, updateRecipe);

router.delete("/:id", protect, deleteRecipe);

module.exports = router;
