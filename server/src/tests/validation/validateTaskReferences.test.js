import { beforeEach, describe, vi, it, expect } from "vitest";

import List from "../../models/List";
import Tag from "../../models/Tag";
import createMock from "./helpers/createMock";
import { validateTaskReferences } from "../../validation/taskValidation";

vi.mock("../../models/List.js", () => ({
  default: {
    exists: vi.fn(),
  },
}));

vi.mock("../../models/Tag.js", () => ({
  default: {
    countDocuments: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validateTaskReferences", () => {
  it("calls next when list and tags exist", async () => {
    List.exists.mockResolvedValue(true);
    Tag.countDocuments.mockResolvedValue(2);

    const req = {
      user: {
        userId: "user123",
      },
      body: {
        listId: "507f1f77bcf86cd799439011",
        tagIds: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
      },
    };

    const { res, next } = createMock();

    await validateTaskReferences(req, res, next);

    expect(List.exists).toHaveBeenCalledWith({
      _id: "507f1f77bcf86cd799439011",
      userId: "user123",
    });
    expect(Tag.countDocuments).toHaveBeenCalledWith({
      userId: "user123",
      _id: {
        $in: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
      },
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("calls next when there are no references to validate", async () => {
    const req = { user: { userId: "user123" }, body: { tagIds: [] } };
    const { res, next } = createMock();

    await validateTaskReferences(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 404 when list does not exist", async () => {
    List.exists.mockResolvedValue(false);

    const req = {
      user: {
        userId: "user123",
      },
      body: {
        listId: "507f1f77bcf86cd799439011",
      },
    };

    const { res, next } = createMock();

    await validateTaskReferences(req, res, next);

    expect(List.exists).toHaveBeenCalledWith({
      _id: "507f1f77bcf86cd799439011",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "List not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 404 when one or more tags do not exist", async () => {
    Tag.countDocuments.mockResolvedValue(1);

    const req = {
      user: {
        userId: "user123",
      },
      body: {
        tagIds: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
      },
    };

    const { res, next } = createMock();

    await validateTaskReferences(req, res, next);

    expect(Tag.countDocuments).toHaveBeenCalledWith({
      userId: "user123",
      _id: {
        $in: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
      },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "One or more tags not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("ignores duplicate tag IDs", async () => {
    Tag.countDocuments.mockResolvedValue(1);

    const req = {
      user: {
        userId: "user123",
      },
      body: {
        tagIds: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439012"],
      },
    };

    const { res, next } = createMock();

    await validateTaskReferences(req, res, next);

    expect(Tag.countDocuments).toHaveBeenCalledWith({
      userId: "user123",
      _id: {
        $in: ["507f1f77bcf86cd799439012"],
      },
    });
    expect(next).toHaveBeenCalled(1);
  });
});
