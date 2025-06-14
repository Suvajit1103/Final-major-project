const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  email: String,
  amount: Number,
  date: Date,
});

module.exports = mongoose.model("Payment", PaymentSchema);
