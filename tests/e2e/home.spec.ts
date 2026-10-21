import { test, expect } from "@playwright/test";

test("shows the booking form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /request an appointment/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /request booking/i })).toBeVisible();
  await expect(page.getByLabel(/full name/i)).toBeVisible();
});
