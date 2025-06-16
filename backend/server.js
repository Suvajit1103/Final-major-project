require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { authMiddleware, adminMiddleware } = require("./middleware/authmiddleware");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");



const app = express();
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Database Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.get("/", (req, res) => {
  res.send("Finance Loan Management System Backend is Running...");
});

app.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

require("./scheduledJobs");
