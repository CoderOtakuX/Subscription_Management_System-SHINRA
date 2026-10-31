import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ALL_ROUTES } from "./routes-data";

test.describe("Accessibility Audit Suite (@axe-core)", () => {
  for (const item of ALL_ROUTES) {
    test(`Route ${item.path} passes accessibility checks (no critical or serious violations)`, async ({ page }) => {
      if (item.role !== "public") {
        await page.addInitScript((roleName) => {
          localStorage.setItem("brightloop_active_role", roleName);
          localStorage.setItem("brightloop_authenticated", "true");
        }, item.role);
      }

      await page.goto(item.path, { waitUntil: "domcontentloaded" });

      // Run axe accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      // Filter for serious and critical violations
      const violations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (violations.length > 0) {
        console.warn(
          `Accessibility violations found on ${item.path}:`,
          violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
          }))
        );
      }

      expect(violations).toEqual([]);
    });
  }
});
