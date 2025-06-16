import { FaWpforms } from "react-icons/fa";
import { AiOutlineDashboard, AiFillProduct } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";
import { IoIosArrowUp } from "react-icons/io";
import { RiContactsBook3Line, RiLoginCircleLine, RiUserAddLine, RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineManageSearch } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [authOpen, setAuthOpen] = useState(false);
   const [dashboardOpen, setDashboardOpen] = useState(false);
  const [manageLoansOpen, setManageLoansOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();  
   const navigate = useNavigate();

   const handleLogout = () => {
    logout();         // clear user auth (context)
    // alert("Logout Success"); 
    navigate("/");    // redirect to home
  };

  return (
    <div className={styles.sidebar}>

          {/* User Profile Section */}
      {isLoggedIn && user && (
        <div className={styles.profileSection}>
          <img
             src={
                   user?.profilePic
                  ? `http://localhost:5000${user.profilePic}` 
                  : "/default-profile.avif"
                }
            alt="Profile"
            className={styles.profileImage}
          />
          <div>
            <p className={styles.userName}>Hi ,{user.name}</p>
            <NavLink to="/profile-settings" className={styles.profileLink}>
              ⚙️ Profile Settings
            </NavLink>
          </div>
        </div>
      )}

      {/* Authentication Dropdown */}
      {!isLoggedIn && (
        <>
          <div
            className={styles.dropdownHeader}
            onClick={() => setAuthOpen(!authOpen)}
          >
            🔐 Authentication  <IoIosArrowUp />
          </div>
          {authOpen && (
            <div className={styles.subMenu}>
              <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
                <RiLoginCircleLine /> Sign In
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : "")}>
                <RiUserAddLine /> Sign Up
              </NavLink>
            </div>
          )}
        </>
      )}

      {/* Private Routes - Only visible when logged in */}
      {isLoggedIn && (
        <>
           
        {/* Admin-only Dashboard */}
          {user?.role === "admin" && (
            <>
              <div
                className={styles.dropdownHeader}
                onClick={() => setDashboardOpen(!dashboardOpen)}
              >
                <AiOutlineDashboard /> Dashboard <IoIosArrowUp />
              </div>
              {dashboardOpen && (
                <div className={styles.subMenu}>
                  <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                  >
                    <AiFillProduct /> All Loans
                  </NavLink>
                </div>
              )}
            </>
          )}
          
           {/* User-only Manage Loans */}
          {user?.role === "user" && (
            <>
              <div
                className={styles.dropdownHeader}
                onClick={() => setManageLoansOpen(!manageLoansOpen)}
              >
                <MdOutlineManageSearch /> Manage Loans <IoIosArrowUp />
              </div>
              {manageLoansOpen && (
                <div className={styles.subMenu}>
                  <NavLink
                    to="/user-dashboard"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                  >
                    <AiFillProduct /> My Loan
                  </NavLink>
                  <NavLink
                    to="/loan-application"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                  >
                    <FaWpforms /> Loan Application
                  </NavLink>
                </div>
              )}
            </>
          )}
          

          {/* Logout Button */}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <RiLogoutBoxLine /> Logout
          </button>
        </>
      )}

      {/* Common Routes */}
      <NavLink to="/aboutus" className={({ isActive }) => (isActive ? styles.active : "")}>
        <FcAbout /> About Us
      </NavLink>

      <NavLink to="/contactus" className={({ isActive }) => (isActive ? styles.active : "")}>
        <RiContactsBook3Line /> Contact Us
      </NavLink>
    </div>
  );
};

export default Sidebar;
