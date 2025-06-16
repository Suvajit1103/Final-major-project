import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import styles from "./LoanApplication.module.css";

const LoanApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
   
    name: "",
    contactNumber:"",
    loanAmount: "",
    loanDuration: "",
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/loans", formData, {
      headers: {
        "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
      },
    });

    alert("Loan Application Submitted Successfully!");
    navigate("/user-dashboard");
  } catch (error) {
    console.error("Error submitting loan application", error);
    alert(error.response?.data?.message || "Something went wrong.");
  }
};

  return (
    <div className={styles.container}>
     

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Loan Application</h2>
        <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
        <input type="tel" name="contactNumber" placeholder="Phone No." required onChange={handleChange} />
        <input type="number" name="loanAmount" placeholder="Loan Amount" required onChange={handleChange} />
        <input type="number" name="loanDuration" placeholder="Loan Duration (Months)" required onChange={handleChange} />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default LoanApplication;
