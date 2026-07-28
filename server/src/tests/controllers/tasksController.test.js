import { vi, beforeEach, describe, it, expect } from "vitest";

import { normalizeDueDate } from "../../controllers/helpers/normalizeDueDate.js";
import { sanitizeDocument } from "../../controllers/helpers/sanitizeDocument.js";
import createMock from "../validation/helpers/createMock";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../controllers/tasksController";
import Task from "../../models/Task.js";

vi.mock("../../models/Task.js", () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

vi.mock("../../controllers/helpers/normalizeDueDate.js", () => ({
  normalizeDueDate: vi.fn(),
}));

vi.mock("../../controllers/helpers/sanitizeDocument.js", () => ({
  sanitizeDocument: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function mockFindQuery(result) {
  const lean = vi.fn().mockResolvedValue(result);
  const sort = vi.fn().mockReturnValue({ lean });
  const select = vi.fn().mockReturnValue({ sort });

  return { select, sort, lean };
}

function mockUpdateQuery(result) {
  const lean = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ lean });

  return { select, lean };
}

describe("tasksController", () => {
  it("fetches user tasks", async () => {
    const tasks = [
      {
        _id: "123",
        title: "Test title",
        description: "",
        dueDate: null,
        listId: null,
        tagIds: [],
        subtasks: [],
        checked: false,
      },
    ];

    const query = mockFindQuery(tasks);
    Task.find.mockReturnValue(query);

    const req = { user: { userId: "user123" } };
    const { res } = createMock();

    await getTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({ userId: "user123" });
    expect(query.select).toHaveBeenCalledWith(
      "-__v -createdAt -updatedAt -userId",
    );
    expect(query.sort).toHaveBeenCalledWith({ dueDate: 1, createdAt: 1 });
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tasks fetched successfully",
      data: tasks,
    });
  });

  it("creates a task", async () => {
    const task = {
      title: "Test title",
      description: "Test description",
      dueDate: null,
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    };

    Task.create.mockResolvedValue(task);
    normalizeDueDate.mockReturnValue(null);
    sanitizeDocument.mockReturnValue(task);

    const req = {
      user: { userId: "user123" },
      body: { title: "Test title", description: "Test description" },
    };
    const { res } = createMock();

    await createTask(req, res);

    expect(Task.create).toHaveBeenCalledWith({
      userId: "user123",
      title: "Test title",
      description: "Test description",
      dueDate: null,
      listId: null,
      tagIds: undefined,
      subtasks: undefined,
    });
    expect(normalizeDueDate).toHaveBeenCalledWith(undefined);
    expect(sanitizeDocument).toHaveBeenCalledWith(task);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task created successfully",
      data: task,
    });
  });

  it("updates a task", async () => {
    const taskId = "123";
    const userId = "user123";
    const updatePayload = {
      title: "Test title",
      checked: true,
    };

    const updatedTask = {
      _id: taskId,
      title: "Test title",
      description: "Test description",
      dueDate: null,
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: true,
    };

    const query = mockUpdateQuery(updatedTask);
    Task.findOneAndUpdate.mockReturnValue(query);

    const req = {
      user: { userId: userId },
      body: updatePayload,
      params: { taskId },
    };
    const { res } = createMock();

    await updateTask(req, res);

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      updatePayload,
      { returnDocument: "after", runValidators: true },
    );
    expect(query.select).toHaveBeenCalledWith(
      "-__v -createdAt -updatedAt -userId",
    );
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task updated successfully",
      data: updatedTask,
    });
  });

  it("returns 400 if nothing gets updated", async () => {
    const taskId = "123";
    const userId = "user123";
    const updatePayload = {};

    const req = {
      user: { userId: userId },
      body: updatePayload,
      params: { taskId },
    };
    const { res } = createMock();

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "No fields to update",
    });
  });

  it("returns 404 if task to update is not found", async () => {
    const taskId = "123";
    const userId = "user123";
    const updatePayload = {
      dueDate: null,
      subtasks: [],
    };

    const query = mockUpdateQuery(null);
    Task.findOneAndUpdate.mockReturnValue(query);
    normalizeDueDate.mockReturnValue(null);

    const req = {
      user: { userId: userId },
      body: updatePayload,
      params: { taskId },
    };
    const { res } = createMock();

    await updateTask(req, res);

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      updatePayload,
      { returnDocument: "after", runValidators: true },
    );
    expect(normalizeDueDate).toHaveBeenCalledWith(null);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task not found",
    });
  });

  it("deletes a task", async () => {
    const task = {
      _id: "123",
      title: "Test title",
      description: "",
      dueDate: null,
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    };

    Task.findOneAndDelete.mockResolvedValue(task);

    const req = { user: { userId: "user123" }, params: { taskId: "123" } };
    const { res } = createMock();

    await deleteTask(req, res);

    expect(Task.findOneAndDelete).toHaveBeenCalledWith({
      _id: "123",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task deleted successfully",
    });
  });

  it("returns 404 if task to delete is not found", async () => {
    Task.findOneAndDelete.mockResolvedValue(null);

    const req = { user: { userId: "user123" }, params: { taskId: "123" } };
    const { res } = createMock();

    await deleteTask(req, res);

    expect(Task.findOneAndDelete).toHaveBeenCalledWith({
      _id: "123",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task not found",
    });
  });
});
