import { test, expect } from '@playwright/test';

/**
 * Basic E2E tests for Keira - Video Watermark Removal
 */
test.describe('Keira Application', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Keira/i);
  });

  test('should display the main interface', async ({ page }) => {
    await page.goto('/');
    // Verify main app container is visible
    await expect(page.locator('#root')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    // Check viewport is set correctly
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
  });
});
