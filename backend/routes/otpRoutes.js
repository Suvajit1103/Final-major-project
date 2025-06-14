// const express = require("express");
// const router = express.Router();
// const twilio = require("twilio");
// const OTP = require("../models/otpModel");
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // Generate OTP and Send SMS
// router.post("/send-otp", async (req, res) => {
//   const { phone } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

//   try {
//     await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phone,
//     });

//     await OTP.findOneAndUpdate({ phone }, { otp }, { upsert: true });
//     res.json({ message: "OTP sent successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// });

// // Verify OTP and Register/Login
// router.post("/verify-otp", async (req, res) => {
//   const { phone, otp } = req.body;
//   const validOTP = await OTP.findOne({ phone, otp });

//   if (!validOTP) return res.status(400).json({ error: "Invalid or expired OTP" });

//   let user = await User.findOne({ phone });
//   if (!user) {
//     user = new User({ phone });
//     await user.save();
//   }

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
//   res.json({ message: "Login successful", token });

//   await OTP.deleteOne({ phone }); // Remove OTP after verification
// });

// module.exports = router;
