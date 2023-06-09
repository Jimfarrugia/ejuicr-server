const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipe");
const User = require("../models/user");

// @desc      Get a recipe
// @route     GET /api/recipes/:id
// @access    Private
const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found.");
  }
  if (recipe.author.toString() !== req.user.id) {
    res.status(401);
    throw new Error("That recipe does not belong to you.");
  }
  res.status(200).json(recipe);
});

// @desc      Get all recipes
// @route     GET /api/recipes
// @access    Private
const getAllRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ author: req.user.id });
  res.status(200).json(recipes);
});

// @desc      Create a recipe
// @route     POST /api/recipes
// @access    Private
const createRecipe = asyncHandler(async (req, res) => {
  const title = req.body.name;
  // throw error if title is empty
  if (!title) {
    res.status(400);
    throw new Error("Recipe title must not be blank.");
  }
  // throw error if user has a recipe with the same title
  const duplicateRecipe = await Recipe.findOne({ name: title });
  if (duplicateRecipe) {
    res.status(400);
    throw new Error(
      `You already have a recipe named ${title}. Please use a different title.`
    );
  }
  const recipe = await Recipe.create({ ...req.body, author: req.user.id });
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
  const user = await User.findById(req.user.id);
  // Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found.");
  }
  // Make sure recipe auther matches the user's id
  if (recipe.author.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized.");
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
  const user = await User.findById(req.user.id);
  // Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found.");
  }
  // Make sure recipe auther matches the user's id
  if (recipe.author.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized.");
  }
  const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: deletedRecipe.id });
});

module.exports = {
  getRecipe,
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
