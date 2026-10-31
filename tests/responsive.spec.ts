import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes-data";

const TEST_WIDTHS = [360, 768, 1024, 1440];

test.describe("Responsive & Viewport Suite", () => {
  for (const width of TEST_WIDTHS) {
    test.describe(`Viewport width ${width}px`, () => {
      for (const item of ALL_ROUTES) {
        test(`Route ${item.path} at ${width}px has no sideways scroll and correct sidebar state`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });

          if (item.role !== "public") {
            await page.addInitScript((roleName) => {
              localStorage.setItem("brightloop_active_role", roleName);
              localStorage.setItem("brightloop_authenticated", "true");
            }, item.role);
          }

          await page.goto(item.path, { waitUntil: "domcontentloaded" });

          // Assert document.documentElement.scrollWidth <= window.innerWidth (allow 1px tolerance for subpixel rounding)
          const isNoHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth <= window.innerWidth + 1;
          });
          expect(isNoHorizontalScroll).toBe(true);

          // For admin backoffice routes, check sidebar / hamburger
          if (item.path.startsWith("/admin")) {
            if (width < 1024) {
              // Sidebar hidden behind hamburger
              const desktopSidebar = page.locator("aside");
              await expect(desktopSidebar).toBeHidden();

              const hamburger = page.locator('button[aria-label="Open navigation menu"]');
              await expect(hamburger).toBeVisible();
            } else {
              // Sidebar visible on 1024+
              const desktopSidebar = page.locator("aside");
              await expect(desktopSidebar).toBeVisible();
            }
          }
        });
      }
    });
  }
});
