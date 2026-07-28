import { vi, beforeEach, describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";

import createMock from "../validation/helpers/createMock";
import { authMiddleWare } from "../../middleware/authMiddleware";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function expectUnauthorized(res, next) {
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "Unauthorized",
  });
  expect(next).not.toHaveBeenCalled();
}

describe("authMiddleware", () => {
  it("calls next() for a valid token", () => {
    jwt.verify.mockReturnValue({
      userId: "6a02e10c0789762065d1f964",
      iat: 1785215033,
      exp: 1785301433,
    });

    const req = { headers: { authorization: "Bearer fake.jwt.token" } };
    const { res, next } = createMock();

    authMiddleWare(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "fake.jwt.token",
      process.env.JWT_SECRET_KEY,
    );
    expect(req.user).toEqual({
      userId: "6a02e10c0789762065d1f964",
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 401 for invalid authHeader", () => {
    const req = { headers: { authorization: null } };
    const { res, next } = createMock();

    authMiddleWare(req, res, next);

    expectUnauthorized(res, next);
  });

  it("returns 401 if authHeader does not start with 'Bearer'", () => {
    const req = { headers: { authorization: "" } };
    const { res, next } = createMock();

    authMiddleWare(req, res, next);

    expectUnauthorized(res, next);
  });

  it("returns 401 for missing token", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt missing");
    });

    const req = { headers: { authorization: "Bearer " } };
    const { res, next } = createMock();

    authMiddleWare(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("", process.env.JWT_SECRET_KEY);
    expectUnauthorized(res, next);
  });
});
