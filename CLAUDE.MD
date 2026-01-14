# CLAUDE.MD - Project Context for AI Assistant

## Project Overview
**amioprenova** is a static website for a musician. It serves as the artist's official online presence for fans, promoters, and press. The site prioritizes performance, simplicity, low cost, and long-term maintainability.

## Project Type
Static website only.

## Technology Stack
- **Static Site Generator**: Astro
- **Styling**: Tailwind CSS (or minimal CSS if already chosen)
- **JavaScript**: Minimal (only where necessary)
- **Fonts**: System fonts by default
- **Deployment**: Static hosting (to be configured)

## Design & Styling

**Primary design reference**: `DESIGN.md` contains the complete visual design system for amioprenova.com. It is the **sole primary reference** for all styling, colour palette, typography, layout, components, and visual guidelines.

**Key design specifications**:
- Colour palette with light and dark mode variants
- Typography hierarchy (Playfair Display/Merriweather for headings, Inter/Open Sans for body)
- Component specifications (buttons, cards, hero sections, event lists, video grids)
- Layout and spacing standards
- Accessibility requirements (WCAG 2.1 AA compliance)
- Responsive design breakpoints

**Important**: All styling decisions must reference and comply with `DESIGN.md`. When implementing new features or modifying existing ones, consult the design guide to ensure consistency.

## Repository Structure
- Standard Astro project layout
- Central configuration file for external URLs and constants
- Events data stored in a dedicated data file
- **Important**: Avoid hardcoding external URLs directly into page templates

## Development Setup

### Prerequisites
- Node.js
- npm

### Getting Started
```bash
npm install
npm run dev      # Development server
npm run build    # Production build
```

## Pages Included (V1)
- Home
- About
- Music
- Video
- Shows
- Support / Buy
- Blog / News (simple, low-frequency updates)
- Press
- Contact
- Links (Linktree-style page at `/links`)
- Privacy

## Blog / News System

The site includes a static blog/news system using Markdown files and Astro Content Collections.

**Architecture:**
- Blog posts are Markdown (`.md`) files stored in `src/content/blog/`
- English posts: `src/content/blog/en/`
- Bulgarian posts: `src/content/blog/bg/`
- Each post is automatically published when the Markdown file exists (NO draft concept)
- Posts are rendered at build time
- Removing a Markdown file removes the post on next build

**Required frontmatter:**
```yaml
---
title: "Post Title"
description: "Post description for SEO"
pubDate: "2026-01-13"  # ISO date string
tags: ["tag1", "tag2"]  # Optional array
---
```

**URLs:**
- Blog index: `/en/news` and `/bg/news`
- Individual posts: `/en/news/[slug]` and `/bg/news/[slug]`
- Pagination: `/en/news/page/2/`, `/en/news/page/3/`, etc.
- Legacy `/blog` routes redirect to `/news`

**Features:**
- Static pagination (6 posts per page, generated at build time)
- Client-side search with build-time JSON index
- Social share links (Facebook, Twitter/X) using static URLs
- Posts sorted newest-first
- No inline translation logic for post content

**Search:**
- Search index generated at build time: `/search-index.json`
- Client-side filtering by title, description, and tags
- Minimal JavaScript (simple substring matching)
- Results link directly to post pages

**Bulgarian posts:**
- If no Bulgarian posts exist, empty state message is shown
- English posts are NOT automatically translated
- Bulgarian posts must be created separately in `src/content/blog/bg/`

## Multilingual Support (i18n)

This project uses a **content-driven multilingual strategy**. Pages are language-specific files with no translation logic embedded.

### Architecture Rules

**Page structure:**
- Each language has its own page files under language-specific routes:
  - `/en/...` (English pages)
  - `/bg/...` (Bulgarian pages)
- Page content is written directly in the target language inside those files
- Pages import shared layouts/components but contain **no translation logic**
- **NEVER** use inline translation objects, ternaries, or language conditionals in page templates

**Content rules:**
- Long-form content, paragraphs, headings, and page-specific text must live in language-specific page files
- **Do NOT** embed translation strings directly in page templates
- **Do NOT** centralize full page content into JSON or translation files
- English pages serve as templates; duplicate and translate for Bulgarian versions

**UI text (navigation, footer, buttons):**
- Small, shared UI strings (navigation labels, footer labels, button text) **may** be stored in a small language dictionary file
- UI dictionaries are limited to short interface text only (5-10 words max per string)
- Example: navigation labels, "Contact", "Home", footer copyright text

**Language behavior:**
- **Primary language**: English (also serves as fallback)
- **Secondary language**: Bulgarian (optional)
- **Routes**: `/en` and `/bg`
- **Fallback behavior**: If a Bulgarian page does not exist, English content is shown instead of a 404
- **Language persistence**: Language selection persists across pages via localStorage

## Contact & Communication
- **Newsletter signup**: Mailchimp embeds only
- **Contact and booking**: `mailto:` links with prefilled subject/body templates
- **No contact form backend** in V1

## Events / Shows
- Events are rendered at **build time** from a local data file in the repository
- Editing events = edit the data file and rebuild the site
- **No live API calls** in V1
- **Planned future upgrade**: Pull events from Google Calendar or a ticketing platform

## Monetization
- **No on-site e-commerce** in V1
- "Support / Buy" page links out to third-party services:
  - Bandcamp (albums and merch)
  - Ticket platforms (e.g., Eventbrite, Tito)
  - Donation platforms (e.g., Ko-fi, Buy Me a Coffee)
  - Affiliate links (simple outbound links)

## Common Tasks

### Development
- Edit Astro components and pages
- Update events data file and rebuild
- Test in browser at multiple viewport sizes
- Verify builds succeed before committing

### Deployment
- Run `npm run build`
- Deploy static output to hosting platform

## Design Considerations
- Clean, minimal, professional aesthetic
- Mobile-first and responsive design
- System fonts by default
- Minimal JavaScript
- Accessible markup and sensible semantics
- SEO-friendly structure

## SEO & Metadata Conventions

**All pages must implement proper SEO:**
- Every page must define a `title` and `description` prop passed to the Layout component
- Titles and descriptions must be language-specific (English in `/en`, Bulgarian in `/bg`)
- Titles should follow the pattern: "Page Name - amioprenova"
- Descriptions should be concise (150-160 characters) and descriptive

**SEO implementation:**
- SEO logic is centralized in `src/layouts/Layout.astro`
- The Layout component generates:
  - Primary meta tags (title, description, canonical URL)
  - OpenGraph metadata (og:title, og:description, og:type, og:url, og:image, og:locale)
  - Twitter Card metadata
- Base URL and OG image configured in `src/config/site.ts`
- Canonical URLs automatically generated per page
- Language attribute (`lang`) set correctly per route

**Metadata requirements:**
- Do NOT copy/paste meta tags into individual pages
- Do NOT hardcode production URLs
- Do NOT invent real metadata values - use placeholders with TODO comments
- Placeholders are acceptable until real content is provided

**Search engine configuration:**
- `robots.txt` located in `/public` - allows all indexing
- Sitemap generation: Temporarily disabled due to build incompatibility
  - See `astro.config.mjs` for instructions to re-enable when production URL is set
  - Sitemap will include all `/en` and `/bg` routes when enabled

**Important:**
- Do NOT introduce analytics or tracking as part of SEO work
- SEO changes must not break existing functionality
- Always test builds after SEO modifications

## Press Assets & Media Kit

**Location:**
- All press assets are stored in `public/press/`
- Assets include:
  - Press photos (high-resolution images)
  - Logo files (PNG format)
  - Technical rider (PDF)

**File paths:**
- Press photos: `public/press/press-photo-1.jpg` (add more as needed)
- Logo: `public/press/logo.png`
- Technical rider: `public/press/tech-rider.pdf`

**Configuration:**
- Press asset paths are defined in `src/config/site.ts` under `pressAssets`
- Bio text, genres, and RIYL tags are also configured in `site.ts`
- Press page pulls all external links (social media, music platforms) from central config

**Press page structure:**
- Short bio section (paragraph in page file)
- Long bio section (multiple paragraphs in page file)
- Genre tags (from config)
- Recommended If You Like (RIYL) tags (from config)
- Key links (website, music, socials - all from config)
- Downloads section (photos, logo, tech rider - paths from config)
- Press contact link (mailto with pressEmail from config)

**Important conventions:**
- **NEVER hardcode external URLs** in page templates - always use `siteConfig`
- **Downloads are public assets** - they must exist under `public/` to be directly accessible
- Press page biography text lives in language-specific page files (`/en/press.astro`, `/bg/press.astro`)
- Metadata (genres, RIYL, asset paths) lives in `src/config/site.ts`
- Footer social links automatically render from config and hide empty URLs

**Contact page:**
- Booking and Press sections as clickable cards
- Mailto links use structured templates (name, venue, dates, budget, etc.)
- Emails pulled from `siteConfig.bookingEmail` and `siteConfig.pressEmail`
- Raw email addresses are NOT displayed as plain text - only as mailto links

## Notes for AI Assistant

**General principles:**
- **Prefer static, build-time solutions** over dynamic/client-side approaches
- Keep changes **small, incremental, and easy to review**
- When uncertain, **add placeholders and document them** or **ask explicit questions** instead of guessing
- **Always ensure the site builds successfully** before completing tasks
- Use the central configuration file for external URLs, not hardcoded values

**Multilingual (i18n) - CRITICAL:**
- **NEVER introduce inline translation logic into page templates**
- **NEVER use ternaries, conditionals, or language objects in page content** (e.g., `lang === 'en' ? 'Text' : 'Текст'`)
- **NEVER centralize full page content into JSON or translation files**
- Each language must have its own separate page file under `/en` or `/bg`
- Page content should be written directly in the target language with no logic
- Prefer clarity, simplicity, and explicit content files over abstraction
- When unsure about translations, duplicate English content rather than inventing logic
- Small UI strings (navigation labels, button text) may use a dictionary file, but page content must not

## Branch Strategy
- `main`: Production-ready code
- Feature branches: Use `claude/*` prefix for AI-assisted development

## Contact & Links
- Repository: amioprenova
- Project Type: Static musician website (Astro)
