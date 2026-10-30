import { expect, test } from '@playwright/test';

test.describe('FIX-050 reasoned related content', () => {
  test('shows only editorially justified writing and capabilities on a project', async ({ page }) => {
    await page.goto('/en/projects/nis_boutique/');

    const relatedContent = page.locator('[data-related-content="project-context"]');
    await expect(relatedContent).toBeVisible();
    await expect(relatedContent.getByRole('link', {
      name: 'How I built a business site around WhatsApp',
    })).toBeVisible();
    await expect(relatedContent.getByText(
      'Explains the WhatsApp-first conversion decision used throughout this case study.',
    )).toBeVisible();
    await expect(relatedContent.getByRole('link', {
      name: 'What I learned from building a credible portfolio',
    })).toHaveCount(0);

    const capabilities = relatedContent.locator('[data-related-capabilities]');
    await expect(capabilities.getByText('Web & mobile products', { exact: true })).toBeVisible();
    await expect(capabilities.getByText('Product practice & leadership', { exact: true })).toBeVisible();
  });

  test('keeps the reciprocal project reason visible in Hebrew', async ({ page }) => {
    await page.goto('/he/blog/catering-whatsapp/');

    const relatedContent = page.getByRole('region', { name: 'פרויקטים קשורים' });
    await expect(relatedContent).toBeVisible();
    await expect(relatedContent.getByRole('link', { name: 'Nis Boutique Catering' })).toBeVisible();
    await expect(relatedContent.getByText(
      'מסביר את החלטת ההמרה מבוססת WhatsApp שמובילה את הקייס סטאדי הזה.',
    )).toBeVisible();
  });
});

test.describe('FIX-068 curated related articles', () => {
  test('shows no more than three topic-based article links with reasons', async ({ page }) => {
    await page.goto('/en/blog/small-project-architecture/');

    const heading = page.getByRole('heading', { name: 'Related articles' });
    const section = heading.locator('..');
    const links = section.getByRole('link');

    await expect(heading).toBeVisible();
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveText('The initial HTML should contain the article');
    await expect(section.getByText(/Continues the content-discovery path/)).toHaveCount(3);
    await expect(links.filter({ hasText: 'Even small projects need clear boundaries' })).toHaveCount(0);
  });

  test('keeps localized titles, reasons, and RTL links in Hebrew', async ({ page }) => {
    await page.goto('/he/blog/small-project-architecture/');

    const heading = page.getByRole('heading', { name: 'מאמרים קשורים' });
    const section = heading.locator('..');
    const links = section.getByRole('link');

    await expect(heading).toBeVisible();
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute(
      'href',
      '/he/blog/initial-html-should-contain-the-article/',
    );
    await expect(section.getByText(/ממשיך את מסלול גילוי התוכן/)).toHaveCount(3);
  });
});
