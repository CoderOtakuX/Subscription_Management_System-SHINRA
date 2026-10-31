import { test, expect } from "@playwright/test";

test.describe("Form Validations Suite", () => {
  test("Signup rejects weak passwords and live checklist updates properly", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "domcontentloaded" });

    // Fill basic details
    await page.fill('input[placeholder="e.g. Vikram Sengupta"]', "Test User");
    await page.fill('input[placeholder="name@company.com"]', "test.user@example.com");

    const passwordInput = page.locator('input[placeholder="Enter a secure password..."]');
    const confirmPasswordInput = page.locator('input[placeholder="Repeat password..."]');
    const termsCheckbox = page.locator('input#agreeTerms');
    await termsCheckbox.check();

    // 1. Password of 8 characters or fewer
    await passwordInput.fill("Ab1!");
    await confirmPasswordInput.fill("Ab1!");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Password must be more than 8 characters long.")).toBeVisible();

    // Verify live checklist shows length not passed
    const lengthItem = page.getByText("More than 8 characters", { exact: true });
    await expect(lengthItem).toBeVisible();

    // 2. Missing uppercase
    await passwordInput.fill("lowercase123!@#");
    await confirmPasswordInput.fill("lowercase123!@#");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Password must contain at least one uppercase letter.")).toBeVisible();

    // 3. Missing lowercase
    await passwordInput.fill("UPPERCASE123!@#");
    await confirmPasswordInput.fill("UPPERCASE123!@#");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Password must contain at least one lowercase letter.")).toBeVisible();

    // 4. Missing special character
    await passwordInput.fill("ValidPassword123");
    await confirmPasswordInput.fill("ValidPassword123");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Password must contain at least one special character.")).toBeVisible();
  });

  test("Plan form requires a billing period", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("brightloop_active_role", "admin");
      localStorage.setItem("brightloop_authenticated", "true");
    });

    await page.goto("/admin/plans/new", { waitUntil: "domcontentloaded" });

    // Fill title and SKU, but leave billing period as empty
    await page.fill('input[placeholder="Professional Monthly"]', "Enterprise Custom Tier");
    await page.fill('input[placeholder="PRO-M-2026"]', "ENT-CUSTOM-2026");

    await page.click('button[type="submit"]');

    // Expect validation message
    const errorText = page.locator("text=Billing period is required.");
    await expect(errorText).toBeVisible();
  });

  test("Payment modal rejects amount above amount due", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("brightloop_active_role", "admin");
      localStorage.setItem("brightloop_authenticated", "true");
    });

    await page.goto("/admin/payments", { waitUntil: "domcontentloaded" });

    // Click Record Payment button to open modal
    await page.click('button:has-text("Record Payment")');

    // Modal should be open
    const modalHeading = page.locator("text=Record Manual / Offline Settlement");
    await expect(modalHeading).toBeVisible();

    // Enter an excessive amount far higher than invoice total amount
    const amountInput = page.locator('input[type="number"][step="0.01"]');
    await amountInput.fill("999999999");

    await page.click('button:has-text("Confirm & Book Payment")');

    // Expect error indicating payment cannot exceed amount due
    const errorMsg = page.locator("text=cannot exceed amount due").first();
    await expect(errorMsg).toBeVisible();
  });
});
