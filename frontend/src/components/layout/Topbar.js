import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import styles from "./TopBar.module.css";

const TopBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);


  return (
    <div className={styles.topBar}>
      <h1 className={styles.companyName}>moneyNEST</h1>
      <div className={styles.actions}>
        <button  onClick={toggleTheme} className={styles.themeToggle}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
