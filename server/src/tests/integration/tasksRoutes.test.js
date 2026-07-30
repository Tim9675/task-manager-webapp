import request from "supertest";
import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest";

import { clearTestDB, connectTestDB, disconnectTestDB } from "./helpers/db";
import { createUser } from "./helpers/createUser";
import app from "../../app";
import Task from "../../models/Task";

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(disconnectTestDB);

async function createGenericUser() {
  return await createUser("name", "name@email.com");
}

async function createUserWithTask() {
  const { user, token } = await createGenericUser();

  const task = await Task.create({
    userId: user._id,
    title: "Old title",
    description: "Old description",
    dueDate: null,
    listId: null,
    tagIds: [],
    subtasks: [],
    checked: false,
  });

  return { user, token, task };
}

async function createManyTasks(user) {
  await Task.create([
    {
      userId: user._id,
      title: "The First Son of the Sea",
      dueDate: new Date("2026-08-03"),
    },
    {
      userId: user._id,
      title: "The Second Division Commander",
      dueDate: new Date("2026-08-02"),
    },
    {
      userId: user._id,
      title: "The Third World",
      dueDate: new Date("2026-08-01"),
    },
  ]);
}

function expectUnauthorized(response) {
  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Unauthorized");
}

describe("tasksRoutes", () => {
  describe("GET /tasks", () => {
    it("returns only the authenticated user's tasks, sorted by due date", async () => {
      const { user, token } = await createGenericUser();
      const { user: otherUser } = await createUser("Tim", "tim@email.com");

      await createManyTasks(user);

      await Task.create({
        userId: otherUser._id,
        title: "The Good",
        dueDate: new Date("2026-08-04"),
      });

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Tasks fetched successfully");
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data.map((task) => task.title)).toEqual([
        "The Third World",
        "The Second Division Commander",
        "The First Son of the Sea",
      ]);
    });

    it("returns 401 for malformed token", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer definitely-not-a-jwt");

      expectUnauthorized(response);
    });
  });

  describe("POST /tasks", () => {
    it("creates a task", async () => {
      const { user, token } = await createGenericUser();

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Renew driver's license",
          tagIds: [],
          subtasks: [],
          checked: false,
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Task created successfully");

      const task = await Task.findOne({
        title: "Renew driver's license",
      });

      expect(task).not.toBeNull();
      expect(task.userId.toString()).toBe(user._id.toString());
      expect(task).toMatchObject({
        title: "Renew driver's license",
        checked: false,
      });
    });

    it("returns 400 for invalid payload", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Title must be a string");
    });

    it("returns 400 for invalid list", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Renew driver's license",
          listId: "listId",
          tagIds: [],
          subtasks: [],
          checked: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("List ID must be a valid ObjectId");
    });

    it("returns 404 when listId does not exists", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Renew driver's license",
          listId: "6a3521abb585df96518271a7",
          tagIds: [],
          subtasks: [],
          checked: false,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("List not found");
    });

    it("returns 400 for invalid tag", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Renew driver's license",
          tagIds: ["tagId"],
          subtasks: [],
          checked: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Tag ID must be a valid ObjectId");
    });

    it("returns 404 when tagId does not exists", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Renew driver's license",
          tagIds: ["6a352335b585df96518271ab"],
          subtasks: [],
          checked: false,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("One or more tags not found");
    });

    it("rejects unauthorized requests", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "Renew driver's license",
          tagIds: ["tagId"],
          subtasks: [],
          checked: false,
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("returns 401 for malformed token", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", "Bearer definitely-not-a-jwt");

      expectUnauthorized(response);
    });
  });

  describe("PATCH /tasks/:taskId", () => {
    it("updates a task", async () => {
      const { user, token, task } = await createUserWithTask();

      const response = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "New title" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task updated successfully");

      const updatedTask = await Task.findById(task._id);

      expect(updatedTask).not.toBeNull();
      expect(updatedTask.title).toBe("New title");
      expect(updatedTask.userId.toString()).toBe(user._id.toString());
      expect(updatedTask).toMatchObject({
        title: "New title",
      });
    });

    it("returns 400 for invalid ObjectId", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .patch("/api/tasks/123")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "New title" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid taskId");
    });

    it("returns 404 when task does not exists", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .patch("/api/tasks/6a3521c4b585df96518271a8")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "New title" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Task not found");
    });

    it("returns 404 if task does not belong to user", async () => {
      const { user, task } = await createUserWithTask();
      const { token: otherToken } = await createUser("Tim", "tim@email.com");

      const response = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ title: "New title" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Task not found");

      const unchanged = await Task.findById(task._id);

      expect(unchanged.title).toBe("Old title");
    });

    it("returns 400 for invalid payloads", async () => {
      const { token, task } = await createUserWithTask();

      const response = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ checked: "" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Checked must be a boolean");

      const unchanged = await Task.findById(task._id);

      expect(unchanged.checked).toBe(false);
    });

    it("returns 400 for empty payloads", async () => {
      const { token, task } = await createUserWithTask();

      const response = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("No fields to update");

      const unchanged = await Task.findById(task._id);

      expect(unchanged.title).toBe("Old title");
    });

    it("returns 401 for malformed token", async () => {
      const { task } = await createUserWithTask();

      const response = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set("Authorization", "Bearer definitely-not-a-jwt");

      expectUnauthorized(response);
    });
  });

  describe("DELETE /tasks/:taskId", () => {
    it("deletes a task", async () => {
      const { token, task } = await createUserWithTask();

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task deleted successfully");

      const updatedTask = await Task.findById(task._id);

      expect(updatedTask).toBeNull();
    });

    it("returns 400 for invalid ObjectId", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .delete("/api/tasks/123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid taskId");
    });

    it("returns 404 when task does not exists", async () => {
      const { token } = await createGenericUser();

      const response = await request(app)
        .delete("/api/tasks/6a3521c4b585df96518271a8")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Task not found");
    });

    it("returns 404 if task does not belong to user", async () => {
      const { task } = await createUserWithTask();
      const { token: otherToken } = await createUser("Tim", "tim@email.com");

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Task not found");

      const unchanged = await Task.findById(task._id);

      expect(unchanged).not.toBeNull();
      expect(unchanged.title).toBe(task.title);
      expect(unchanged.userId.toString()).toBe(task.userId.toString());
    });

    it("returns 401 for malformed token", async () => {
      const { task } = await createUserWithTask();

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", "Bearer definitely-not-a-jwt");

      expectUnauthorized(response);
    });
  });
});
