# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: musicas.spec.ts >> Musicas Carousel >> should navigate to previous song when clicking left arrow
- Location: tests\musicas.spec.ts:37:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.col-span-4.lg\\:col-span-5 button:has-text("←")').first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic: scroller-end
  - generic: scroller-start
  - generic [ref=e3]:
    - generic: end
    - generic: start
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e9]:
          - paragraph [ref=e10]: Fazemos isso pelas memórias
          - paragraph [ref=e11]: Até agora tem valido a pena.
          - paragraph [ref=e12]: Isso não vai mudar
        - img "Capa - Sangue Visceral" [ref=e17] [cursor=pointer]
      - generic [ref=e19]:
        - generic [ref=e21]: Ind
        - generic [ref=e23]: Reni
        - generic [ref=e25]: Vince
        - generic [ref=e27]: Gabs
        - generic [ref=e29]: Tilas
      - generic [ref=e32]:
        - heading "Unreleased" [level=1] [ref=e33]
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]:
              - img [ref=e37]
              - img [ref=e38]
            - img [ref=e39] [cursor=pointer]
            - img [ref=e41] [cursor=pointer]
            - generic [ref=e43]: 1/12
          - generic [ref=e44]:
            - generic [ref=e45]:
              - generic [ref=e46]:
                - generic [ref=e47]:
                  - generic: sangue visceral
                - heading "Letargia" [level=2] [ref=e49]
              - generic [ref=e50]:
                - button "OUVIR" [ref=e51] [cursor=pointer]:
                  - img [ref=e53]
                  - generic [ref=e55]: OUVIR
                - list [ref=e56]:
                  - listitem [ref=e57]:
                    - img [ref=e58]
                    - text: "2024"
                  - listitem [ref=e60]:
                    - img [ref=e61]
                    - text: 3:24
            - list [ref=e63]:
              - listitem [ref=e64] [cursor=pointer]:
                - generic [ref=e65]:
                  - img [ref=e67]
                  - text: Letargia
                - generic [ref=e69]: sangue visceral
              - listitem [ref=e70] [cursor=pointer]:
                - generic [ref=e71]:
                  - img [ref=e73]
                  - text: me diga vc
                - generic [ref=e75]: sangue visceral
              - listitem [ref=e76] [cursor=pointer]:
                - generic [ref=e77]:
                  - img [ref=e79]
                  - text: coisas-dancantes.MOV
                - generic [ref=e81]: sangue visceral
              - listitem [ref=e82] [cursor=pointer]:
                - generic [ref=e83]:
                  - img [ref=e85]
                  - text: entrelaçamento quântico
                - generic [ref=e87]: sangue visceral
              - listitem [ref=e88] [cursor=pointer]:
                - generic [ref=e89]:
                  - img [ref=e91]
                  - text: não entendi
                - generic [ref=e93]: sangue visceral
              - listitem [ref=e94] [cursor=pointer]:
                - generic [ref=e95]:
                  - img [ref=e97]
                  - text: eco de mim
                - generic [ref=e99]: vazio preenchido
              - listitem [ref=e100] [cursor=pointer]:
                - generic [ref=e101]:
                  - img [ref=e103]
                  - text: poeira estelar
                - generic [ref=e105]: vazio preenchido
              - listitem [ref=e106] [cursor=pointer]:
                - generic [ref=e107]:
                  - img [ref=e109]
                  - text: fragmentos
                - generic [ref=e111]: vazio preenchido
              - listitem [ref=e112] [cursor=pointer]:
                - generic [ref=e113]:
                  - img [ref=e115]
                  - text: luz distante
                - generic [ref=e117]: vazio preenchido
              - listitem [ref=e118] [cursor=pointer]:
                - generic [ref=e119]:
                  - img [ref=e121]
                  - text: gravidade zero
                - generic [ref=e123]: vazio preenchido
              - listitem [ref=e124] [cursor=pointer]:
                - generic [ref=e125]:
                  - img [ref=e127]
                  - text: aurora negra
                - generic [ref=e129]: vazio preenchido
              - listitem [ref=e130] [cursor=pointer]:
                - generic [ref=e131]:
                  - img [ref=e133]
                  - text: limbo
                - generic [ref=e135]: vazio preenchido
      - contentinfo [ref=e141]:
        - generic [ref=e142]:
          - img [ref=e143]
          - list [ref=e146]:
            - listitem [ref=e147] [cursor=pointer]:
              - generic [ref=e148]:
                - img [ref=e149]
                - generic "instagram" [ref=e151]:
                  - generic [ref=e152]: i
                  - generic [ref=e153]: "n"
                  - generic [ref=e154]: s
                  - generic [ref=e155]: t
                  - generic [ref=e156]: a
                  - generic [ref=e157]: g
                  - generic [ref=e158]: r
                  - generic [ref=e159]: a
                  - generic [ref=e160]: m
            - listitem [ref=e161] [cursor=pointer]:
              - generic [ref=e162]:
                - img [ref=e163]
                - generic "spotify" [ref=e165]:
                  - generic [ref=e166]: s
                  - generic [ref=e167]: p
                  - generic [ref=e168]: o
                  - generic [ref=e169]: t
                  - generic [ref=e170]: i
                  - generic [ref=e171]: f
                  - generic [ref=e172]: "y"
            - listitem [ref=e173] [cursor=pointer]:
              - generic [ref=e174]:
                - img [ref=e175]
                - generic "tiktok" [ref=e177]:
                  - generic [ref=e178]: t
                  - generic [ref=e179]: i
                  - generic [ref=e180]: k
                  - generic [ref=e181]: t
                  - generic [ref=e182]: o
                  - generic [ref=e183]: k
            - listitem [ref=e184] [cursor=pointer]:
              - generic [ref=e185]:
                - img [ref=e186]
                - generic "detritoe@gmail.com" [ref=e188]:
                  - generic [ref=e189]: d
                  - generic [ref=e190]: e
                  - generic [ref=e191]: t
                  - generic [ref=e192]: r
                  - generic [ref=e193]: i
                  - generic [ref=e194]: t
                  - generic [ref=e195]: o
                  - generic [ref=e196]: e
                  - generic [ref=e197]: "@"
                  - generic [ref=e198]: g
                  - generic [ref=e199]: m
                  - generic [ref=e200]: a
                  - generic [ref=e201]: i
                  - generic [ref=e202]: l
                  - generic [ref=e203]: .
                  - generic [ref=e204]: c
                  - generic [ref=e205]: o
                  - generic [ref=e206]: m
            - listitem [ref=e207] [cursor=pointer]:
              - img [ref=e208]
              - generic [ref=e210]: cuscuz records
            - listitem [ref=e211] [cursor=pointer]:
              - img [ref=e212]
              - generic [ref=e214]: nossa música
            - listitem [ref=e215] [cursor=pointer]:
              - img [ref=e216]
              - generic [ref=e218]: próximos shows
            - listitem [ref=e219] [cursor=pointer]:
              - img [ref=e220]
              - generic [ref=e222]: links relevantes
          - generic [ref=e223]:
            - paragraph [ref=e224]: © 2026 Detrito Espacial. Todos os direitos reservados.
            - paragraph [ref=e225]: © Desenvolvidor por Elementare Studio
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
> 40 |     await leftArrow.click();
     |                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  57 |     await expect(ouvirButton).toBeVisible();
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