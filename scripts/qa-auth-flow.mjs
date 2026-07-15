/**
 * QA script — simulates frontend auth-api.ts calls against the backend.
 * Run: node scripts/qa-auth-flow.mjs [apiBaseUrl]
 * Default: https://api.churcheden.app/api/v1
 */

const API_BASE = process.argv[2] ?? "https://api.churcheden.app/api/v1";
const ORIGIN = process.argv[3] ?? "http://localhost:5173";

const ts = Date.now();
const testEmail = `qa-${ts}@mailinator.com`;
const testPassword = "QaTestPass123!";

let accessToken = "";
let refreshToken = "";

const results = [];

function record(name, pass, detail) {
  results.push({ name, pass, detail });
  const icon = pass ? "PASS" : "FAIL";
  console.log(`[${icon}] ${name}`);
  if (detail) console.log(`       ${detail}`);
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = {
    "Content-Type": "application/json",
    Origin: ORIGIN,
    ...(options.headers ?? {}),
  };
  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json, headers: res.headers };
}

async function run() {
  console.log(`\nChurchEden Auth QA`);
  console.log(`API: ${API_BASE}`);
  console.log(`Origin: ${ORIGIN}`);
  console.log(`Test email: ${testEmail}\n`);

  // 1. Health (root domain)
  const healthUrl = API_BASE.replace("/api/v1", "") + "/health";
  try {
    const h = await fetch(healthUrl);
    const hj = await h.json();
    record("Health check", h.status === 200 && hj.status === "OK", `HTTP ${h.status} — ${hj.service}`);
  } catch (e) {
    record("Health check", false, String(e));
  }

  // 2. Google auth URL
  try {
    const g = await request("/auth/google/url");
    record(
      "GET /auth/google/url",
      g.status === 200 && g.json?.status === "success" && g.json?.url?.includes("/auth/google"),
      `HTTP ${g.status} — url: ${g.json?.url}`,
    );
  } catch (e) {
    record("GET /auth/google/url", false, String(e));
  }

  // 3. Register
  try {
    const r = await request("/auth/register", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });
    const ok = r.status === 201 && r.json?.status === "success" && r.json?.accessToken;
    if (ok) {
      accessToken = r.json.accessToken;
      refreshToken = r.json.refreshToken;
    }
    record(
      "POST /auth/register",
      ok,
      `HTTP ${r.status} — ${r.json?.message ?? r.json?.code ?? JSON.stringify(r.json).slice(0, 120)}`,
    );
  } catch (e) {
    record("POST /auth/register", false, String(e));
  }

  // 4. Login before verify (expect 403)
  try {
    const l = await request("/auth/login", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });
    record(
      "POST /auth/login (unverified → 403)",
      l.status === 403 && l.json?.code === "EMAIL_NOT_VERIFIED",
      `HTTP ${l.status} — code: ${l.json?.code} — ${l.json?.message}`,
    );
  } catch (e) {
    record("POST /auth/login (unverified)", false, String(e));
  }

  // 5. GET /auth/me with token
  try {
    const m = await request("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    record(
      "GET /auth/me (with token)",
      m.status === 200 && m.json?.user?.email === testEmail,
      `HTTP ${m.status} — user: ${m.json?.user?.email}`,
    );
  } catch (e) {
    record("GET /auth/me", false, String(e));
  }

  // 6. Resend verification
  try {
    const rv = await request("/auth/resend-verification", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    record(
      "POST /auth/resend-verification",
      rv.status === 200,
      `HTTP ${rv.status} — ${rv.json?.message ?? JSON.stringify(rv.json).slice(0, 80)}`,
    );
  } catch (e) {
    record("POST /auth/resend-verification", false, String(e));
  }

  // 7. Verify email with bad OTP (expect 400)
  try {
    const v = await request("/auth/verify-email", {
      method: "POST",
      body: { email: testEmail, otp: "000000" },
    });
    record(
      "POST /auth/verify-email (bad OTP → 400)",
      v.status === 400,
      `HTTP ${v.status} — ${v.json?.message ?? v.json?.code}`,
    );
  } catch (e) {
    record("POST /auth/verify-email (bad OTP)", false, String(e));
  }

  // 8. Refresh token
  try {
    const rf = await request("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
    const ok = rf.status === 200 && rf.json?.data?.newAccessToken;
    if (ok) accessToken = rf.json.data.newAccessToken;
    record(
      "POST /auth/refresh",
      ok,
      `HTTP ${rf.status} — rotated: ${!!rf.json?.data?.newAccessToken}`,
    );
  } catch (e) {
    record("POST /auth/refresh", false, String(e));
  }

  // 9. Invalid login
  try {
    const bad = await request("/auth/login", {
      method: "POST",
      body: { email: testEmail, password: "WrongPass123!" },
    });
    record(
      "POST /auth/login (bad password → 401)",
      bad.status === 401 && bad.json?.code === "UNAUTHORIZED",
      `HTTP ${bad.status} — ${bad.json?.message}`,
    );
  } catch (e) {
    record("POST /auth/login (bad password)", false, String(e));
  }

  // 10. Logout
  try {
    const lo = await request("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    record("POST /auth/logout", lo.status === 200, `HTTP ${lo.status} — ${lo.json?.message}`);
  } catch (e) {
    record("POST /auth/logout", false, String(e));
  }

  // 11. CORS check
  try {
    const corsUrl = `${API_BASE}/auth/login`;
    const cors = await fetch(corsUrl, {
      method: "OPTIONS",
      headers: {
        Origin: ORIGIN,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type,authorization",
      },
    });
    const allowOrigin = cors.headers.get("access-control-allow-origin");
    const allowCreds = cors.headers.get("access-control-allow-credentials");
    record(
      "CORS preflight",
      cors.status === 204 && allowOrigin === ORIGIN && allowCreds === "true",
      `HTTP ${cors.status} — Allow-Origin: ${allowOrigin} — Credentials: ${allowCreds}`,
    );
  } catch (e) {
    record("CORS preflight", false, String(e));
  }

  // Summary
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n--- Summary: ${passed} passed, ${failed} failed ---\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
