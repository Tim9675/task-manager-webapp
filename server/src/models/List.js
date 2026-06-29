import mongoose, { Schema } from "mongoose";

const listSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    }, // Can add lowercase: true if want to implement case-sensitiveness
    color: {
      type: String,
      default: "#ff6b6b",
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

listSchema.index({ userId: 1, title: 1 }, { unique: true });
listSchema.index({ userId: 1, createdAt: 1 });

const List = mongoose.model("List", listSchema);

export default List;
