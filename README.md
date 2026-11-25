# Abdelhamid Ezzerg — Personal Academic Website

Source code for [https://ezzerg.github.io/](https://ezzerg.github.io/), built with React, TypeScript, Tailwind CSS, and Vite.

## Updating Content

### Adding a Publication
Create a new folder under `src/content/publications/<slug>/` with three files:
- `meta.json` — title, authors, venue, year, topics, `arxivUrl`, `abstract`, and optional `url` / `venueShort`
- `citation.bib` — BibTeX citation
- `thumbnail.png` (or `.jpg`, `.jpeg`, `.webp`, `.svg`) — preview figure

See `src/content/publications/README.md` for a full template. New papers are automatically discovered, sorted, added to the filter controls, and embedded into the static SEO HTML & Schema.org JSON-LD at build time.

### Updating Your CV
Replace `public/cv/EZZERG_CV.pdf` (keeping the exact filename so `https://ezzerg.github.io/cv/EZZERG_CV.pdf` stays valid).

### Updating Bio or Background
Edit `src/data/portfolioData.ts`.

## Local Development & Build

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs production bundle + pre-rendered SEO HTML to dist/
```

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds `dist/` and deploys it to GitHub Pages. Make sure **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions** and remove any older Next.js workflow that pointed to `./out`.

## Preserved SEO Files
- `public/googlecc09fd1143d6e8ba.html` — Google Search Console ownership verification
- `public/robots.txt` — crawler rules & sitemap pointer
- `public/sitemap.xml` — canonical sitemap (auto-stamped with build date in `dist/sitemap.xml`)
- `public/cv/EZZERG_CV.pdf` — hosted CV PDF
- `public/.nojekyll` — disables GitHub Pages Jekyll processing
