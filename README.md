# amioprenova

Official website for jazz vocalist **Ami Oprenova** — a static site built with Astro, Tailwind CSS, and TypeScript. Multilingual (English + Bulgarian), deployed via Cloudflare Pages.

---

## Development

### Prerequisites

- Node.js v18 or later
- npm

### Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Development server at `http://localhost:4321` |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npx astro check` | TypeScript type checking (0 errors expected) |

**Always run `npm run build` before committing.** The build must pass with 0 errors.

### Testing Light/Dark Mode

1. Open `http://localhost:4321/en` in Chrome
2. Open DevTools (`F12`) → More tools → Rendering
3. Toggle `prefers-color-scheme` between `light` and `dark`
4. Verify all colors and text adapt correctly

### Troubleshooting

**Port already in use:**
```bash
lsof -ti:4321 | xargs kill -9
# or run on a different port:
npm run dev -- --port 3000
```

**Build fails with TypeScript errors:**
1. Read the error message and line number
2. Run `npx astro check` for detailed diagnostics
3. Fix the type annotation or prop definition
4. Re-run `npm run build`

**Changes not showing in browser:**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Stop the dev server (`Ctrl+C`) and restart with `npm run dev`

**`git push` returns HTTP 403:**
- Ensure your branch name starts with `ai/` (required by branch protection rules)

---

## AI Agent Instructions

This repository is optimized for AI coding agents.

- **[AI.md](./AI.md)**: Universal entry point for all AI agents.
- **[GEMINI.md](./GEMINI.md)**: Specific context for Gemini CLI.
- **[.cursorrules](./.cursorrules)**: Rules for Cursor/Windsurf.
- **[docs/ai/](./docs/ai/)**: Detailed standards, workflows, and progress tracking.

---

## Content Management

### Blog Posts

Blog posts are Markdown files. When a file exists, it is published — there is no draft system.

**Add a post:**
1. Create `src/content/blog/en/your-post-name.md` (and `/bg/` for Bulgarian)
2. Add required frontmatter:
   ```markdown
   ---
   title: "Post Title"
   description: "150–160 character description for SEO"
   pubDate: "2026-01-15"
   tags: ["music", "announcement"]
   ---

   Post content in Markdown.
   ```
3. Run `npm run build` — post is live at `/en/news/your-post-name`

**Delete a post:** Remove the Markdown file and rebuild.

Posts are paginated (6 per page), sorted newest-first. Search index is generated at build time.

---

### About Page

Edit `src/content/pages/en/about.md` (and `/bg/`) with this frontmatter:

```yaml
---
title: "About Ami Oprenova"
description: "SEO description"
image: "https://..."   # Portrait image URL
---
```

Body content is Markdown. Rebuild to see changes.

---

### Music Releases

Edit `src/data/releases.json`. Each release:

```json
{
  "id": "album-name",
  "title": "Album Title",
  "year": 2026,
  "description": "Album description",
  "bandcampUrl": "https://...",
  "spotifyUrl": "https://...",
  "appleMusicUrl": "https://...",
  "coverImage": "https://placehold.co/600x600/...",
  "featured": false
}
```

Set `"featured": true` on one release to feature it on the Home and Music pages. Cover images should be 600×600px square.

---

### Videos

Edit `src/data/videos.json`. Each video:

```json
{
  "id": "video-id",
  "title": "Video Title",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "thumbnail": "https://placehold.co/640x360/...",
  "date": "2026-01-15",
  "description": "Video description",
  "featured": false
}
```

Set `"featured": true` on one video to feature it on the Home and Video pages. Thumbnails should be 16:9 (640×360px).

---

### Shows / Events

Edit `src/data/events.json`. Rebuild to update the Shows page.

---

### Press Assets

Store press materials in `public/press/`:

```
public/press/
├── press-photo-1.jpg    # High-resolution press photo
├── logo.png             # Official logo
└── tech-rider.pdf       # Technical rider
```

Update `pressAssets` in `src/config/site.ts` after adding new photos.

---

### Site Configuration

All external URLs and metadata are in `src/config/site.ts`. Update placeholder values before going live:

- `baseUrl` — production domain
- Social media URLs
- Email addresses
- Music platform URLs (Bandcamp, Spotify, Apple Music)

---

## File Structure

```
src/
├── content/blog/{en,bg}/    # Blog posts (Markdown)
├── content/pages/{en,bg}/   # Page content, e.g. About (Markdown)
├── pages/{en,bg}/           # Page templates (Astro)
├── data/                    # events.json, releases.json, videos.json
├── components/              # Reusable UI components
├── layouts/Layout.astro     # Global layout with SEO
├── config/site.ts           # Central site configuration
└── styles/global.css        # CSS variables and design tokens
```

---

## Deployment

This is a static site. Run `npm run build` and deploy the `dist/` folder to any static host:

- **Cloudflare Pages** (current target)
- Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront

Before deploying, set `baseUrl` in `src/config/site.ts` to the production domain, then re-enable the sitemap in `astro.config.mjs`.

---

## Documentation

| File | Audience | Purpose |
|------|----------|---------|
| `README.md` | Everyone | Content management, commands, deployment |
| `AI.md` | AI agents | Entrypoint: hard rules, doc index |
| `DESIGN.md` | Developers | Visual design system |
| `docs/ai/workflow.md` | AI agents | Branch model, PR process |
| `docs/ai/standards.md` | AI agents | Implementation conventions |
| `docs/ai/decisions.md` | AI agents | Architectural decisions |
| `docs/ai/progress.md` | AI agents | Session state: done / next |
