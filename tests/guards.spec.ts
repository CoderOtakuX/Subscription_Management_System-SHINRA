import { test, expect } from "@playwright/test";

test.describe("RBAC & Auth Route Guards Suite", () => {
  const customerRestricted = ["/dashboard", "/staff", "/discounts", "/taxes", "/admin/dashboard", "/admin/staff", "/admin/discounts", "/admin/taxes"];
  const staffRestricted = ["/staff", "/discounts", "/taxes", "/admin/staff", "/admin/discounts", "/admin/taxes"];

  for (const route of customerRestricted) {
    test(`Customer role cannot open ${route}`, async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("brightloop_active_role", "customer");
        localStorage.setItem("brightloop_authenticated", "true");
      });

      await page.goto(route, { waitUntil: "domcontentloaded" });

      // Verify Access Restricted 403 message or not loading admin table
      const restrictedHeading = page.locator("text=Access Restricted (403)");
      await expect(restrictedHeading).toBeVisible();
    });
  }

  for (const route of staffRestricted) {
    test(`Staff role cannot open ${route}`, async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("brightloop_active_role", "staff");
        localStorage.setItem("brightloop_authenticated", "true");
      });

      await page.goto(route, { waitUntil: "domcontentloaded" });

      // Verify Access Restricted 403 message is visible
      const restrictedHeading = page.locator("text=Access Restricted (403)");
      await expect(restrictedHeading).toBeVisible();
    });
  }

  test("Unauthenticated users are redirected to /login", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("brightloop_authenticated", "false");
      localStorage.removeItem("brightloop_active_role");
    });

    await page.goto("/admin/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*\/login/);
  });
});
