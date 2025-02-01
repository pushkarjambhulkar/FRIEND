const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  location: { type: String }, // City, Country, etc.
  profilePicture: { type: String }, // URL to profile picture
  bio: { type: String, maxlength: 300 }, // Short bio/description

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs (Friends List)

  hobbies: [{ type: String }], // Array of hobbies/interests
  profession: { type: String }, // Job title or education status

  createdAt: { type: Date, default: Date.now }, // Timestamp for account creation
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = mongoose.model("User", userSchema);
