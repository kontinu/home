import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile nav toggle shows and hides the nav panel", async ({ page }) => {
  const menuButton = page.getByRole("button", { name: "Menú" });
  const mobilePanel = page.locator("#mobile-nav-panel");

  await page.goto("/");

  await expect(mobilePanel.getByRole("link", { name: "Servicios" })).not.toBeVisible();
  await expect(mobilePanel.getByRole("link", { name: "Bootcamps" })).not.toBeVisible();

  await menuButton.click();
  await expect(mobilePanel.getByRole("link", { name: "Servicios" })).toBeVisible();
  await expect(mobilePanel.getByRole("link", { name: "Bootcamps" })).toBeVisible();
  await expect(mobilePanel.getByRole("link", { name: "Cómo trabajamos" })).toBeVisible();
  await expect(mobilePanel.getByRole("link", { name: "Hablemos" })).toBeVisible();

  await expect(menuButton).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(mobilePanel.getByRole("link", { name: "Servicios" })).not.toBeVisible();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");

  await menuButton.click();
  await mobilePanel.getByRole("link", { name: "Cómo trabajamos" }).click();
  await expect(page).toHaveURL(/\/#como-trabajamos$/);
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(mobilePanel.getByRole("link", { name: "Servicios" })).not.toBeVisible();
});
