const express = require("express");
const User = require("../model/user");
const authMiddleware = require("../middleware/auth.js"); // Assuming you have middleware to validate JWT token
const router = express.Router();

// Get all users excluding the current user and their friends
router.get("/", authMiddleware, async (req, res) => {
  const currentUserId = req.userId; // Assuming the userId is extracted by the middleware from JWT

  try {
    // Find the current user and their friends
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all users except the current user and their friends
    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude the current user
      _id: { $nin: currentUser.friends }, // Exclude friends (using $nin operator)
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;