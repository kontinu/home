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
});
