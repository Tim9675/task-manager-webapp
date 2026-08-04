import { describe, it, expect } from "vitest";

import createMock from "./utils/createMock.js";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../../validation/taskValidation.js";

describe("validateCreateTask", () => {
  it("calls next() for valid input", () => {
    const req = {
      body: {
        title: "Renew driver's license",
        description: "Test description",
        dueDate: "2026-01-01T10:00:00.000Z",
        listId: "6a3521abb585df96518271a7",
        tagIds: ["6a352335b585df96518271ab"],
        subtasks: [
          {
            title: "Subtask 1",
            checked: false,
          },
        ],
        checked: false,
      },
    };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 400 if title is empty", () => {
    const req = { body: { title: "" } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title must be a non-empty string",
    });
  });

  it("returns 400 if title is whitespace only", () => {
    const req = { body: { title: "          " } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title must be a non-empty string",
    });
  });

  it("returns 400 if title is missing", () => {
    const req = { body: { description: "Test description" } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title must be a string",
    });
  });

  it("returns 400 if due date is a number", () => {
    const req = { body: { title: "Test title", dueDate: 123 } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Due date must be a string",
    });
  });

  it("returns 400 if due date is an invalid format", () => {
    const req = { body: { title: "Test title", dueDate: "dueDate" } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Due date must be a valid ISO date",
    });
  });

  it("returns 400 if listId is a number", () => {
    const req = { body: { title: "Test title", listId: 123 } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "List ID must be a string",
    });
  });

  it("returns 400 if list is an invalid object ID", () => {
    const req = { body: { title: "Test title", listId: "listId" } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "List ID must be a valid ObjectId",
    });
  });

  it("returns 400 if tagIds is not an array", () => {
    const req = { body: { title: "Test title", tagIds: 123 } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tag IDs must be an array",
    });
  });

  it("returns 400 if tagId is invalid", () => {
    const req = { body: { title: "Test title", tagIds: [123] } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tag ID must be a string",
    });
  });

  it("returns 400 if subtasks is not an array", () => {
    const req = { body: { title: "Test title", tagIds: [], subtasks: 123 } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Subtasks must be an array",
    });
  });

  it("returns 400 if subtask is not an object", () => {
    const req = { body: { title: "Test title", tagIds: [], subtasks: [123] } };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Each subtask must be an object",
    });
  });

  it("returns 400 if subtask title is invalid", () => {
    const req = {
      body: {
        title: "Test title",
        tagIds: [],
        subtasks: [{ title: 123, checked: false }],
      },
    };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Subtask title must be a string",
    });
  });

  it("returns 400 if subtask checked is not boolean", () => {
    const req = {
      body: {
        title: "Test title",
        tagIds: [],
        subtasks: [{ title: "Test subtask title", checked: 123 }],
      },
    };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Subtask checked must be a boolean",
    });
  });

  it("returns 400 if checked is not boolean", () => {
    const req = {
      body: { title: "Test title", tagIds: [], subtasks: [], checked: 123 },
    };
    const { res, next } = createMock();

    validateCreateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Checked must be a boolean",
    });
  });
});

describe("validateUpdateTask", () => {
  it("calls next() when body is empty", () => {
    const req = { body: {} };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("calls next() when only title is updated", () => {
    const req = { body: { title: "Test title" } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("calls next() when only checked is updated", () => {
    const req = { body: { checked: true } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid title", () => {
    const req = { body: { title: 123 } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title must be a string",
    });
  });

  it("rejects invalid due date", () => {
    const req = { body: { dueDate: "dueDate" } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Due date must be a valid ISO date",
    });
  });

  it("rejects invalid listId", () => {
    const req = { body: { listId: "listId" } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "List ID must be a valid ObjectId",
    });
  });

  it("rejects invalid tagIds", () => {
    const req = { body: { tagIds: "tagIds" } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tag IDs must be an array",
    });
  });

  it("rejects invalid subtasks", () => {
    const req = { body: { subtasks: "subtasks" } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Subtasks must be an array",
    });
  });

  it("rejects invalid subtask title", () => {
    const req = { body: { subtasks: [{ title: 123, checked: false }] } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Subtask title must be a string",
    });
  });

  it("rejects invalid subtask checked", () => {
    const req = {
      body: { subtasks: [{ title: "Test subtask title", checked: 123 }] },
    };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Subtask checked must be a boolean",
    });
  });

  it("rejects invalid checked", () => {
    const req = { body: { checked: 123 } };
    const { res, next } = createMock();

    validateUpdateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Checked must be a boolean",
    });
  });
});
