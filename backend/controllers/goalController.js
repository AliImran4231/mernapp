const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
const User = require("../models/userModel");

//@desc Get Goals
//@route GET /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.status(200).json(goals);
});

//@desc Set Goals
//@route Post /api/goals
//@access Private
const setGoal = asyncHandler(async (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const goal = await Goal.create({
    text: req.body.text,
    text: req.user.id,
  });

  res.status(200).json(goal);
});

//@desc Update Goals
//@route Put /api/goals:id
//@access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  const user= await User.findById(req.user._id);
  //check for User
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  //Makes sure the user is the owner of the goal
  if (goal.user.toString() !== user._id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

//@desc Delete Goals
//@route Deleyte /api/goals:id
//@access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

    const user = await User.findById(req.user._id);
    //check for User
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    //Makes sure the user is the owner of the goal
    if (goal.user.toString() !== user._id) {
      res.status(401);
      throw new Error("User not authorized");
    }
    
  await goal.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getGoals, createGoal: setGoal, updateGoal, deleteGoal };
