import { test, expect } from "@playwright/test";

test.describe("Product Detail", () => {
  test("products listing page renders", async ({ page }) => {
    await page.goto("/san-pham");
    await expect(page).toHaveTitle(/Sản phẩm|Anh Táo/);
    // Page should render even without DB
    await expect(page.locator("main")).toBeVisible();
  });

  test("product detail page shows breadcrumbs", async ({ page }) => {
    await page.goto("/san-pham");
    // Try to click first product link if any products exist
    const productLink = page.locator('a[href^="/san-pham/"]').first();
    if (await productLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productLink.click();
      const breadcrumb = page.locator("nav");
      await expect(breadcrumb.getByText("Trang chủ")).toBeVisible();
      await expect(breadcrumb.getByText("Sản phẩm")).toBeVisible();
    }
  });
});
