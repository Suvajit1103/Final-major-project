 const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {authMiddleware} = require("../middleware/authmiddleware");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const router = express.Router();
// const SECRET_KEY = "your_jwt_secret_key";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role = "user", profilePic = "" } = req.body;

    // Basic input validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role, // use default if not provided
      profilePic,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exist
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    //Create JWT token
    const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

  // Return token and safe user data (excluding password)
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic || null,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// upload profile picture
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { name, password } = req.body;
      const userId = req.user._id; // ⬅️ fix this if your middleware adds userId

      const updateFields = {};

      if (name) updateFields.name = name;
      if (password) updateFields.password = await bcrypt.hash(password, 10);
      if (req.file) {
        updateFields.profilePic = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true }
      );

      res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ error: "Profile update failed" });
    }
  }
);


//remove profile pic
router.put("/remove-profile-pic", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.profilePic) {
      const filePath = path.join(__dirname, "..", user.profilePic);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file from uploads/
      }

      user.profilePic = "";
      await user.save();

      res.json({ message: "Profile picture removed", user });
    } else {
      res.status(400).json({ error: "No profile picture to remove" });
    }
  } catch (err) {
    console.error("Error removing profile picture:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;


