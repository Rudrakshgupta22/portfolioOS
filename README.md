# Rudraksh — Portfoli OS
A responsive, motion-led portfolio presented as a mission-control interface. It combines a landing experience, profile and architecture pages, Sanity-managed project showcases, a project contact form, and a Sanity Studio mounted at `/studio`.

For the detailed architecture, data-flow diagrams, dependency inventory, and implementation notes, see [architecture.md](./architecture.md).

## At a glance

- **Framework:** Next.js 16 App Router, React 19, TypeScript
- **Styling and interaction:** Tailwind CSS 4, Framer Motion, Lucide React, React Icons
- **Content:** Sanity Studio and Sanity Content Lake, with local portfolio data as a project fallback
- **Contact delivery:** Resend
- **Routes:** `/`, `/hub`, `/profile`, `/projects`, `/project/[id]`, `/stack`, `/contact`, and `/studio`
- **Rendering configuration:** Next.js `cacheComponents` is enabled. Data-backed project routes retain `export const instant = false`.

## Requirements

- Node.js compatible with Next.js 16
- npm (the repository includes `package-lock.json`)
- Sanity project ID and dataset to use the Studio and Sanity-backed projects
- Resend API key to deliver contact-form submissions

## Local development

1. Install packages:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root. Add the Sanity values to enable Sanity Studio and live project data; add the Resend key to enable contact-form delivery:

   ```dotenv
   NEXT_PUBLIC_SANITY_PROJECT_ID=
   NEXT_PUBLIC_SANITY_DATASET=
   # Optional; defaults to the API version configured in sanity/env.ts
   NEXT_PUBLIC_SANITY_API_VERSION=
   RESEND_API_KEY=
   ```

   `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are required by the Sanity configuration. Without them, importing the Sanity environment throws an explicit missing-variable error. Never put write tokens or other private credentials in `NEXT_PUBLIC_*` variables or commit `.env.local`.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The initial experience links into `/hub`; use the HUD menu to navigate the portfolio. Open `/studio` to author Sanity project documents.

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build locally |

There is currently no dedicated test script in `package.json`.

## Content management

### Projects

The Sanity project document schema is in `sanity/schemaTypes/project-type.ts`. Create a document in `/studio` and fill in its title and slug. Optional content includes status, directive, tech stack, impact metrics, anomaly report, GitHub and live URLs, a cover image, and a screenshot gallery.

`/projects` fetches Sanity projects and merges them with `portfolioData.missions.tier_1_deployments` from `lib/intel.ts`. Slugs are compared case-insensitively; when a Sanity project matches a local project, the Sanity document takes precedence. Projects with a cover image use Sanity's asset URL, and projects without one retain the card's designed background. The detail page uses `CenterPanel` when there is no cover image.

Sanity cover and gallery images are rendered with `next/image`. The Sanity CDN is allow-listed in `next.config.ts`.

### Contact form

The `/contact` page submits to `POST /api/contact`. The route sends the message through Resend and requires `RESEND_API_KEY` at runtime. Configure the sender/domain in Resend before relying on production email delivery; provider errors are returned by the route and the form shows an error state.

## Deployment checklist

- Configure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in the deployment environment before building or starting the app. These values are needed during Sanity module initialization.
- Set `RESEND_API_KEY` if the contact form should deliver messages.
- Keep private API credentials server-side; do not expose them through `NEXT_PUBLIC_*`.
- Confirm Sanity documents have unique, URL-safe slugs. A slug is used as the project route ID.
- Upload images through Sanity Studio; `cdn.sanity.io` is configured as an allowed remote image host.
- Run `npm run lint` and `npm run build` before release.
- Preserve `export const instant = false` on the Sanity-backed `/projects` and `/project/[id]` routes. Do not replace it with `dynamic = "force-dynamic"` while `cacheComponents` is enabled.

## Repository guide

| Path | Responsibility |
| --- | --- |
| `app/` | App Router layouts, pages, and HTTP route handlers |
| `app/(os)/` | Shared portfolio shell and its hub, profile, projects, project detail, architecture, and contact pages |
| `components/` | Reusable visual, cursor, portrait, and animation components |
| `lib/intel.ts` | Typed local portfolio profile and fallback project records |
| `lib/projects.ts` | Sanity query, normalization, and Sanity/local project merge |
| `sanity/` | Studio schema, configuration, client, image helper, and live-content helper |
| `public/` | Static assets, including the portrait used by `HeroPortrait3D` |
| `next.config.ts` | Next.js cache, image, and Turbopack configuration |

## Documentation

- [Architecture and implementation notes](./architecture.md)
