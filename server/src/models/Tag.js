import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
      trim: true,
    }, // FUT: Can add lowercase: true if want to implement case-sensitiveness
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

tagSchema.index({ userId: 1, title: 1 }, { unique: true });
tagSchema.index({ userId: 1, createdAt: 1 });

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
