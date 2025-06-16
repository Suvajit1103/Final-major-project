const express = require("express");
const Loan = require("../models/Loan");
// const Repayment = require("../models/Repayment");
const { getLoanById, processRepayment } = require("../controllers/loanController");
const {authMiddleware} = require("../middleware/authmiddleware"); // Ensure it's a function

const router = express.Router();
require("dotenv").config();



// Loan Application Route
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, contactNumber, loanAmount, loanDuration } = req.body;

    // Validate required fields
    if (!name || !contactNumber || !loanAmount || !loanDuration) {
      return res.status(400).json({ message: "All fields are required: name, contact, loan amount, and loan duration." });
    }

    // Validate types
    if (isNaN(loanAmount) || isNaN(loanDuration)) {
      return res.status(400).json({ message: "Loan amount and duration must be numbers." });
    }


    const newLoan = new Loan({
      userId: req.user._id, // From authMiddleware
      name,
      contactNumber,
      loanAmount: parseFloat(loanAmount),
      loanDuration: parseInt(loanDuration, 12),
      status: "pending",
    });

    await newLoan.save();

    res.status(201).json({ message: "Loan application submitted successfully." });
  } catch (error) {
    console.error("Error submitting loan application:", error);
    res.status(500).json({ message: "Server error while submitting loan application." });
  }
});


//  Fixed Get User Loans Route
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id });
    res.json(loans);
  } catch (err) {
    console.error("Error fetching user loans:", err);
    res.status(500).json({ error: "Error fetching user loans" });
  }
});

// GET a single loan by ID
router.get('/:id', authMiddleware, getLoanById);


//get admin all loan
router.get("/", authMiddleware, async (req, res) => {
  try {
     if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    const loans = await Loan.find()
      .populate("userId", "name phone") // this links user data
      .exec();

    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Error fetching loans" });
  }
});

// ✅ Approve or Reject Loan
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const loanId = req.params.id;
    const { status } = req.body;

    // Validate input
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    loan.status = status;

    // ✅ Generate scheduled repayments if loan is approved
     if (status === "approved") {
      const installmentAmount = Math.floor(loan.loanAmount / loan.loanDuration);
      const today = new Date();
      const schedule = [];

      for (let i = 0; i < loan.loanDuration; i++) {
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + i * 30); // every 30 days (monthly)
        schedule.push({
          date: dueDate,
          amount: installmentAmount,
          status: "PENDING",
        });
      }

      loan.scheduledRepayments = schedule;
    }

    await loan.save();

    res.status(200).json({ message: "Loan status updated successfully." });
  } catch (err) {
    console.error("Error updating loan status:", err);
    res.status(500).json({ message: "Server error while updating loan status." });
  }
});


// POST: Process a repayment

router.post("/pay/:loanId", authMiddleware, processRepayment);



// router.post("/pay/:loanId", authMiddleware, async (req, res) => {
//   try {
//     const { paidAmount } = req.body;
//     const { loanId } = req.params;

//     if (!paidAmount || paidAmount <= 0) {
//       return res.status(400).json({ message: "Paid amount must be greater than 0." });
//     }

//     const loan = await Loan.findById(loanId);
//     if (!loan) {
//       return res.status(404).json({ message: "Loan not found." });
//     }


//     const currentAmountLeft = loan.amountLeft ?? loan.loanAmount;

//     if (paidAmount > currentAmountLeft) {
//       return res.status(400).json({ message: "Payment exceeds remaining loan amount." });
//     }

//     loan.amountLeft = currentAmountLeft - paidAmount;

//     if (loan.amountLeft === 0) {
//       loan.status = "Paid";
//     }
//     await loan.save();

//     res.status(200).json({ message: "Payment recorded.", amountLeft: loan.amountLeft });
//   } catch (err) {
//     console.error("Error processing repayment:", err);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

module.exports = router;

