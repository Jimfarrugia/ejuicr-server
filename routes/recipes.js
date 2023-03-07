const express = require("express");
const router = express.Router();
const {
  getRecipe,
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipes");
const { protect } = require("../middleware/auth");

router.get("/", protect, getAllRecipes);

router.get("/:id", protect, getRecipe);

router.post("/", protect, createRecipe);

router.put("/:id", protect, updateRecipe);

router.delete("/:id", protect, deleteRecipe);

module.exports = router;
