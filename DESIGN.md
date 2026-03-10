# Design Kit for Ami Oprenova

**Visual Reference**: This design is based on a provided reference image that serves as the primary styling source of truth. All implementation decisions should align with the visual aesthetic shown in that reference.

This design guide defines the visual language and component rules for the official website of jazz artist **Ami Oprenova**. It is intended to be a reference for developers and content editors so the site remains cohesive and polished as it grows.

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
| Logo Text | #1F1F1F | Title with ID "logo-title" and text with class "logo-text"|

Use the primary colour sparingly to draw attention to interactive elements (buttons, links) and avoid overusing it in large backgrounds. The secondary gold brings warmth and works well for subtle separators or icon accents.

### Dark Mode Palette

The dark theme uses a warm, sophisticated palette with **gold as a prominent accent color** for headings and highlights. This creates visual warmth and elegance while maintaining excellent contrast. Dark mode is applied via the `data-theme="dark"` attribute on the `<html>` element, allowing for instant theme switching without page reload.

| Palette name | Hex | Usage |
|---|---|---|
| Dark Background | #0D0C0B | Warm near-black base with subtle brown undertones for pages and sections. |
| Dark Surface | #1A1816 | Cards and elevated elements; warmer than pure gray. |
| Dark Surface Muted | #121110 | Slightly darker than base for subtle depth differences. |
| Dark Surface Elevated | #221F1D | Dropdowns, modals, tooltips that need to stand above content. |
| Primary (dark) | #F5F5F5 | Burgundy accent for CTAs and buttons; consistent with light mode. |
| Secondary Gold | #D4AF37 | **Gold accent used prominently for headings, section titles, and highlights.** |
| Text Heading | #D4AF37 | **All H1-H6 headings use gold color** for visual warmth and brand distinction. |
| Text Primary (dark) | #F5F5F5 | Main body copy; off-white for comfortable reading. |
| Text Secondary (dark) | #B3B3B3 | Subdued text and metadata; ensures hierarchy. |
| Logo Text (dark) | #F5F5F5 | Title with ID "logo-title" and text with class "logo-text"|
| Border | #2D2926 | Warm-toned borders instead of flat grays. |
| Border Light | #252320 | Subtle dividers with warm undertones. |

**Gold Usage Rules**:
- **Headings (H1-H6)**: Always gold (#D4AF37) in dark mode for prominence and warmth
- **Section titles**: Use gold to create visual interest and hierarchy
- **Accent highlights**: Subtle gold borders or separators on featured content
- **Logo**: Gets gold treatment in dark mode (uses heading color)
- **NOT for body text**: Body copy remains off-white (#F5F5F5) for readability

**Color Philosophy**: The dark theme prioritizes warmth over sterile blacks and grays. Backgrounds have brown undertones (#0D0C0B), and borders use warm tones (#2D2926). Gold (#D4AF37) provides elegance and draws the eye to important content without overwhelming. Burgundy (#8B1C3B) remains the primary action color for buttons and CTAs.

**Contrast Requirements**: All text/background combinations meet WCAG AA standards (4.5:1 for body text, 3:1 for large text). Test with [WCAG contrast checker](https://webaim.org/resources/contrastchecker/) when making adjustments.

### Extended Colour Tokens

In addition to the core palette above, the design system includes extended tokens for specific UI purposes:

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| Border | #E5E5E5 | #2D2926 | Default borders for cards, inputs, dividers (warm-toned in dark) |
| Border Light | #F0F0F0 | #252320 | Subtle dividers and separators (warm-toned in dark) |
| Border Focus | #8B1C3B | #8B1C3B | Interactive element focus states (uses accent primary) |
| Surface Muted | #F7F4F0 | #121110 | Slightly darker/lighter than main surface for subtle contrast |
| Surface Elevated | #FFFFFF | #221F1D | For dropdown menus, modals, tooltips that need to appear above other content |
| Text Heading | #1F1F1F | #D4AF37 | Heading color (black in light, gold in dark) |
| Accent Gold | #CDA34A | #D4AF37 | Gold accent color for highlights and decorative elements |

### Link Colour Convention

All text links should use the **Primary burgundy** (`#8B1C3B`) colour with an appropriate hover state:
- **Default state**: `text-accent-primary`
- **Hover state**: `text-accent-primary-hover` (darkens to `#771830` in light mode, lightens to `#A52344` in dark mode)
- **Visited links**: Same as default (no special visited state for brand consistency)

Do not use blue (`#0000FF` or similar) for links, as this deviates from the warm, sophisticated palette. The burgundy accent is distinctive enough to indicate interactivity while maintaining brand cohesion.

## Header & Navigation

### Sticky Glass Header

The site header uses a modern "glass morphism" effect that remains visible as users scroll. This creates an elegant, floating appearance while maintaining readability.

**Technical specifications**:
- **Position**: `position: sticky; top: 0;`
- **Z-index**: High enough to appear above page content (e.g., `z-index: 50`)
- **Background**: Semi-transparent with backdrop blur
  - Light mode: `background: rgba(247, 244, 240, 0.85);` (85% opacity of Background Light)
  - Dark mode: `background: rgba(13, 12, 11, 0.85);` (85% opacity of Dark Background)
- **Backdrop filter**: `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);`
- **Border**: Subtle bottom border for definition
  - Light mode: `border-bottom: 1px solid rgba(229, 229, 229, 0.5);`
  - Dark mode: `border-bottom: 1px solid rgba(45, 41, 38, 0.5);`
- **Padding**: Generous vertical padding (e.g., `py-4` or 1rem) for comfortable touch targets
- **Transition**: Smooth transition on theme changes

**Browser support**: The `backdrop-filter` property requires vendor prefixes for older browsers. Include `-webkit-backdrop-filter` for Safari compatibility. Provide a fallback with higher background opacity for browsers that don't support backdrop filters.

### Logo

The site logo displays "Ami Oprenova" in a script/signature font style. It should be implemented as an inline SVG for scalability and styling control.

**Font style**: Script or signature font (handwritten appearance)
- Recommended fonts: Dancing Script, Pacifico, Great Vibes, or similar cursive fonts
- Fallback stack: `'Script Font', cursive, serif`
- Use a web font (e.g., Google Fonts) or create a custom SVG path for the logo text

**Styling**:
- Color matches text primary in current theme
- Size: Proportional to header height, typically 1.5–2rem
- On mobile: May scale down slightly for better fit

### Navigation Menu

**Desktop layout**: Horizontal navigation links displayed inline, typically to the right of the logo
- Font: Body sans-serif font
- Links use theme text color with accent color on hover
- Include language selector and theme toggle icon

**Mobile layout**: Hamburger menu icon that opens an animated overlay
- Hamburger icon: Three horizontal lines (☰), positioned in top-right corner
- Overlay animation: Slide in from right or top with fade effect
- Overlay background: Matches header glass effect for consistency
- Navigation items: Stacked vertically with generous spacing
- Include language selector and theme toggle within overlay

**Hamburger animation**:
- Transform lines into an X when open
- Use CSS transitions for smooth animation (e.g., `transition: transform 0.3s ease`)

### Theme Toggle

A sun/moon icon button that allows users to manually override the system theme preference.

**Icon states**:
- Light mode active: Show moon icon (☾) to indicate "switch to dark mode"
- Dark mode active: Show sun icon (☀) to indicate "switch to light mode"

**Behavior**:
- On first visit: Use system preference (`prefers-color-scheme`)
- After manual toggle: Store preference in cookie and override system setting
- Icon updates immediately when clicked
- Smooth transition between themes (e.g., `transition: background-color 0.3s ease, color 0.3s ease`)

**Positioning**:
- Desktop: In header alongside navigation
- Mobile: Inside hamburger overlay menu

## Theme & Language Persistence

User preferences for theme (light/dark) and language (en/bg) are stored in browser cookies for server-side access and long-term persistence.

### Cookie Specifications

**Cookie names**:
- `site_theme`: Stores user's theme preference (`"light"` or `"dark"`)
- `site_lang`: Stores user's language preference (`"en"` or `"bg"`)

**Cookie attributes**:
- **Path**: `/` (site-wide)
- **Max-Age**: 365 days (31,536,000 seconds) for long-term persistence
- **SameSite**: `Lax` for security
- **Secure**: True in production (HTTPS only)

**Default behavior**:
- **Theme**: On first visit, detect system preference via `prefers-color-scheme`. If user manually changes theme, store in cookie and override system preference on subsequent visits.
- **Language**: Default to English (`en`). Store user's selection in cookie.

**Implementation**: Use simple JavaScript cookie helpers to read and write these values. On page load, check for cookies and apply the stored preferences. When user changes theme or language, update the cookie and apply the new setting immediately.

### JavaScript Cookie Helpers

Create utility functions for cookie management:
```javascript
// Set a cookie
function setCookie(name, value, days) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Get a cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
```

**On page load**:
1. Check for `site_theme` cookie. If present, apply that theme. If not, use system preference.
2. Check for `site_lang` cookie. If present, redirect to that language path if needed.

**On theme toggle**:
1. Determine new theme value (opposite of current)
2. Call `setCookie('site_theme', newTheme, 365)`
3. Update `data-theme` attribute on `<html>` element
4. Update theme toggle icon

## Typography

The typography system uses three distinct font families to create visual hierarchy and maintain brand elegance.

### Font Families

**Logo font (Script/Signature)**: Dancing Script, Pacifico, Great Vibes, or similar cursive fonts
- **Usage**: Logo SVG only ("Ami Oprenova" wordmark)
- **Fallback stack**: `'Dancing Script', 'Pacifico', cursive, serif`
- **Weight**: Regular (400)
- **Character**: Handwritten, elegant, personal

**Display font (Serif)**: Playfair Display or Merriweather
- **Usage**: Headings (H1–H3), hero statements, pull quotes, section titles
- **Fallback stack**: `'Playfair Display', 'Merriweather', Georgia, serif`
- **Weight**: Bold (700) for headings, Regular (400) for decorative text
- **Character**: Elegant, sophisticated, classical

**Body font (Sans-serif)**: Inter or Open Sans
- **Usage**: Paragraphs, navigation, UI text, buttons, forms, metadata
- **Fallback stack**: `'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Weight**: Regular (400) for body copy, Medium (500) for emphasis, Bold (700) for strong emphasis
- **Character**: Clean, modern, highly legible

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

Buttons use the design system's accent colors and must maintain clear visibility in both light and dark themes. All button states should have smooth transitions (e.g., `transition: all 0.2s ease`).

**Primary button (Filled)**:
- **Background**: Primary burgundy (`#8B1C3B`)
- **Text**: White (`#FFFFFF`)
- **Border**: None
- **Border radius**: 8px
- **Padding**: `px-6 py-3` (24px horizontal, 12px vertical)
- **Font weight**: Medium (500)

**Primary button states**:
- **Default**: `bg: #8B1C3B`, `color: #FFFFFF`
- **Hover**: `bg: #771830` (darkened), `color: #FFFFFF`
- **Focus**: `bg: #8B1C3B`, `color: #FFFFFF`, `outline: 2px solid #8B1C3B`, `outline-offset: 2px`
- **Active**: `bg: #6B1428` (further darkened), `color: #FFFFFF`
- **Disabled**: `bg: #9A9A9A`, `color: #E5E5E5`, `cursor: not-allowed`, `opacity: 0.6`

**Secondary button (Outlined)**:
- **Background**: Transparent
- **Text**: Primary burgundy in light mode, same burgundy in dark mode
- **Border**: 2px solid primary burgundy
- **Border radius**: 8px
- **Padding**: `px-6 py-3` (match primary for consistency)
- **Font weight**: Medium (500)

**Secondary button states**:
- **Default (light)**: `bg: transparent`, `color: #8B1C3B`, `border: 2px solid #8B1C3B`
- **Default (dark)**: `bg: transparent`, `color: #8B1C3B`, `border: 2px solid #8B1C3B`
- **Hover (light)**: `bg: rgba(139, 28, 59, 0.1)`, `color: #771830`, `border: 2px solid #771830`
- **Hover (dark)**: `bg: rgba(139, 28, 59, 0.2)`, `color: #A52344`, `border: 2px solid #A52344`
- **Focus**: Add `outline: 2px solid #8B1C3B`, `outline-offset: 2px`
- **Active (light)**: `bg: rgba(139, 28, 59, 0.15)`, `color: #6B1428`, `border: 2px solid #6B1428`
- **Active (dark)**: `bg: rgba(139, 28, 59, 0.25)`, `color: #C5294D`, `border: 2px solid #C5294D`
- **Disabled**: `bg: transparent`, `color: #9A9A9A`, `border: 2px solid #9A9A9A`, `cursor: not-allowed`, `opacity: 0.6`

**Text link**:
- Use accent primary color with underline decoration (optional)
- On hover: Darken in light mode, lighten in dark mode (use `text-accent-primary-hover`)
- Font weight: Regular (400) or Medium (500) depending on context
- Do not over-underline navigation menu items—use color change and bold instead

**Accessibility requirements**:
- All buttons must have minimum 44px height for touch targets
- Focus states must be clearly visible with sufficient contrast
- Disabled buttons should not be focusable
- Use `aria-label` or visible text for icon-only buttons

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

**Photography**: Use high-resolution portraits of Ami Oprenova on the home and about pages. Include photos of live performances and candid moments for authenticity. Ensure consistent colour grading (warm tones, high contrast) to align with the burgundy palette.

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

- Provide descriptive alt text for images (e.g. "Ami Oprenova performing on stage").

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

This design kit provides a foundation for building a cohesive, accessible and professional web presence for Ami Oprenova. By following these guidelines, developers and content editors can maintain consistent branding, clear hierarchy and engaging layouts, ensuring the site remains easy to update and appealing to fans, press and promoters alike.
