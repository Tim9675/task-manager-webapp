import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import useAuth from "../../contexts/useAuth";
import ProtectedRoute from "../../routes/ProtectedRoute";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../contexts/useAuth");

beforeEach(() => {
  vi.clearAllMocks();
});

function renderComponent() {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={<ProtectedRoute>Dashboard</ProtectedRoute>}
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("renders the loading page while authentication is loading", async () => {
    useAuth.mockReturnValue({
      loading: true,
      user: null,
    });

    renderComponent();

    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  it("redirects to the login page for unauthenticated users", async () => {
    useAuth.mockReturnValue({
      loading: false,
      user: null,
    });

    renderComponent();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the dashboard for authenticated users", async () => {
    useAuth.mockReturnValue({
      loading: false,
      user: {
        name: "name",
      },
    });

    renderComponent();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
