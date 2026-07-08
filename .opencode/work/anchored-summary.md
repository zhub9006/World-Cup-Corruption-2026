## Goal
- Display all 17 IFAB Laws + VAR Protocol from extracted JSON files in a well-documented, navigable web interface within the existing Next.js app.

## Constraints & Preferences
- Use the extracted law JSON files in `src/data/laws/` (generated from `scripts/fifa_pdf_to_json.py`)
- All server components, no new dependencies, pure Tailwind styling
- Index + detail page layout (user chose this over single-scroll or homepage replacement)

## Progress
### Done
- **Repo reset** to GitHub origin (commit `0c6b62a` "init the project") — all previously built components, data files, and types were removed
- **`scripts/fifa_pdf_to_json.py`** — extracts text from PDF (`docs/Laws of the Game 2026_27_single pages.pdf`) using PyMuPDF, detects law boundaries via "Law1".."Law17" dividers, outputs structured JSON for all 17 laws + VAR Protocol
- **`scripts/requirements.txt`** — pins `PyMuPDF>=1.25.0`
- **`src/data/laws/law-01.json` … `law-17.json`, `var-protocol.json`** — extracted law data with rules, exact quotes, and page numbers (18 files total)
- **`src/data/fifa_laws.json`** — combined index of all 18 entries
- **`src/lib/types.ts`** — `Law`, `LawRule`, `LawIndexEntry` interfaces
- **`src/lib/laws.ts`** — `getAllLaws()`, `getLawByNumber()` using `readFileSync` from filesystem
- **`src/app/laws/page.tsx`** — index page: responsive card grid (3-col desktop), each card shows law number badge, title, rule count, domain description; links to detail page
- **`src/app/laws/[id]/page.tsx`** — detail page: dynamic route loading specific law JSON, renders per-rule sections with section title, full quote in blockquote, page badge; generates static params for all 18 entries
- **lint + build pass clean** — `biome check --write --unsafe` applied 5 fixes (node: protocol, unused import, import type, import sorting); `noArrayIndexKey` fixed by using stable key `${page_number}-${specific_rule}`

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- **`fs.readFileSync` for law loading** in `src/lib/laws.ts` — avoids dynamic `import()` issues with bundler resolution for 18 files
- **`generateStaticParams`** for law detail pages — all 18 paths pre-rendered at build time
- **`await params`** — required in Next.js 16 (params is a Promise)
- **Card grid with domain descriptions** on index page — each law card shows a sentence explaining what the law covers, improving discoverability
- **Blockquote with left border** for exact quotes — matches typical legal documentation style; page badge shown per rule

## Critical Context
- Next.js 16.2.10, React 19.2.4, TypeScript 5.x, Tailwind v4, shadcn v4
- PDF at `docs/Laws of the Game 2026_27_single pages.pdf` (23 MB, 234 pages)
- Extraction requires `pip install PyMuPDF` then `python scripts/fifa_pdf_to_json.py "docs/Laws of the Game 2026_27_single pages.pdf"`
- Law JSONs have format `{ law_number, law_title, rules: [{ specific_rule, exact_quote, page_number }] }`
- Combined index: `{ law_number, law_title, rule_count }` — 18 entries (1–17 + VAR)
- `/laws` = static index, `/laws/{id}` = SSG detail pages for all 18 IDs

## Relevant Files
- `scripts/fifa_pdf_to_json.py`: PDF extraction script (run manually)
- `scripts/requirements.txt`: PyMuPDF dependency
- `src/data/laws/law-*.json` / `var-protocol.json`: Extracted law data (18 files)
- `src/data/fifa_laws.json`: Combined index
- `src/lib/types.ts`: Law / LawRule / LawIndexEntry type definitions
- `src/lib/laws.ts`: getAllLaws() / getLawByNumber() data loader
- `src/app/laws/page.tsx`: Index page with card grid
- `src/app/laws/[id]/page.tsx`: Dynamic law detail page
- `docs/Laws of the Game 2026_27_single pages.pdf`: Source PDF for extraction
