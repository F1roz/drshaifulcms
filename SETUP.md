# Dr. Shaiful Islam Website — Eleventy + Decap CMS Setup

This project builds the same design you already had, but content now lives in
editable files under `/content` and is rendered into pages at build time.
Dr. Shaiful edits everything through `/admin` (Decap CMS) — no code required.

## What changed structurally
- Pages are now `.njk` templates (`index.njk`, `about.njk`, etc.) that pull text/images
  from `/content/*.json` and `/content/procedures/*.md`.
- Adding a new file in `/content/procedures/` automatically creates a new page at
  build time — that's what lets Dr. Shaiful add new procedures himself.
- CSS, JS, cursor, animations are untouched — copied as-is from your zip.

## One-time setup checklist

### 1. Push this project to GitHub (replacing current repo contents)
```
cd this-folder
git init   # only if starting fresh; otherwise just copy files into your existing repo
git add .
git commit -m "Migrate to Eleventy + Decap CMS"
git remote add origin https://github.com/F1roz/drshaiful.git
git push -u origin main --force
```
(If your repo already has history you want to keep, just copy these files into
your existing local clone instead of re-initializing, then commit & push normally.)

### 2. Create a GitHub OAuth App (required for Decap CMS login)
1. Go to https://github.com/settings/developers → "New OAuth App"
2. **Application name:** Dr. Shaiful Islam CMS
3. **Homepage URL:** `https://drshaiful.vercel.app` (or your real domain once bought)
4. **Authorization callback URL:** `https://drshaiful.vercel.app/api/callback`
5. Click "Register application"
6. Copy the **Client ID**, then click "Generate a new client secret" and copy that too

### 3. Add environment variables in Vercel
In your Vercel project → Settings → Environment Variables, add:
- `OAUTH_GITHUB_CLIENT_ID` = (from step 2)
- `OAUTH_GITHUB_CLIENT_SECRET` = (from step 2)

Redeploy after adding these (Vercel → Deployments → ⋯ → Redeploy).

### 4. Create Dr. Shaiful's own GitHub account & add as collaborator
1. Create a new GitHub account for him (separate from yours)
2. On `github.com/F1roz/drshaiful` → Settings → Collaborators → Add people →
   enter his username → send invite
3. He logs into his new GitHub account and accepts the email invite

### 5. Update `admin/config.yml` domain (if using a custom domain later)
Once you buy the real domain, update these two values in `admin/config.yml`:
```yaml
base_url: https://your-real-domain.com
```
And update the OAuth App's URLs in GitHub settings (step 2) to match.

## How Dr. Shaiful uses it day-to-day
1. Go to `yourdomain.com/admin`
2. Click "Login with GitHub" → authorize (one-time)
3. Pick a section from the left menu (Homepage, Expertise/Procedures, Career,
   Research, Memberships, Gallery, Videos, Testimonials, Chambers, Contact)
4. Edit text, drag in new photos/videos, click **Publish**
5. Vercel auto-deploys the change — live in ~1–2 minutes

## Local testing (optional, for you)
```
npm install
npm run start   # runs Eleventy locally with live reload at localhost:8080
```

## Notes
- Vercel's build command is already set in `vercel.json` (`npm run build`,
  output directory `_site`) — no manual config needed in the Vercel dashboard
  beyond the environment variables above.
- I could not run a live `npm install` / build in my sandbox (no internet
  access there), so please do a test build/deploy on your end before handing
  this off to Dr. Shaiful. If anything errors on the Vercel build log, send
  me the error and I'll fix it.
