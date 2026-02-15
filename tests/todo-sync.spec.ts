import { expect, test } from "@playwright/test";

test("todo syncs across two clients", async ({ browser }) => {
	test.skip(
		process.env.E2E_ZERO !== "1",
		"Set E2E_ZERO=1 and run zero-cache + postgres for this spec.",
	);

	const contextA = await browser.newContext();
	const contextB = await browser.newContext();
	const pageA = await contextA.newPage();
	const pageB = await contextB.newPage();

	const todoTitle = `sync-${Date.now()}`;

	await pageA.goto("/demo/todo");
	await pageB.goto("/demo/todo");

	await expect(pageA.getByText("Realtime Todo Demo")).toBeVisible();
	await expect(pageB.getByText("Realtime Todo Demo")).toBeVisible();

	await pageA.getByPlaceholder("Add a todo and press Enter").fill(todoTitle);
	await pageA.getByPlaceholder("Add a todo and press Enter").press("Enter");

	const todoRowA = pageA.locator("li", { hasText: todoTitle }).first();
	const todoRowB = pageB.locator("li", { hasText: todoTitle }).first();

	await expect(todoRowB).toBeVisible({ timeout: 10_000 });

	await todoRowB.locator("input[type='checkbox']").check();
	await expect(todoRowA.locator("input[type='checkbox']")).toBeChecked({
		timeout: 10_000,
	});

	await todoRowB.getByRole("button", { name: "Delete" }).click();
	await expect(todoRowA).toBeHidden({ timeout: 10_000 });

	await contextA.close();
	await contextB.close();
});
