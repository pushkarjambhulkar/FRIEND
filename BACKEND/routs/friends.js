const express = require("express");
const User = require("../model/user.js");
const authMiddleware = require("../middleware/auth.js"); // Middleware to authenticate users

const router = express.Router();

// Middleware to protect routes
router.use(authMiddleware);

// Fetch the current user's friends
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("friends");
    res.status(200).json(user.friends);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Something went wrong" });
  }
});

// Search users by name (excluding the current user and existing friends)
router.get("/users/search", async (req, res) => {
  try {
    const { query } = req.query;

    // Get the current user's friends
    const currentUser = await User.findById(req.userId);
    const friendIds = currentUser.friends;

    // Find users matching the search query, excluding the current user and existing friends
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // Case-insensitive search
      _id: { $ne: req.userId, $nin: friendIds }, // Exclude the current user and existing friends
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Add a friend
router.post("/addNew", async (req, res) => {
  try {
    const { friendId } = req.body;

    // Get the current user and check if they are already friends
    const currentUser = await User.findById(req.userId);
    if (currentUser.friends.includes(friendId)) {
      return res.status(400).json({ message: "User is already a friend" });
    }

    // Add friend to the current user's friends list
    currentUser.friends.push(friendId);
    await currentUser.save(); // Save the changes to the current user's friends list

    // Add the current user to the friend's friends list (bidirectional relationship)
    const friendUser = await User.findById(friendId);
    if (!friendUser.friends.includes(req.userId)) {
      friendUser.friends.push(req.userId);
      await friendUser.save(); // Save the changes to the friend's friends list
    }

    res.status(201).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Remove a friend
router.delete("/:friendId", async (req, res) => {
  try {
    const { friendId } = req.params;

    // Check if friendId is valid
    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    // Check if req.userId is valid
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Ensure friendId and req.userId are both valid and not null
    const friendIdStr = friendId.toString(); // Convert friendId to string
    const userIdStr = req.userId.toString(); // Convert req.userId to string

    // Find current user and friend
    const currentUser = await User.findById(userIdStr);
    const friendUser = await User.findById(friendIdStr);

    // If either user is not found
    if (!currentUser || !friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove friend from the current user's friends list
    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== friendIdStr
    );
    await currentUser.save();

    // Remove current user from the friend's friends list
    friendUser.friends = friendUser.friends.filter(
      (id) => id.toString() !== req.userId.toString()
    );
    await friendUser.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
