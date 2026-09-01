import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthCallback } from "@/app/components/auth/auth-callback";

const mocks = vi.hoisted(() => ({
  hydrateUser: vi.fn(),
  setSessionFromTokens: vi.fn(),
}));

vi.mock("@/app/auth/auth-context", () => ({
  useAuth: () => ({
    hydrateUser: mocks.hydrateUser,
    setSessionFromTokens: mocks.setSessionFromTokens,
  }),
}));

function renderAt(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/onboarding/church-basics"
          element={<div>basics-page</div>}
        />
        <Route path="/dashboard" element={<div>dashboard-page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mocks.hydrateUser.mockReset().mockResolvedValue(true);
  mocks.setSessionFromTokens.mockReset().mockResolvedValue(undefined);
});

describe("AuthCallback", () => {
  it("exchanges the token and routes to church-basics when the profile is incomplete", async () => {
    renderAt("/auth/callback?accessToken=abc&profileComplete=false");

    await screen.findByText("basics-page");
    expect(mocks.setSessionFromTokens).toHaveBeenCalledWith("abc");
    expect(mocks.hydrateUser).not.toHaveBeenCalled();
  });

  it("routes to the dashboard when an access token is present and no profile flag", async () => {
    renderAt("/auth/callback?accessToken=abc");

    await screen.findByText("dashboard-page");
    expect(mocks.setSessionFromTokens).toHaveBeenCalledWith("abc");
    expect(mocks.hydrateUser).not.toHaveBeenCalled();
  });

  it("hydrates the existing session (no access token) and routes to the dashboard", async () => {
    renderAt("/auth/callback");

    await screen.findByText("dashboard-page");
    expect(mocks.hydrateUser).toHaveBeenCalledTimes(1);
    expect(mocks.setSessionFromTokens).not.toHaveBeenCalled();
  });

  it("renders an error and does not complete sign-in when an error param is present", async () => {
    renderAt("/auth/callback?error=auth_failed");

    expect(
      await screen.findByText("Google sign-in failed. Please try again."),
    ).toBeInTheDocument();
    expect(mocks.setSessionFromTokens).not.toHaveBeenCalled();
    expect(mocks.hydrateUser).not.toHaveBeenCalled();
  });

  it("shows the completing state before the async work finishes", () => {
    let pending: (v: unknown) => void;
    mocks.setSessionFromTokens.mockImplementation(
      () => new Promise((resolve) => (pending = resolve)),
    );
    renderAt("/auth/callback?accessToken=abc");

    expect(screen.getByText("Completing sign-in...")).toBeInTheDocument();

    pending!(undefined);
  });
});
