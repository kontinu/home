import { expect, test } from "@playwright/test";

test("services collection and detail flows stay usable with sparse content", async ({
  page
}) => {
  await page.goto("/servicios");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Consultoría cloud y platform engineering/i
    })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /Solicitar propuesta/i }).first()
  ).toBeVisible();

  const firstServiceLink = page.locator('[data-testid="service-card-link"]').first();

  await expect(firstServiceLink).toBeVisible();
  await firstServiceLink.click();

  await expect(page).toHaveURL(/\/servicios\/[^/]+\/?$/);
  await expect(page.getByRole("link", { name: /Volver a servicios/i }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Solicitar propuesta/i }).first()
  ).toBeVisible();
});
