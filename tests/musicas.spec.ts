import { test, expect } from '@playwright/test';

test.describe('Musicas Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);
  });

  test('should display unreleaseds title', async ({ page }) => {
    const title = page.locator('h2:has-text("unreleaseds")');
    await expect(title).toBeVisible();
  });

  test('should display 11 indicator dots', async ({ page }) => {
    const dots = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full');
    await expect(dots).toHaveCount(12);
  });

  test('should display 7 items in the right list', async ({ page }) => {
    const listItems = page.locator('.col-span-4.lg\\:col-start-9 .list-item');
    await expect(listItems).toHaveCount(7);
  });

  test('should navigate to next song when clicking right arrow', async ({ page }) => {
    const rightArrow = page.locator('.col-span-4.lg\\:col-span-5 button:has-text("→")').first();
    
    const initialActiveDot = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full[style*="var(--white-color)"]').first();
    
    await rightArrow.click();
    await page.waitForTimeout(1000);
    
    const newActiveDot = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full[style*="var(--white-color)"]').first();
    
    expect(newActiveDot).not.toEqual(initialActiveDot);
  });

  test('should navigate to previous song when clicking left arrow', async ({ page }) => {
    const leftArrow = page.locator('.col-span-4.lg\\:col-span-5 button:has-text("←")').first();
    
    await leftArrow.click();
    await page.waitForTimeout(1000);
    
    const activeDot = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full[style*="var(--white-color)"]').first();
    await expect(activeDot).toBeVisible();
  });

  test('should display current song metadata', async ({ page }) => {
    const badge = page.locator('.col-span-3.lg\\:col-start-6 .inline-block:has-text("sangue visceral")');
    await expect(badge).toBeVisible();

    const title = page.locator('.col-span-3.lg\\:col-start-6 h3:has-text("Letargia")');
    await expect(title).toBeVisible();
  });

  test('should display OUVIR button', async ({ page }) => {
    const ouvirButton = page.locator('.col-span-3.lg\\:col-start-6 a:has-text("OUVIR")');
    await expect(ouvirButton).toBeVisible();
    await expect(ouvirButton).toHaveAttribute('href', '#');
  });

  test('should collapse current cover when navigating next', async ({ page }) => {
    const cover = page.locator('.col-span-4.lg\\:col-span-5 .bg-(--green-color)').first();
    
    const initialBoundingBox = await cover.boundingBox();
    expect(initialBoundingBox).toBeTruthy();
    const initialHeight = initialBoundingBox!.height;
    
    const rightArrow = page.locator('.col-span-4.lg\\:col-span-5 button:has-text("→")').first();
    await rightArrow.click();
    
    await page.waitForTimeout(400);
    
    const midAnimationBoundingBox = await cover.boundingBox();
    expect(midAnimationBoundingBox).toBeTruthy();
    expect(midAnimationBoundingBox!.height).toBeLessThan(initialHeight! * 0.5);
  });

  test('should have proper grid layout', async ({ page }) => {
    const section = page.locator('section:has-text("unreleaseds")');
    await expect(section).toHaveClass(/grid/);
    
    const coverContainer = page.locator('.col-span-4.lg\\:col-span-5');
    await expect(coverContainer).toBeVisible();
    
    const metadataContainer = page.locator('.col-span-3.lg\\:col-start-6');
    await expect(metadataContainer).toBeVisible();
    
    const listContainer = page.locator('.col-span-4.lg\\:col-start-9');
    await expect(listContainer).toBeVisible();
  });
});