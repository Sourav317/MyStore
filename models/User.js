import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  uploads: { type: Array, default: 0 },
});

// Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
