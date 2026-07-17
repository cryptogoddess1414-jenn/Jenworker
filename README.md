# jenworker

A static front-end clone of the [origami.chat](https://origami.chat) landing page.

## Provenance

Live scraping of origami.chat was not possible from this environment — both
a direct fetch and the web-fetch tool got HTTP 403 (the site appears to
block non-browser / proxied traffic). This clone was instead hand-built
from four mobile screenshots of the site provided by the user, covering:

- Hero section (headline, subhead, prompt input, Product Hunt badge)
- Mobile navigation menu (Product links, Pricing, Verticals, API Docs, etc.)
- Verticals/targeting section (industries with lead counts)
- Email/phone provider "waterfall" panel

Because the source was a handful of screenshots rather than the live DOM,
this reproduces the visible content and layout faithfully but is not a
byte-for-byte mirror — some off-screen content (assets, exact fonts/colors,
JS behavior, other pages) isn't captured.

## Files

- `index.html` — page markup
- `style.css` — styling
- `script.js` — mobile menu toggle

## Running locally

Just open `index.html` in a browser, or serve the folder:

```
npx serve .
```
