# rest-mustarddata

Korean highway rest area information site — rest.mustarddata.com

## Commands

```bash
npm run dev          # Local dev server
npm run build        # Static export to out/
npm run lint         # ESLint
npm run fetch-data   # Refresh data from API → data/*.json
```

## Architecture

**Next.js 16 App Router** with `output: 'export'` (fully static, deployed via GitHub Pages with CNAME).

### Routes

| Route | Description |
|---|---|
| `/` | Homepage — popular rest areas, search |
| `/rest-area/` | All rest areas list |
| `/rest-area/[restArea]/` | Rest area detail (food, facilities, brands) |
| `/highway/` | Highways grouped by type |
| `/highway/[highway]/` | Highway detail with its rest areas |
| `/food/` | Food/menu listings |
| `/feed.xml/` | RSS feed (route handler) |

### Data Layer

- `data/*.json` — static JSON files (rest-areas, highways, metadata), fetched via `scripts/fetch-rest-areas.ts`
- `src/lib/data.ts` — data access functions (imported at build time, no runtime fetching)
- `src/lib/types.ts` — TypeScript interfaces (RestArea, Highway, Food, Facility, etc.)

### Components

- `src/components/` — shared components (Header, Footer, SearchForm, JsonLd, SisterSites)
- `SearchForm` is the only `'use client'` component; everything else is server-rendered

## Conventions

- **Language**: All user-facing content is Korean (`lang="ko"`)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`), no custom config file
- **Trailing slashes**: Enabled in next.config.ts (`trailingSlash: true`)
- **Images**: Unoptimized (static export constraint)
- **SEO**: Structured data via JsonLd component, sitemap.ts, robots.ts, OpenGraph/Twitter meta
- **Analytics**: GA4 + Google AdSense
- **Slug generation**: Uses `transliteration` package (devDep) in the fetch script
