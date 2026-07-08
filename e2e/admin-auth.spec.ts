import { test, expect } from "@playwright/test";

test.describe("Admin Authentication", () => {
  test("admin page redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    // Should redirect to /login
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin dashboard is not accessible without auth", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin products page redirects without auth", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("main")).toBeVisible();
  });
});
