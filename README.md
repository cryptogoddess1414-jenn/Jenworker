# jenworker

Jenworker's marketing/product site, originally cloned from
[origami.chat](https://origami.chat) and rebranded: "Origami" → "Jenworker",
pink accent → gold, matching the Agentic Builder brand family.

The hero prompt composer, chat widget, and "Start Free" capture flow are
wired to the live backend in
[jenworker-backend](https://github.com/cryptogoddess1414-jenn/jenworker-backend)
at `https://jenworker-api.up.railway.app` (`/api/prospect`, `/api/leads`,
`/api/chat`).

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

## Pages

- `index.html` — home (hero, verticals, provider waterfalls)
- `lead-generation.html`, `web-scraping.html`, `verticals.html`, `sign-in.html` — product/auth pages, placeholder content inferred from the nav (no screenshots existed for these)
- `style.css` — shared styling
- `script.js` — mobile menu toggle

## Files

- `preview.html` — a single self-contained version of the whole site, with all pages inlined and a hash-based router (`#/lead-generation`, `#/sign-in`, etc.) so it can run as one file with smooth page-to-page transitions. Every nav item and CTA is wired up, including a few not covered by any screenshot (e.g. Data Enrichment, API Docs), which route to a shared "not in this preview" page instead of dead-ending.

## Running locally

Open `index.html` (multi-page version) or `preview.html` (single-file router version) directly in a browser, or serve the folder:

```
npx serve .
```
