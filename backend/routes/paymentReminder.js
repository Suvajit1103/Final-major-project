const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const User = require("../models/user");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/send-reminder", async (req, res) => {
  try {
    const users = await User.find();
    const reminders = users.map((user) =>
      client.messages.create({
        body: `Reminder: Your monthly loan payment is due. Please make the payment to avoid penalties.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone,
      })
    );

    await Promise.all(reminders);
    res.json({ message: "Payment reminders sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send reminders." });
  }
});

module.exports = router;
