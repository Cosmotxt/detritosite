# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: musicas.spec.ts >> Musicas Carousel >> should display OUVIR button
- Location: tests\musicas.spec.ts:55:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.col-span-3.lg\\:col-start-6 a:has-text("OUVIR")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.col-span-3.lg\\:col-start-6 a:has-text("OUVIR")')

```

```yaml
- text: scroller-end scroller-start end start
- paragraph: Fazemos isso pelas memórias
- paragraph: Até agora tem valido a pena.
- paragraph: Isso não vai mudar
- img "Capa - Sangue Visceral"
- text: Ind Reni Vince Gabs Tilas
- heading "Unreleased" [level=1]
- img
- img
- img
- img
- text: 1/12 sangue visceral
- heading "Letargia" [level=2]
- button "OUVIR":
  - img
  - text: OUVIR
- list:
  - listitem:
    - img
    - text: "2024"
  - listitem:
    - img
    - text: 3:24
- list:
  - listitem:
    - img
    - text: Letargia sangue visceral
  - listitem:
    - img
    - text: me diga vc sangue visceral
  - listitem:
    - img
    - text: coisas-dancantes.MOV sangue visceral
  - listitem:
    - img
    - text: entrelaçamento quântico sangue visceral
  - listitem:
    - img
    - text: não entendi sangue visceral
  - listitem:
    - img
    - text: eco de mim vazio preenchido
  - listitem:
    - img
    - text: poeira estelar vazio preenchido
  - listitem:
    - img
    - text: fragmentos vazio preenchido
  - listitem:
    - img
    - text: luz distante vazio preenchido
  - listitem:
    - img
    - text: gravidade zero vazio preenchido
  - listitem:
    - img
    - text: aurora negra vazio preenchido
  - listitem:
    - img
    - text: limbo vazio preenchido
- contentinfo:
  - img
  - list:
    - listitem:
      - img
    - listitem:
      - img
    - listitem:
      - img
    - listitem:
      - img
    - listitem:
      - img
      - text: cuscuz records
    - listitem:
      - img
      - text: nossa música
    - listitem:
      - img
      - text: próximos shows
    - listitem:
      - img
      - text: links relevantes
  - paragraph: © 2026 Detrito Espacial. Todos os direitos reservados.
  - paragraph: © Desenvolvidor por Elementare Studio
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Musicas Carousel', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('http://localhost:5174');
  6  |     await page.waitForTimeout(2000);
  7  |   });
  8  | 
  9  |   test('should display unreleaseds title', async ({ page }) => {
  10 |     const title = page.locator('h2:has-text("unreleaseds")');
  11 |     await expect(title).toBeVisible();
  12 |   });
  13 | 
  14 |   test('should display 11 indicator dots', async ({ page }) => {
  15 |     const dots = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full');
  16 |     await expect(dots).toHaveCount(12);
  17 |   });
  18 | 
  19 |   test('should display 7 items in the right list', async ({ page }) => {
  20 |     const listItems = page.locator('.col-span-4.lg\\:col-start-9 .list-item');
  21 |     await expect(listItems).toHaveCount(7);
  22 |   });
  23 | 
  24 |   test('should navigate to next song when clicking right arrow', async ({ page }) => {
  25 |     const rightArrow = page.locator('.col-span-4.lg\\:col-span-5 button:has-text("→")').first();
  26 |     
  27 |     const initialActiveDot = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full[style*="var(--white-color)"]').first();
  28 |     
  29 |     await rightArrow.click();
  30 |     await page.waitForTimeout(1000);
  31 |     
  32 |     const newActiveDot = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full[style*="var(--white-color)"]').first();
  33 |     
  34 |     expect(newActiveDot).not.toEqual(initialActiveDot);
  35 |   });
  36 | 
  37 |   test('should navigate to previous song when clicking left arrow', async ({ page }) => {
  38 |     const leftArrow = page.locator('.col-span-4.lg\\:col-span-5 button:has-text("←")').first();
  39 |     
  40 |     await leftArrow.click();
  41 |     await page.waitForTimeout(1000);
  42 |     
  43 |     const activeDot = page.locator('.col-span-4.lg\\:col-span-5 .rounded-full[style*="var(--white-color)"]').first();
  44 |     await expect(activeDot).toBeVisible();
  45 |   });
  46 | 
  47 |   test('should display current song metadata', async ({ page }) => {
  48 |     const badge = page.locator('.col-span-3.lg\\:col-start-6 .inline-block:has-text("sangue visceral")');
  49 |     await expect(badge).toBeVisible();
  50 | 
  51 |     const title = page.locator('.col-span-3.lg\\:col-start-6 h3:has-text("Letargia")');
  52 |     await expect(title).toBeVisible();
  53 |   });
  54 | 
  55 |   test('should display OUVIR button', async ({ page }) => {
  56 |     const ouvirButton = page.locator('.col-span-3.lg\\:col-start-6 a:has-text("OUVIR")');
> 57 |     await expect(ouvirButton).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
  58 |     await expect(ouvirButton).toHaveAttribute('href', '#');
  59 |   });
  60 | 
  61 |   test('should collapse current cover when navigating next', async ({ page }) => {
  62 |     const cover = page.locator('.col-span-4.lg\\:col-span-5 .bg-(--green-color)').first();
  63 |     
  64 |     const initialBoundingBox = await cover.boundingBox();
  65 |     expect(initialBoundingBox).toBeTruthy();
  66 |     const initialHeight = initialBoundingBox!.height;
  67 |     
  68 |     const rightArrow = page.locator('.col-span-4.lg\\:col-span-5 button:has-text("→")').first();
  69 |     await rightArrow.click();
  70 |     
  71 |     await page.waitForTimeout(400);
  72 |     
  73 |     const midAnimationBoundingBox = await cover.boundingBox();
  74 |     expect(midAnimationBoundingBox).toBeTruthy();
  75 |     expect(midAnimationBoundingBox!.height).toBeLessThan(initialHeight! * 0.5);
  76 |   });
  77 | 
  78 |   test('should have proper grid layout', async ({ page }) => {
  79 |     const section = page.locator('section:has-text("unreleaseds")');
  80 |     await expect(section).toHaveClass(/grid/);
  81 |     
  82 |     const coverContainer = page.locator('.col-span-4.lg\\:col-span-5');
  83 |     await expect(coverContainer).toBeVisible();
  84 |     
  85 |     const metadataContainer = page.locator('.col-span-3.lg\\:col-start-6');
  86 |     await expect(metadataContainer).toBeVisible();
  87 |     
  88 |     const listContainer = page.locator('.col-span-4.lg\\:col-start-9');
  89 |     await expect(listContainer).toBeVisible();
  90 |   });
  91 | });
```