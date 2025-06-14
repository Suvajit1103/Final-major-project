import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loanStatuses, setLoanStatuses] = useState({}); // Track dropdowns
   const navigate = useNavigate();

    // ✅ Redirect if not admin
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    alert("Access denied. Admins only.");
    navigate("/user-dashboard");
  }
}, [navigate]);


  const fetchLoans = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Server responded with:", data.message);
        throw new Error("Unauthorized");
      }

      const data = await res.json();
      console.log("Loans:", data);
      setLoans(data); // ✅ THIS LINE WAS MISSING - Set the fetched loans to state
    } catch (err) {
      console.error("Error fetching loans:", err.message);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const updateLoanStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/loans/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === id ? { ...loan, status: newStatus } : loan
        )
      );

      alert(`Loan ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    } catch (err) {
      alert(`${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} Failed`);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h2>Admin Dashboard</h2>
      <h2>Loan Applications</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Amount</th>
            <th>Duration</th>
            <th>Current Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.userId?.name || loan.name || "N/A"}</td>
              <td>{loan.userId?.phone || loan.contactNumber || "N/A"}</td>
              <td>₹{loan.loanAmount || "N/A"}</td>
              <td>{loan.loanDuration || "N/A"} months</td>
              <td>{loan.status}</td>
              <td>
                 {loan.status === "paid" ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>Fully Paid</span>
                  ) : (
                  <div>
                  <select
                   value={loanStatuses[loan._id] || loan.status || "pending"}
                    onChange={(e) =>
                    setLoanStatuses({
                    ...loanStatuses,
                   [loan._id]: e.target.value,
                   })
                   }
                  >
                    <option value="pending">PENDING</option>
                   <option value="approved">APPROVED</option>
                   <option value="rejected">REJECTED</option>
                  </select>
                  <button
                  onClick={() =>
                       updateLoanStatus(loan._id, loanStatuses[loan._id])
                        }
                      >
                       Update
                     </button>
                   </div>
                   )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
