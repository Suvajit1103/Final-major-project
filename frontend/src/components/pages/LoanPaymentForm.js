import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styles from "./LoanPaymentForm.module.css";

const LoanPaymentForm = ({ onSuccess }) => {
  const { id: loanId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  

  

  const [amount, setAmount] = useState(0);
  const [minAmount, setMinAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ⏱️ Find the next due (unpaid or partially paid) installment
  useEffect(() => {

     const repayments = location.state?.repayments || [];

    const nextDue = repayments.find(
      (r) => r.status === "PENDING" || r.status === "PARTIALLY PAID"
    );
    if (nextDue) {
      setMinAmount(nextDue.amount);
      setAmount(nextDue.amount); // default input value
    } else {
      alert("All repayments are already paid.");
      navigate(`/loan-details/${loanId}`);
    }
  }, [location.state?.repayments, loanId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amount < minAmount) {
      alert(`Minimum payment amount is ₹${minAmount}`);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/loans/pay/${loanId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paidAmount: amount }),
      });

      const text = await response.text();

      if (!response.ok) {
        console.error("Payment failed:", response.status, response.statusText, "| Body:", text);
        alert(`Payment failed: ${response.status} ${response.statusText}`);
        return;
      }

      const data = JSON.parse(text);
      console.log("Payment success:", data);
      alert("Payment successful!");
      if (onSuccess) onSuccess();
      setTimeout(() => navigate(`/loan-details/${loanId}`), 1000);

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Pay Your Loan EMI</h2>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <label htmlFor="amount">
          Payment Amount (in Rupees) <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          id="amount"
          min={minAmount}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder={`Minimum ₹${minAmount}`}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Process Repayment"}
        </button>
      </form>
      <button className={styles.backBtn} onClick={() => navigate(`/user-dashboard`)}>
        ← Back
      </button>
    </div>
  );
};

export default LoanPaymentForm;
