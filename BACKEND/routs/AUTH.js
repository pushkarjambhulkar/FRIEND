const express = require("express");
const User = require("../model/userModel");
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const {
    username,
    email,
    profilePicture,
    password,
    dateOfBirth,
    gender,
    location,
    hobbies,
    profession,
  } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Username or Email already taken" });

    const user = new User({
      username,
      email,
      password,
      dateOfBirth,
      gender,
      location,
      profilePicture,
      hobbies: hobbies || [],
      profession,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Something went wrong" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});



module.exports = router;
