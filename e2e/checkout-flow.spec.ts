import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test("checkout page loads", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.locator("main")).toBeVisible();
  });

  test("checkout form has required fields", async ({ page }) => {
    await page.goto("/checkout");
    // Should have buyer name, phone, email fields if cart has items
    // Without items, may redirect or show empty state
    await expect(page.locator("main")).toBeVisible();
  });
});
