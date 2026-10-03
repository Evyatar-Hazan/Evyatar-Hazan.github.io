# Resilient calendar-date presentation

`presentCalendarDate` is a small, dependency-free utility for presenting date-only values without letting malformed input break a larger interface.

## Public provenance

The implementation is extracted from a need already visible in Evyatar Hazan's public portfolio:

- `src/pages/BlogIndex.tsx`, `src/pages/BlogPost.tsx`, and `src/components/sections/BlogPreview.tsx` each format the same blog metadata date.
- The bilingual public article [`one-bad-date-should-not-blank-a-screen`](https://evyatarhazan.com/blog/one-bad-date-should-not-blank-a-screen/) explains why an invalid secondary date should degrade locally instead of blanking a whole screen.
- The article was added by public commit [`176873f7d35a9bf3fa8960d9b1d25d4418eb56ed`](https://github.com/Evyatar-Hazan/Evyatar-Hazan.github.io/commit/176873f7d35a9bf3fa8960d9b1d25d4418eb56ed), authored and committed by Evyatar Hazan.

This feature does not claim that the unnamed file-management tool discussed in that article is public. The reusable implementation here is based only on the portfolio's public formatters and public explanation.

## API

```ts
import { presentCalendarDate } from './presentCalendarDate';

const presentation = presentCalendarDate('2026-09-13', {
  language: 'en',
  style: 'long',
  fallback: 'Date unavailable',
});

// {
//   status: 'valid',
//   text: 'September 13, 2026',
//   dateTime: '2026-09-13'
// }
```

### Input

- `input`: an unknown value. Only an exact ISO calendar date in `YYYY-MM-DD` form is accepted.
- `language`: `en` or `he`.
- `style`: optional `long` or `compact`; defaults to `long`.
- `fallback`: optional text for absent or invalid input; defaults to an em dash.

### Output

- `status`: `valid`, `empty`, or `invalid`.
- `text`: formatted date or the supplied fallback.
- `dateTime`: the validated ISO value for a semantic HTML `<time>` element, otherwise `null`.

The explicit status lets a consumer distinguish missing data from malformed data without parsing display copy.

## React demo integration

The demo depends on the portfolio's localized-route contract instead of constructing URLs:

```tsx
import { localizedPath } from '../../routing/portfolioRoutes';
import { createDatePresentationRegistration } from './datePresentationRegistration';

const registration = createDatePresentationRegistration(localizedPath);
```

Task 09 owns `localizedPath` and the router. Task 12 owns only the feature module and slot registration. The integrator decides where `lab.reusableComponent` mounts and adds its static route or navigation entry if needed.

After mounting the demo, the integrator can replace the duplicated local formatters in `BlogIndex.tsx`, `BlogPost.tsx`, and `BlogPreview.tsx` with:

```ts
presentCalendarDate(post.date, { language, style: 'long' }).text
```

`BlogPreview.tsx` may keep its existing compact presentation by passing `style: 'compact'`.

The demo processes input entirely in the browser. It performs no fetch, telemetry, persistence, clipboard write, or external submission.

## Deliberate limitations

- Calendar dates only; timestamps are rejected.
- No relative dates, durations, date arithmetic, or timezone conversion.
- Ambiguous strings such as `03/04/2026` are rejected.
- Gregorian dates from year `0001` through `9999` only.
- Presentation depends on the browser's `Intl.DateTimeFormat` and installed locale data.
- Invalid data is contained and surfaced; it is not repaired.

## License status

At implementation time, the public repository had no `LICENSE`, `COPYING`, or package-level license declaration. Public visibility alone does not grant reuse rights. This task does not add a license or describe the utility as open source.

Before encouraging reuse outside this portfolio, the owner must explicitly choose one of these positions:

1. Add a named license, such as MIT, scoped either to the repository or this utility directory.
2. Keep the current default copyright position and state that no reuse license is granted.

No package registry publication, account, credential, or release is part of this feature.
