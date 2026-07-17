# Asset Manifest — Technical Spike

| Project file | Source | Date | Role | Notes |
|---|---|---|---|---|
| `public/assets/signal-forge-hero.webp` | Built-in ImageGen output `exec-fb2de77d-bf49-4151-aba8-24e274fd4122.png`, generated from the approved Signal Forge visual reference | 2026-07-14 | Hero artwork and poster-first visual state | Standalone artwork without UI text; compressed locally to WebP |
| `public/assets/signal-forge-hero-mobile.webp` | Responsive derivative of `signal-forge-hero.webp` | 2026-07-14 | Mobile Hero artwork | Same approved artwork resized to `800×500` and compressed to `21,604` bytes; selected only through the mobile `<picture>` source |
| `public/assets/evyatar-mark.png` | Portfolio legacy `public/favicon.png` | 2026-07-14 | Real Evyatar identity mark | Reused without modification |
| `public/assets/nis-logo-card.jpg` | NIS project `public/brand/nis-logo-card.jpg` | 2026-07-14 | Real brand proof | Copied from the owned project repository |
| `public/assets/nis-salad-cups.webp` | NIS project `public/media/food/nis-salad-cups-branded-1080w.webp` | 2026-07-14 | Primary NIS product media | Real branded catering media |
| `public/assets/nis-salmon-skewers.webp` | NIS project `public/media/food/events/salmon-skewers-close-1200w.webp` | 2026-07-14 | Supporting NIS event media | Real catering media |
| `public/assets/nis-live-hero-desktop.png` | Clean capture of the owned live product at `https://nisboutiquecatering.com/` | 2026-07-14 | Desktop product proof | Route `/`; viewport `1440×900`; owned-project UI; real Hero and WhatsApp CTA |
| `public/assets/nis-live-hero-mobile.png` | Clean capture of the owned live product at `https://nisboutiquecatering.com/` | 2026-07-14 | Mobile product proof | Route `/`; viewport `390×844`; owned-project UI; independent mobile layout and persistent WhatsApp CTA |
No ImageGen output is used as product proof. Generated artwork is limited to the abstract Signal Forge world; the NIS chapter uses only real project media.
