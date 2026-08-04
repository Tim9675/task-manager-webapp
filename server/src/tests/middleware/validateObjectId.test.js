import { beforeEach, describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";

import { validateObjectId } from "../../middleware/validateObjectId";
import createMock from "../validation/utils/createMock";

vi.mock("mongoose", () => ({
  default: {
    Types: {
      ObjectId: {
        isValid: vi.fn(),
      },
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validateObjectId", () => {
  it("calls next() for valid ObjectId", () => {
    mongoose.Types.ObjectId.isValid.mockReturnValue(true);

    const req = { params: { taskId: "507f1f77bcf86cd799439011" } };
    const { res, next } = createMock();

    const middleware = validateObjectId("taskId");

    middleware(req, res, next);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 400 for invalid ObjectId", () => {
    mongoose.Types.ObjectId.isValid.mockReturnValue(false);

    const req = { params: { taskId: "abc" } };
    const { res, next } = createMock();

    const middleware = validateObjectId("taskId");

    middleware(req, res, next);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith("abc");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid taskId" });
    expect(next).not.toHaveBeenCalled();
  });
});
