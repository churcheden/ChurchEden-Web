import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "@/app/auth/protected-route";

const mocks = vi.hoisted(() => ({
  useAuthResult: { isAuthenticated: false, isLoading: false },
}));

vi.mock("@/app/auth/auth-context", () => ({
  useAuth: () => mocks.useAuthResult,
}));

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>secret-page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/sign-in"
          element={<div>sign-in-page</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mocks.useAuthResult = { isAuthenticated: false, isLoading: false };
});

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to the onboarding sign-in route", () => {
    renderProtected();
    // The protected page must not render.
    expect(screen.queryByText("secret-page")).not.toBeInTheDocument();
    expect(
      screen.getByText("sign-in-page"),
    ).toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    mocks.useAuthResult = { isAuthenticated: true, isLoading: false };
    renderProtected();
    expect(screen.getByText("secret-page")).toBeInTheDocument();
    expect(screen.queryByText("sign-in-page")).not.toBeInTheDocument();
  });

  it("shows a loading state while auth is initializing", () => {
    mocks.useAuthResult = { isAuthenticated: false, isLoading: true };
    renderProtected();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("secret-page")).not.toBeInTheDocument();
    expect(screen.queryByText("sign-in-page")).not.toBeInTheDocument();
  });
});
