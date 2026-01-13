import { expect, test } from "@playwright/test";

test("basic test", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("h1")).toContainText("Hello world!");
	await expect(page.locator("button")).toBeVisible();
	await expect(page.getByText("About Page")).toBeVisible();
});
