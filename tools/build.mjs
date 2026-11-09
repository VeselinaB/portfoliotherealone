// Static page generator for the portfolio (v2).
// Run from the project root:  node tools/build.mjs
// Writes index.html, work/, about/, contact/, 404.html, sitemap.xml and robots.txt.
// Netlify publishes the folder as-is (netlify.toml: publish = "."); no build step runs there.
//
// Links are generated with an explicit index.html (for example work/punchy-spec-ad/index.html),
// so they open the right page with file://, with any local server and on Netlify. On http(s)
// assets/js/site.js rewrites them to clean URLs (work/punchy-spec-ad/).
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://vb8portfolio.netlify.app';
const EMAIL = 'veselina.belcheva8@gmail.com';
const NAME = 'Vesselina Belcheva';
const SOCIAL = [
  { name: 'Instagram', handle: '@_v.belcheva_', url: 'https://www.instagram.com/_v.belcheva_/' },
  { name: 'TikTok', handle: '@v.belcheva_', url: 'https://www.tiktok.com/@v.belcheva_' },
  { name: 'X', handle: '@BelchevaV', url: 'https://x.com/BelchevaV', avatar: 'assets/brand/x-avatar.webp' },
];
// Optional personal assets: the pages use them automatically once the files exist.
const HAS_PORTRAIT = existsSync(join(ROOT, 'assets/brand/portrait.webp'));
const SHOWREEL = existsSync(join(ROOT, 'assets/media/showreel/showreel.json')) ? JSON.parse(readFileSync(join(ROOT, 'assets/media/showreel/showreel.json'), 'utf8')) : null;
// Agencies currently worked with. Projects are only labelled with an agency once confirmed:
// set `client: 'Upscale'` on a project below to attribute it.
const CURRENT = ['Aesthetic Al', 'Upscale'];

/* ---------- Work page sections ---------- */
const GROUPS = [
  { id: 'sports', title: 'Sports, coaching & creator content', short: 'Sports & coaching', kicker: 'Main focus',
    text: 'Coaches, athletes and educators: race messages, training advice and explainers built on clear captions, purposeful B-roll and designed graphics.' },
  { id: 'aesthetic-al', title: 'Aesthetic Al', short: 'Aesthetic Al', kicker: 'Creator client', status: 'Current client',
    text: 'Fitness tech reviews for the YouTube creator Aesthetic Al: watch comparisons, run footage and product callouts cut for short-form.',
    link: { href: 'https://www.youtube.com/@Aesthetic_Al', label: 'Aesthetic Al on YouTube' } },
  { id: 'ads', title: 'Ads & motion graphics', short: 'Ads & motion', kicker: 'Product and promo',
    text: 'Product spots and promotional edits where typography, motion and sound carry the message.' },
  { id: 'more', title: 'Earlier & personal work', short: 'Earlier & personal', kicker: 'Archive',
    text: 'Earlier client projects and a personal edit made from my own footage.' },
];

/* ---------- projects (each gets its own page) ---------- */
const P = [
  // Sports, coaching & creator content
  { slug: 'nyc-marathon-coach-mark', group: 'sports',
    title: 'Coach Mark: race-day message', subject: 'Coach Mark', type: 'Marathon coach short',
    summary: 'Race-day encouragement built around an animated route map that tracks a runner through the boroughs.',
    approach: 'The coach speaks to camera, then the edit cuts to a branded map where the route draws itself mile by mile, with a live mile counter, so the viewer feels how far they have come.',
    techs: ['Animated route map with mile counter', 'Name lower third', 'Bold keyword captions', 'Crowd cutaway'] },
  { slug: 'micha-strength-training', group: 'sports',
    title: 'Micha on strength training', subject: 'Micha', type: 'Coach talking-head short',
    summary: 'Strength-training advice where the talking head alternates with designed sections.',
    approach: 'A framed intro card sets the topic, a cutaway of conflicting social media comments shows the confusion, and a step diagram (train hard, stay consistent, keep progressing) lands the answer. Captions use a warm orange accent.',
    techs: ['Designed intro and explainer sections', 'Social comment cutaway', 'Step diagram animation', 'Accent captions'] },
  { slug: 'kian-deehan-sleep', group: 'sports',
    title: 'Kian Deehan on sleep', subject: 'Kian Deehan', type: 'Coach talking-head short',
    summary: 'A fitness coach’s point about sleep and progress, illustrated beat by beat.',
    approach: 'Keyword captions carry red emphasis on the words that matter, full-screen type cards reset attention, and quick illustrative cutaways (a check-in graphic, night-time footage, a landscape) make each point visual.',
    techs: ['Keyword captions with colour emphasis', 'Full-screen type cards', 'Illustrative cutaways', 'Hook title'] },
  { slug: 'sharelle-grant-training', group: 'sports',
    title: 'Sharelle Grant on training', subject: 'Sharelle Grant', type: 'Fitness educator short',
    summary: 'Women’s health and training education with highlighted captions and cinematic running B-roll.',
    approach: 'Captions highlight the key term in each line, running footage illustrates the point, and a grid-backed type card builds the sentence word by word before the payoff word lands.',
    techs: ['Highlighted captions', 'Running B-roll', 'Grid type card'] },
  { slug: 'alfredo-scarlata-procrastination', group: 'sports',
    title: 'Alfredo Scarlata: why we procrastinate', subject: 'Alfredo Scarlata', type: 'Educational explainer',
    summary: 'An educational talking-head video whose gaps became typography-led motion graphics.',
    approach: 'Sections without footage were rebuilt as editorial motion design: a to-do card, simple versus emotionally loaded tasks, a brain that “protects” you and a clock that crosses out the time myth, set in a bold sans with an italic serif and a red accent.',
    techs: ['Editorial typography', 'Illustrative motion graphics', 'Bold sans and italic serif system', 'Sound design'] },
  { slug: 'zakk-colburn-coaching', group: 'sports',
    title: 'Zakk Colburn: starting from zero', subject: 'Zakk Colburn', type: 'Coaching business short',
    summary: 'A coaching-business hook with kinetic keyword captions and clean white type cards.',
    approach: 'Captions pop the key words in cyan, a crowd cutaway proves the community, and white cards with a script-font accent slow the sentence down at the important moment.',
    techs: ['Kinetic keyword captions', 'Type cards with script accent', 'Cutaway pacing'] },
  { slug: 'kendall-strampel-coaching', group: 'sports',
    title: 'Kendall Strampel on offers', subject: 'Kendall Strampel', type: 'Coaching business short',
    summary: 'Business advice for fitness coaches with expressive script emphasis and grid type cards.',
    approach: 'The emphasis words switch to a script font so the argument reads at a glance, then a grid card isolates the line that matters.',
    techs: ['Script emphasis captions', 'Grid type card', 'Tight dialogue edit'] },
  // Aesthetic Al
  { slug: 'aesthetic-al-suunto-vs-garmin', group: 'aesthetic-al', client: 'Aesthetic Al',
    title: 'Suunto vs Garmin', type: 'Product review short',
    summary: 'A head-to-head watch comparison that keeps a talking-head argument moving.',
    approach: 'The reasoning stays on camera, but every claim is shown: top-down product shots on a bold colour set, labels that name each feature as it appears, and a handwritten list card that sums up the three reasons before the price reveal.',
    techs: ['Hook title on the first frame', 'Product B-roll timed to the script', 'Feature labels and price callout', 'Captions and sound design'] },
  { slug: 'aesthetic-al-suunto-race-2', group: 'aesthetic-al', client: 'Aesthetic Al',
    title: 'Suunto Race 2 on the run', type: 'Product review short',
    summary: 'A running-watch review that never stays still: seated explanation, run footage, close-ups and drone shots.',
    approach: 'It opens on the question a Garmin owner would ask, then alternates between the creator explaining, the watch in use on the run and wide drone shots that give the review room to breathe.',
    techs: ['Question hook over the face', 'Run and drone B-roll', 'Watch close-ups at the key lines', 'Pacing for a 60-second review'] },
  { slug: 'aesthetic-al-garmin-cirqa', group: 'aesthetic-al', client: 'Aesthetic Al',
    title: 'Garmin Cirqa, race tested', type: 'Product review short',
    summary: 'First-person race footage explained with live stat cards, a GPS map and a clean product card.',
    approach: 'Interface-style cards show pace, distance and heart rate as they would read on a watch, a map overlay explains how the band borrows the phone’s GPS, and the product card lists what it tracks. The race footage keeps the energy up underneath.',
    techs: ['UI stat cards', 'Animated GPS map', 'Product feature card', 'Script-font emphasis captions'] },
  // Ads & motion graphics
  { slug: 'aspire-spec-ad', group: 'ads', spec: true,
    title: 'Aspire: everyday energy', subject: 'Aspire', type: 'Spec ad',
    summary: 'An energy drink spot that starts on the 3 pm slump and builds to the product.',
    approach: 'Kinetic word walls set up the tired feeling, a circular reveal brings in the can, and stat cards (caffeine, calories, vitamins) keep the message to one idea per beat before the closing product line.',
    techs: ['Kinetic type', 'Circular reveal transitions', 'Stat cards', 'Sound-led pacing'] },
  { slug: 'punchy-spec-ad', group: 'ads', spec: true,
    title: 'Punchy: get back on track', subject: 'Punchy', type: 'Spec ad',
    summary: 'A hydration drink spot built from poster-style frames in rapid rotation.',
    approach: 'Every beat is a new poster: oversized condensed type, colour blocking and fruit illustration, while the can stays the constant through each layout.',
    techs: ['Poster typography', 'Colour-block transitions', 'Product motion', 'Rhythmic cutting'] },
  { slug: 'orka-spec-ad', group: 'ads', spec: true,
    title: 'Orka: energy, reimagined', subject: 'Orka', type: 'Spec ad',
    summary: 'A clean, minimal energy-water spot that lets the product and the numbers speak.',
    approach: 'The can stays centre frame while the claims count in (caffeine, sugar, calories), then a flavour reveal and a calm end card.',
    techs: ['Minimal product animation', 'Counting stat reveals', 'Flavour transition', 'End card'] },
  { slug: 'triangle-liquidators-ad', group: 'ads',
    title: 'Triangle Liquidators: bid, win, save', subject: 'Triangle Liquidators', type: 'Promo ad',
    summary: 'A promo for an auction liquidation business: products, prices and reviews in under 30 seconds.',
    approach: 'Products slide in with their retail price and winning bid, customer review cards build trust, and the line “Bid. Win. Save.” closes on one call to action.',
    techs: ['Product price cards', 'Review card montage', 'Kinetic headline', 'Single CTA end card'] },
  // Personal
  { slug: 'italy-2026', group: 'more', personal: true,
    title: 'Italy 2026', subject: 'My own footage', type: 'Personal travel edit',
    summary: 'A travel opener cut from my own trip footage: title type set into the landscape, location cards and a fast montage.',
    approach: 'A personal project. The title sits in the scenery before the cut to a quick run of places and moments, with location cards to anchor where we are.',
    techs: ['Title design', 'Location cards', 'Montage pacing'] },
];

/* ---------- earlier work kept from the previous site (no project pages) ---------- */
const LEGACY = [
  { id: 'plan-b', title: 'Plan B Varna', kicker: 'Social design · food business', kind: 'posts',
    text: '16 branded social posts across July and August 2026.',
    images: ['assets/media/legacy/planb-03-sm.webp', 'assets/media/legacy/planb-07-sm.webp'], full: 'assets/planb-03.webp', ar: 1.5, alt: ['Plan B Varna social post: baked potatoes with parmesan', 'Plan B Varna social post: shrimp and edamame bowl'],
    quote: { text: 'Working with Vesselina is a real pleasure! She managed to present our place in the best possible way and show its character through great ideas and content.', cite: 'Plan B Varna, client' } },
  { id: 'sublue', title: 'Sublue', kicker: 'Product content · underwater scooters', kind: 'video', pw: 810, ph: 1080,
    text: 'Short-form product videos edited from existing footage: script, pacing, subtitles and sound.',
    video: 'assets/media/legacy/sublue-vertical.mp4', poster: 'assets/media/legacy/sublue-vertical.webp' },
];

/* ---------- media metadata (dimensions, durations, native frame rates) ---------- */
const META = JSON.parse(readFileSync(join(ROOT, 'tools/media-meta.json'), 'utf8'));
const SEQ = JSON.parse(readFileSync(join(ROOT, 'assets/timeline/sequence.json'), 'utf8'));
const fpsLabel = (f) => (Math.abs(f - Math.round(f)) < 0.01 ? String(Math.round(f)) : f.toFixed(f < 25 ? 3 : 2)) + ' fps';
SEQ.clips.forEach((c) => { const m = META[c.slug]; c.fps = m.fps; c.fpsLabel = fpsLabel(m.fps); });
const TIMELINE = JSON.stringify(SEQ);

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const link = (r, p = '') => { const [path, hash] = p.split('#'); return r + path + 'index.html' + (hash ? '#' + hash : ''); };
const ICON = {
  arrow: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1.2v9.6L10.6 6z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor"/></svg>',
  cut: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="4" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/><path d="M5.6 10.4 12.5 2M10.4 10.4 3.5 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  undo: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 6H10a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7.5 3 4.5 6l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sound: '<svg class="i-sound" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 6h2.5L8.5 3v10L5 10H2.5z" fill="currentColor"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.6a6 6 0 0 1 0 8.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  select: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2l9 6-4 1 2.5 4.5-1.8.9L6.3 10 3 13z" fill="currentColor"/></svg>',
  mute: '<svg class="i-mute" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 6h2.5L8.5 3v10L5 10H2.5z" fill="currentColor"/><path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  close: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};
const fmtDur = (s) => { s = Math.round(s); return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} min` : `${s} s`; };
const media = (slug) => `assets/media/${slug}/`;
const projBy = Object.fromEntries(P.map((p) => [p.slug, p]));
const isV = (p) => META[p.slug].orient === 'vertical';
const kickerOf = (p) => p.spec ? `Spec ad · ${p.subject}` : p.personal ? 'Personal project' : p.client ? p.client : p.type;
const metaLine = (p) => `${isV(p) ? '9:16' : '16:9'} · ${fmtDur(META[p.slug].dur)} · ${fpsLabel(META[p.slug].fps)}`;
// Typographic widow control: join the last two words of every heading and slogan with a
// non-breaking space, so a heading never ends with one word alone on its last line.
function noWidows(html) {
  return html.replace(/(<(h[1-3])\b[^>]*>|<p class="slogan">)([\s\S]*?)(<\/h[1-3]>|<\/p>)/g, (m, open, tag, inner, close) => {
    let depth = 0; const sp = [];
    for (let i = 0; i < inner.length; i++) { const ch = inner[i]; if (ch === '<') depth++; else if (ch === '>') depth--; else if (ch === ' ' && depth === 0) sp.push(i); }
    if (!sp.length || inner.includes('<br')) return m;
    const cut = sp.length > 1 ? sp[sp.length - 2] + 1 : 0; // start of the second-to-last word
    return open + inner.slice(0, cut) + '<span class="nw">' + inner.slice(cut) + '</span>' + close;
  });
}
function write(rel, html) { const f = join(ROOT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, rel.endsWith('.html') ? noWidows(html) : html); }

/* ---------- layout ---------- */
const NAV = [
  { href: '', label: 'Home', key: 'home' },
  { href: 'work/', label: 'Work', key: 'work' },
  { href: 'about/', label: 'About', key: 'about' },
  { href: 'contact/', label: 'Contact', key: 'contact' },
];
function layout({ path, title, desc, active, body, depth, scripts = [], ogImage, ogType = 'website' }) {
  const r = '../'.repeat(depth);
  const url = SITE + '/' + path;
  const og = SITE + '/' + (ogImage || 'assets/brand/og.jpg');
  const navItems = () => NAV.map((n) => `<a href="${link(r, n.href)}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0A1026">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${r}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${r}assets/brand/favicon-32.png">
<link rel="apple-touch-icon" href="${r}assets/brand/favicon-180.png">
<link rel="preload" href="${r}assets/fonts/bricolage-grotesque-latin-standard-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}assets/css/site.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${link(r)}" aria-label="${NAME}, home">
      <img src="${r}assets/brand/vb-logo-240.webp" width="240" height="126" alt="VB logo">
      <span>${NAME}</span>
    </a>
    <nav class="nav" aria-label="Main">${navItems()}</nav>
    <a class="btn btn-primary btn-sm header-cta" href="${link(r, 'contact/#sample')}">Free sample edit</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Menu"><span></span></button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Main mobile">${navItems()}<a class="btn btn-primary" href="${link(r, 'contact/#sample')}">Free sample edit</a></nav>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="${r}assets/brand/vb-logo-240.webp" width="240" height="126" alt="VB logo">
        <p>Video editor and motion designer for creators, coaches, agencies and brands. Based in Varna, Bulgaria, working remotely.</p>
      </div>
      <div><h2>Pages</h2><ul>${NAV.map((n) => `<li><a href="${link(r, n.href)}">${n.label}</a></li>`).join('')}</ul></div>
      <div><h2>Contact</h2><ul><li><a href="mailto:${EMAIL}">${EMAIL}</a></li>${SOCIAL.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name === "X" ? "X (@BelchevaV)" : s.name}</a></li>`).join('')}</ul></div>
    </div>
    <div class="foot-base"><span>© 2026 ${NAME.toUpperCase()}</span><span>VIDEO EDITING · MOTION GRAPHICS · SOUND</span></div>
  </div>
</footer>
<script src="${r}assets/js/site.js" defer></script>
${scripts.map((s) => `<script src="${r}${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}

/* ---------- components ---------- */
function pcard(p, r) {
  const v = isV(p), m = META[p.slug];
  return `<a class="pcard ${v ? 'pcard--v' : 'pcard--h'}" href="${link(r, `work/${p.slug}/`)}" data-peek data-orient="${v ? 'v' : 'h'}"
   data-video="${r}${media(p.slug)}video.mp4" data-poster="${r}${media(p.slug)}poster.webp"
   data-title="${esc(p.title)}" data-kicker="${esc(kickerOf(p))}" data-desc="${esc(p.summary)}" data-meta="${esc(metaLine(p))}">
  <div class="pcard-media">
    <img src="${r}${media(p.slug)}poster-sm.webp" width="${v ? 360 : 640}" height="${v ? 640 : 360}" alt="Frame from ${esc(p.title)}" loading="lazy" decoding="async" draggable="false">
    ${p.spec ? '<span class="badge">Spec ad</span>' : p.personal ? '<span class="badge">Own footage</span>' : ''}
    <span class="play-ico">${ICON.play}</span>
  </div>
  <div class="pcard-body"><span class="kicker">${esc(kickerOf(p))}</span><h3>${esc(p.title)}</h3></div>
</a>`;
}
function carousel(items, label, cls = '') {
  return `<div class="carousel ${cls}" data-carousel>
  <div class="car-head"><span class="kicker">${label}</span><div class="car-ctrls"><button class="car-btn prev" type="button" aria-label="Previous">${ICON.arrow}</button><button class="car-btn next" type="button" aria-label="Next">${ICON.arrow}</button></div></div>
  <div class="car-track" tabindex="0" aria-label="${esc(label)}">${items.join('\n')}</div>
</div>`;
}
function legacyCard(l, r) {
  let mediaHtml;
  if (l.kind === 'posts') {
    mediaHtml = `<button class="legacy-btn scard-media" type="button" data-view="${r}${l.full}" data-alt="Plan B Varna social post" data-caption="Plan B Varna · social post"><div class="posts">${l.images.map((s, k) => `<img src="${r}${s}" alt="${esc(l.alt[k])}" loading="lazy" decoding="async" width="480" height="640" draggable="false">`).join('')}</div><span class="sr-only">Open a larger post</span></button>`;
  } else {
    mediaHtml = `<button class="legacy-btn scard-media" type="button" data-view="${r}${l.video}" data-poster="${r}${l.poster}" data-caption="${esc(l.title)}"><img src="${r}${l.poster}" alt="Frame from ${esc(l.title)}" loading="lazy" decoding="async" width="${l.pw}" height="${l.ph}" draggable="false"><span class="play-ico">${ICON.play}</span><span class="sr-only">Play ${esc(l.title)}</span></button>`;
  }
  const ar = l.ar || (l.pw / l.ph);
  return `<article class="scard" id="${l.id}" style="--ar:${ar.toFixed(4)}">
  ${mediaHtml}
  <div class="pcard-body"><span class="kicker">${esc(l.kicker)}</span><h3>${esc(l.title)}</h3><p class="card-text">${esc(l.text)}</p>
  ${l.extra ? `<button class="text-link link-btn" type="button" data-view="${r}${l.extra.video}" data-caption="${esc(l.title)}: before and after">${l.extra.label} ${ICON.arrow}</button>` : ''}</div>
  ${l.quote ? `<blockquote class="quote">“${esc(l.quote.text)}”<cite>${esc(l.quote.cite)}</cite></blockquote>` : ''}
</article>`;
}
function stripProject(p, r) { // personal / horizontal project inside the mixed-format strip
  return `<a class="scard" style="--ar:1.7778" href="${link(r, `work/${p.slug}/`)}" data-peek data-orient="h" data-video="${r}${media(p.slug)}video.mp4" data-poster="${r}${media(p.slug)}poster.webp" data-title="${esc(p.title)}" data-kicker="${esc(kickerOf(p))}" data-desc="${esc(p.summary)}" data-meta="${esc(metaLine(p))}">
  <div class="scard-media"><img src="${r}${media(p.slug)}poster-sm.webp" width="640" height="360" alt="Frame from ${esc(p.title)}" loading="lazy" decoding="async" draggable="false"><span class="badge">Own footage</span><span class="play-ico">${ICON.play}</span></div>
  <div class="pcard-body"><span class="kicker">Personal project</span><h3>${esc(p.title)}</h3><p class="card-text">${esc(p.summary)}</p></div>
</a>`;
}
const viewerDialog = `<dialog class="viewer" id="viewer" aria-label="Media viewer"><div class="viewer-inner"><div data-holder></div><div class="viewer-bar"><span data-caption></span><button class="viewer-close" type="button" aria-label="Close">${ICON.close}</button></div></div></dialog>`;
function contactBand(r) {
  return `<section class="section"><div class="wrap"><div class="cta-band reveal">
  <div><span class="eyebrow">Next step</span><h2 style="margin-top:16px">Have footage that deserves <span class="serif">a better edit?</span></h2></div>
  <div class="btn-row"><a class="btn btn-primary" href="${link(r, 'contact/')}">Discuss a project ${ICON.arrow}</a><a class="btn btn-ghost" href="mailto:${EMAIL}">Email me</a></div>
</div></div></section>`;
}

/* ---------- editor (homepage workspace) ----------
   The hero grid itself is the editor root: headline left, monitor right, project info between
   them, and a wide timeline band underneath that runs behind the monitor. */
function editor(copy) {
  const c0 = SEQ.clips[0], parts = c0.title.split(' · ');
  const tracks = ['v3', 'v2', 'v1', 'a1', 'a2', 'a3'];
  return `<div class="hero-grid stage" data-editor data-base="assets/timeline/" data-media="assets/media/" data-link="work/">
  ${copy}
  <div class="monitor" aria-label="Program monitor playing clips from my edits">
    <video muted playsinline preload="none" poster="${media(c0.slug)}poster-sm.webp" aria-hidden="true"></video>
    <video muted playsinline preload="none" aria-hidden="true"></video>
    <i class="mon-flash" aria-hidden="true"></i>
  </div>
  <div class="ws-info" aria-live="polite">
    <span class="ws-kind">${esc(parts[1] || '')}</span>
    <span class="ws-title">${esc(parts[0])}</span>
    <div class="ws-row"><a class="ws-open text-link" href="${link('', `work/${c0.slug}/`)}">View project ${ICON.arrow}</a><button class="ws-mute" type="button" aria-pressed="false" aria-label="Mute cut sound">${ICON.sound}${ICON.mute}</button></div>
  </div>
  <div class="ws-panel">
    <div class="tl-area" tabindex="0" role="slider" aria-label="Editing timeline: click or tap to cut, drag to scrub" aria-valuemin="0" aria-valuemax="${SEQ.total}" aria-valuenow="0">
      <div class="tl-ruler"></div><div class="tl-markers"></div>
      ${tracks.map((k) => `<div class="trk r-${k}"></div>`).join('')}
      <div class="playhead"></div>
    </div>
    <p class="sr-only tl-live" aria-live="polite"></p>
  </div>
  <script type="application/json" id="timeline-data">${TIMELINE}</script>
</div>`;
}

function portrait(r) {
  if (HAS_PORTRAIT) return `<figure class="portrait has-photo reveal"><picture><source media="(max-width: 700px)" srcset="${r}assets/brand/portrait-sm.webp"><img src="${r}assets/brand/portrait.webp" width="1088" height="818" alt="Vesselina Belcheva sprinting on the track in a blue club top" loading="lazy" decoding="async"></picture></figure>`;
  return `<div class="portrait reveal" aria-hidden="true"><div class="portrait-ph"><img src="${r}assets/brand/vb-logo-240.webp" width="240" height="126" alt=""><span>PHOTO COMING SOON</span></div></div>`;
}
function xBadge(r) {
  const x = SOCIAL.find((s) => s.name === 'X');
  return `<a class="x-badge" href="${x.url}" target="_blank" rel="noopener"><img src="${r}${x.avatar}" width="40" height="40" alt="" loading="lazy"><span><b>${esc(x.handle)}</b><small>Follow along on X</small></span></a>`;
}
function showreelSection(r, compact) {
  if (!SHOWREEL) {
    return `<section class="section" id="showreel"><div class="wrap two-col" style="align-items:center">
  <div class="reveal"><span class="eyebrow">Showreel</span><h2 style="margin-top:16px">My showreel,<br> <span class="serif nw">coming soon.</span></h2><p class="lead" style="margin-top:16px">The full reel is being added. Until then, every edit has its own page with sound.</p></div>
  <div class="intro-ph reveal" role="img" aria-label="Showreel coming soon"><div class="intro-ph-inner"><span class="ring">${ICON.play}</span><b>Showreel coming soon</b><span>Browse the edits in the meantime.</span><a class="btn btn-ghost btn-sm" href="${link(r, 'work/')}">Browse the work</a></div></div>
</div></section>`;
  }
  const s = SHOWREEL;
  return `<section class="section reel-section" id="showreel"><div class="wrap">
  <div class="head-row reveal"><div><span class="eyebrow">Showreel</span><h2>${compact ? 'See the work <span class="serif">in motion.</span>' : 'My work <span class="serif">in 30 seconds.</span>'}</h2></div>${compact ? `<a class="text-link" href="${link(r, 'about/#showreel')}">More about me ${ICON.arrow}</a>` : ''}</div>
  <div class="reel reveal"><video controls playsinline preload="none" poster="${r}assets/media/showreel/poster.webp" width="${s.w}" height="${s.h}" aria-label="Vesselina Belcheva showreel">
    <source src="${r}assets/media/showreel/showreel-720.mp4" type="video/mp4" media="(max-width: 900px)">
    <source src="${r}assets/media/showreel/showreel.mp4" type="video/mp4">
    Your browser cannot play this video. <a href="${r}assets/media/showreel/showreel.mp4">Download the showreel</a>.
  </video></div>
</div></section>`;
}

/* ---------- HOME ---------- */
function home() {
  const r = '';
  const featured = ['nyc-marathon-coach-mark', 'aesthetic-al-suunto-vs-garmin', 'micha-strength-training', 'aspire-spec-ad'].map((s) => projBy[s]);
  const hero = projBy['alfredo-scarlata-procrastination'];
  const count = (g) => P.filter((p) => p.group === g).length + (g === 'more' ? LEGACY.length : 0);
  const exp = [
    { href: 'work/#sports', kicker: 'Main focus', title: 'Sports & coaching', text: 'Race messages, training advice and educational explainers for coaches and athletes.', img: `${media('sharelle-grant-training')}poster-sm.webp`, n: count('sports') },
    { href: 'work/#aesthetic-al', kicker: 'Creator client', title: 'Aesthetic Al', text: 'Fitness tech reviews: watch comparisons, run footage, product callouts.', img: `${media('aesthetic-al-garmin-cirqa')}poster-sm.webp`, n: count('aesthetic-al') },
    { href: 'work/#ads', kicker: 'Ads & motion', title: 'Product spots', text: 'Drink spec ads and a promo built on kinetic type and product motion.', img: `${media('punchy-spec-ad')}poster-sm.webp`, n: count('ads') },
    { href: 'work/#more', kicker: 'Archive', title: 'Earlier & personal', text: 'Brand content, social design and a personal travel edit.', img: 'assets/media/legacy/planb-03-sm.webp', n: count('more') },
  ];
  const body = `
<section class="hero">
  <div class="wrap">
    ${editor(`<div class="hero-copy">
        <h1>Edits that<br> <span class="serif nw">hold attention.</span></h1>
        <p class="hero-sub">Short-form, creator and motion-graphics edits for coaches, athletes, creators and brands.</p>
        <div class="btn-row"><a class="btn btn-primary" href="${link(r, 'work/')}">View selected work ${ICON.arrow}</a><a class="btn btn-ghost" href="${link(r, 'contact/#sample')}">Free sample edit</a></div>
      </div>`)}
    <div class="hero-meta"><span>Currently editing for <b>${CURRENT.join('</b> and <b>')}</b></span><span>Sports and fitness focus, edited by a heptathlete</span><span>Based in Varna, working worldwide</span>${SHOWREEL ? `<a class="text-link" href="${link(r, 'about/#showreel')}">Watch the showreel ${ICON.arrow}</a>` : ''}</div>
  </div>
</section>

<section class="section" id="services">
  <div class="wrap">
    <div class="svc-head reveal"><span class="eyebrow">What I edit</span><div class="svc-intro"><h2>Clear story, sharp pacing,<br> <span class="serif nw">sound that lands.</span></h2><p class="lead">You send the footage and the goal. I shape the hook, story, captions, graphics and sound into a finished piece for the platform it lives on.</p></div></div>
    <div class="svc-grid reveal">
      <div class="svc"><span class="svc-no">01</span><h3>Short-form for creators and coaches</h3><p>Reels, Shorts and TikToks built around a strong opening, readable captions and pacing that does not let go.</p></div>
      <div class="svc"><span class="svc-no">02</span><h3>Sports and fitness content</h3><p>Training, race and gear content edited by an athlete who knows what the viewer should notice.</p></div>
      <div class="svc"><span class="svc-no">03</span><h3>Ads and product motion</h3><p>Product spots with kinetic type, stat callouts and one clear message per beat.</p></div>
      <div class="svc"><span class="svc-no">04</span><h3>Motion graphics and explainers</h3><p>Maps, interface overlays, diagrams and typography that make an idea easier to understand.</p></div>
    </div>
    <p class="svc-extra reveal"><b>Also part of the edit:</b> sound design and mixing, captions, colour, horizontal YouTube edits and turning long videos into shorts.</p>
  </div>
</section>

<section class="section" id="experience">
  <div class="wrap">
    <div class="head-row reveal"><div><span class="eyebrow">Experience</span><h2>Explore the work <span class="serif">by type.</span></h2></div><a class="text-link" href="${link(r, 'work/')}">See all work ${ICON.arrow}</a></div>
    <div class="exp-grid">
      ${exp.map((e) => `<a class="exp reveal" href="${link(r, e.href)}">
        <div class="exp-media"><img src="${e.img}" alt="" loading="lazy" decoding="async"></div>
        <div class="exp-body"><span class="kicker">${e.kicker}</span><h3>${e.title}</h3><p>${e.text}</p><span class="exp-go">${e.n} projects ${ICON.arrow}</span></div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" id="selected">
  <div class="wrap">
    <div class="head-row reveal"><div><span class="eyebrow">Selected work</span><h2>A few edits <span class="serif">to start with.</span></h2></div><a class="text-link" href="${link(r, 'work/')}">Open the full portfolio ${ICON.arrow}</a></div>
    <div class="vgrid">${featured.map((p) => pcard(p, r)).join('\n')}</div>
    <a class="feature reveal" href="${link(r, `work/${hero.slug}/`)}" data-peek data-orient="h" data-video="${media(hero.slug)}video.mp4" data-poster="${media(hero.slug)}poster.webp" data-title="${esc(hero.title)}" data-kicker="${esc(kickerOf(hero))}" data-desc="${esc(hero.summary)}" data-meta="${esc(metaLine(hero))}">
      <div class="pcard-media"><img src="${media(hero.slug)}poster.webp" width="1280" height="720" alt="Frame from ${esc(hero.title)}" loading="lazy" decoding="async"><span class="play-ico">${ICON.play}</span></div>
      <div class="feature-body"><span class="kicker">Educational explainer · motion graphics</span><h3>${esc(hero.title)}</h3><p>${esc(hero.approach)}</p><div class="chips">${hero.techs.slice(0, 3).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div></div>
    </a>
  </div>
</section>

${SHOWREEL ? showreelSection('', true) : ''}
<section class="section" id="sample">
  <div class="wrap">
    <div class="offer reveal">
      <div>
        <span class="eyebrow">Free sample edit</span>
        <h2 style="margin-top:16px">Not sure yet? <span class="serif">Send me a clip.</span></h2>
        <p class="lead" style="margin-top:16px">Send one clip from your own footage and I will edit a short sample, so you can judge my pacing, captions and sound on your content before we talk about a project.</p>
        <div class="btn-row" style="margin-top:24px"><a class="btn btn-primary" href="${link(r, 'contact/#sample')}">Request a sample edit ${ICON.arrow}</a><a class="btn btn-ghost" href="mailto:${EMAIL}?subject=Sample%20edit%20request">Email me directly</a></div>
      </div>
      <div>
        <ol class="offer-steps">
          <li><div><b>Send one clip</b><span>A raw clip or a link to it, plus where it will be posted.</span></div></li>
          <li><div><b>Add a reference (optional)</b><span>A video or account whose style you like.</span></div></li>
          <li><div><b>Get a short sample</b><span>A taste of how I would approach your content.</span></div></li>
        </ol>
        <p class="fineprint" style="margin-top:16px">One short sample per new client. It shows my approach on a section of your footage, not a full edit.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="about">
  <div class="wrap about-teaser">
    ${portrait('')}
    <div class="reveal">
      <span class="eyebrow">About</span>
      <h2 style="margin-top:16px;max-width:14ch">An editor who <span class="serif">also trains.</span></h2>
      <div class="prose" style="margin-top:20px">
        <p>I'm Vesselina, a video editor and motion designer. I'm also a heptathlete, so I know what a coach is trying to show and which moment in the footage actually matters.</p>
        <p>I bring the same approach to every edit: understand the subject, then make it easy to watch.</p>
      </div>
      <a class="text-link" href="${link(r, 'about/')}" style="margin-top:24px">More about me ${ICON.arrow}</a>
    </div>
  </div>
</section>
${contactBand(r)}`;
  write('index.html', layout({ path: '', depth: 0, active: 'home', title: `${NAME} | Video Editor for Creators, Coaches and Brands`,
    desc: 'Video editor and motion designer for short-form, creator content and ads, with a focus on sports and fitness. View work or request a free sample edit.',
    body, scripts: ['assets/js/timeline.js'] }));
}

/* ---------- WORK ---------- */
function work() {
  const r = '../';
  const groupHtml = GROUPS.map((g) => {
    const items = P.filter((p) => p.group === g.id);
    const vs = items.filter((p) => isV(p)), hs = items.filter((p) => !isV(p));
    let content = '';
    if (g.id === 'more') {
      content = carousel([...hs.map((p) => stripProject(p, r)), ...LEGACY.map((l) => legacyCard(l, r))], 'Mixed formats', 'strip');
    } else {
      const tile = vs.length % 4 === 3 && g.link ? `<a class="info-tile" href="${g.link.href}" target="_blank" rel="noopener"><span class="kicker">${g.kicker}</span><b>${g.title}</b><span class="muted">${vs.length} shorts edited for the channel. Watch more of the creator's work on YouTube.</span><span class="text-link">${g.link.label} ${ICON.arrow}</span></a>` : '';
      if (vs.length) content += `<div class="vgrid">${vs.map((p) => pcard(p, r)).join('\n')}${tile}</div>`;
      if (hs.length) content += carousel(hs.map((p) => pcard(p, r)), 'Horizontal edits');
    }
    return `<section class="group" id="${g.id}" aria-labelledby="h-${g.id}">
  <div class="group-head reveal">
    <div><span class="eyebrow">${g.kicker}</span><h2 id="h-${g.id}">${g.title}</h2></div>
    <div><p>${g.text}</p>${g.status || g.link ? `<div class="group-meta">${g.status ? `<span class="status${g.status === 'Current client' ? ' now' : ''}">${g.status}</span>` : ''}${g.link ? `<a class="text-link" href="${g.link.href}" target="_blank" rel="noopener">${g.link.label} ${ICON.arrow}</a>` : ''}</div>` : ''}</div>
  </div>
  ${content}
</section>`;
  }).join('\n');
  const n = (g) => P.filter((p) => p.group === g.id).length + (g.id === 'more' ? LEGACY.length : 0);
  const body = `
<section class="page-head"><div class="wrap">
  <span class="eyebrow">Work</span>
  <h1>Selected edits,<br> <span class="serif nw">sorted by focus.</span></h1>
  <p class="lead">Sports and coaching content first, then creator, ad and earlier work. Hover a project for a quick preview, or open it to watch with sound.</p>
</div></section>
<nav class="jumpbar" aria-label="Work sections"><div class="wrap jumpbar-inner">${GROUPS.map((g) => `<a href="#${g.id}">${g.short} <span class="n">${n(g)}</span></a>`).join('')}</div></nav>
<div class="wrap">${groupHtml}</div>
${viewerDialog}
${contactBand(r)}`;
  write('work/index.html', layout({ path: 'work/', depth: 1, active: 'work', title: `Work | ${NAME}, Video Editor`,
    desc: 'Video editing portfolio: sports, coaching and creator edits, fitness tech reviews for Aesthetic Al, spec ads, motion graphics and earlier work.', body }));
}

/* ---------- PROJECT PAGES ---------- */
function projectPages() {
  const order = GROUPS.flatMap((g) => P.filter((p) => p.group === g.id));
  order.forEach((p, i) => {
    const r = '../../', m = META[p.slug], v = isV(p);
    const prev = order[(i - 1 + order.length) % order.length], next = order[(i + 1) % order.length];
    const group = GROUPS.find((g) => g.id === p.group);
    const rows = [];
    if (p.client) rows.push(['Client', p.client]);
    if (p.spec) rows.push(['Client', 'Self-initiated']);
    if (p.subject) rows.push([p.spec ? 'Brand' : p.personal ? 'Footage' : 'Featuring', p.subject]);
    rows.push(['Format', `${v ? '9:16 vertical' : '16:9 horizontal'} · ${fmtDur(m.dur)}`]);
    rows.push(['Frame rate', fpsLabel(m.fps)]);
    rows.push(['Type', p.type]);
    if (rows.length % 2) rows.push(['Edited by', NAME]);
    const body = `
<div class="wrap">
  <div style="padding-top:24px"><a class="back" href="${link(r, `work/#${p.group}`)}">${ICON.arrow} Back to ${esc(group.title)}</a></div>
  <article class="proj ${v ? 'is-v' : 'is-h'}">
    <div class="player">
      <video controls playsinline preload="metadata" poster="${r}${media(p.slug)}poster.webp" width="${m.w}" height="${m.h}">
        <source src="${r}${media(p.slug)}video.mp4" type="video/mp4">
        Your browser cannot play this video. <a href="${r}${media(p.slug)}video.mp4">Download the MP4</a>.
      </video>
    </div>
    <div class="proj-info">
      <div><span class="eyebrow">${esc(p.spec ? 'Spec ad' : p.personal ? 'Personal project' : group.title)}</span><h1 style="margin-top:14px">${esc(p.title)}</h1><p class="lead" style="margin-top:14px">${esc(p.summary)}</p></div>
      <dl class="meta">${rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
      <div><h2 class="kicker" style="margin-bottom:10px">The approach</h2><p class="muted">${esc(p.approach)}</p></div>
      <div><h2 class="kicker" style="margin-bottom:12px">Techniques in this edit</h2><ul class="techs">${p.techs.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
      ${p.spec ? `<p class="note">Self-initiated spec ad. Not commissioned by ${esc(p.subject)}.</p>` : ''}
      ${p.personal ? '<p class="note">Personal project, edited from my own footage.</p>' : ''}
      <div class="btn-row"><a class="btn btn-primary" href="${link(r, 'contact/#sample')}">Request a sample edit ${ICON.arrow}</a><a class="btn btn-ghost" href="${link(r, 'work/')}">All work</a></div>
    </div>
  </article>
  <nav class="pager" aria-label="More projects"><a href="${link(r, `work/${prev.slug}/`)}"><small>Previous</small><span>${esc(prev.title)}</span></a><a href="${link(r, `work/${next.slug}/`)}"><small>Next</small><span>${esc(next.title)}</span></a></nav>
</div>`;
    write(`work/${p.slug}/index.html`, layout({ path: `work/${p.slug}/`, depth: 2, active: 'work', ogType: 'video.other', ogImage: `${media(p.slug)}poster.webp`,
      title: `${p.title} | ${kickerOf(p)} | ${NAME}`, desc: `${p.summary} Edited by ${NAME}.`, body }));
  });
}

/* ---------- ABOUT ---------- */
function about() {
  const r = '../';
  const body = `
<section class="page-head"><div class="wrap two-col about-head" style="align-items:center">
  ${portrait(r)}
  <div class="reveal">
    <span class="eyebrow">About</span>
    <h1>Editor, motion designer<br> <span class="serif">and heptathlete.</span></h1>
    <div class="prose" style="margin-top:24px">
      <p>I'm <strong>Vesselina Belcheva</strong>, a video editor and motion designer based in Varna, Bulgaria, working remotely with creators, coaches, agencies and brands.</p>
      <p>I edit short-form and creator content, product ads and motion-graphics explainers. My favourite part is the craft that makes a video easy to watch: a hook that earns the next second, captions that read at a glance, graphics that explain and sound that gives every cut weight.</p>
    </div>
    ${xBadge(r)}
  </div>
</div></section>

<section class="section"><div class="wrap two-col">
  <div class="reveal"><span class="eyebrow">Why sports and fitness</span><h2 style="margin-top:16px">I know what the <span class="serif">footage is for.</span></h2></div>
  <div class="prose reveal">
    <p>As a heptathlete I spend a lot of time training and watching how movement looks on camera. When a coach explains a cue, I know which rep shows it. When a runner reviews a watch, I know which stat the viewer cares about.</p>
    <p>That saves rounds of notes and keeps the edit on what the coach or athlete is really saying. Outside sport I work the same way: understand the subject first, then edit so the audience gets it quickly.</p>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head reveal"><span class="eyebrow">How we work together</span><h2>Simple process, <span class="serif">clear communication.</span></h2></div>
  <ol class="steps reveal">
    <li><span class="k">01</span><b>Footage and goal</b><span>You send the raw files, the platform and any references.</span></li>
    <li><span class="k">02</span><b>Story first</b><span>I find the hook and structure, and plan graphics and B-roll.</span></li>
    <li><span class="k">03</span><b>First cut and notes</b><span>You review and send feedback. I keep you updated.</span></li>
    <li><span class="k">04</span><b>Final delivery</b><span>Exported in the formats and ratios you need.</span></li>
  </ol>
</div></section>

${showreelSection(r, false)}
${contactBand(r)}`;
  write('about/index.html', layout({ path: 'about/', depth: 1, active: 'about', title: `About | ${NAME}, Video Editor`,
    desc: 'Vesselina Belcheva is a video editor, motion designer and heptathlete based in Varna, Bulgaria, editing sports, fitness and creator content, ads and explainers.', body }));
}

/* ---------- CONTACT ---------- */
// The sample request form is a Netlify Form: Netlify detects the form="sample-request" markup at
// deploy time and stores each submission (Forms tab) and can email it. site.js submits it with
// fetch so the visitor stays on the page; without JavaScript it posts normally and lands on /contact/thanks/.
function sampleForm() {
  return `<form class="form" id="sample-form" name="sample-request" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="bot-field" novalidate>
      <input type="hidden" name="form-name" value="sample-request">
      <p class="hp" aria-hidden="true"><label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="form-row">
        <div class="field"><label for="f-name">Your name <span class="req" aria-hidden="true">*</span></label><input id="f-name" name="name" autocomplete="name" required maxlength="120"><span class="err" id="e-name"></span></div>
        <div class="field"><label for="f-email">Email <span class="req" aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="200"><span class="err" id="e-email"></span></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="f-channel">Channel or brand</label><input id="f-channel" name="channel" placeholder="@handle or website" maxlength="200"></div>
        <div class="field"><label for="f-platform">Platform and format</label><select id="f-platform" name="platform"><option>Reels / TikTok (9:16)</option><option>YouTube Shorts</option><option>YouTube video (16:9)</option><option>Paid social ad</option><option>Not sure yet</option></select></div>
      </div>
      <div class="field"><label for="f-footage">Link to the clip or footage <span class="req" aria-hidden="true">*</span></label><input id="f-footage" name="footage" type="url" inputmode="url" required placeholder="https://drive.google.com/..." maxlength="500"><small>Google Drive, Dropbox or WeTransfer link. Make sure it can be opened.</small><span class="err" id="e-footage"></span></div>
      <div class="field"><label for="f-ref">Reference you like (optional)</label><input id="f-ref" name="reference" type="url" inputmode="url" placeholder="https://..." maxlength="500"><span class="err" id="e-ref"></span></div>
      <div class="field"><label for="f-notes">Anything I should know?</label><textarea id="f-notes" name="notes" placeholder="Goal of the video, audience, what to avoid..." maxlength="3000"></textarea></div>
      <button class="btn btn-primary" type="submit"><span class="lbl">Send request</span> ${ICON.arrow}</button>
      <p class="fineprint">Fields marked * are required. Your details are only used to reply to your request.</p>
      <div class="form-msg" id="sample-status" role="status" aria-live="polite" tabindex="-1"></div>
    </form>`;
}
function contact() {
  const r = '../';
  const body = `
<section class="page-head contact-page"><div class="wrap contact-grid">
  <div class="contact-col">
    <div class="contact-head">
      <span class="eyebrow">Contact</span>
      <h1>Let's talk about <span class="serif">your next video.</span></h1>
      <p class="lead">Tell me what you're making, where it will be posted and how it should feel. Request a free sample edit with the form, or email me directly.</p>
    </div>
    <div class="panel">
      <span class="kicker">Email</span>
      <a class="email-big" href="mailto:${EMAIL}">${EMAIL}</a>
      <div class="btn-row"><a class="btn btn-primary" href="mailto:${EMAIL}?subject=Video%20editing%20project">Write an email ${ICON.arrow}</a><button class="btn btn-ghost" type="button" data-copy="${EMAIL}" aria-describedby="copy-status">Copy address</button></div>
      <p class="status-line" id="copy-status" aria-live="polite"></p>
    </div>
    <div class="panel">
      <span class="kicker">Social</span>
      <div class="socials">${SOCIAL.map((s) => `<a class="social" href="${s.url}" target="_blank" rel="noopener">${s.avatar ? `<img class="av" src="${r}${s.avatar}" width="32" height="32" alt="" loading="lazy">` : ''}<b>${s.name}</b><span>${esc(s.handle)}</span></a>`).join('')}</div>
    </div>
  </div>
  <div class="panel" id="sample">
    <span class="eyebrow">Free sample edit</span>
    <h2>Request a sample edit</h2>
    <p class="muted">Send one clip and I'll edit a short sample so you can judge my approach on your own footage. One short sample per new client.</p>
    ${sampleForm()}
  </div>
</div></section>`;
  write('contact/index.html', layout({ path: 'contact/', depth: 1, active: 'contact', title: `Contact | ${NAME}, Video Editor`,
    desc: 'Contact Vesselina Belcheva about a video editing project or request a free sample edit of one clip.', body }));
  const thanks = `
<section class="page-head"><div class="wrap">
  <span class="eyebrow">Request sent</span>
  <h1>Thanks, your request <span class="serif">is in.</span></h1>
  <p class="lead">I'll look at your clip and reply by email. If you don't hear back within a few days, please check your spam folder.</p>
  <div class="btn-row" style="margin-top:24px"><a class="btn btn-primary" href="${link(r + '../', 'work/')}">Browse the work ${ICON.arrow}</a><a class="btn btn-ghost" href="${link(r + '../')}">Back to home</a></div>
</div></section>`;
  write('contact/thanks/index.html', layout({ path: 'contact/thanks/', depth: 2, active: 'contact', title: `Request sent | ${NAME}`, desc: 'Your sample edit request was sent.', body: thanks }).replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"'));
}

/* ---------- 404, sitemap, robots ---------- */
function extras() {
  const body = `<section class="wrap nf"><span class="eyebrow">404</span><h1>This page <span class="serif">didn't make the cut.</span></h1><p class="lead">The link may be old or mistyped.</p><div class="btn-row"><a class="btn btn-primary" href="index.html">Go home ${ICON.arrow}</a><a class="btn btn-ghost" href="work/index.html">View work</a></div></section>`;
  let html = layout({ path: '404', depth: 0, active: '', title: `Page not found | ${NAME}`, desc: 'Page not found.', body });
  // served from any URL depth on Netlify, so asset and page paths are root-absolute here
  html = html.replace(/(href|src)="(?!https?:|mailto:|#|\/)([^"]*)"/g, (m, a, v) => `${a}="/${v.replace(/^\.\//, '')}"`);
  write('404.html', html);
  const urls = ['', 'work/', 'about/', 'contact/', ...P.map((p) => `work/${p.slug}/`)];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /_backup/\nDisallow: /veselina-portfolio/\n\nSitemap: ${SITE}/sitemap.xml\n`);
}

home(); work(); projectPages(); about(); contact(); extras();
console.log('Built', 5 + P.length, 'pages');
