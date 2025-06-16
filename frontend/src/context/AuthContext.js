import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [user, setUser] = useState(null); // 👈 store user info (with role)

  useEffect(() => {
    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser)); // 👈 parse saved user info
    }
  }, []);

   const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // 👈 store user
    setIsLoggedIn(true);
    setUser(userData);
  };

 const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // 👈 remove user info
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
