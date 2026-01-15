# Project Summary

## What is this project?

**amioprenova** is the official website for jazz vocalist and composer Ami Oprenova. It serves as her online presence for fans, promoters, and press.

## Project Goals

- Provide a professional web presence for the artist
- Share music, videos, and tour information
- Enable fans to discover and connect with the artist
- Make it easy for press and promoters to access media kit materials
- Remain simple, performant, and maintainable over time

## Tech Stack

### Core Technology
- **Framework**: Astro (static site generator)
- **Styling**: Tailwind CSS + custom CSS variables
- **Language**: TypeScript/JavaScript
- **Package Manager**: npm

### Key Features
- **Static site generation** - No server required, deploy anywhere
- **Content Collections** - Type-safe Markdown content management
- **Multilingual** - English (/en) and Bulgarian (/bg) routes
- **Design system** - CSS variables for automatic light/dark mode via `prefers-color-scheme`

## Repository Map

```
/
├── src/
│   ├── components/         # Reusable UI components (Button, Card, etc.)
│   ├── layouts/            # Page layouts with SEO
│   ├── pages/              # Astro page files (routes)
│   │   ├── en/             # English pages
│   │   └── bg/             # Bulgarian pages
│   ├── content/            # Content Collections (blog, pages)
│   │   ├── blog/           # Blog posts in Markdown
│   │   └── pages/          # Page content in Markdown (e.g., About)
│   ├── data/               # JSON data files
│   │   ├── events.json     # Show/event listings
│   │   ├── releases.json   # Music releases
│   │   └── videos.json     # Video links
│   ├── config/             # Site configuration
│   │   └── site.ts         # Central config for URLs, metadata
│   ├── i18n/               # Small UI translation strings
│   ├── lib/                # Utility functions
│   └── styles/             # Global CSS
│       └── global.css      # CSS variables + design system
│
├── public/                 # Static assets
│   └── press/              # Press kit materials (photos, logos, PDFs)
│
├── docs/ai/                # AI assistant context (this directory)
│
├── README.md               # User-facing documentation
├── CLAUDE.md               # AI assistant entrypoint (short)
├── DESIGN.md               # Visual design system specification
├── package.json            # Dependencies and scripts
├── astro.config.mjs        # Astro configuration
└── tailwind.config.mjs     # Tailwind configuration
```

## What's Implemented

### Pages (V1 - Complete)
- **Home** - Hero, featured release, shows preview, featured video, newsletter signup
- **About** - Markdown-driven biography with portrait image
- **Music** - Release grid with streaming links (Bandcamp, Spotify, Apple Music)
- **Video** - Video grid with YouTube links and thumbnails
- **Shows** - Event listings with venue details and ticket links
- **Blog/News** - Markdown blog system with pagination, search
- **Press** - Media kit with downloadable assets and bio
- **Contact** - Booking and press mailto links
- **Links** - Linktree-style page with all external links
- **Support/Buy** - Links to merch, tickets, and donation platforms
- **Privacy** - Privacy policy page

### Features Implemented
- ✅ Multilingual routing (EN + BG)
- ✅ Content Collections for type-safe Markdown
- ✅ Static blog with pagination (6 posts/page)
- ✅ Client-side search (build-time JSON index)
- ✅ SEO meta tags (OpenGraph, Twitter Card)
- ✅ Central configuration for external URLs
- ✅ Press kit with downloadable assets
- ✅ Design system with automatic light/dark mode
- ✅ Reusable UI components (Button, Card, PageHeader, SectionHeader, Badge)
- ✅ CSS variables for theming
- ✅ Responsive design (mobile-first)
- ✅ Accessibility focus states

### Data Management
- **Events**: Managed in `src/data/events.json` (edited manually, rebuilt)
- **Releases**: Managed in `src/data/releases.json`
- **Videos**: Managed in `src/data/videos.json`
- **Blog posts**: Markdown files in `src/content/blog/{en,bg}/`
- **About page**: Markdown files in `src/content/pages/{en,bg}/`

## V1 Constraints (Non-Negotiable)

These are hard constraints for the V1 product:

1. **No CMS** - Content managed through Git, Markdown, and JSON files
2. **No backend** - Fully static, no server-side logic
3. **No database** - All content in repository
4. **No on-site e-commerce** - Links to external platforms only
5. **No live API calls** - Events are static data files (future: pull from Google Calendar)
6. **No contact form backend** - Mailto links only in V1
7. **No manual theme toggle** - Dark mode via system preference only
8. **No real external URLs yet** - Placeholder URLs until artist provides real ones

## Deployment

- **Build command**: `npm run build`
- **Output directory**: `dist/`
- **Deployment target**: Cloudflare Pages (planned)
- **Current status**: Ready for deployment once real URLs are provided

## Known Limitations / TODOs

- Sitemap generation temporarily disabled (needs production base URL)
- Press assets are placeholders (awaiting real photos, logos, PDFs)
- Some external URLs are placeholders (Bandcamp, social media, etc.)
- Bulgarian translations may need review by native speaker
- Design system partially implemented (Home, About, Music, Video pages complete; Shows page in progress)
