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

    const relatedContent = page.locator('[data-related-content="reasoned-links"]');
    await expect(relatedContent).toBeVisible();
    await expect(relatedContent.getByRole('link', { name: 'Nis Boutique Catering' })).toBeVisible();
    await expect(relatedContent.getByText(
      'מסביר את החלטת ההמרה מבוססת WhatsApp שמובילה את הקייס סטאדי הזה.',
    )).toBeVisible();
  });
});
