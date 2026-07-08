import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigate to products page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Sản phẩm/i }).first().click();
    await expect(page).toHaveURL(/\/san-pham/);
  });

  test("navigate to repair services page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Sửa chữa/i }).first().click();
    await expect(page).toHaveURL(/\/sua-chua/);
  });

  test("navigate to booking page", async ({ page }) => {
    await page.goto("/sua-chua");
    const bookingLink = page.getByRole("link", { name: /Đặt lịch/i }).first();
    if (await bookingLink.isVisible()) {
      await bookingLink.click();
      await expect(page).toHaveURL(/\/dat-lich-sua-chua/);
    }
  });

  test("navigate to contact page", async ({ page }) => {
    await page.goto("/");
    const contactLink = page.getByRole("link", { name: /Liên hệ/i }).first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/\/lien-he/);
    }
  });

  test("404 page shows for unknown route", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.locator("body")).toContainText(/không tìm thấy|not found|404/i);
  });
});
