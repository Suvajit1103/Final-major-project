const Loan = require("../models/Loan");


const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ error: "Loan not found" });
    res.json(loan);
  } catch (err) {
    console.error("Error fetching loan by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const processRepayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { paidAmount } = req.body;

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount." });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    let remainingAmount = paidAmount;

    for (let i = 0; i < loan.scheduledRepayments.length; i++) {
      let installment = loan.scheduledRepayments[i];
      if (installment.status === "PAID") continue;

      if (remainingAmount >= installment.amount) {
        remainingAmount -= installment.amount;
        installment.amount = 0;
        installment.status = "PAID";
      } else if (remainingAmount > 0) {
        installment.amount -= remainingAmount;
        installment.status = "PARTIALLY PAID";
        remainingAmount = 0;
        break;
      } else {
        break;
      }
    }

    loan.paidAmount += paidAmount;
    loan.amountLeft = loan.loanAmount - loan.paidAmount;

    if (loan.amountLeft <= 0) {
      loan.amountLeft = 0;
      loan.status = "paid";
    }

    await loan.save();

    res.json({ message: "Payment processed", loan });
  } catch (err) {
    console.error("Payment processing error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = {
  getLoanById,
  processRepayment
};

