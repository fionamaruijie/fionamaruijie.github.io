# Ruijie Ma (Fiona) — Personal Portfolio

Live site: https://fionamaruijie.github.io/

A premium, editorial single-page portfolio positioned around **Business Analytics ×
Data Quality × AI Workflows**. Plain HTML, CSS, and vanilla JavaScript — no build step,
deploys directly on GitHub Pages.

## Design
- Restrained, consulting/editorial aesthetic: serif display type (Newsreader) + Inter,
  warm ivory palette, deep-teal accent, generous whitespace, hairline dividers.
- Signature **interactive “journey” map** (Experience section): click a city to read the
  story behind it. Light theme, English only.

## Structure
- `index.html` — all content & sections (Home, About, Work, Experience + map, Skills, Résumé, Contact)
- `style.css` — design system (CSS variables, responsive, light theme)
- `app.js` — mobile menu, scroll-spy, scroll reveal, and the interactive map (no libraries)
- `assets/`
  - `Ruijie_Ma_Resume.pdf` — résumé (linked from hero, résumé band)
  - `avatar.jpg` — portrait (About section)
  - `favicon.svg` — site icon
  - `world.svg` — faint world map used as the journey-map background
- `.nojekyll` — serve files as-is (no Jekyll processing)

## Dependencies
- Google Fonts (Newsreader + Inter), loaded via `<link>` with `preconnect` + `display=swap`.
  Everything else is self-hosted; no JS libraries.

## Deploying (GitHub Pages)
Settings → Pages → **Deploy from a branch** → `main` / `root`.
Pushing to `main` publishes at https://fionamaruijie.github.io/.

## Local preview
No build needed (serve over http so the fonts/assets load correctly):
```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Updating content
- **Résumé:** replace `assets/Ruijie_Ma_Resume.pdf` (same filename).
- **Map stories / cities:** edit the `CITIES` array near the top of `app.js`.
- **Projects / Experience / Skills:** edit the matching `<section>` in `index.html`.
- **Colors / fonts:** CSS variables at the top of `style.css` (`--accent`, `--serif`, …).

## Notes
- All external links use `target="_blank"` + `rel="noopener noreferrer"`.
- SEO metadata, Open Graph/Twitter tags, canonical URL, and Person JSON-LD are included in `<head>`.
- The site is a static HTML/CSS/JS portfolio designed for GitHub Pages.
