import { expect, test } from "@playwright/test";

test("homepage shows the primary headline and both conversion paths", async ({
  page
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Aceleramos equipos y plataformas cloud/i
    })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /Servicios/i }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Bootcamps/i }).first()
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /Explorar servicios/i }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Ver bootcamps/i }).first()
  ).toBeVisible();

  await page.getByRole("link", { name: /Explorar servicios/i }).first().click();
  await expect(page).toHaveURL(/\/servicios\/?$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Consultoría cloud y platform engineering/i
    })
  ).toBeVisible();

  await page.getByRole("link", { name: /Cómo trabajamos/i }).click();
  await expect(page).toHaveURL(/\/#como-trabajamos$/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Dos caminos claros, una misma disciplina técnica/i
    })
  ).toBeVisible();

  await page.goto("/");

  await page.getByRole("link", { name: /Ver bootcamps/i }).first().click();
  await expect(page).toHaveURL(/\/bootcamps\/?$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Bootcamps técnicos para convertir conceptos en práctica operativa/i
    })
  ).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /Saltar al contenido/i })).toBeFocused();
  await expect(page.getByRole("link", { name: /Saltar al contenido/i })).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/bootcamps\/?#contenido-principal$/);
});
