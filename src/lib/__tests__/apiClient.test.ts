import { afterEach, describe, expect, it, vi } from "vitest";
import apiClient from "@/lib/apiClient";
import { AppError } from "@/lib/errors";
import { onSessionExpired } from "@/lib/session-events";

const BASE = "https://api.test.churcheden.app/api/v1";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status < 400,
    status,
    json: async () => body,
  } as unknown as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("apiClient auth/session handling", () => {
  it("GET /auth/me returning 401 does NOT trigger a refresh or emit session expiry", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ code: "UNAUTHORIZED", message: "Not signed in" }, 401),
      );
    vi.stubGlobal("fetch", fetchMock);

    const expired = vi.fn();
    const off = onSessionExpired(expired);

    await expect(apiClient.get("/auth/me")).rejects.toBeInstanceOf(AppError);

    // The session probe must not fan out to /auth/refresh (this is what caused
    // the infinite refresh/redirect loop), and must not signal an expired session.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toBe(`${BASE}/auth/me`);
    expect(
      fetchMock.mock.calls.some((c) => String(c[0]).includes("/auth/refresh")),
    ).toBe(false);
    expect(expired).not.toHaveBeenCalled();

    off();
  });

  it("refreshes once and retries when a protected request 401s then the refresh succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ code: "TOKEN_EXPIRED" }, 401)) // /profile
      .mockResolvedValueOnce(jsonResponse({ accessToken: "new" })) // /auth/refresh
      .mockResolvedValueOnce(jsonResponse({ data: { id: 1 } })); // /profile retry
    vi.stubGlobal("fetch", fetchMock);

    const expired = vi.fn();
    const off = onSessionExpired(expired);

    const data = await apiClient.get("/profile");

    expect(data).toEqual({ data: { id: 1 } });
    expect(fetchMock).toHaveBeenCalledTimes(3);

    // Second call is the refresh POST to /auth/refresh.
    const refreshCall = fetchMock.mock.calls[1];
    expect(String(refreshCall[0])).toBe(`${BASE}/auth/refresh`);

    // A recovered session must not have emitted session expiry.
    expect(expired).not.toHaveBeenCalled();
    off();
  });

  it("emits session expiry and throws TOKEN_EXPIRED when the refresh fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ code: "TOKEN_EXPIRED" }, 401)) // /profile
      .mockResolvedValueOnce(jsonResponse({}, 500)); // /auth/refresh fails
    vi.stubGlobal("fetch", fetchMock);

    const expired = vi.fn();
    const off = onSessionExpired(expired);

    await expect(apiClient.get("/profile")).rejects.toMatchObject({
      code: "TOKEN_EXPIRED",
    });

    expect(expired).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    off();
  });

  it("throws the parsed AppError for a non-401 error without touching refresh", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ code: "SERVER", message: "boom", details: { x: ["y"] } }, 500),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiClient.get("/profile")).rejects.toMatchObject({
      code: "SERVER",
      message: "boom",
      details: { x: ["y"] },
      statusCode: 500,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("apiClient request builder", () => {
  it("GET resolves the parsed JSON body on success", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ user: { id: 7 } }));
    vi.stubGlobal("fetch", fetchMock);

    const out = await apiClient.get("/auth/me");
    expect(out).toEqual({ user: { id: 7 } });
    expect(String(fetchMock.mock.calls[0][0])).toBe(`${BASE}/auth/me`);
  });

  it("POST serializes JSON, sets Content-Type and sends credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await apiClient.post("/auth/login", { email: "a@b.com", password: "pw" });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BASE}/auth/login`);
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("include");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
    expect(init.body).toBe(JSON.stringify({ email: "a@b.com", password: "pw" }));
  });
});
