const mongoose = require("mongoose");




const ScheduledRepaymentSchema = new mongoose.Schema({
  date: Date,
  amount: Number,
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'PARTIALLY PAID'],
    default: 'PENDING'
  }
});



const LoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
   name: String,
  contactNumber: Number,
  loanAmount: Number,
  paidAmount: {
    type: Number,
    default: 0
  },
  amountLeft: Number,
  loanDuration: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'pending'
  },
  scheduledRepayments: [ScheduledRepaymentSchema]
}, { timestamps: true });


module.exports = mongoose.model("Loan", LoanSchema);
