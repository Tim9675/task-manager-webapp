import client from "./client";

export async function getCurrentUser() {
  const response = await client.get("/auth/me");
  return response.data;
}

export async function login(data) {
  const response = await client.post("/auth/login", data);
  return response.data;
}

export async function register(data) {
  const response = await client.post("/auth/register", data);
  return response.data;
}
