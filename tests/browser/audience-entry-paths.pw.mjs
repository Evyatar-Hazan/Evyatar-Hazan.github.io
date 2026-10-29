import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const languages = {
  en: {
    title: 'What are you here to explore?',
    links: [
      ['Discuss a product or system', '/en/contact/'],
      ['Review selected work', '/en/projects/'],
      ['Read the technical notes', '/en/blog/'],
    ],
  },
  he: {
    title: 'מה תרצו למצוא כאן?',
    links: [
      ['לדבר על מוצר או מערכת', '/he/contact/'],
      ['לצפייה בעבודות נבחרות', '/he/projects/'],
      ['לקריאת הכתיבה הטכנית', '/he/blog/'],
    ],
  },
};

for (const viewport of viewports) {
  for (const [language, copy] of Object.entries(languages)) {
    for (const theme of ['light', 'dark']) {
      test(`FIX-038 ${viewport.name}-${language}-${theme} exposes stable audience paths`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(`/${language}/`);

        const controlsBefore = await page.locator('.system-rail').boundingBox();
        const navigation = page.getByRole('navigation', { name: copy.title });
        await expect(navigation).toBeVisible();
        await navigation.scrollIntoViewIfNeeded();

        for (const [label, href] of copy.links) {
          const link = navigation.getByRole('link', { name: label });
          await expect(link).toHaveAttribute('href', href);
          await link.focus();
          await expect(link).toBeFocused();
        }

        const controlsAfter = await page.locator('.system-rail').boundingBox();
        expect(controlsAfter).toEqual(controlsBefore);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      });
    }
  }
}
