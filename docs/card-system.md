# Card surface system

The public portfolio uses one card foundation and exactly three visual variants. Feature classes still own their internal layout; the card system owns the shared border, radius, surface, shadow, and interactive response.

| Variant | Use | Visual treatment |
| --- | --- | --- |
| `raised` | Important grouped content that sits above the page | Raised surface, shared border, panel radius, restrained shadow |
| `muted` | Supporting context, indexes, and form workspaces | Muted surface, shared border and radius, no elevation |
| `interactive` | A card whose primary purpose is opening or exploring content | Raised treatment plus a clearer hover/focus border and subtle lift on precise pointers |

Use `cardSurfaceClassName(variant, featureClass)` from `src/components/cardSurface.ts`. Do not introduce a fourth surface treatment for a local feature; keep its layout in the feature class and choose the closest documented variant.

Nested controls, fields, status messages, media frames, and code samples are not cards. They keep their own control or content styling.

## Current inventory

- `raised`: professional overview groups, direct-contact panel, message review, AI provenance shell.
- `muted`: project index, contact context and brief workspace, nested AI provenance evidence.
- `interactive`: featured projects, writing entries, blog archive entries, curated reading routes, and audience entry paths.

Project accents may color an internal rule, index, or media frame, but they do not create another card surface variant.
