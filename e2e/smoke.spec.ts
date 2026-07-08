import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads and shows site name", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Anh Táo Mobile/);
  });

  test("navbar is visible with key links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    await expect(nav.getByText("Sản phẩm")).toBeVisible();
    await expect(nav.getByText("Sửa chữa")).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText("Anh Táo Mobile")).toBeVisible();
  });

  test("health endpoint returns OK", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
  });
});
