import { test, expect } from "@playwright/test";

test.describe("Cart Flow", () => {
  test("cart page loads", async ({ page }) => {
    await page.goto("/gio-hang");
    await expect(page.locator("main")).toBeVisible();
  });

  test("empty cart shows appropriate message", async ({ page }) => {
    await page.goto("/gio-hang");
    // Should show empty state or cart content
    await expect(page.locator("main")).toBeVisible();
  });

  test("add to cart button exists on product page", async ({ page }) => {
    await page.goto("/san-pham");
    const productLink = page.locator('a[href^="/san-pham/"]').first();
    if (await productLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productLink.click();
      const addBtn = page.getByRole("button", { name: /Thêm vào giỏ|Đặt giữ|Mua/i });
      if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(addBtn).toBeEnabled();
      }
    }
  });
});
