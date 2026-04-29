import { expect, test } from "@playwright/test";

test("bootcamps collection and detail flows stay usable with sparse content", async ({
  page
}) => {
  await page.goto("/bootcamps");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Bootcamps técnicos para convertir conceptos en práctica operativa/i
    })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /Solicitar información/i }).first()
  ).toBeVisible();

  const firstBootcampLink = page.locator('[data-testid="bootcamp-card-link"]').first();

  await expect(firstBootcampLink).toBeVisible();
  await firstBootcampLink.click();

  await expect(page).toHaveURL(/\/bootcamps\/[^/]+\/?$/);
  await expect(page.getByRole("link", { name: /Volver a bootcamps/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Inscribirme|Solicitar información/i }).first()
  ).toBeVisible();
});
