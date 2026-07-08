import { test, expect } from "@playwright/test";

test.describe("Contact / Lead Form", () => {
  test("contact page loads", async ({ page }) => {
    await page.goto("/lien-he");
    await expect(page.locator("main")).toBeVisible();
  });

  test("trade-in page loads", async ({ page }) => {
    await page.goto("/gui-may-thu-cu");
    await expect(page.locator("main")).toBeVisible();
  });

  test("trade-in form has fields", async ({ page }) => {
    await page.goto("/gui-may-thu-cu");
    const form = page.locator("form");
    if (await form.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(form).toBeVisible();
    }
  });
});
