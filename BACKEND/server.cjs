const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routs/AUTH.js"); 
const friendRoutes = require("./routs/friends.js");
const userRoutes = require("./routs/users.js");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/users", userRoutes);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
