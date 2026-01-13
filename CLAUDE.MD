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
