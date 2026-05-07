<!-- Base branch: develop — retarget if this shows main -->

Closes #

## Summary
<!-- One sentence: what changed and why -->

## Changes
<!-- Files modified and what changed in each -->

## Acceptance criteria verified
<!-- For each criterion from the linked issue, confirm it passes in the Cloudflare preview -->
<!-- The Cloudflare Pages bot posts the preview URL in the comments above -->

## Notes
<!-- Breaking changes, follow-up work, open questions — delete if none -->

## Checklist

**Always**
- [ ] `npm run build` passes (0 errors)
- [ ] Preview URL verified (see Cloudflare Pages comment above)

**If `.astro` or `.ts` files changed**
- [ ] No hardcoded hex/rgba — design tokens only
- [ ] All new `<button>` elements have `type="button"` (or `type="submit"` where appropriate)

**If EN/BG pages changed**
- [ ] Both locale files updated in the same commit
- [ ] No `lang === 'en' ?` conditionals in page files

**If `src/i18n/ui.ts` changed**
- [ ] Keys added under both `en` and `bg`

**If a tech-debt item is resolved**
- [ ] Entry removed from `docs/ai/tech-debt.md` in this PR
