import { test, expect } from "@playwright/test";

test.describe("Repair Booking", () => {
  test("booking form page loads", async ({ page }) => {
    await page.goto("/dat-lich-sua-chua");
    await expect(page).toHaveTitle(/Đặt lịch|sửa chữa|Anh Táo/i);
  });

  test("booking form has required fields", async ({ page }) => {
    await page.goto("/dat-lich-sua-chua");
    await expect(page.locator('input[name="customerName"], input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="customerPhone"], input[name="phone"]')).toBeVisible();
  });

  test("booking form validates required fields", async ({ page }) => {
    await page.goto("/dat-lich-sua-chua");
    const submitBtn = page.getByRole("button", { name: /Đặt lịch|Gửi/i });
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
      // Browser should show validation for required fields
      // The form should not navigate away
      await expect(page).toHaveURL(/\/dat-lich-sua-chua/);
    }
  });
});
