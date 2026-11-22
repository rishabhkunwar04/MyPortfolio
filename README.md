# Rishabh Raj’s portfolio

A static Astro portfolio focused on backend engineering, distributed systems, and AI tooling. The home page introduces Rishabh and links to Work, Experience, Blog, and Contact. Contact is a section on the home page.

## Run locally

Use Node.js 24 and pnpm. Install dependencies with `pnpm install --frozen-lockfile`, then run `pnpm dev` and open the URL Astro prints. To check the production version, run `pnpm build` followed by `pnpm preview`. Astro generates `dist/` from the source files.

## Where to make changes

| Area | Source and editing notes |
| --- | --- |
| Shared navigation and styles | `src/layouts/Site.astro` owns the header, active links, résumé download, and hiring link. `src/style.css` contains shared and home styles. Several pages and components also have scoped styles. |
| Home and contact | `src/pages/index.astro` contains the name, role, employer badges, and contact links. `src/components/ExpertiseAndTools.astro` owns the expertise copy and scrolling tool list. |
| Hero and portrait | `src/signalRibbon.ts` draws the ribbon behind the name. `src/motion.ts` controls playback, pointer response, and reduced motion. The separate split portrait below the hero lives in `src/components/PortraitIntro.astro` and uses `public/rishabh-portrait.webp`. |
| Work | Edit `src/data/projects.ts` for project records. The first project is featured on `src/pages/work/index.astro`, which also builds the employer filters. Each slug generates a detail page via `src/pages/work/[slug].astro`. Check `src/components/SystemPreview.astro` when changing artwork and `src/work.css` for detail-page styles. |
| Experience and résumé | Edit roles and highlights in `src/pages/experience.astro`. Check the home employer badges when changing employment dates. The downloadable résumé is a separate file at `public/rishabh-raj-resume.pdf`. |
| Blog | Add entries to `src/data/posts.ts`. The page and its featured artwork are in `src/pages/blog.astro`. |

## Adding the next blog post

Each entry needs a title, a short summary, the published LinkedIn post URL, and a list of topics. Reuse existing topic spellings to group related posts. Put the entry first to feature it under **Start here**, or append it to keep the existing feature. The shelf, topic bubbles, filters, and counts update from the array. The optional `redirects` cover draws the 301/302 diagram for the first published article. Omit the cover for an article without matching artwork.

## Design and content decisions

- Keep the dark layout, prominent name, and compact navigation with a clear active-page indicator. The reference screenshots guided layout and hierarchy. Use Rishabh’s own portrait, work, and writing.
- Keep the name readable over the animated ribbon. Preserve the pause control and reduced-motion behavior when changing the artwork. Check the hero and portrait at desktop and phone widths.
- American Express may be listed as the current employer. Keep new descriptions generic and avoid adding internal data, metrics, or architecture. Existing copy and diagrams contain employer-specific details. Review those separately with Rishabh during deployment planning before treating them as public material.

Deployment planning is the next milestone. The commands above build and preview the portfolio locally.
