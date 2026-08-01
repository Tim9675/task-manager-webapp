import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { clearAuthToken, setAuthToken, onAuthFailure } from "../../api/client";
import { getCurrentUser, login, register } from "../../api/authApi";
import useAuth from "../../contexts/useAuth";
import AuthProvider from "../../contexts/AuthProvider";

vi.mock("../../api/authApi", () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock("../../api/client", () => ({
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  onAuthFailure: vi.fn(() => () => {}),
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

function TestComponent() {
  const auth = useAuth();

  return (
    <>
      <span>{auth.loading ? "loading" : "done"}</span>

      <span>{auth.user ? auth.user.name : "no-user"}</span>

      <button
        data-testid="signIn"
        onClick={() => {
          auth.signIn({
            email: "name@email.com",
            password: "Pass123;",
          });
        }}
      >
        Login
      </button>

      <button
        data-testid="signUp"
        onClick={() => {
          auth.signUp({
            name: "name",
            email: "name@email.com",
            password: "Pass123;",
            timezone: "Asia/Manila",
          });
        }}
      >
        Sign up
      </button>

      <button
        data-testid="signOut"
        onClick={() => {
          auth.signOut();
        }}
      >
        Log out
      </button>
    </>
  );
}

function renderComponent() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );
}

describe("AuthProvider", () => {
  it("renders without token", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("done")).toBeInTheDocument();
      expect(screen.getByText("no-user")).toBeInTheDocument();
    });
  });

  it("renders with token", async () => {
    localStorage.setItem("token", "123");
    getCurrentUser.mockResolvedValue({
      user: {
        name: "Tim",
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(setAuthToken).toHaveBeenCalledWith("123");
      expect(getCurrentUser).toHaveBeenCalledTimes(1);
      expect(screen.getByText("done")).toBeInTheDocument();
      expect(screen.getByText("Tim")).toBeInTheDocument();
    });
  });

  it("signs out when getCurrentUser fails", async () => {
    localStorage.setItem("token", "123");
    getCurrentUser.mockRejectedValue({ message: "User not found" });

    renderComponent();

    await waitFor(() => {
      expect(clearAuthToken).toHaveBeenCalledTimes(1);
      expect(screen.getByText("no-user")).toBeInTheDocument();
    });
  });

  it("sets authenticated session after sign in", async () => {
    login.mockResolvedValue({
      token: "123",
      user: { name: "name" },
    });

    renderComponent();

    await userEvent.click(screen.getByTestId("signIn"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "name@email.com",
        password: "Pass123;",
      });
      expect(setAuthToken).toHaveBeenCalledWith("123");
      expect(screen.getByText("name")).toBeInTheDocument();
    });
  });

  it("sets authenticated session after sign up", async () => {
    register.mockResolvedValue({
      token: "123",
      user: { name: "newName" },
    });

    renderComponent();

    await userEvent.click(screen.getByTestId("signUp"));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: "name",
        email: "name@email.com",
        password: "Pass123;",
        timezone: "Asia/Manila",
      });
      expect(setAuthToken).toHaveBeenCalledWith("123");
      expect(screen.getByText("newName")).toBeInTheDocument();
    });
  });

  it("renders after sign out", async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId("signOut"));

    await waitFor(() => {
      expect(clearAuthToken).toHaveBeenCalledTimes(1);
      expect(screen.getByText("no-user")).toBeInTheDocument();
    });
  });

  it("unsubscribes from auth failure listener on unmount", async () => {
    const unsubscribe = vi.fn();

    onAuthFailure.mockReturnValue(unsubscribe);

    const { unmount } = renderComponent();

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(onAuthFailure).toHaveBeenCalledWith(expect.any(Function));
  });
});
