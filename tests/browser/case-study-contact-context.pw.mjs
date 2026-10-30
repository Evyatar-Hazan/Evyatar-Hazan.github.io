import { expect, test } from '@playwright/test';

const projectIds = [
  'nis_boutique',
  'online_converter',
  'emergency_protocol',
  'united_hatzalah',
];

const scenarios = [
  {
    language: 'en',
    theme: 'light',
    viewport: { width: 1440, height: 900 },
    contactLabel: 'Start a conversation',
    privacyNote: 'No personal details are stored in the URL.',
  },
  {
    language: 'en',
    theme: 'dark',
    viewport: { width: 390, height: 844 },
    contactLabel: 'Start a conversation',
    privacyNote: 'No personal details are stored in the URL.',
  },
  {
    language: 'he',
    theme: 'light',
    viewport: { width: 1440, height: 900 },
    contactLabel: 'מתחילים שיחה',
    privacyNote: 'פרטים אישיים אינם נשמרים בכתובת.',
  },
  {
    language: 'he',
    theme: 'dark',
    viewport: { width: 390, height: 844 },
    contactLabel: 'מתחילים שיחה',
    privacyNote: 'פרטים אישיים אינם נשמרים בכתובת.',
  },
];

for (const scenario of scenarios) {
  test(`FIX-079 carries safe context from every ${scenario.language} case study at ${scenario.viewport.width}px`, async ({ page }) => {
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, scenario);
    await page.setViewportSize(scenario.viewport);

    for (const projectId of projectIds) {
      await page.goto(`/${scenario.language}/projects/${projectId}/`, { waitUntil: 'domcontentloaded' });

      const projectTitle = (await page.locator('.case-story-hero h1').textContent())?.trim();
      expect(projectTitle).toBeTruthy();

      const controlsBefore = await page.locator('.system-rail-icon').evaluateAll((controls) => controls.map((control) => {
        const rect = control.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }));
      const contactLink = page.locator('#next .case-story-footer-actions')
        .getByRole('link', { name: scenario.contactLabel });

      await expect(contactLink).toHaveAttribute(
        'href',
        `/${scenario.language}/contact/?intent=project&project=${projectId}`,
      );
      await contactLink.focus();
      await expect(contactLink).toBeFocused();
      await page.keyboard.press('Enter');

      await expect(page).toHaveURL(
        new RegExp(`/${scenario.language}/contact/\\?intent=project&project=${projectId}$`),
      );
      await expect(page.locator('.contact-context-card__copy h2')).toHaveText(projectTitle);
      await expect(page.getByText(scenario.privacyNote, { exact: false })).toBeVisible();

      const searchEntries = await page.evaluate(() => [...new URL(window.location.href).searchParams.entries()]);
      expect(searchEntries).toEqual([
        ['intent', 'project'],
        ['project', projectId],
      ]);

      const emailHref = await page.locator('.contact-workspace')
        .getByRole('link', { name: scenario.language === 'he' ? 'אימייל' : 'Email', exact: true })
        .getAttribute('href');
      const emailQuery = new URLSearchParams(emailHref?.split('?')[1] ?? '');
      expect(emailQuery.get('body')).toContain(projectTitle);
      expect(emailQuery.has('name')).toBe(false);
      expect(emailQuery.has('email')).toBe(false);
      expect(emailQuery.has('message')).toBe(false);

      const controlsAfter = await page.locator('.system-rail-icon').evaluateAll((controls) => controls.map((control) => {
        const rect = control.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }));
      expect(controlsAfter).toEqual(controlsBefore);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
        `${scenario.language}/${projectId} must not overflow`,
      ).toBe(false);
    }
  });
}
