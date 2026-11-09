# Vesselina Belcheva: video editing portfolio

Static multi-page site, deployed by Netlify straight from this folder (`netlify.toml`: `publish = "."`, no build step on Netlify).

## Pages

| URL | File |
|---|---|
| `/` | `index.html` (hero + interactive timeline, services, experience cards, selected work, sample offer, about, contact CTA) |
| `/work/` | `work/index.html` (client groups, type filters `?type=sports|creators|ads|motion`) |
| `/work/<project>/` | one page per edit |
| `/about/` | `about/index.html` |
| `/contact/` | `contact/index.html` (email, socials, sample-edit request that opens the visitor's email app) |
| 404 | `404.html` (served automatically by Netlify) |

## Editing content

All copy and project data live in `tools/build.mjs`. After changing it run, from this folder:

```
node tools/build.mjs
```

That regenerates every HTML page, `sitemap.xml` and `robots.txt`.

- Showreel: put the processed files in `assets/media/showreel/` (showreel.mp4 1080p, showreel-720.mp4, poster.webp and showreel.json with {"w":1920,"h":1080}) and rebuild; the About page and homepage pick it up automatically.
- Portrait: save `assets/brand/portrait.webp` (960x1200) and `assets/brand/portrait-sm.webp` (480x600) and rebuild.
- Attribute a project to Upscale: add `client: 'Upscale'` to that project in `tools/build.mjs`, then rebuild.
- Add your photo: save it as `assets/brand/portrait.webp` (4:5) and replace the two `portrait-ph` placeholders in `tools/build.mjs`.

## Media

- `assets/media/<project>/` per edit: `video.mp4` (H.264 720p at the edit's native frame rate, 1-second keyframe interval for fast seeking, AAC 128k, faststart), `poster.webp`, `poster-sm.webp`. The same file plays on the project page, in the hover preview and in the homepage timeline.
- `assets/timeline/` small filmstrip thumbnails and `sequence.json` (clip in-points, durations, audio peaks, caption and SFX positions) for the homepage timeline. The timeline's monitor plays the real project videos.
- `assets/brand/` logo (transparent), favicons, Open Graph image.
- `assets/fonts/` self-hosted Bricolage Grotesque (headings and text), Newsreader Italic (accent words) and JetBrains Mono (timecodes), SIL OFL licences included.
- `assets/media/legacy/` web copies of the older Sublue and Blaine McConnell videos (plus before/after) with WebP posters, and Plan B thumbnails. The originals in `assets/` are untouched. The About page shows an "intro video coming soon" placeholder until a personal intro is supplied.

Full videos never load until a visitor presses play. Hover previews load only on desktop, on hover.

## Local preview

```
python tools/serve.py
```

then open http://localhost:8080. Use this server rather than `python -m http.server`: the built-in Python server ignores HTTP Range requests, so videos cannot seek (the homepage timeline and the project players jump back to 0:00). Opening `index.html` by double-click also works, because every internal link points to an explicit `index.html`.

## Backup

The previous single-page site is kept in `_backup/site-2026-08/index.html` (with the old README, netlify.toml and .gitignore) (excluded from search engines in `robots.txt`).

## Contact form (Netlify Forms)

The sample request form on `/contact/` is a Netlify Form named `sample-request`:
`data-netlify="true"`, a hidden `form-name` field and a honeypot field (`bot-field`).
`assets/js/site.js` validates the fields, posts the form with `fetch` and shows a success or
error message. Without JavaScript it posts normally and lands on `/contact/thanks/`.

One-time setup in the Netlify dashboard:
1. Project configuration > Forms: turn on form detection (newer sites have it off by default).
2. Redeploy, then check the Forms tab: `sample-request` should be listed.
3. Project configuration > Notifications > Emails and webhooks > Form submission notifications:
   add an email notification for `sample-request` to your inbox.

Local testing: `python tools/serve.py --fake-forms` answers form posts with 200 so the success
message can be checked. Nothing is sent locally; only Netlify delivers real submissions.
