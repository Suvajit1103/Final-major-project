const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { type: String, unique: true, required: true },
  profilePic: {
    type: String,
    default:"",
  },
});

module.exports = mongoose.model("User", UserSchema);


