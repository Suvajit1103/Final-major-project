const express = require("express");
const Payment = require("../models/Payment");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, amount } = req.body;
    const newPayment = new Payment({ email, amount, date: new Date() });

    await newPayment.save();
    res.json({ message: "Payment Successful!" });
  } catch (error) {
    res.status(500).json({ error: "Payment Failed" });
  }
});
router.get("/", async (req, res) => {
    const { email } = req.query;
    try {
      const payments = await Payment.find({ email }).sort({ date: -1 });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Error fetching payment history" });
    }
  });

module.exports = router;
