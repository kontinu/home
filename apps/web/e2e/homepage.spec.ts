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
      level: 2,
      name: /Consultoría cloud y platform engineering/i
    })
  ).toBeVisible();

  await page.goto("/");

  await page.getByRole("link", { name: /Ver bootcamps/i }).first().click();
  await expect(page).toHaveURL(/\/bootcamps\/?$/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Bootcamps técnicos para convertir conceptos en práctica operativa/i
    })
  ).toBeVisible();
});
