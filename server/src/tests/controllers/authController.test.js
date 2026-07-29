import { vi, beforeEach, describe, it, expect } from "vitest";
import bcrypt, { hash } from "bcrypt";

import { sanitizeUser } from "../../controllers/helpers/sanitizeUser.js";
import { signToken } from "../../controllers/helpers/signToken.js";
import { normalizeString } from "../../helpers/normalizeString.js";
import {
  register,
  login,
  getCurrentUser,
} from "../../controllers/authController.js";
import createMock from "../validation/helpers/createMock.js";
import User from "../../models/User.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../../controllers/helpers/sanitizeUser.js", () => ({
  sanitizeUser: vi.fn(),
}));

vi.mock("../../controllers/helpers/signToken.js", () => ({
  signToken: vi.fn(),
}));

vi.mock("../../helpers/normalizeString.js", () => ({
  normalizeString: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();

  normalizeString.mockImplementation((value) => value.trim().toLowerCase());
});

function mockFindQuery(result) {
  const lean = vi.fn().mockResolvedValue(result);

  return { lean };
}

function mockGetQuery(result) {
  const lean = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ lean });

  return { select, lean };
}

function expectUnauthorized(res) {
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "Invalid email or password",
  });
}

const rawUser = {
  _id: "123",
  name: "name",
  email: "name@email.com",
  passwordHash: "passwordHash",
  timezone: "Asia/Manila",
};

const sanitizedUser = {
  id: "123",
  name: "name",
  email: "name@email.com",
  timezone: "Asia/Manila",
};

const queriedUser = {
  _id: "123",
  name: "name",
  email: "name@email.com",
  passwordHash: "passwordHash",
  timezone: "Asia/Manila",
};

describe("authController", () => {
  describe("register", () => {
    it("registers a new user", async () => {
      const query = mockFindQuery(null);
      User.findOne.mockReturnValue(query);
      bcrypt.hash.mockResolvedValue("passwordHash");
      User.create.mockResolvedValue(rawUser);
      signToken.mockReturnValue("token");
      sanitizeUser.mockReturnValue(sanitizedUser);

      const req = {
        body: {
          name: "name",
          email: "name@email.com",
          password: "password",
          timezone: "Asia/Manila",
        },
      };
      const { res } = createMock();

      await register(req, res);

      expect(normalizeString).toHaveBeenCalledWith("name");
      expect(normalizeString).toHaveBeenCalledWith("name@email.com");
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "name@email.com" }, { name: "name" }],
      });
      expect(query.lean).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(User.create).toHaveBeenCalledWith({
        name: "name",
        email: "name@email.com",
        passwordHash: "passwordHash",
        timezone: "Asia/Manila",
      });
      expect(signToken).toHaveBeenCalledWith("123");
      expect(sanitizeUser).toHaveBeenCalledWith(rawUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Account created successfully",
        data: {
          user: sanitizedUser,
          token: "token",
        },
      });
    });

    it("returns 409 if user already exists", async () => {
      const query = mockFindQuery(rawUser);
      User.findOne.mockReturnValue(query);

      const req = {
        body: {
          name: "name",
          email: "name@email.com",
          password: "password",
          timezone: "Asia/Manila",
        },
      };
      const { res } = createMock();

      await register(req, res);

      expect(normalizeString).toHaveBeenCalledWith("name");
      expect(normalizeString).toHaveBeenCalledWith("name@email.com");
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });
  });

  describe("login", () => {
    it("logs in an existing user", async () => {
      const query = mockFindQuery(queriedUser);
      User.findOne.mockReturnValue(query);
      bcrypt.compare.mockResolvedValue(true);
      signToken.mockReturnValue("token");

      const req = { body: { email: "name@email.com", password: "password" } };
      const { res } = createMock();

      await login(req, res);

      expect(normalizeString).toHaveBeenCalledWith("name@email.com");
      expect(User.findOne).toHaveBeenCalledWith({ email: "name@email.com" });
      expect(query.lean).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "passwordHash");
      expect(signToken).toHaveBeenCalledWith("123");
      expect(sanitizeUser).toHaveBeenCalledWith(queriedUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Account logged in successfully",
        data: {
          user: sanitizedUser,
          token: "token",
        },
      });
    });

    it("returns 401 if the user does not exist", async () => {
      const query = mockFindQuery(null);
      User.findOne.mockReturnValue(query);

      const req = { body: { email: "name@email.com", password: "password" } };
      const { res } = createMock();

      await login(req, res);

      expect(normalizeString).toHaveBeenCalledWith("name@email.com");
      expect(User.findOne).toHaveBeenCalledWith({ email: "name@email.com" });
      expect(query.lean).toHaveBeenCalledTimes(1);
      expectUnauthorized(res);
    });

    it("returns 401 if the password is wrong", async () => {
      const query = mockFindQuery(queriedUser);
      User.findOne.mockReturnValue(query);
      bcrypt.compare.mockResolvedValue(false);

      const req = { body: { email: "name@email.com", password: "password" } };
      const { res } = createMock();

      await login(req, res);

      expect(normalizeString).toHaveBeenCalledWith("name@email.com");
      expect(User.findOne).toHaveBeenCalledWith({ email: "name@email.com" });
      expect(query.lean).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "passwordHash");
      expectUnauthorized(res);
    });
  });

  describe("getCurrentUser", () => {
    it("fetches user details for an existing user", async () => {
      const query = mockGetQuery(queriedUser);
      User.findById.mockReturnValue(query);

      const req = { user: { userId: "123" } };
      const { res } = createMock();

      await getCurrentUser(req, res);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(query.select).toHaveBeenCalledWith("name email timezone");
      expect(query.lean).toHaveBeenCalledTimes(1);
      expect(sanitizeUser).toHaveBeenCalledWith(queriedUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User fetched successfully",
        data: sanitizedUser,
      });
    });

    it("returns 404 if the user does not exist", async () => {
      const query = mockGetQuery(null);
      User.findById.mockReturnValue(query);

      const req = { user: { userId: "123" } };
      const { res } = createMock();

      await getCurrentUser(req, res);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(query.select).toHaveBeenCalledWith("name email timezone");
      expect(query.lean).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });
});
