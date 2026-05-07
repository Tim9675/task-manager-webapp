import mongoose from "mongoose";

// const MOCK_USER_ID = new mongoose.Types.ObjectId("123456789123456789123456");
const MOCK_USER_ID = new mongoose.Types.ObjectId("987654321987654321987654");

export function getUserId(req) {
  // if (!req.user?._id) {
  //   return res.status(401).json({ message: "Unauthorized"})
  // }

  // ^^ Reminder: ONCE AUTHENTICATION IS IMPLEMENTED, UNCOMMENT THE ABOVE AND REMOVE THE MOCK USER ID

  return req.user?._id || MOCK_USER_ID;
}
