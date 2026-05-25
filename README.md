# davila.uno — Personal portfolio

Personal portfolio and blog for [Ever Dávila](https://davila.uno).  
Stack: Next.js 16 · TypeScript · Tailwind CSS v4 · Sanity CMS · Vercel · next-intl (5 locales).

---

## Quick start after cloning

```bash
git clone https://github.com/everDavila/personal-site.git
cd personal-site
```

Copy `.env.local` from your other machine into the project root, then:

```bash
node setup.mjs
```

That's it. The script checks the env file, installs dependencies and tells you what to run.

---

## Environment variables

The project needs a single `.env.local` file at the root. It is **never committed**.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=your_write_token
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | [sanity.io/manage](https://sanity.io/manage) → project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Same page, usually `production` |
| `SANITY_TOKEN` | sanity.io/manage → API → Tokens → create one with **Editor** permissions |

---

## Dev commands

```bash
npm run dev       # Next.js at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

Sanity Studio runs embedded at [http://localhost:3000/studio](http://localhost:3000/studio).

---

## Project structure

```
src/
  app/[locale]/          # Pages (one per route, server components)
  components/            # UI components
  sanity/
    schemaTypes/         # Sanity document types
    queries/             # GROQ queries + TypeScript types
    structure.ts         # Studio sidebar structure
  i18n/                  # next-intl routing config
  lib/                   # Shared utilities (localized(), BLOG_FALLBACK)
messages/                # i18n strings (es, en, pt, qu, zh)
```

## Key Sanity document types

| Type | Purpose |
|---|---|
| `siteSettings` | Singleton — hero, bio, social links, CV URL |
| `experience` | Singleton — work history + education |
| `post` | Blog posts (localizedBlockContent) |
| `project` | Portfolio case studies |
| `playgroundItem` | Experiments / side projects |
| `editorialSubtitle` | Rotating page subtitles — grouped by page in Studio |

---

## i18n

5 locales: `es` (default) · `en` · `pt` · `qu` · `zh`.  
Subtitles and most copy come from Sanity. Static labels (nav, buttons, fallbacks) are in `messages/*.json`.  
Quechua and Chinese fall back to Spanish and English respectively for blog content.

---

## Deployment

Deployed on Vercel. Push to `main` triggers a production deploy automatically.  
Add the same env variables in the Vercel project settings (Settings → Environment Variables).
