# amioprenova

Official website for amioprenova - a static musician website built with Astro.

## Overview

This is a static website that serves as the online presence for the musician amioprenova. It features:
- Multilingual support (English and Bulgarian)
- Blog/News system with Markdown files
- Event listings
- Contact forms via mailto links
- Social media integration

## Development

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will run at `http://localhost:4321`

## Blog / News System

### How it Works

The blog system uses Markdown files that are processed at build time. When you create a new `.md` file in the blog folder, it automatically becomes a published post on the next build.

**Important: There is no draft system.** If a Markdown file exists, it's published.

### Adding a New Blog Post

Follow these steps to add a new blog post:

1. **Create a new Markdown file** in the appropriate language folder:
   - English posts: `src/content/blog/en/your-post-name.md`
   - Bulgarian posts: `src/content/blog/bg/your-post-name.md`

2. **Add required frontmatter** at the top of the file:
   ```markdown
   ---
   title: "Your Post Title"
   description: "A brief description for SEO and previews (150-160 characters)"
   pubDate: "2026-01-13"
   tags: ["music", "announcement"]
   ---

   Your post content goes here in Markdown format.

   ## You can use headings

   - And bullet points
   - Like this

   **Bold text** and *italic text* are supported.
   ```

3. **Save the file** - the filename (without `.md`) becomes the URL slug

4. **Rebuild the site**:
   ```bash
   npm run build
   ```

5. **The post is now published** at:
   - English: `/en/news/your-post-name`
   - Bulgarian: `/bg/news/your-post-name`

### Required Frontmatter Fields

Every blog post MUST include:

- `title` - The post title
- `description` - Brief description for SEO
- `pubDate` - Publication date in ISO format (YYYY-MM-DD)
- `tags` - (Optional) Array of tags like `["music", "tour"]`

### Example Posts

Example blog posts can be found in `src/content/blog/en/`. You can use these as templates for new posts.

### Deleting a Post

To remove a blog post:
1. Delete the Markdown file from `src/content/blog/en/` or `src/content/blog/bg/`
2. Rebuild the site with `npm run build`
3. The post will no longer appear

### Pagination

- Blog posts are paginated automatically (6 posts per page)
- Pagination is generated at build time
- URLs: `/en/news/`, `/en/news/page/2/`, etc.
- Posts are sorted newest-first by publication date

### Search Functionality

- Search is client-side and lightweight
- A search index is generated at build time (`/search-index.json`)
- Visitors can search posts by title, description, or tags
- No server required for search functionality

## File Structure

```
src/
├── content/
│   ├── blog/
│   │   ├── en/          # English blog posts
│   │   └── bg/          # Bulgarian blog posts
│   └── config.ts        # Content schema definition
├── pages/
│   ├── en/              # English pages
│   │   └── news/        # Blog index and posts
│   └── bg/              # Bulgarian pages
│       └── news/        # Blog index and posts
├── layouts/
│   └── Layout.astro     # Global layout with SEO
├── config/
│   └── site.ts          # Site configuration
└── data/
    └── events.json      # Event listings
```

## Configuration

Site configuration is centralized in `src/config/site.ts`. Update placeholder URLs with real values:

- `baseUrl` - Your production website URL
- Social media links
- Email addresses
- External platform URLs

## Press Assets

### Location

All press assets (photos, logo, tech rider) are stored in `public/press/`:

```
public/press/
├── press-photo-1.jpg    # High-resolution press photo(s)
├── logo.png             # Official logo
└── tech-rider.pdf       # Technical rider PDF
```

### Replacing Press Assets

To update press materials:

1. **Press Photos**:
   - Replace `public/press/press-photo-1.jpg` with your high-resolution press photo
   - Add more photos by creating `press-photo-2.jpg`, etc.
   - Update the `pressAssets.photos` array in `src/config/site.ts`:
     ```typescript
     pressAssets: {
       photos: [
         '/press/press-photo-1.jpg',
         '/press/press-photo-2.jpg'  // Add new photos here
       ],
       // ...
     }
     ```

2. **Logo**:
   - Replace `public/press/logo.png` with your official logo (PNG format recommended)

3. **Technical Rider**:
   - Replace `public/press/tech-rider.pdf` with your actual technical rider PDF

### Press Page Content

To update the press page biography and metadata:

1. **Bio Text**: Edit the content directly in the press page files:
   - English: `src/pages/en/press.astro`
   - Bulgarian: `src/pages/bg/press.astro`

2. **Genres & RIYL Tags**: Update in `src/config/site.ts`:
   ```typescript
   genres: ['Electronic', 'Ambient', 'Experimental'],
   riylTags: ['Artist Name 1', 'Artist Name 2', 'Artist Name 3'],
   ```

3. **External Links**: All press page links (social media, music platforms) come from `src/config/site.ts`. Update the placeholder URLs with real values.

## Deployment

This is a static site. After running `npm run build`, deploy the `dist/` folder to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- CloudFlare Pages
- AWS S3 + CloudFront

## Notes for Maintainers

- **No CMS**: Content is managed through Markdown files and Git
- **No database**: Everything is static files
- **Multilingual**: English is primary, Bulgarian is optional
- **SEO**: All pages include proper meta tags for search engines
- **Performance**: Minimal JavaScript, fast loading times

## Support

For detailed technical documentation, see `CLAUDE.MD` in the repository root.
