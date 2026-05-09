import mongoose, { Schema } from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    color: { type: String, default: "#d1eaed" },
    startAt: { type: Date, required: true },
    endAt: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= startAt;
        },
        message: "endAt must be after startAt",
      },
    },
    allDay: { type: Boolean, default: false },
    location: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

eventSchema.index({ userId: 1, startAt: 1, createdAt: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
