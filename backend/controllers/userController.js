const jsonwebtoken = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc     Register a new user
//@route    POST /api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new error("Please provide all the necesscary fields");
  }

  //Check the User Exists
  const UserExists = await User.findOne({
    email: email,
  });

  if (UserExists) {
    res.status(400);
    throw new error("User Already Exists");
  }

  //Hash the password
  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(password, salt);

  // Create a new User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error("Invalid User Data");
  }
  res.json({ massage: "Register Route" });
});

//@desc     Authenicate a new user
//@route    POST /api/users/login
//@access   Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check for user email
  const user = await User.findOne({ email });

  if (user && (await bycrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new error("Invalid Email or Password");
  }
});

//@desc     Get user data
//@route    GET /api/users
//@access   Private
const getMe = asyncHandler(async (req, res) => {
 const{_id, name, email} = await User.findById(req.user.id);
 res.json({
   id:_id,
   name,
   email
 });
});

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, loginUser, getMe };
