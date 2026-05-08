import mongoose, { Schema } from "mongoose";

const tagsSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true, trim: true }, // Can add lowercase: true if want to implement case-sensitiveness
    color: { type: String, default: "#d1eaed" },
  },
  { timestamps: true },
);

tagsSchema.index({ userId: 1, title: 1 }, { unique: true });
tagsSchema.index({ userId: 1, createdAt: 1 });

const Tag = mongoose.model("Tag", tagsSchema);

export default Tag;
