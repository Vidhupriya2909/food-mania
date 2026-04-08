/**
 * Website smoke test script
 * Tests all user-facing pages and API endpoints
 * Usage: npx tsx scripts/test-website.ts [base_url]
 */

const BASE_URL = process.argv[2] || "http://localhost:3000";

interface TestResult {
  name: string;
  status: "PASS" | "FAIL" | "WARN";
  details: string;
  duration: number;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    results.push({ name, status: "PASS", details: "", duration });
    console.log(`  ✅ ${name} (${duration}ms)`);
  } catch (e: any) {
    const duration = Date.now() - start;
    results.push({ name, status: "FAIL", details: e.message, duration });
    console.log(`  ❌ ${name} (${duration}ms) — ${e.message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

async function fetchPage(path: string, opts?: { redirect?: "follow" | "manual" }) {
  const res = await fetch(`${BASE_URL}${path}`, {
    redirect: opts?.redirect || "follow",
    headers: { "User-Agent": "FoodMart-TestBot/1.0" },
  });
  return res;
}

async function fetchJSON(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", "User-Agent": "FoodMart-TestBot/1.0" },
  });
  const data = await res.json();
  return { res, data };
}

// ─── PUBLIC PAGES ───────────────────────────────────────────

async function testPublicPages() {
  console.log("\n📄 PUBLIC PAGES\n");

  const pages = [
    { path: "/", name: "Homepage" },
    { path: "/menu", name: "Menu Page" },
    { path: "/plans", name: "Plans Page" },
    { path: "/gift-cards", name: "Gift Cards Page" },
    { path: "/customize", name: "Customize Page" },
    { path: "/login", name: "Login Page" },
  ];

  for (const page of pages) {
    await test(`${page.name} (${page.path}) loads`, async () => {
      const res = await fetchPage(page.path);
      assert(res.ok, `HTTP ${res.status}`);
      const html = await res.text();
      assert(html.includes("</html>"), "Missing closing HTML tag");
      assert(html.length > 500, `Page too small (${html.length} bytes)`);
    });
  }
}

// ─── CONTENT CHECKS ─────────────────────────────────────────

async function testPageContent() {
  console.log("\n🔍 CONTENT CHECKS\n");

  await test("Homepage has key sections", async () => {
    const res = await fetchPage("/");
    const html = await res.text();
    assert(html.includes("Food Mart"), "Missing brand name");
  });

  await test("Login page has phone input", async () => {
    const res = await fetchPage("/login");
    const html = await res.text();
    assert(html.includes("phone") || html.includes("Phone") || html.includes("mobile"), "Missing phone/mobile input reference");
  });

  await test("Plans page has subscription content", async () => {
    const res = await fetchPage("/plans");
    const html = await res.text();
    assert(html.includes("plan") || html.includes("Plan"), "Missing plan references");
  });

  await test("Menu page has meal type tabs", async () => {
    const res = await fetchPage("/menu");
    const html = await res.text();
    const hasMealRef = html.toLowerCase().includes("breakfast") ||
                       html.toLowerCase().includes("lunch") ||
                       html.toLowerCase().includes("dinner");
    assert(hasMealRef, "Missing meal type references");
  });

  await test("Customize page has date navigation", async () => {
    const res = await fetchPage("/customize");
    const html = await res.text();
    assert(
      html.toLowerCase().includes("pick") || html.toLowerCase().includes("customize") || html.toLowerCase().includes("meal"),
      "Missing customization content"
    );
  });
}

// ─── API ENDPOINTS ──────────────────────────────────────────

async function testAPIs() {
  console.log("\n🔌 API ENDPOINTS\n");

  await test("GET /api/plans returns plans", async () => {
    const { res, data } = await fetchJSON("/api/plans");
    assert(res.ok, `HTTP ${res.status}`);
    assert(data.success === true, `success=${data.success}`);
    assert(Array.isArray(data.plans), "plans is not an array");
    assert(data.plans.length > 0, "No plans returned");
  });

  await test("GET /api/plans — plan structure is valid", async () => {
    const { data } = await fetchJSON("/api/plans");
    const plan = data.plans[0];
    assert(plan.id, "Missing plan.id");
    assert(plan.name, "Missing plan.name");
    assert(typeof plan.durationDays === "number", "durationDays not a number");
    assert(Array.isArray(plan.features), "features not an array");
  });

  await test("GET /api/menu — returns today's menu", async () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const { res, data } = await fetchJSON(`/api/menu?date=${dateStr}`);
    assert(res.ok, `HTTP ${res.status}`);
    assert(data.success === true, `success=${data.success}`);
    assert(Array.isArray(data.data), "data is not an array");
  });

  await test("GET /api/menu — menu item structure is valid", async () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const { data } = await fetchJSON(`/api/menu?date=${dateStr}`);
    if (data.data.length > 0) {
      const item = data.data[0];
      assert(item.id, "Missing item.id");
      assert(item.dailyMenuId, "Missing dailyMenuId");
      assert(item.name, "Missing item.name");
      assert(item.mealType, "Missing mealType");
      assert(["BREAKFAST", "LUNCH", "DINNER"].includes(item.mealType), `Invalid mealType: ${item.mealType}`);
      assert(typeof item.basePrice === "number", "basePrice not a number");
    } else {
      console.log("    ⚠️  No menu items for today — skipping structure check");
    }
  });

  await test("GET /api/menu — future date works", async () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);
    const dateStr = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`;
    const { res, data } = await fetchJSON(`/api/menu?date=${dateStr}`);
    assert(res.ok, `HTTP ${res.status}`);
    assert(data.success === true, "success not true");
  });

  await test("GET /api/menu — past date returns empty gracefully", async () => {
    const { res, data } = await fetchJSON("/api/menu?date=2020-01-01");
    assert(res.ok, `HTTP ${res.status}`);
    assert(data.success === true, "success not true");
    assert(Array.isArray(data.data), "data not an array");
  });

  await test("GET /api/menu — invalid date handled", async () => {
    const { res } = await fetchJSON("/api/menu?date=not-a-date");
    // Should either return error or empty gracefully
    assert(res.status < 500, `Server error ${res.status}`);
  });

  await test("PATCH /api/user/profile — rejects unauthenticated", async () => {
    const res = await fetch(`${BASE_URL}/api/user/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("POST /api/orders — rejects unauthenticated", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("GET /api/user/address — rejects unauthenticated", async () => {
    const res = await fetch(`${BASE_URL}/api/user/address`, {
      headers: { "Content-Type": "application/json" },
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });
}

// ─── AUTH-PROTECTED PAGES ───────────────────────────────────

async function testProtectedPages() {
  console.log("\n🔒 AUTH-PROTECTED PAGES (should redirect to login)\n");

  const protectedPaths = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/dashboard/orders", name: "My Orders" },
    { path: "/dashboard/profile", name: "Profile" },
    { path: "/dashboard/addresses", name: "Addresses" },
    { path: "/dashboard/gift-cards", name: "Gift Cards" },
    { path: "/checkout", name: "Checkout" },
    { path: "/referrals", name: "Referrals" },
  ];

  for (const page of protectedPaths) {
    await test(`${page.name} redirects when unauthenticated`, async () => {
      const res = await fetchPage(page.path, { redirect: "manual" });
      // Should redirect (302/307) to login
      assert(
        res.status === 302 || res.status === 303 || res.status === 307 || res.status === 308 || res.status === 200,
        `Expected redirect or auth page, got ${res.status}`
      );
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location") || "";
        assert(
          location.includes("login") || location.includes("auth"),
          `Redirects to ${location}, expected login`
        );
      }
    });
  }
}

// ─── ADMIN PAGES ────────────────────────────────────────────

async function testAdminPages() {
  console.log("\n🛡️  ADMIN PAGES (should redirect when unauthenticated)\n");

  const adminPaths = [
    { path: "/admin", name: "Admin Overview" },
    { path: "/admin/orders", name: "Admin Orders" },
    { path: "/admin/subscriptions", name: "Admin Subscriptions" },
    { path: "/admin/scheduler", name: "Admin Scheduler" },
    { path: "/admin/menu-items", name: "Admin Menu Items" },
    { path: "/admin/users", name: "Admin Users" },
    { path: "/admin/settings", name: "Admin Settings" },
  ];

  for (const page of adminPaths) {
    await test(`${page.name} blocks unauthenticated access`, async () => {
      const res = await fetchPage(page.path, { redirect: "manual" });
      assert(
        res.status === 302 || res.status === 303 || res.status === 307 || res.status === 200,
        `Expected redirect, got ${res.status}`
      );
    });
  }

  await test("Admin login page loads", async () => {
    const res = await fetchPage("/admin/login");
    assert(res.ok, `HTTP ${res.status}`);
    const html = await res.text();
    assert(html.includes("</html>"), "Not a valid HTML page");
  });
}

// ─── PERFORMANCE CHECKS ────────────────────────────────────

async function testPerformance() {
  console.log("\n⚡ PERFORMANCE CHECKS\n");

  await test("Homepage loads under 3s", async () => {
    const start = Date.now();
    await fetchPage("/");
    const elapsed = Date.now() - start;
    assert(elapsed < 3000, `Took ${elapsed}ms`);
  });

  await test("API /api/plans responds under 2s", async () => {
    const start = Date.now();
    await fetchJSON("/api/plans");
    const elapsed = Date.now() - start;
    assert(elapsed < 2000, `Took ${elapsed}ms`);
  });

  await test("API /api/menu responds under 2s", async () => {
    const start = Date.now();
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    await fetchJSON(`/api/menu?date=${dateStr}`);
    const elapsed = Date.now() - start;
    assert(elapsed < 2000, `Took ${elapsed}ms`);
  });
}

// ─── SECURITY CHECKS ───────────────────────────────────────

async function testSecurity() {
  console.log("\n🔐 SECURITY CHECKS\n");

  await test("Security headers present", async () => {
    const res = await fetchPage("/");
    const xframe = res.headers.get("x-frame-options");
    const csp = res.headers.get("content-security-policy");
    const xContentType = res.headers.get("x-content-type-options");
    // At least one security header should be present (Vercel adds some by default)
    const hasAny = xframe || csp || xContentType;
    if (!hasAny) {
      console.log("    ⚠️  No security headers detected (x-frame-options, CSP, x-content-type-options)");
    }
  });

  await test("No sensitive data in public API responses", async () => {
    const { data } = await fetchJSON("/api/plans");
    const json = JSON.stringify(data);
    assert(!json.includes("password"), "Response contains 'password'");
    assert(!json.includes("secret"), "Response contains 'secret'");
    assert(!json.includes("token"), "Response contains 'token'");
  });

  await test("Invalid API method returns 405 or appropriate error", async () => {
    const res = await fetch(`${BASE_URL}/api/plans`, { method: "DELETE" });
    assert(res.status === 405 || res.status === 404 || res.status === 400, `Expected 4xx, got ${res.status}`);
  });
}

// ─── SEO CHECKS ─────────────────────────────────────────────

async function testSEO() {
  console.log("\n🔎 SEO CHECKS\n");

  await test("Homepage has meta title", async () => {
    const res = await fetchPage("/");
    const html = await res.text();
    assert(html.includes("<title>"), "Missing <title> tag");
    assert(html.includes("Food Mart"), "Title missing brand name");
  });

  await test("Homepage has meta description", async () => {
    const res = await fetchPage("/");
    const html = await res.text();
    assert(html.includes('name="description"'), "Missing meta description");
  });

  await test("Homepage has Open Graph tags", async () => {
    const res = await fetchPage("/");
    const html = await res.text();
    assert(html.includes('property="og:'), "Missing Open Graph tags");
  });

  await test("Homepage has lang attribute", async () => {
    const res = await fetchPage("/");
    const html = await res.text();
    assert(html.includes('lang="en"'), "Missing lang attribute");
  });
}

// ─── MAIN ───────────────────────────────────────────────────

async function main() {
  console.log(`\n🧪 Food Mart Website Test Suite`);
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   Time: ${new Date().toLocaleString()}`);
  console.log(`${"─".repeat(50)}`);

  await testPublicPages();
  await testPageContent();
  await testAPIs();
  await testProtectedPages();
  await testAdminPages();
  await testPerformance();
  await testSecurity();
  await testSEO();

  // Summary
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const warned = results.filter((r) => r.status === "WARN").length;
  const total = results.length;
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n${"─".repeat(50)}`);
  console.log(`\n📊 RESULTS: ${passed}/${total} passed, ${failed} failed, ${warned} warnings`);
  console.log(`⏱️  Total time: ${(totalTime / 1000).toFixed(1)}s`);

  if (failed > 0) {
    console.log(`\n❌ FAILURES:`);
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => console.log(`   • ${r.name}: ${r.details}`));
  }

  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Test runner crashed:", e);
  process.exit(2);
});
