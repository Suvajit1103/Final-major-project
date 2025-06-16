import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiEyeCloseLine } from "react-icons/ri";
import { RxEyeOpen } from "react-icons/rx";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; 
import styles from "./Login.module.css";

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);


   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

        const { token, user } = res.data;

    // ✅ Call login with both token and user
    login(token, user);

      // ✅ Navigate based on role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert("Login Failed. Please check your email or password.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className={styles.logincontainer}>
    <div className={styles.loginbox}>
      <div className={styles.loginleft}>
        <h2>Login</h2>
  
          <div className={styles.Sinputgroup}>
            <label htmlFor="username">Email:</label>
            <input type="email" id="username" placeholder="Enter  Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.Sinputgroup}>
            <label htmlFor="password">Password:</label>
            <div className={styles.passin}>
            <input type={showPassword ? "text" : "password"} id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
           <button id={styles.showpass} onClick={togglePasswordVisibility}> {showPassword ? <RxEyeOpen /> : <RiEyeCloseLine /> }</button></div>
          </div>
          <button  className={styles.loginbtn} onClick={handleSubmit}>Login</button>
      
        <p>
          Don’t have an account? <Link to={"/register"}>Sign Up</Link>
        </p>
      </div>
      <div className={styles.loginright}>
        <h2>WELCOME BACK!</h2>
        <p>
          Please Login !
        </p>
      </div>
    </div>
  </div>
   
  );
};

export default Login;
