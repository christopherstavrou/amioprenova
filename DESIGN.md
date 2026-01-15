# Design Kit for amioprenova.com

This design guide defines the visual language and component rules for amioprenova.com, the official website for jazz artist Ami Opprenova. It is intended to be a reference for developers and content editors so the site remains cohesive and polished as it grows.

## Colour Palette

| Palette name | Hex | Usage |
|---|---|---|
| Primary | #8B1C3B | Warm burgundy accent used for buttons, links, highlights and hover states. |
| Secondary | #CDA34A | Soft gold used for subtle highlights and decorative elements. |
| Background Light | #F7F4F0 | Off-white background for most sections. Provides warmth without overpowering content. |
| Background Dark | #1F1F1F | Charcoal used for footer and dark section alternatives. |
| Text Primary | #1F1F1F | Main body copy on light backgrounds. |
| Text Inverse | #FFFFFF | Text on dark backgrounds or accent blocks. |
| Neutral Grey | #9A9A9A | Secondary text, borders, muted notes. |

Use the primary colour sparingly to draw attention to interactive elements (buttons, links) and avoid overusing it in large backgrounds. The secondary gold brings warmth and works well for subtle separators or icon accents.

### Dark Mode Palette

When the browser or operating system is set to dark mode, the site should automatically switch to a palette optimised for low-light environments. Use the CSS media query `@media (prefers-color-scheme: dark)` to apply these variables. The dark theme preserves the overall brand but ensures sufficient contrast and readability.

| Palette name | Hex | Usage |
|---|---|---|
| Dark Background | #0B0B0B | Near-black base for pages, cards and sections in dark mode. |
| Dark Surface | #1C1C1C | Slightly lighter than the base; use for cards and elevated elements. |
| Primary (dark) | #8B1C3B | Same burgundy accent—works well on dark surfaces. |
| Secondary (dark) | #D3B35A | Gold accent brightened slightly for legibility on dark backgrounds. |
| Text Primary (dark) | #F5F5F5 | Main copy colour in dark mode; off-white for comfortable contrast. |
| Text Secondary (dark) | #B3B3B3 | Subdued text and metadata; ensures hierarchy. |

The primary and secondary colours remain consistent across themes, but they may need slight adjustments in opacity or brightness to maintain contrast. Always test colour combinations using tools like the [WCAG contrast checker](https://webaim.org/resources/contrastchecker/) to ensure accessible contrast ratios in both light and dark modes.

### Extended Colour Tokens

In addition to the core palette above, the design system includes extended tokens for specific UI purposes:

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| Border | #E5E5E5 | #2A2A2A | Default borders for cards, inputs, dividers |
| Border Light | #F0F0F0 | #222222 | Subtle dividers and separators |
| Border Focus | #8B1C3B | #8B1C3B | Interactive element focus states (uses accent primary) |
| Surface Muted | #F7F4F0 | #151515 | Slightly darker/lighter than main surface for subtle contrast |
| Surface Elevated | #FFFFFF | #242424 | For dropdown menus, modals, tooltips that need to appear above other content |

### Link Colour Convention

All text links should use the **Primary burgundy** (`#8B1C3B`) colour with an appropriate hover state:
- **Default state**: `text-accent-primary`
- **Hover state**: `text-accent-primary-hover` (darkens to `#771830` in light mode, lightens to `#A52344` in dark mode)
- **Visited links**: Same as default (no special visited state for brand consistency)

Do not use blue (`#0000FF` or similar) for links, as this deviates from the warm, sophisticated palette. The burgundy accent is distinctive enough to indicate interactivity while maintaining brand cohesion.

## Typography

**Display font**: Playfair Display or Merriweather. These serif faces convey elegance and sophistication suitable for jazz. Use them for headings, hero statements and pull quotes. Headings should be bold.

**Body font**: Inter or Open Sans. These sans-serif fonts ensure legibility across devices. Use them for paragraphs, navigation and UI text. Use regular weight for default copy and medium weight for emphasis.

### Font Sizing & Hierarchy

| Element | Mobile size | Desktop size | Notes |
|---|---|---|---|
| H1 (page title) | 2.25 rem | 3 rem | Large hero headings; uppercase optional. |
| H2 (section heading) | 1.5 rem | 2.5 rem | Distinct section titles with plenty of whitespace. |
| H3 (sub-heading) | 1.25 rem | 1.75 rem | Used for subsections and card titles. |
| Body text | 1 rem | 1 rem | Maintain a comfortable line height (~1.6). |
| Small text | 0.875 rem | 0.875 rem | Used for captions, metadata, and footers. |

### Line Height and Letter Spacing

Keep paragraph line height around 1.6 and heading line height around 1.2 to ensure readability. Use slight letter-spacing (e.g. 0.5 px) for all caps headings but avoid excessive tracking which can hurt legibility.

## Layout & Spacing

**Grid system**: Use a 12-column fluid grid with a max content width of 1200 px. On small screens, columns stack vertically. Maintain consistent gutters (16–24 px).

**Section spacing**: Provide generous vertical padding on sections—64–96 px top and bottom on large screens and 40–60 px on mobile. Use alternating background colours (light/dark/neutral blocks) to separate sections visually.

**Containers**: Constrain content within a central container on wide screens. For full-width elements like the hero or image bands, extend to the viewport edges.

**Border radius**: Use 8 px radius on cards and buttons for a softer feel. Avoid sharp corners.

**Shadows**: Apply subtle box shadows on cards and images to lift them from the background. Use one shadow style consistently (e.g. `0 4px 8px rgba(0,0,0,0.1)`).

**Interactive size**: Ensure all interactive elements (buttons, menu items) are at least 44 px tall for accessibility.

## Components

### Buttons

**Primary button**: Filled with the primary burgundy colour, white text, rounded corners. On hover, darken slightly (e.g. #771830).

**Secondary button**: Bordered variant with primary colour border and text; transparent background. On hover, fill with a very light burgundy tint and darken border.

**Text link**: Underscored or subtle underline; changes colour on hover. Do not over-underline menu items—use bold and colour instead.

### Cards

**Card layout**: Use for albums, videos, shows, news posts. Each card has a subtle drop shadow, 8 px radius and 24 px padding. Place the image/thumbnail at the top or left, followed by a heading, sub-heading/metadata, and actions (buttons or links).

**Consistency**: Align titles and metadata consistently between cards. If an image is unavailable, use a neutral placeholder.

### Hero Section

Use a full-width background image or video still, overlaid with a semi-transparent dark gradient to enhance text contrast. The hero should contain the artist's name/logo, a short tagline and call-to-action buttons (e.g. Listen, Watch, Shows, Join Newsletter). Avoid busy backgrounds; choose images with negative space around focal points.

### Event List

Display upcoming shows using a two-column layout: date + venue on the left, city/country + ticket button on the right. On small screens, stack items vertically. Use separators or alternating backgrounds for clarity.

### Video Grid

Display videos as cards with a 16:9 thumbnail, title, date and optional description. Only embed the featured video on the page; link other videos to YouTube or another platform. Maintain consistent aspect ratios by wrapping thumbnails in containers.

### Newsletter Sign-up

Create a centred section with a contrasting background. Use a short invitation line (e.g. "Get the latest news and shows") followed by a simple form (email field and subscribe button). For Mailchimp, embed the form iframe styled to match the site's colours.

### Press Assets Section

Provide clear download links for press kit assets (photos, logos, technical rider). Group related downloads in a card or accordion. Include file type and size information.

## Imagery

**Photography**: Use high-resolution portraits of Ami Opprenova on the home and about pages. Include photos of live performances and candid moments for authenticity. Ensure consistent colour grading (warm tones, high contrast) to align with the burgundy palette.

**Album covers**: Display square or circular album art on the music page. Maintain consistent sizing and spacing between releases.

**Video thumbnails**: Generate thumbnails for YouTube videos or use provided stills. Crop thumbnails to 16:9, add overlay play icons if desired.

### Placeholder Images

During the initial development phase or when actual assets are not yet available, use simple placeholder images to help visualise layouts without breaking the design. We recommend using the [placehold.co](https://placehold.co/) service, which can generate configurable placeholder images on the fly.

**Guidelines**:

- **Aspect ratio**: Choose placeholder dimensions that match the intended content. For example, use `https://placehold.co/1920x1080?text=Hero+Image` for hero sections (16:9), `https://placehold.co/800x800?text=Album+Cover` for square album art, and `https://placehold.co/600x338?text=Video` for 16:9 video thumbnails. This ensures the layout looks correct even before real images are added.

- **Colours**: Use colours that harmonise with the site's palette. You can customise placehold.co images via query parameters, e.g. `https://placehold.co/800x800/8B1C3B/FFFFFF?text=Album` will render a burgundy background with white text.

- **Alt text**: Always specify alt text that describes the intended image (e.g. "Placeholder album cover"). When replacing with real images, update the alt text accordingly.

- **Replace as soon as possible**: Placeholder images are a temporary solution. Replace them with actual photos and artwork as soon as assets become available to enhance the authenticity and storytelling of the website.

## Accessibility and Legibility

- Ensure colour contrasts meet [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/) standards—particularly between text and background. Avoid low contrast combinations (e.g. burgundy text on gold).

- Provide descriptive alt text for images (e.g. "Ami Opprenova performing on stage").

- Make links and buttons keyboard navigable and ensure focus states are visible. Use `:focus-visible` styles alongside `:hover` styles.

- Use ARIA labels on navigation, forms and icons to assist screen reader users.

## Content Management

**Markdown files**: Store long-form text content (biography, about page, blog posts) in Markdown files. Use YAML frontmatter fields (title, description, pubDate, tags) for metadata.

**JSON/YAML data**: Use JSON or YAML files for structured collections such as upcoming shows (events.json), album releases (releases.json), and video listings (videos.json). Each entry should contain fields like title, date, location, url, etc.

**Images**: Save images in `/public/assets/images` or similar and reference them in Markdown or JSON files. Include alternative text alongside each image entry.

## Implementation Guidelines

**Tailwind CSS configuration**: Define custom colours in `tailwind.config.js` using the palette above. Extend the theme's font family with your selected fonts. Configure responsive breakpoints if the defaults need adjusting.

### Dark Mode Implementation

Implement dark mode by defining corresponding colour variables and Tailwind theme values. Use the `prefers-color-scheme` media query to detect the user's preferred theme. For example, define CSS variables for both light and dark themes:

```css
:root {
  --bg: #F7F4F0;
  --surface: #FFFFFF;
  --text-primary: #1F1F1F;
  --text-secondary: #9A9A9A;
  --accent-primary: #8B1C3B;
  --accent-secondary: #CDA34A;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0B0B0B;
    --surface: #1C1C1C;
    --text-primary: #F5F5F5;
    --text-secondary: #B3B3B3;
    --accent-primary: #8B1C3B;
    --accent-secondary: #D3B35A;
  }
}
```

These variables can then be used in your styles or Tailwind configuration to ensure the colour scheme adapts automatically when the user's system is set to dark mode. In Tailwind, you can enable the `darkMode` option (e.g. `'media'`) and define dark variants for your custom colours.

**CSS variables**: Declare CSS variables for colours and border radius in a global stylesheet (e.g. `:root { --color-primary: #8B1C3B; }`) to maintain consistency across non-Tailwind styles.

**Reusable components**: Build navigation, buttons, cards, event lists and video grids as reusable components in your framework (Astro/React) to ensure consistency. Use props to adjust layout or content when necessary.

**Responsive design**: Use Tailwind's mobile-first responsive utilities to adapt layouts across breakpoints. Avoid absolute positioning unless necessary; rely on flexbox and grid to create responsive flows.

**Testing**: Perform cross-browser testing (Chrome, Firefox, Safari) and test on devices of varying sizes. Use accessibility tools (e.g. Axe, Lighthouse) to verify colour contrast and keyboard navigation.

## Conclusion

This design kit provides a foundation for building a cohesive, accessible and professional web presence for Ami Opprenova. By following these guidelines, developers and content editors can maintain consistent branding, clear hierarchy and engaging layouts, ensuring the site remains easy to update and appealing to fans, press and promoters alike.
