import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes-data";

test.describe("Screen Map Route Suite", () => {
  for (const item of ALL_ROUTES) {
    test(`Route ${item.path} loads with 200, no console errors, and visible h1`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const failedRequests: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      page.on("requestfailed", (request) => {
        // Ignore optional favicon/media requests if browser cancels
        const url = request.url();
        if (!url.includes("favicon") && !url.includes(".svg")) {
          failedRequests.push(`${request.method()} ${url} — ${request.failure()?.errorText}`);
        }
      });

      if (item.role !== "public") {
        await page.addInitScript((roleName) => {
          localStorage.setItem("brightloop_active_role", roleName);
          localStorage.setItem("brightloop_authenticated", "true");
        }, item.role);
      }

      const response = await page.goto(item.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      // Verify visible h1 heading
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();

      expect(failedRequests).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
});
