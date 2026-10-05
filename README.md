# Ruijie Ma (Fiona) — Personal Portfolio

Live site: https://fionamaruijie.github.io/

Personal portfolio of Ruijie Ma (Fiona), a New York-based Business & Data Analyst working
across data quality, financial analysis, and research. M.S. in Business Analytics and
Artificial Intelligence (STEM), Johns Hopkins Carey Business School (Jul 2026).

Plain HTML, CSS, and vanilla JavaScript — no build step, deploys directly on GitHub Pages.

## Design
- Editorial, consulting-style look: Newsreader serif for display type + Inter for body
  text, soft lavender-white background, deep plum text, periwinkle-violet accent
  (`#6C5CE7`), and a baby-blue → violet → pink gradient (`#8FB8FF → #B49BF4 → #F4A6D4`)
  on the headline accent, primary buttons and badges. Generous whitespace, hairline dividers.
- Signature **interactive “journey” map** (Experience section): click a city to read the
  story behind it. Light theme only, English only.

## Structure
- `index.html` — all content & sections (Home, About, Work, Experience + map, Skills, Résumé, Contact)
- `style.css` — design system (CSS variables, responsive, light theme)
- `app.js` — mobile menu, scroll-spy, scroll reveal, and the interactive map (no libraries)
- `assets/`
  - `Ruijie_Ma_Resume.pdf` — résumé (linked from hero, résumé band)
  - `Inventory_Agent_Report.pdf` — team report (linked from the Inventory Agent project)
  - `avatar.jpg` — portrait (hero; also the social-preview image)
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
