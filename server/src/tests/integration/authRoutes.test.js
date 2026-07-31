import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { clearTestDB, connectTestDB, disconnectTestDB } from "./helpers/db";
import { createUser } from "./helpers/createUser";
import { deleteUser } from "./helpers/deleteUser";
import app from "../../app";
import User from "../../models/User";

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(disconnectTestDB);

describe("authRoutes", () => {
  describe("POST /register", () => {
    it("registers a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "name",
        email: "name@email.com",
        password: "Pass1234;",
        timezone: "Asia/Manila",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Account created successfully");
      expect(response.body.data.user).toMatchObject({
        name: "name",
        email: "name@email.com",
        timezone: "Asia/Manila",
      });
      expect(response.body.data.user.passwordHash).toBeUndefined();
      expect(response.body.data.token).toBeDefined();

      const user = await User.findOne({ email: "name@email.com" });

      expect(user).toBeDefined();
      expect(user.passwordHash).not.toBe("Pass1234;");
    });

    it.each([
      [
        "name is missing",
        {
          email: "name@email.com",
          password: "Pass1234;",
          timezone: "Asia/Manila",
        },
        "Name must be a string\n",
      ],
      [
        "email is missing",
        {
          name: "name",
          password: "Pass1234;",
          timezone: "Asia/Manila",
        },
        "Email must be a string\n",
      ],
      [
        "email is invalid",
        {
          name: "name",
          email: "email",
          password: "Pass1234;",
          timezone: "Asia/Manila",
        },
        "Invalid email address\n",
      ],
      [
        "password is missing",
        {
          name: "name",
          email: "name@email.com",
          timezone: "Asia/Manila",
        },
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "password is invalid",
        {
          name: "name",
          email: "name@email.com",
          password: "password",
          timezone: "Asia/Manila",
        },
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "name and email are missing",
        {
          password: "Pass123;",
          timezone: "Asia/Manila",
        },
        "Name must be a string\nEmail must be a string\n",
      ],
      [
        "name is missing and email is invalid",
        {
          email: "email",
          password: "Pass123;",
          timezone: "Asia/Manila",
        },
        "Name must be a string\nInvalid email address\n",
      ],
      [
        "name and password are missing",
        {
          email: "name@email.com",
          timezone: "Asia/Manila",
        },
        "Name must be a string\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "name is missing and password is invalid",
        {
          email: "name@email.com",
          password: "password",
          timezone: "Asia/Manila",
        },
        "Name must be a string\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "email and password are missing",
        {
          name: "name",
          timezone: "Asia/Manila",
        },
        "Email must be a string\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "email is missing and password is invalid",
        {
          name: "name",
          password: "password",
          timezone: "Asia/Manila",
        },
        "Email must be a string\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "email is invalid and password is missing",
        {
          name: "name",
          email: "email",
          timezone: "Asia/Manila",
        },
        "Invalid email address\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "email and password are invalid",
        {
          name: "name",
          email: "email",
          password: "password",
          timezone: "Asia/Manila",
        },
        "Invalid email address\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "name, email, and password are missing",
        {
          timezone: "NewWorld/Elbaf",
        },
        "Name must be a string\nEmail must be a string\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "name and email are missing and password is invalid",
        {
          password: "password",
          timezone: "NewWorld/Elbaf",
        },
        "Name must be a string\nEmail must be a string\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "name and password are missing and email is invalid",
        {
          email: "email",
          timezone: "NewWorld/Elbaf",
        },
        "Name must be a string\nInvalid email address\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
      [
        "name is missing and email and password are invalid",
        {
          email: "email",
          password: "password",
          timezone: "NewWorld/Elbaf",
        },
        "Name must be a string\nInvalid email address\nPassword must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n",
      ],
    ])("returns 400 when %s", async (_, body, message) => {
      const response = await request(app).post("/api/auth/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(message);
    });

    it("returns 400 if timezone is invalid", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "name",
        email: "name@email.com",
        password: "Pass1234;",
        timezone: "NewWorld/Elbaf",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid timezone");
    });

    it.each([
      [
        "duplicate name",
        async () => {
          await createUser("name", "another@gmail.com");
          return {
            name: "name",
            email: "new@email.com",
          };
        },
      ],
      [
        "duplicate email",
        async () => {
          await createUser("tim", "name@email.com");
          return {
            name: "new",
            email: "name@email.com",
          };
        },
      ],
    ])("returns 409 for %s", async (_, setup) => {
      const body = await setup();

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...body,
          password: "Pass123;",
          timezone: "Asia/Manila",
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /login", () => {
    it("logs in an existing user", async () => {
      await createUser("name", "name@email.com");

      const response = await request(app).post("/api/auth/login").send({
        email: "name@email.com",
        password: "Pass123;",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Account logged in successfully");
      expect(response.body.data.user).toMatchObject({
        name: "name",
        email: "name@email.com",
      });
      expect(response.body.data.token).toBeDefined();
    });

    it("logs in regardless of email casing", async () => {
      await createUser("name", "name@email.com");

      const response = await request(app).post("/api/auth/login").send({
        email: "  NAME@EMAIL.COM  ",
        password: "Pass123;",
      });

      expect(response.status).toBe(200);
    });

    it("returns 401 for unknown email", async () => {
      await createUser("name", "name@email.com");

      const response = await request(app).post("/api/auth/login").send({
        email: "name@gmail.com",
        password: "Pass123;",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
      expect(response.body.data).not.toBeDefined();
    });

    it("returns 401 for wrong password", async () => {
      await createUser("name", "name@email.com");

      const response = await request(app).post("/api/auth/login").send({
        email: "name@email.com",
        password: "password",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
      expect(response.body.data).not.toBeDefined();
    });

    it.each([
      [
        "missing email",
        {
          password: "Pass123;",
        },
        "Email must be a string",
      ],
      [
        "missing password",
        {
          email: "name@email.com",
        },
        "Password must be a string",
      ],
      [
        "invalid payload",
        {
          title: "Test title",
          password: "Pass123;",
        },
        "Email must be a string",
      ],
    ])("returns 400 when %s", async (_, body, message) => {
      const response = await request(app).post("/api/auth/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(message);
      expect(response.body.data).toBeUndefined();
    });
  });

  describe("GET /me", () => {
    it("fetches user details for an existing user", async () => {
      const { token } = await createUser("name", "name@email.com");

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User fetched successfully");
      expect(response.body.data).toEqual({
        id: expect.any(String),
        name: "name",
        email: "name@email.com",
        timezone: "Asia/Manila",
      });
    });

    it("returns 401 when token is missing", async () => {
      await createUser("name", "name@email.com");

      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
      expect(response.body.data).not.toBeDefined();
    });

    it("returns 401 when token is invalid", async () => {
      await createUser("name", "name@email.com");

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer ");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
      expect(response.body.data).not.toBeDefined();
    });

    it("returns 404 if user does not exist", async () => {
      const { user, token } = await createUser("name", "name@email.com");
      await deleteUser(user._id);

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
      expect(response.body.data).not.toBeDefined();
    });

    it("returns 401 when token is expired", async () => {
      const { user } = await createUser("name", "name@email.com");

      const expiredToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: -1 },
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
      expect(response.body.data).not.toBeDefined();
    });
  });
});
