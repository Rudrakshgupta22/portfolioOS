# Architecture and Engineering Notes

This document describes the current implementation of the Rudraksh portfolio in this repository. It is intended as a practical guide for maintenance and onboarding; the source code and `package.json` remain authoritative if implementation details change.

## 1. Product and runtime overview

The site presents a personal portfolio as a retro-editorial, mission-control interface. The root route is an interactive introduction; the portfolio itself is organized into a shared dashboard shell. Project content comes from Sanity with local TypeScript data retained as a resilient fallback. The embedded Sanity Studio is served from the same Next.js application at `/studio`.

The application uses the Next.js App Router and React Server and Client Components:

- The root layout owns document metadata, global styles, and the route-aware custom cursor layer.
- The `(os)` route group provides the portfolio HUD, responsive navigation, background effects, and page frame without adding a URL segment.
- Interactive views use Client Components and Framer Motion for local state, gestures, cursor tracking, and scroll-driven presentation.
- Project list and detail routes fetch Sanity content on the server, normalize it, and render project UI.
- Route handlers provide contact-form email delivery. No application database is configured.

`next.config.ts` enables `cacheComponents` and `partialPrefetching`, configures Tailwind's Turbopack CSS loader, and allows images from `cdn.sanity.io`. Keep the project's route-level `export const instant = false` declarations in sync with this Next.js configuration.

## 2. Technology inventory

### Framework and language

| Technology | Role |
| --- | --- |
| Next.js `16.4.0` | App Router, server rendering, routing, route handlers, image optimization, and production runtime |
| React / React DOM `19.3.0` | Component rendering, state, and lifecycle |
| TypeScript `^5` | Application language and strict type checking (`strict: true`) |
| Node.js types `@types/node` | Type declarations for server-side Node APIs |
| React types `@types/react`, `@types/react-dom` | Type declarations for React |

### Styling, motion, and visual assets

| Technology | Role |
| --- | --- |
| Tailwind CSS `^4` | Utility-first styling and design composition |
| `@tailwindcss/turbopack` `^4` | Tailwind CSS integration with the configured Turbopack CSS rule |
| Framer Motion `^14` | Page transitions, scroll animation, interactive cards, drag gestures, springs, and the 3D portrait |
| `lucide-react` | Arrow and interface iconography |
| `react-icons` | Brand and technology icon sets |
| `next/font/google` | Build-time optimized font loading; the interface uses families including Fraunces, Manrope, JetBrains Mono, and Martian Mono |
| `unicornstudio-react` | React integration for a Unicorn Studio scene in the standalone `BootSequence` component |
| `styled-components` | Installed runtime dependency; no use in the main route implementations was identified during this documentation pass |

### Content, media, and services

| Technology | Role |
| --- | --- |
| Sanity `^5` | Content platform and embedded Studio |
| `next-sanity` `^13` | Sanity client integration, GROQ utilities, Studio bridge, and live-content helper |
| `@sanity/vision` `^5` | GROQ Vision tool inside Studio |
| `@sanity/image-url` `^2` | Sanity image URL builder exposed by `sanity/lib/image.ts` |
| Resend `^6` | Email delivery for the contact API route |
| `ai` `^7` and `@ai-sdk/openai` `^4` | AI SDK packages present in the dependency manifest; they are not currently part of the documented route/data flow |

### Development and quality tools

| Technology | Role |
| --- | --- |
| ESLint `^9` | Lint runner |
| `eslint-config-next` `16.4.0` | Next.js core-web-vitals and TypeScript lint rules |
| TypeScript `^5` | Static type checking; no standalone type-check script is defined |
| npm | Dependency installation and project scripts; the lockfile is `package-lock.json` |

The version ranges above are the ranges declared in `package.json`; the lockfile records the resolved dependency tree.

## 3. Routes and composition

| URL | Source | Responsibility |
| --- | --- | --- |
| `/` | `app/page.tsx` | Client-side introduction; entering the experience navigates to `/hub` |
| `/hub` | `app/(os)/hub/page.tsx` | System Overview, interactive deployment pinboard, portrait, and social links |
| `/profile` | `app/(os)/profile/page.tsx` | Profile, pipeline, metrics, operational ledger, and portrait |
| `/projects` | `app/(os)/projects/page.tsx` | Server-fetched project list passed to the client-side projects grid |
| `/project/[id]` | `app/(os)/project/[id]/page.tsx` | Project case study, Sanity-first lookup, local fallback, visuals, and next-project navigation |
| `/stack` | `app/(os)/stack/page.tsx` | Architecture principles and scroll-driven presentation |
| `/contact` | `app/(os)/contact/page.tsx` | Contact form and social/contact links |
| `/studio` and `/studio/*` | `app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio |
| `POST /api/contact` | `app/api/contact/route.ts` | Validates basic required contact fields and sends email using Resend |

The `(os)` folder is a Next.js route group: it organizes pages under a shared layout without appearing in their public paths. `app/(os)/template.tsx` adds a Framer Motion transition around pages in that group.

### Root cursor boundary

`app/layout.tsx` wraps the application in a Suspense boundary around `GlobalCursorLayer`. That client component renders the custom cursor on ordinary routes and omits it when the pathname is `/studio` or begins with `/studio/`. The Studio therefore retains native cursor interaction. The native cursor suppression rule in `app/globals.css` is scoped to the global cursor layer and fine-pointer desktop screens. `CustomCursor` also gates its tracking on a desktop-sized fine pointer and uses a fixed, high-z-index, pointer-events-none element.

The Suspense fallback is the route children. Keep this boundary if changing pathname-dependent code in the root layout; it prevents pathname access from breaking prerendering of the Studio route.

## 4. Project data and CMS integration

### Sources and normalized model

`lib/intel.ts` defines the `Mission`, `AnomalyReport`, and other portfolio data types, plus the hardcoded operator profile and deployment data. Project fields can include an ID, title, status, stack, directive, impact metrics, anomaly report, repository URLs, a cover image URL, and gallery image URLs.

`lib/projects.ts` is the shared project boundary:

1. `getProjects()` fetches published project documents with a GROQ query.
2. The query projects `slug.current` to `id` and maps Sanity field names and asset references into a compact shape.
3. `fromMission()` maps local `Mission` fields into `ProjectData`.
4. `fromSanityProject()` normalizes missing optional fields to safe defaults.
5. A map keyed by lowercase project ID merges local entries and Sanity entries. A Sanity document replaces a local project when their slugs match case-insensitively; otherwise both remain in the result.

The UI-facing model uses `stack`, `impact_metrics`, `anomaly_report`, `github_url`, `live_url`, `image_url`, and `gallery`, regardless of content source.

### List-to-detail flow

`/projects` calls `getProjects()` in its server page and passes the normalized records into `ProjectsGrid`. The grid remains a Client Component for hover previews and animation. Cards link to `/project/[id]`, render cover images when available, show optional repository links, and include a full GitHub archive link.

The project detail route queries Sanity for the requested slug first. If Sanity has no matching document, it looks for a hardcoded deployment in `portfolioData.missions.tier_1_deployments`, case-insensitively. A missing result goes through Next.js `notFound()`. `generateStaticParams()` uses the shared merged project list, so generated route IDs cover both sources. The footer's next-project navigation also uses this combined list.

The detail page uses the optional Sanity/local cover image in its visual frame and falls back to `CenterPanel` if the cover is absent. Optional gallery images are rendered below the project stack section. Empty stacks and metrics are handled as empty arrays by normalization.

### Sanity Studio, schema, and client

- `sanity.config.ts` mounts Studio at `/studio`, loads the schema, and configures the structure and Vision tools.
- `sanity/schemaTypes/project-type.ts` defines project title and slug, status, directive, tech stack, metrics, anomaly report, repository/live URLs, a hotspot-enabled cover image, and a hotspot-enabled screenshot gallery.
- `sanity/lib/client.ts` uses `useCdn: false`, avoiding CDN caching delays for newly published content.
- `sanity/env.ts` requires `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`; API version is optional and has a code default.
- `sanity/lib/image.ts` exports a Sanity image URL builder. The current project query reads image asset URLs directly.
- `sanity/lib/live.ts` defines `sanityFetch` and `SanityLive` helpers. The current project list/detail flows use `client.fetch`; the helper is not mounted as a global live-preview layer.

The Next.js image remote pattern allows HTTPS assets under `cdn.sanity.io/images/**`. If using a different image host, update `next.config.ts` before rendering the URL with `next/image`.

### Next.js cache configuration

`next.config.ts` enables `cacheComponents`. Both `app/(os)/projects/page.tsx` and `app/(os)/project/[id]/page.tsx` declare `export const instant = false` for request-time Sanity-backed data. Preserve this setup when changing rendering behavior; do not add `dynamic = "force-dynamic"` as a replacement under the current configuration.

## 5. Interaction and component map

| Component | Responsibility |
| --- | --- |
| `components/PremiumIntro.tsx` | Interactive root introduction and entry cards |
| `components/HeroPortrait3D.tsx` | Reusable portrait card with spring-based pointer tilt, layered 3D transforms, parallax image, glare, and floating animation |
| `components/Centralpanel.tsx` | Animated interactive technology/mission visualization used by the project detail fallback |
| `components/CursorPreview.tsx` | Context API and floating hover preview used by the projects grid |
| `components/CustomCursor.tsx` | Desktop fine-pointer cursor tracking and hover treatment |
| `components/GlobalCursorLayer.tsx` | Root cursor mount and Studio route exclusion |
| `components/ProjectMotion.tsx` | Reusable reveal, title, scroll-word, and rule animations used in project details |
| `components/BootSequence.tsx` | Standalone boot animation component; it is not the root page's current entry component |
| `components/ClosingCTA.tsx` | Standalone call-to-action section |

The Hub and Profile are different pages. The Hub presents the overview and deployment pinboard; the Profile contains the detailed operational/profile sections. The portrait is integrated into both page experiences.

## 6. Visual system, responsiveness, and performance

The visual language combines warm paper (`#EBE9E1`), espresso (`#2A1610`), orange-red (`#E43D12`), mustard (`#EFB11D`), and rose (`#D6536D`) with editorial display typography and technical monospace labels. Most page styling is expressed in Tailwind classes; `app/globals.css` supplies the base background, typography, overflow behavior, cursor rule, and scrollbar.

Performance and responsive choices embodied in the implementation include:

- Hiding desktop navigation links on narrow screens and exposing a Menu control.
- Applying responsive text sizes and wrapping rules to titles, metrics, long inline links, and nested role names.
- Reducing ambient flare blur on mobile to limit compositing/GPU load.
- Adding `will-change-transform` to relevant continuously animated and scroll-linked motion elements.
- Hiding and skipping custom cursor tracking on mobile/touch-oriented pointers.
- Using `next/image` for Sanity project covers and screenshots.
- Respecting Framer Motion reduced-motion handling where implemented in interactive visual components.

Treat reduced-motion behavior, keyboard access, hover-only interactions, and small-screen overflow as part of feature validation when editing animation-heavy UI.

## 7. Environment and external services

The application reads these environment variables in the current source:

| Variable | Required for | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity client, Studio, and image builder | Public configuration; still configure correctly |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity client, Studio, and image builder | Public configuration; still configure correctly |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional Sanity API version override | Public configuration; code supplies a default |
| `RESEND_API_KEY` | `POST /api/contact` email delivery | Secret; server-side only |

The source currently does not contain a Sanity project seeding API route. Do not assume a migration endpoint exists in this checkout. If one is added later, protect it with authentication, use a server-only write token, document the operational process, and remove or disable it when no longer needed.

### Operational considerations

- Missing Sanity project ID or dataset fails during Sanity environment initialization. Set both in local and deployment environments rather than weakening the explicit configuration guard.
- Contact delivery requires a working Resend account/API key and a sender address authorized for that account. The current route sets its recipient and sender in source; adjust those intentionally for the deployment.
- `next/font/google` loads fonts through Next.js font optimization. A clean production build may need network access to retrieve fonts unless they are already cached.
- Sanity data fetches can fail if project configuration, dataset access, or content is unavailable. Keep the existing fallback data for projects and make any future error/fallback policy visible rather than returning misleading success-shaped values.
- No database, authentication system, automated test runner, or CI workflow is configured by the current package manifest.

## 8. Problems encountered and resolutions

These notes capture recurring implementation and deployment issues addressed while building the current experience. They describe the solution pattern, not a claim that the issue is currently occurring.

| Problem | Resolution and engineering takeaway |
| --- | --- |
| Sanity-backed pages failed in a deployment with missing dataset configuration. | Configure project ID and dataset in the deployment environment. Keep the explicit assertions in `sanity/env.ts` so a missing integration is diagnosed directly. |
| Request-time CMS reads conflicted with the Next.js 16 `cacheComponents` setup. | Keep `cacheComponents` enabled and use the route's `export const instant = false` convention on the CMS-backed list/detail routes. Do not substitute `dynamic = "force-dynamic"` under this configuration. |
| Published CMS projects and existing hardcoded projects needed to coexist. | Normalize both sources in `lib/projects.ts`, compare IDs case-insensitively, and let the matching Sanity record override its local counterpart without dropping unrelated fallback projects. |
| Uploaded Sanity images could be rejected by Next Image optimization. | Allow `cdn.sanity.io` in `images.remotePatterns`, query asset URLs, and render optional images with `next/image`. Keep a designed component fallback when no cover is present. |
| A global custom cursor interfered with Sanity Studio and mobile/touch use. | Mount it at the root for route coverage, explicitly exclude `/studio`, scope native cursor hiding to the cursor-enabled wrapper, and gate tracking to fine-pointer desktop screens. |
| Narrow screens clipped long titles, metric values, role names, and external URLs. | Use responsive type scales, min-width-aware layouts, and safe text wrapping at the specific content surfaces rather than shrinking every page globally. |
| Large blur and continuous transforms can be costly on mobile. | Reduce flare blur at mobile breakpoints and apply transform compositing hints to elements that continuously animate or track scroll. Verify visually and profile before expanding these optimizations. |
| The Hub portrait was initially expected on the Profile experience, while the visible page was `/hub`. | Distinguish the routes in implementation and documentation; place the portrait in the intended Hub System Overview and retain the separate Profile page composition. |

## 9. Lessons and maintenance guidance

1. **Keep one normalization boundary for shared content.** Project cards, detail pages, and future consumers should rely on `ProjectData`, not duplicate Sanity-to-UI mappings.
2. **Treat local content as an explicit fallback.** Sanity enrichment should not silently erase projects that have not been migrated. Slug collision behavior should remain deterministic and tested when data logic changes.
3. **Document framework constraints next to operational instructions.** Cache Components, request-time data, and route exports interact; a seemingly conventional rendering flag may be incompatible with this application's configuration.
4. **Configure integrations at their boundary.** Sanity environment assertions, remote image patterns, and server-only email credentials each prevent a different category of runtime failure.
5. **Design interactions for devices that do not have a mouse.** Pointer tracking, hover previews, draggable cards, and menu navigation need touch, keyboard, and small-screen behavior.
6. **Optimize effects selectively.** Blur, fixed layers, image decoding, and continuous motion can add compositing cost. Reduce expensive work on mobile and validate the specific effect rather than applying broad styling changes.
7. **Separate implemented dependencies from shipped features.** Package presence alone does not mean a feature is wired into the current route flow. Confirm actual imports and configuration before describing an integration as active.
8. **Keep documentation aligned with source.** Update route tables, environment variables, and CMS fields whenever those interfaces change; do not copy secrets or deployment-specific credential values into documentation.

## 10. Directory map

```text
ops-console-v2/
├── app/
│   ├── (os)/
│   │   ├── contact/                 # Contact page
│   │   ├── hub/                     # Overview and deployment pinboard
│   │   ├── profile/                 # Profile, metrics, and ledger
│   │   ├── project/[id]/            # CMS-backed project case study
│   │   ├── projects/                # CMS-backed project grid
│   │   ├── stack/                   # Architecture presentation
│   │   ├── layout.tsx               # Shared portfolio shell and navigation
│   │   └── template.tsx             # Route-group page transition
│   ├── api/contact/route.ts          # Resend-backed contact handler
│   ├── studio/[[...tool]]/page.tsx   # Embedded Sanity Studio
│   ├── globals.css                  # Base styling and global cursor rule
│   ├── layout.tsx                   # Root layout and cursor boundary
│   └── page.tsx                     # Landing introduction
├── components/                      # Shared visual and motion components
├── lib/
│   ├── intel.ts                     # Typed hardcoded profile/project data
│   └── projects.ts                  # Sanity query and project normalization
├── sanity/
│   ├── lib/                         # Client, image, and live helpers
│   ├── schemaTypes/                 # Sanity document schemas
│   └── env.ts                       # Required public Sanity configuration
├── public/                          # Static images and other assets
├── next.config.ts
├── package.json
├── README.md
└── architecture.md
```

## 11. Validation workflow

The repository defines these checks:

```bash
npm run lint
npm run build
```

Use lint for source-level feedback and a production build to validate route compilation, Next.js configuration, image handling, and framework constraints. `package.json` does not currently define a test script; add focused tests when introducing non-trivial data normalization, validation, or routing behavior.
