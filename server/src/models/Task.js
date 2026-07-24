import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },

    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    description: { type: String, default: "", trim: true },

    dueDate: { type: Date, default: null },

    listId: { type: Schema.Types.ObjectId, default: null, ref: "List" },

    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

    subtasks: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        title: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 100,
          trim: true,
        },
        checked: { type: Boolean, default: false },
      },
    ],

    checked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

taskSchema.index({ userId: 1, dueDate: 1, createdAt: 1 });
taskSchema.index({ userId: 1, listId: 1 });
taskSchema.index({ userId: 1, tagIds: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
