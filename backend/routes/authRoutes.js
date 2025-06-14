const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
// const SECRET_KEY = "your_jwt_secret_key";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role = "user" } = req.body;

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


module.exports = router;


