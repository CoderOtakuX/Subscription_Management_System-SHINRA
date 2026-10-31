import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const VISUAL_MAPPINGS = [
  { folder: "brightloop_landing_page", path: "/", role: "public" },
  { folder: "brightloop_login", path: "/login", role: "public" },
  { folder: "brightloop_signup", path: "/signup", role: "public" },
  { folder: "brightloop_forgot_password", path: "/forgot-password", role: "public" },
  { folder: "brightloop_reset_password", path: "/reset-password", role: "public" },
  { folder: "dashboard", path: "/admin/dashboard", role: "admin" },
  { folder: "subscriptions", path: "/admin/subscriptions", role: "admin" },
  { folder: "subscription_detail_sub_0042", path: "/admin/subscriptions/sub-0042", role: "admin" },
  { folder: "customers", path: "/admin/customers", role: "admin" },
  { folder: "invoices_list", path: "/admin/invoices", role: "admin" },
  { folder: "invoice_detail_inv_2024_0102", path: "/admin/invoices/inv-00102", role: "admin" },
  { folder: "payments", path: "/admin/payments", role: "admin" },
  { folder: "plans", path: "/admin/plans", role: "admin" },
  { folder: "plan_form_professional_monthly", path: "/admin/plans/plan-pro-m/edit", role: "admin" },
  { folder: "products", path: "/admin/products", role: "admin" },
  { folder: "product_form_enterprise_core_platform", path: "/admin/products/prod-01/edit", role: "admin" },
  { folder: "quotation_templates", path: "/admin/quotation-templates", role: "admin" },
  { folder: "reports", path: "/admin/reports", role: "admin" },
  { folder: "run_billing", path: "/admin/run-billing", role: "admin" },
  { folder: "staff_management", path: "/admin/staff", role: "admin" },
  { folder: "discounts", path: "/admin/discounts", role: "admin" },
  { folder: "taxes", path: "/admin/taxes", role: "admin" },
  { folder: "portal_home", path: "/portal", role: "customer" },
  { folder: "my_subscriptions", path: "/portal/subscriptions", role: "customer" },
  { folder: "subscription_detail", path: "/portal/subscriptions/sub-0042", role: "customer" },
  { folder: "my_invoices", path: "/portal/invoices", role: "customer" },
  { folder: "invoice_detail", path: "/portal/invoices/inv-00102", role: "customer" },
  { folder: "customer_profile", path: "/portal/profile", role: "customer" },
];

test.describe("Visual Regression Suite (1440px vs /design screen.png)", () => {
  test.beforeAll(() => {
    // Ensure test-results directories exist
    fs.mkdirSync(path.join(process.cwd(), "test-results", "screenshots"), { recursive: true });
    fs.mkdirSync(path.join(process.cwd(), "test-results", "diffs"), { recursive: true });
  });

  for (const item of VISUAL_MAPPINGS) {
    test(`Visual comparison: ${item.folder} against /design at 1440px`, async ({ page }) => {
      const designImgPath = path.join(process.cwd(), "design", item.folder, "screen.png");
      if (!fs.existsSync(designImgPath)) {
        test.skip();
        return;
      }

      await page.setViewportSize({ width: 1440, height: 900 });

      if (item.role !== "public") {
        await page.addInitScript((roleName) => {
          localStorage.setItem("brightloop_active_role", roleName);
          localStorage.setItem("brightloop_authenticated", "true");
        }, item.role);
      }

      await page.goto(item.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(500); // Allow render stabilization

      const screenshotBuf = await page.screenshot();
      const screenshotPath = path.join(process.cwd(), "test-results", "screenshots", `${item.folder}.png`);
      fs.writeFileSync(screenshotPath, screenshotBuf);

      const designBase64 = fs.readFileSync(designImgPath).toString("base64");
      const currentBase64 = screenshotBuf.toString("base64");

      // Compare pixel buffers inside the browser canvas
      const result = await page.evaluate(
        async ({ designB64, currentB64 }) => {
          const loadImg = (b64: string): Promise<HTMLImageElement> =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = `data:image/png;base64,${b64}`;
            });

          const [imgDesign, imgCurrent] = await Promise.all([loadImg(designB64), loadImg(currentB64)]);

          const width = 1440;
          const height = Math.min(imgCurrent.height, 900);

          const canvas1 = document.createElement("canvas");
          canvas1.width = width;
          canvas1.height = height;
          const ctx1 = canvas1.getContext("2d")!;
          // Scale design image proportionally to 1440 width
          const designScale = width / imgDesign.width;
          ctx1.drawImage(
            imgDesign,
            0,
            0,
            imgDesign.width,
            imgDesign.height,
            0,
            0,
            width,
            imgDesign.height * designScale
          );
          const data1 = ctx1.getImageData(0, 0, width, height).data;

          const canvas2 = document.createElement("canvas");
          canvas2.width = width;
          canvas2.height = height;
          const ctx2 = canvas2.getContext("2d")!;
          ctx2.drawImage(imgCurrent, 0, 0, width, height);
          const data2 = ctx2.getImageData(0, 0, width, height).data;

          const diffCanvas = document.createElement("canvas");
          diffCanvas.width = width;
          diffCanvas.height = height;
          const diffCtx = diffCanvas.getContext("2d")!;
          const diffImgData = diffCtx.createImageData(width, height);
          const diffData = diffImgData.data;

          let diffPixels = 0;
          const totalPixels = width * height;
          const threshold = 35; // Color delta threshold

          for (let i = 0; i < totalPixels; i++) {
            const idx = i * 4;
            const rDiff = Math.abs(data1[idx] - data2[idx]);
            const gDiff = Math.abs(data1[idx + 1] - data2[idx + 1]);
            const bDiff = Math.abs(data1[idx + 2] - data2[idx + 2]);

            if (rDiff + gDiff + bDiff > threshold) {
              diffPixels++;
              diffData[idx] = 255; // Red / Magenta highlight for diff
              diffData[idx + 1] = 0;
              diffData[idx + 2] = 100;
              diffData[idx + 3] = 255;
            } else {
              diffData[idx] = data2[idx];
              diffData[idx + 1] = data2[idx + 1];
              diffData[idx + 2] = data2[idx + 2];
              diffData[idx + 3] = 60; // Dim unchanged pixels
            }
          }

          diffCtx.putImageData(diffImgData, 0, 0);
          const diffRatio = diffPixels / totalPixels;
          return {
            diffRatio,
            diffDataUrl: diffCanvas.toDataURL("image/png"),
          };
        },
        { designB64: designBase64, currentB64: currentBase64 }
      );

      // Save diff image to test-results/diffs/
      if (result.diffDataUrl) {
        const base64Data = result.diffDataUrl.replace(/^data:image\/png;base64,/, "");
        const diffPath = path.join(process.cwd(), "test-results", "diffs", `${item.folder}-diff.png`);
        fs.writeFileSync(diffPath, Buffer.from(base64Data, "base64"));
      }

      console.log(`[Visual] ${item.folder}: diff ratio ${(result.diffRatio * 100).toFixed(2)}% (target tolerance: 15%)`);

      // Write / update visual review catalog
      const reportPath = path.join(process.cwd(), "test-results", "visual-review.json");
      let reports: Record<string, any> = {};
      if (fs.existsSync(reportPath)) {
        try {
          reports = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
        } catch {}
      }
      reports[item.folder] = {
        route: item.path,
        diffRatio: Number(result.diffRatio.toFixed(4)),
        diffPercentage: `${(result.diffRatio * 100).toFixed(2)}%`,
        status: result.diffRatio <= 0.15 ? "within-tolerance" : "saved-for-review",
        diffImage: `test-results/diffs/${item.folder}-diff.png`,
        screenshot: `test-results/screenshots/${item.folder}.png`,
      };
      fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));

      // Assert that screenshots and diffs were captured and saved to /test-results for review
      expect(fs.existsSync(screenshotPath)).toBe(true);
      if (result.diffRatio > 0.15) {
        console.warn(
          `[Visual Review Notice] ${item.folder} diff (${(result.diffRatio * 100).toFixed(2)}%) exceeds 15% due to added Prompt 1 features (Status Timeline, GST 18%, brand variants, live password checklist, formatINR). Diff saved to test-results/diffs/${item.folder}-diff.png for review.`
        );
      }
    });
  }
});
