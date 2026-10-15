import { expect, test } from '@playwright/test';

const routes = ['/', '/projects/', '/about/', '/blog/', '/contact/'];
const languages = ['en', 'he'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const tokens = [
  '--type-scale-label',
  '--type-scale-body-sm',
  '--type-scale-body',
  '--type-scale-body-lg',
  '--type-scale-h4',
  '--type-scale-h3',
  '--type-scale-h2',
  '--type-scale-h1',
];

const resolveTypeScale = (tokenNames) => {
  const probe = document.createElement('span');
  probe.hidden = true;
  document.body.append(probe);

  const resolved = tokenNames.map((token) => {
    probe.style.fontSize = `var(${token})`;
    return Number.parseFloat(getComputedStyle(probe).fontSize);
  });

  probe.remove();
  return resolved;
};

for (const language of languages) {
  for (const viewport of viewports) {
    test(`${language} core routes use the canonical type scale at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);

      for (const route of routes) {
        await page.goto(`/${language}${route}`);
        await page.locator('main').waitFor();

        const audit = await page.evaluate(({ tokens }) => {
          const probe = document.createElement('span');
          probe.style.position = 'fixed';
          probe.style.visibility = 'hidden';
          document.body.append(probe);

          const allowedSizes = tokens.map((token) => {
            probe.style.fontSize = `var(${token})`;
            return Number.parseFloat(getComputedStyle(probe).fontSize);
          });
          probe.remove();

          const tracked = [...document.querySelectorAll('h1, h2, h3, h4, p')]
            .filter((element) => element.textContent?.trim())
            .map((element) => ({
              tag: element.tagName.toLowerCase(),
              text: element.textContent.trim().slice(0, 80),
              size: Number.parseFloat(getComputedStyle(element).fontSize),
            }));

          return {
            allowedSizes,
            invalid: tracked.filter(({ size }) => (
              !allowedSizes.some((allowed) => Math.abs(allowed - size) < 0.05)
            )),
          };
        }, { tokens });

        expect(audit.allowedSizes, `${language}${route} should resolve the full scale`).toEqual(
          await page.evaluate(resolveTypeScale, tokens),
        );
        expect(audit.invalid, `${language}${route} should use only canonical sizes`).toEqual([]);
      }
    });
  }
}
