# Contributing to World Cup Corruption

Thanks for your interest! This guide explains the project structure and how to contribute — whether you're adding a new refereeing incident, fixing a bug, or improving the codebase.

---

## Quick Start

```bash
git clone <repo-url>
cd world-cup-corruption
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Architecture — File-by-File

### `src/data/` — All Content Data

This is where the raw data lives. Every incident and every law is stored as plain JSON files.

#### `src/data/incidents/`

| File | Purpose |
|---|---|
| `incident-001.json` … `incident-005.json` | Individual incident records. Each file contains the full match details, description, images, videos, and cross-references to IFAB Laws. |
| `index.json` | Lightweight index of all incidents. Contains just the fields needed for card grids (title, summary, severity, team, thumbnail). Must be updated when adding a new incident. |

#### `src/data/laws/`

| File | Purpose |
|---|---|
| `law-01.json` … `law-17.json` | Extracted text of each IFAB Law. Each file contains the law number, title, and an array of rules with exact quotes and page references from the official PDF. |
| `var-protocol.json` | Video Assistant Referee (VAR) Protocol — extracted the same way as the 17 laws. |

#### `src/data/`

| File | Purpose |
|---|---|
| `fifa_laws.json` | Combined index of all 18 entries (Laws 1–17 + VAR). Used by the sidebar and law grid pages to list available laws and their rule counts. |

> **Schema reference:** See the README for full field-by-field documentation of all JSON types.

---

### `src/lib/` — Data Loaders & Types

| File | Purpose |
|---|---|
| `types.ts` | **All TypeScript interfaces** — `Incident`, `IncidentIndexEntry`, `Law`, `LawRule`, `LawIndexEntry`, `IncidentRuleRef`, `IncidentImage`, `IncidentVideo`. If you add a new field to the data, define its type here first. |
| `incidents.ts` | **Incident loaders** — `getAllIncidents()` returns the index array; `getIncidentById(id)` returns a single incident. Both read from `src/data/incidents/` using `readFileSync`. |
| `laws.ts` | **Law loaders** — `getAllLaws()` returns the combined index; `getLawByNumber(id)` reads a single law JSON file. Both read from `src/data/`. |
| `utils.ts` | **`cn()`** — Utility that merges Tailwind classes using `clsx` + `tailwind-merge`. Used by shadcn components and throughout the app. |

---

### `src/components/` — Reusable UI

| File | Purpose |
|---|---|
| `navbar.tsx` | **Sticky top navigation** — Contains brand text ("Laws of the Game 2026/27"), links to Home, The Book (opens in new tab), and All Laws. Highlights the active link using `usePathname()`. Has a mobile hamburger toggle using local state. |
| `footer.tsx` | **Site footer** — Shows an abbreviated list of law numbers for quick access, along with attribution text linking to the official IFAB website. |
| `laws-sidebar.tsx` | **Law navigation sidebar** — On mobile: horizontal scrollable row of pill-shaped law badges. On desktop (`md+`): fixed 224px sidebar with the full law list. Highlights the currently viewed law. Used by the `/laws` layout. |
| `incident-card.tsx` | **Incident preview card** — Shows severity badge, match info, title (clamped to 1 line), summary (clamped to 2 lines), date, and optional thumbnail image. Used in the homepage and `/incidents` grid. |
| `masonry-grid.tsx` | **Responsive CSS grid** — A simple wrapper using `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`. Renders children directly with no extra wrapping. |
| `rule-citation.tsx` | **Law citation block** — Renders on incident detail pages. Shows which law was violated, a matching quote from the law text (auto-matched by keyword), and an explanation of why it applies. Links back to the full law detail page. |
| `ui/button.tsx` | **shadcn Button** — A primitive button component with variant and size presets (`default`, `outline`, `ghost`, `destructive`, `link`; `xs` through `icon-lg`). Uses `class-variance-authority` for variant management. |

---

### `src/app/` — Routes & Pages

Next.js App Router convention: every folder under `src/app/` maps to a URL path.

| Route | File | Purpose |
|---|---|---|
| `/` | `page.tsx` | **Homepage** — Hero section ("When the Laws Are Broken by Those Who Enforce Them"), stat cards (incidents count, laws count, rules count), recent incidents grid, and a "How to Contribute" CTA. |
| — | `layout.tsx` | **Root layout** — Wraps all pages in `<Navbar>` and `<Footer>`. Loads Geist and Inter fonts. Sets HTML metadata. |
| — | `globals.css` | **Global styles** — Tailwind v4 imports, CSS custom properties for all shadcn design tokens (background, foreground, card, primary, secondary, etc.), dark mode variables, and base layer resets. |
| `/laws` | `laws/page.tsx` | **Law index** — 3-column card grid of all 18 laws. Each card shows the law number badge, title, rule count, and a one-sentence domain description. |
| `/laws/[id]` | `laws/[id]/page.tsx` | **Law detail** — SSG page for a single law. Renders each rule as a card with its section heading, exact quote in a blockquote, and page number badge. Uses `generateStaticParams` to pre-render all 18 paths. |
| `/laws` | `laws/layout.tsx` | **Laws layout** — Adds the `LawsSidebar` component to all `/laws/*` pages. Uses a responsive flex layout (`md:flex-row`). |
| `/incidents` | `incidents/page.tsx` | **Incident index** — Full grid of all documented incidents using `MasonryGrid` + `IncidentCard`. Shows a "no incidents" message with a contribution link when empty. |
| `/incidents/[id]` | `incidents/[id]/page.tsx` | **Incident detail** — SSG page for a single incident. Renders match details table, full description, image gallery, video links, and law citations via `RuleCitation`. Uses `generateStaticParams`. |
| `/book` | `book/route.ts` | **The Book** — Route handler that returns raw HTML with a full-viewport iframe loading the PDF. Not wrapped by any layout (no Navbar/Footer/chrome). Opens in a new tab. |
| `/pdf` | `pdf/route.ts` | **PDF server** — Route handler that reads the PDF from `docs/` and serves it with `Content-Type: application/pdf` and caching headers. |

---

### `scripts/` — Tooling

| File | Purpose |
|---|---|
| `fifa_pdf_to_json.py` | Python script that extracts law text from the official IFAB PDF (`docs/Laws of the Game 2026_27_single pages.pdf`). Uses PyMuPDF to read each page, detects law boundaries via "Law1" … "Law17" dividers, and outputs structured JSON into `src/data/laws/`. |
| `requirements.txt` | Pins `PyMuPDF>=1.25.0`. Run `pip install -r scripts/requirements.txt` before using the extraction script. |

---

## How to Contribute an Incident

Adding a new refereeing incident requires creating two JSON files. No database, no build changes.

### Step 1: Create the incident file

Create `src/data/incidents/incident-006.json`:

```json
{
  "id": "incident-006",
  "title": "Short descriptive headline",
  "summary": "One-sentence summary for card grids (2-line max).",
  "match": "Team A vs Team B — Stage Name",
  "teams": {
    "home": "Team A",
    "away": "Team B"
  },
  "tournament": "FIFA World Cup YYYY",
  "competitionStage": "Group Stage / Round of 16 / Quarter-final / Semi-final / Final",
  "date": "YYYY-MM-DD",
  "referee": "Full name of the match referee",
  "minute": 42,
  "description": "A few paragraphs explaining what happened, why it was a mistake, which laws were violated, and how it affected the match outcome. Use plain language — readers may not be refereeing experts.",
  "videos": [
    {
      "url": "https://www.youtube.com/watch?v=EXAMPLE",
      "title": "Descriptive video title"
    }
  ],
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "caption": "What this image shows",
      "aspectRatio": 1.6
    }
  ],
  "rules": [
    {
      "lawNumber": 5,
      "lawTitle": "The Referee",
      "explanation": "Explain what the law says and how it was violated in this specific incident. Be specific about which part of the law applies."
    }
  ],
  "severity": "major",
  "wasVARUsed": false,
  "varOutcome": null
}
```

**Severity guidelines:**

| Severity | Meaning |
|---|---|
| `minor` | Incorrect decision that didn't affect the match outcome |
| `major` | Clearly wrong call that may have influenced the result |
| `critical` | Match-changing error that should have led to a replay |

### Step 2: Register in the index

Add the matching entry to `src/data/incidents/index.json`:

```json
{
  "id": "incident-006",
  "title": "Short descriptive headline",
  "summary": "One-sentence summary for card grids.",
  "date": "YYYY-MM-DD",
  "severity": "major",
  "image": "https://example.com/thumbnail.jpg",
  "teams": {
    "home": "Team A",
    "away": "Team B"
  }
}
```

### Step 3: Verify

```bash
npm run build
```

The build will:
1. Type-check all JSON against the TypeScript interfaces
2. Pre-render `/incidents/incident-006` as a static page
3. Include it in the `/incidents` index grid

### Step 4: Commit and open a PR

```bash
git add src/data/incidents/
git commit -m "incident: add [title]"
git push
```

---

## How to Contribute Code

### Adding a new page

1. Create a folder under `src/app/` matching the desired URL path (e.g. `src/app/about/`)
2. Add a `page.tsx` file exporting a default React component
3. If the page needs data, use or create a loader in `src/lib/`
4. Add the route to the Navbar if needed (edit `src/components/navbar.tsx`)

### Adding a new component

1. Create the file in `src/components/`
2. Use `"use client"` only if the component needs hooks (`useState`, `usePathname`, etc.)
3. Import types from `@/lib/types` as needed
4. Use `cn()` from `@/lib/utils` for conditional Tailwind classes

### Adding a new data type

1. Add the interface to `src/lib/types.ts`
2. Create a loader function in a new file under `src/lib/` (or extend an existing one)
3. Store data as JSON under `src/data/`
4. Import and use the loader in your pages

---

## Development Workflow

### Branch naming

| Type | Format | Example |
|---|---|---|
| New incident | `incident/short-description` | `incident/ghost-goal-2010` |
| New feature | `feature/description` | `feature/search-bar` |
| Bug fix | `fix/description` | `fix/sidebar-overflow` |

### Before committing

```bash
npm run lint       # Check for errors and style issues
npm run format     # Auto-format all files with Biome
npm run build      # Verify TypeScript and SSG builds
```

All three should pass before pushing.

---

## Code Standards

- **TypeScript strict mode** is enabled. Avoid `any` — prefer `unknown` and type guards.
- **Biome** handles linting and formatting. Config in `biome.json`. Run `npm run format` to auto-fix.
- **Import conventions:**
  - Use `import type` for type-only imports (`import type { Law } from "./types"`)
  - Use `node:` protocol for Node.js builtins (`import { readFileSync } from "node:fs"`)
  - Sort imports alphabetically by source path (Biome enforces this)
- **CSS:** Use Tailwind utility classes. Avoid custom CSS files. Use `cn()` for conditional classes.
- **Server components by default.** Only add `"use client"` when you need browser APIs or React hooks.
- **Data loaders** use `readFileSync` (not dynamic `import()`) so they work in both dev and production builds.
- **Route handlers** (`route.ts`) are not wrapped by layouts — use them for raw responses like PDF serving or full-screen pages.
