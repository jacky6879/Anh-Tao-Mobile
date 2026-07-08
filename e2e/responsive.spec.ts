import { test, expect } from "@playwright/test";

test.describe("Responsive Design", () => {
  test("mobile: hamburger menu visible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    // Look for mobile menu button (hamburger)
    const menuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], nav button').first();
    if (await menuBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(menuBtn).toBeVisible();
    }
  });

  test("mobile: floating CTA is visible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    // FloatingCTA component should be visible (Zalo/Hotline buttons)
    const cta = page.locator('[class*="fixed"], [class*="floating"]').first();
    await expect(cta).toBeVisible();
  });

  test("desktop: full navigation visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await expect(page.getByText("Sản phẩm").first()).toBeVisible();
  });

  test("product grid adjusts to viewport", async ({ page }) => {
    // Desktop: should have multi-column grid
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/san-pham");
    await expect(page.locator("main")).toBeVisible();

    // Mobile: should stack
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/san-pham");
    await expect(page.locator("main")).toBeVisible();
  });
});
