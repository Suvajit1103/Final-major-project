import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";

const UserDashboard = () => {
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "user") {
      alert("Access denied. Users only.");
      navigate("/admin-dashboard");
    } else {
      fetchUserLoans(user._id);
    }
  }, [navigate]);

  const fetchUserLoans = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/loans/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user loans");
      }

      const data = await res.json();
      setLoans(data);
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <>
      
    <div className={styles.userContainer}>
      <h2>User Dashboard</h2>
      <h2>Your Loan Applications</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Total Amount</th>
            <th>Amount Left</th>
            <th>Status</th>
            <th>Check Details</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>₹{loan.loanAmount || 0}</td>
              <td>₹{loan.amountLeft === 0 ? 0 : (loan.amountLeft || loan.loanAmount || 0)}</td>
              <td>
                <span
    className={`${styles.status} ${
      loan.status === "paid"
        ? styles.statusPaid
        : loan.status === "pending"
        ? styles.statusPending
        : loan.status === "rejected"
        ? styles.statusRejected
        : loan.status === "approved"
        ? styles.statusApproved
        : ""
    }`}
  >
  {loan.status.toUpperCase()}
    </span></td>
              <td>
                <button onClick={() => navigate(`/loan-details/${loan._id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default UserDashboard;
