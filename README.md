# Dr. Shaiful Islam — Website (Astro + TinaCMS)

Rebuilt from the original static HTML site into an Astro site with TinaCMS,
so the site owner can edit content and add/remove procedure pages without
touching code.

## What changed from the original static site

- Every page's content now lives in `src/content/pages/*.md` (site pages) and
  `src/content/procedures/*.md` (the 20 procedure detail pages), instead of
  being hardcoded into each `.html` file.
- Shared header/nav/footer now live in one place: `src/layouts/Layout.astro`.
  Editing it once updates every page.
- Procedure pages are generated automatically from
  `src/content/procedures/`. Adding a new `.md` file there (or through the
  Tina admin UI) automatically creates a new page at `/procedures/<slug>`
  and adds it to the `/procedures` listing under the right category — no
  code changes needed.
- Site-wide details (name, tagline, social links, footer/copyright text)
  live in `src/content/settings/global.json`, editable as one "Global Site
  Settings" doc in Tina.
- URLs are now clean (`/about` instead of `/about.html`).

## One thing worth knowing

The original design has some richly custom-styled sections (the animated
stat counters, the testimonial cards, the chamber cards). Those still work
exactly as before, but in the Tina editor they show up as a single "Page
Content" rich-text block rather than individually-labeled fields per line.
It's still editable — just less granular than the "Procedures" collection,
which has proper individual fields (title, category, image, description)
since that's the part you said needs the most hands-on editing. If you want
individually-labeled fields on any of the other pages too (e.g. separate
fields for each chamber's phone number), that's a follow-up worth doing
page-by-page — happy to do that next.

## Local setup

```bash
npm install
npm run dev          # plain Astro dev server, no CMS
```

## Setting up TinaCMS (one-time)

1. Push this project to a GitHub repo.
2. Go to https://app.tina.io, sign up free, and create a project connected
   to that repo.
3. Copy `.env.example` to `.env` and fill in the `TINA_CLIENT_ID` and
   `TINA_TOKEN` values Tina Cloud gives you.
4. Run:
   ```bash
   npm run tina-dev
   ```
   This opens the site with an "Edit" pencil — click it to enter the visual
   editor. Your client would use this same URL in production (see below) to
   make edits: click any page, click into a field, change it, hit save. For
   procedures, there's an "Add New" button in the Procedures collection to
   create a page, and a delete option to remove one.

## Deploying on Vercel

1. Import the GitHub repo into Vercel as a new project (framework preset:
   Astro — Vercel detects this automatically).
2. In Vercel's project settings, add the same environment variables from
   `.env` (`TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_BRANCH`).
3. Set the build command to `npm run tina-build` (already the default in
   `package.json`) so Tina's admin bundle builds alongside the site.
4. Deploy. Your client can then edit content at `https://yourdomain.com/admin`
   any time — changes are committed to GitHub and Vercel auto-redeploys.

## Project structure

```
src/
  content/
    pages/          → editable content for each static page (About, Contact, etc.)
    procedures/      → one file per procedure (add/remove here = add/remove pages)
    settings/        → site-wide name, tagline, social links, footer text
  layouts/Layout.astro → shared nav + footer
  pages/            → Astro routes (mostly thin wrappers that pull from content/)
tina/config.ts       → defines what your client can edit and how
public/assets/       → original CSS, JS, and images, unchanged
```
