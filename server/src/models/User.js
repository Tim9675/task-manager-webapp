import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    passwordHash: {
      type: String,
      required: true,
    },

    timezone: {
      type: String,
      default: "Asia/Manila",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
