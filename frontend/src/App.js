import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import Login from "./components/auth/Login";
import LoanApplication from "./components/loan/LoanApplication";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Register from "./components/auth/Register";
import Aboutus from "./components/about-us/aboutus";
import Contactus from "./components/Contact-us/contactus";
import LoanDetails from "./components/pages/LoanDetails";
import LoanPaymentForm from "./components/pages/LoanPaymentForm";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Optional: persist login with localStorage
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ThemeProvider>
       <AuthProvider>
      <Router>
        <TopBar />
        <div className="mainContainer">
          {/* Pass login state to Sidebar */}
          <Sidebar isLoggedIn={isLoggedIn} />

          <Routes>
            <Route
              path="/"
              element={<Login onLogin={() => {
                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true");
              }} />}
            />
            <Route
              path="/register"
              element={<Register onRegister={() => {
                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true");
              }} />}
            />
            <Route path="/loan-application" element={<LoanApplication />} />
            <Route path="/admin-dashboard" element={ <AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/loan-details/:id" element={<LoanDetails />} />
            <Route path="/loan-payment-form/:id" element={<LoanPaymentForm/>}/>
            
            
          </Routes>
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
