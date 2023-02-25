const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipe");

// @desc      Get recipes
// @route     GET /api/recipes
// @access    Private
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find();
  res.status(200).json(recipes);
});

// @desc      Create a recipe
// @route     POST /api/recipes
// @access    Private
const createRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.create(req.body);
  res.status(200).json(recipe);
});

// @desc      Update a recipe
// @route     PUT /api/recipes/:id
// @access    Private
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(400);
    throw new Error("Recipe not found.");
  }
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedRecipe);
});

// @desc      Delete a recipe
// @route     DELETE /api/recipes/:id
// @access    Private
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(400);
    throw new Error("Recipe not found");
  }
  const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedRecipe);
});

module.exports = {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
