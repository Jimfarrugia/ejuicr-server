const express = require("express");
const router = express.Router();
const {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipes");

router.get("/", getRecipes);

router.post("/", createRecipe);

router.put("/:id", updateRecipe);

router.delete("/:id", deleteRecipe);

module.exports = router;
