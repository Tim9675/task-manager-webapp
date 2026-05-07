import mongoose, { Schema } from "mongoose";

const listSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true, trim: true }, // Can add lowercase: true if want to implement case-sensitiveness
    color: { type: String, default: "#ff6b6b" },
  },
  { timestamps: true },
);

listSchema.index({ userId: 1, title: 1 }, { unique: true });

const List = mongoose.model("List", listSchema);

export default List;
