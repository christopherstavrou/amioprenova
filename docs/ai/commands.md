# Commands Reference

This document lists all canonical commands for working with this project.

---

## Prerequisites

Ensure you have the following installed:
- **Node.js**: v18 or later (v20 recommended)
- **npm**: Comes with Node.js

Check versions:
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
```

---

## Installation

### First-Time Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd amioprenova
npm install
```

**Expected output**:
- Dependencies installed successfully
- No error messages
- `node_modules/` directory created
- `package-lock.json` updated

**Time**: 30-60 seconds depending on network speed

---

## Development

### Start Development Server

```bash
npm run dev
```

**What it does**:
- Starts Astro development server
- Watches for file changes
- Hot-reloads browser on save
- Compiles TypeScript and Astro components

**Expected output**:
```
🚀 astro v4.x.x started in Xms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose

watching for file changes...
```

**Port**: `http://localhost:4321`

**When to use**:
- During active development
- To preview changes in real-time
- To test functionality before committing

**How to stop**: Press `Ctrl+C` in terminal

---

## Building

### Production Build

```bash
npm run build
```

**What it does**:
1. Runs TypeScript type checking (`astro check`)
2. Generates static HTML, CSS, and JS files
3. Optimizes assets (minification, compression)
4. Outputs to `dist/` directory

**Expected output**:
```
[check] Getting diagnostics for Astro files...
Result: 0 errors, 0 warnings

[build] output: "static"
[build] directory: /path/to/dist/
[build] Generating static routes
[build] ✓ Completed in 3.5s
```

**Success indicators**:
- `0 errors` in type checking
- `✓ Completed` message
- `dist/` directory contains 43+ HTML files

**Common build outputs**:
- `dist/en/index.html` - English homepage
- `dist/bg/index.html` - Bulgarian homepage
- `dist/en/blog/index.html` - Blog index
- `dist/_astro/` - Optimized CSS and JS

**Build time**: 3-5 seconds

**When to use**:
- Before deploying
- Before committing (to verify no errors)
- To test production build locally

---

### Preview Production Build

```bash
npm run preview
```

**What it does**:
- Serves the built `dist/` directory
- Simulates production environment
- No hot-reload (static files only)

**Expected output**:
```
astro v4.x.x ready in X ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose
```

**Port**: `http://localhost:4321`

**When to use**:
- After running `npm run build`
- To test production build before deploying
- To verify minified assets work correctly

**Prerequisite**: Must run `npm run build` first

---

## Code Quality

### Type Checking

```bash
npx astro check
```

**What it does**:
- Runs TypeScript type checking on `.astro` files
- Validates props and component usage
- Checks for type errors

**Expected output**:
```
Result (43 files):
- 0 errors
- 0 warnings
```

**When to use**:
- Before committing
- When adding new components
- When refactoring TypeScript code

---

## Git Commands

### Common Git Workflow

```bash
# Check current status
git status

# Create feature branch
git checkout -b claude/feature-name

# Stage all changes
git add .

# Commit with message
git commit -m "feat: description of change"

# Push to remote
git push -u origin claude/feature-name

# Check recent commits
git log --oneline -n 10
```

---

## Testing Light/Dark Mode

### Chrome DevTools Method

1. Open the site in Chrome: `http://localhost:4321/en`
2. Open DevTools: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
3. Open Rendering tab:
   - Click the three-dot menu in DevTools
   - Select "More tools" > "Rendering"
4. Find "Emulate CSS media features"
5. Toggle `prefers-color-scheme`:
   - Select `prefers-color-scheme: dark` - Site should switch to dark mode
   - Select `prefers-color-scheme: light` - Site should switch to light mode
   - Select `No emulation` - Site should follow system preference

**Expected behavior**:
- Background colors change (light beige → near-black)
- Text colors invert (dark → light)
- All content remains readable
- No layout shift or broken styling

---

## Troubleshooting Commands

### Clear Cache and Reinstall

If experiencing weird behavior:

```bash
# Remove dependencies and cache
rm -rf node_modules package-lock.json .astro

# Reinstall fresh
npm install

# Rebuild
npm run build
```

---

### Check for Outdated Dependencies

```bash
npm outdated
```

**Output**: Lists packages with available updates

**When to use**: Monthly maintenance, or when encountering package-related issues

---

### Verify Package Integrity

```bash
npm audit
```

**Output**: Lists security vulnerabilities in dependencies

**When to use**: Before deploying, monthly security reviews

---

## Deployment Commands

### Build for Production

```bash
npm run build
```

**Deploy the `dist/` folder** to your static hosting platform:
- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

---

## Quick Reference

| Command | Purpose | Output | Time |
|---------|---------|--------|------|
| `npm install` | Install dependencies | `node_modules/` created | 30-60s |
| `npm run dev` | Development server | `http://localhost:4321` | 2-3s startup |
| `npm run build` | Production build | `dist/` directory | 3-5s |
| `npm run preview` | Preview build | Serves `dist/` | 1-2s startup |
| `npx astro check` | Type checking | Error/warning report | 5-10s |

---

## Environment Variables

**Current status**: No environment variables required for V1.

**Future**: If adding external API integrations, document environment variables here.

---

## Success Criteria

### Development Server
✅ Server starts without errors
✅ `http://localhost:4321` loads successfully
✅ Hot-reload works on file save
✅ No console errors in browser

### Production Build
✅ `npm run build` completes with 0 errors
✅ `dist/` directory contains 43+ HTML files
✅ Type checking passes (0 errors, 0 warnings)
✅ All routes generate successfully

### Visual Verification
✅ All pages load without 404 errors
✅ Navigation works (EN ↔ BG)
✅ Light/dark mode switches correctly
✅ Responsive breakpoints work (mobile, tablet, desktop)
✅ External links open in new tabs

---

## Common Issues & Solutions

### Issue: `npm run dev` fails with port error

**Error**: `Port 4321 is already in use`

**Solution**:
```bash
# Kill process on port 4321 (Linux/Mac)
lsof -ti:4321 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

---

### Issue: Build fails with TypeScript errors

**Error**: `Type 'X' is not assignable to type 'Y'`

**Solution**:
1. Read error message carefully
2. Check the file and line number indicated
3. Fix type annotation or prop definition
4. Run `npx astro check` to verify
5. Run `npm run build` again

---

### Issue: Changes not showing in browser

**Possible causes**:
1. Browser cache - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Service worker - Clear site data in DevTools Application tab
3. Dev server needs restart - Stop (`Ctrl+C`) and run `npm run dev` again

---

### Issue: 403 Error on `git push`

**Error**: `RPC failed; HTTP 403`

**Cause**: Branch name doesn't match required `claude/` prefix or session constraints

**Solution**:
```bash
# Check current branch name
git branch --show-current

# If not starting with 'claude/', rename it
git branch -m claude/your-feature-name

# Try pushing again
git push -u origin claude/your-feature-name
```

---

## Notes

- Always run `npm run build` before committing to ensure no build errors
- Use `npm run dev` for real-time development feedback
- Preview production builds with `npm run preview` to catch issues before deployment
- Keep dependencies up to date but test thoroughly after updates
