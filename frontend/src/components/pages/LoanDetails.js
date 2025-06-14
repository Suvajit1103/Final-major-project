import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import styles from "./LoanDetails.module.css";

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/loans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch loan");

        const data = await res.json();
        setLoan(data);
      } catch (err) {
        console.error(err.message);
        alert("Unable to fetch loan details.");
        navigate("/user-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id, navigate]);

  const repayments = loan?.scheduledRepayments || [];

  if (loading) return <p>Loading loan details...</p>;
  if (!loan) return <p>No loan found.</p>;

  return (
    <div className={styles.detailsContainer}>
      <h2>Loan Details</h2>
      <div className={styles.detailBox}>
        <p><strong>Name:</strong> {loan.userId?.name || loan.name}</p>
        <p><strong>Contact Number:</strong> {loan.userId?.phone || loan.contactNumber}</p>
        <p><strong>Loan Amount:</strong> ₹{loan.loanAmount}</p>
        <p><strong>Amount Left:</strong> ₹{loan.amountLeft === 0 ? 0 : (loan.amountLeft ?? "N/A")}</p>
        <p><strong>Duration:</strong> {loan.loanDuration} months</p>
        <p><strong>Status:</strong> {loan.status}</p>
      </div>

      {repayments.length > 0 && (
        <div className={styles.repaymentSection}>
          <h3>Scheduled Repayments</h3>
          <NavLink
            to={`/loan-payment-form/${loan._id}`}
            state={{ repayments: loan.scheduledRepayments }}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Loan Repayment
          </NavLink>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loan.scheduledRepayments.map((repayment, index) => (
          <tr key={index}>
            <td>{new Date(repayment.date).toLocaleDateString()}</td>
            <td>₹{repayment.amount}</td>
            <td>
              <span
                className={`${styles.status} ${
                  repayment.status === "PAID"
                    ? styles.paid
                    : repayment.status === "PARTIALLY PAID"
                    ? styles.partial
                    : styles.pending
                }`}
              >
                {repayment.status}
              </span>
            </td>
          </tr>
        ))}
            </tbody>
          </table>
        </div>
      )}

    <button className={styles.backBtn} onClick={() => navigate(`/user-dashboard`)}>
        ← Back
      </button>
    </div>
  );
};

export default LoanDetails;
