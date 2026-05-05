# Brand — amioprenova

The artistic identity and visual language for the official site of jazz vocalist **Ami Oprenova**.

This document is the source of truth for the *concept* of the brand — palette, typography, voice, photography. It deliberately contains no hex values or implementation details. Those live next to the code that owns them:

| What you need | Where it lives |
|---|---|
| Token values (colour, spacing, radius, transitions) | Top of [`src/styles/global.css`](../src/styles/global.css) |
| Component specs (button states, card padding, etc.) | Frontmatter docstring of each [`src/components/*.astro`](../src/components/) |
| Component inventory and "use when…" guidance | [`docs/component-library.md`](./component-library.md) |
| Implementation guide (dark mode, Tailwind setup) | [`docs/ai/standards.md`](./ai/standards.md) |

If a token value or component contract changes, update the owning file. This document changes only when the brand itself does — a rebrand, a new colour direction, a different voice.

---

## Voice and tone

Warm, considered, generous. Speaks about music as a craft and a gift, not as content. Avoids hype, exclamation marks, and marketing superlatives. When the artist's name appears in copy, it is **Ami Oprenova** in full on first reference.

Bilingual: every public surface exists in English and Bulgarian. Translations are not literal — each language carries the same warmth in its own register.

---

## Palette

Three colours carry the brand:

- **Burgundy** — the primary action colour. Deep, warm, saturated. Used for buttons, links, focus states, and the wordmark in light mode. The closest analogue is the inside of a wine glass under stage lights.
- **Gold** — the accent of warmth and elegance. Used for headings and the wordmark in dark mode, and for small decorative ornaments throughout. Never a primary action; never on body text.
- **Warm neutrals** — off-white in light mode, warm near-black in dark mode. Both have a brown undertone; neither is a sterile grey.

The palette is single-accent per mode. Light mode is burgundy-led; dark mode is gold-led, with burgundy retained on actions. Avoid introducing additional accent colours — the warmth of the palette comes from restraint.

---

## Typography

Three typefaces, each with a clear job:

- **Script (the wordmark)** — handwritten, personal, used only for "Ami Oprenova" as the logo. Pacifico is the current choice, with Dancing Script as a fallback. Never used for body or headings.
- **Display serif** — elegant and classical. Used for page titles, section headings, hero statements, and pull quotes. Playfair Display.
- **Body sans-serif** — clean, modern, highly legible. Used for paragraphs, navigation, UI controls, and metadata. Inter.

Headings carry letter-spacing slightly tighter than default; body text lives at a comfortable ~1.6 line height. The combination should feel like a printed concert programme, not a web page.

---

## Photography

Real photographs of Ami performing or in candid moments — not stock, not heavily filtered. Warm colour grading aligned with the burgundy palette: lifted shadows, slight gold cast in highlights. Avoid cool-blue tones.

Crop with negative space around the subject; the hero treatment expects a focal point that breathes when an overlay scrim is applied. Live-performance imagery is preferred over staged portraits.

---

## Logomark

The wordmark "Ami Oprenova" set in script is the logo. There is no separate icon mark. In light mode the wordmark takes the burgundy gradient; in dark mode, the gold gradient. The wordmark is rendered with `background-clip: text` over a CSS gradient — see [`src/components/Logo.astro`](../src/components/Logo.astro).

---

## Themes

The site supports light and dark themes equally. Dark mode is not an afterthought — gold-accented headings on warm near-black is part of the brand, not a fallback. Theme is chosen by the visitor's system preference on first visit and persisted via cookie thereafter.

The mechanism is documented in [`docs/ai/standards.md`](./ai/standards.md); the token values for both modes are in [`src/styles/global.css`](../src/styles/global.css).

---

## What this document is not

- It is not a CSS reference. Don't add hex values or class names here.
- It is not a component spec. Don't describe button padding or card layout here.
- It is not a process document. Don't put workflow rules here.

If you find yourself wanting to add one of those, the right home is the file that owns the corresponding code — that way the doc and the code can never drift.
