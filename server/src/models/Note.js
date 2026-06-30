import mongoose, { Schema } from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
    content: { type: String, default: "", trim: true },
    color: {
      type: String,
      default: "#d1eaed",
      validate: {
        validator: function (value) {
          return /^#([0-9A-Fa-f]{6})$/.test(value);
        },
        message: "Color must be a valid 6-digit hex code",
      },
    },
  },
  { timestamps: true },
);

noteSchema.index({ userId: 1, createdAt: -1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
