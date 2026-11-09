/* Homepage editing workspace (v4).
   A large program monitor plays the real project videos (native frame rates, double-buffered so
   the next clip is ready at each cut). Underneath, a multi-track timeline: hover or drag to scrub,
   click or tap to cut. A cut slices every track at the playhead with a short crisp sound
   (only after a click or tap, and mutable). Boundaries reached during playback flash silently. */
(function () {
  var root = document.querySelector('[data-editor]');
  var dataEl = document.getElementById('timeline-data');
  if (!root || !dataEl) return;
  var seq; try { seq = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var base = root.getAttribute('data-base') || '', media = root.getAttribute('data-media') || '', link = root.getAttribute('data-link') || '';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var small = matchMedia('(max-width: 760px)').matches;
  var TOTAL = seq.total, clips = seq.clips, N = clips.length;

  var q = function (s) { return root.querySelector(s); };
  var area = q('.tl-area'), ruler = q('.tl-ruler'), markers = q('.tl-markers');
  var T = { v3: q('.trk.r-v3'), v2: q('.trk.r-v2'), v1: q('.trk.r-v1'), a1: q('.trk.r-a1'), a2: q('.trk.r-a2'), a3: q('.trk.r-a3') };
  var playhead = q('.playhead'), vids = root.querySelectorAll('.monitor video');
  var titleEl = q('.ws-title'), kindEl = q('.ws-kind'), openEl = q('.ws-open'), muteBtn = q('.ws-mute'), live = q('.tl-live');
  var NS = 'http://www.w3.org/2000/svg';
  var pct = function (t) { return (t / TOTAL * 100) + '%'; };
  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  function bars(values, h, line) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + values.length + ' 100'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < values.length; i++) {
      var hh = Math.max(3, values[i] * h), r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', i + 0.15); r.setAttribute('width', 0.7); r.setAttribute('y', (100 - hh) / 2); r.setAttribute('height', hh); svg.appendChild(r);
    }
    if (line) { var pl = document.createElementNS(NS, 'polyline'); pl.setAttribute('points', line); svg.appendChild(pl); }
    return svg;
  }
  // A clip is an outer window (.clip) over an inner content strip (.ci) that always spans the
  // original clip, so a cut can split the window without stretching thumbnails or waveforms.
  function clip(track, start, dur, ci, fill) {
    var c = el('div', 'clip', track), inner = el('div', 'ci', c);
    c.dataset.os = start; c.dataset.od = dur; c.dataset.ci = ci;
    place(c, start, dur); if (fill) fill(inner, c); return c;
  }
  function place(c, s, d) {
    var os = +c.dataset.os, od = +c.dataset.od;
    c.dataset.s = s; c.dataset.d = d; c.style.left = pct(s); c.style.width = pct(Math.max(0.02, d));
    var inner = c.firstChild; inner.style.width = (od / d * 100) + '%'; inner.style.left = (-(s - os) / d * 100) + '%';
  }

  /* ---- build tracks from real clip data ---- */
  for (var s = 0; s <= Math.floor(TOTAL); s++) {
    var tk = el('i', 'tl-tick' + (s % 5 === 0 ? ' major' : ''), ruler); tk.style.left = pct(s);
  }
  var MK = ['#FF4FAD', '#7CA5FF', '#FFC857', '#5BE3B0'];
  clips.forEach(function (c, i) {
    var m = el('i', 'mk', markers); m.style.left = pct(c.start + 0.1); m.style.setProperty('--c', MK[i % MK.length]);
    c.caps.forEach(function (k) { clip(T.v3, c.start + k[0], k[1] - k[0], i); });
    clip(T.v2, c.start + c.dur * 0.12, c.dur * 0.7, i, function (inner) { el('i', 'kf l', inner); el('i', 'kf r', inner); });
    clip(T.v1, c.start, c.dur, i, function (inner) { inner.dataset.strip = base + 'strip-' + c.id + '.webp'; });
    clip(T.a1, c.start, c.dur, i, function (inner) { inner.appendChild(bars(c.dia, 92)); });
    c.sfx.forEach(function (k) { clip(T.a3, c.start + k[0], Math.max(0.3, k[1]), i); });
  });
  [[0, 3], [3, 6], [6, N]].forEach(function (b) {
    var st = clips[b[0]].start, en = clips[b[1] - 1].start + clips[b[1] - 1].dur, vals = [], dia = [], pts = [];
    for (var k = b[0]; k < b[1]; k++) { vals = vals.concat(clips[k].mus); dia = dia.concat(clips[k].dia); }
    var stepN = Math.max(1, Math.floor(dia.length / 24));
    for (var j = 0; j < dia.length; j += stepN) { var w = 0; for (var z = j; z < Math.min(dia.length, j + stepN); z++) w = Math.max(w, dia[z]); pts.push((j / dia.length * vals.length).toFixed(1) + ',' + (w > 0.45 ? 62 : 26)); }
    clip(T.a2, st, en - st, -1, function (inner) { inner.appendChild(bars(vals, 78, pts.join(' '))); });
  });
  function loadStrips() { root.querySelectorAll('.r-v1 .ci').forEach(function (ci) { if (ci.dataset.strip) ci.style.backgroundImage = 'url("' + ci.dataset.strip + '")'; }); }

  /* ---- cut: slice every track at time t ---- */
  var cuts = 0;
  var flash = q('.mon-flash');
  function sliceFlash(time, soft) {
    var line = el('i', 'slice' + (soft ? ' soft' : ''), area); line.style.left = pct(time);
    setTimeout(function () { line.remove(); }, 760);
  }
  function sparks(time, y) {
    if (reduce) return;
    for (var k = 0; k < 6; k++) {
      var sp = el('i', 'spark', area); sp.style.left = pct(time); sp.style.top = y + 'px';
      sp.style.setProperty('--a', (k < 3 ? -1 : 1) * (40 + k % 3 * 32 + Math.random() * 14) + 'deg');
      setTimeout(function (n) { return function () { n.remove(); }; }(sp), 480);
    }
  }
  function cutAt(time, userAction, y) {
    var did = false;
    root.querySelectorAll('.trk .clip').forEach(function (c) {
      var s0 = +c.dataset.s, d0 = +c.dataset.d;
      if (time - s0 < 0.08 || s0 + d0 - time < 0.08) return;
      var right = c.cloneNode(true); c.parentNode.insertBefore(right, c.nextSibling);
      place(c, s0, time - s0); place(right, time, s0 + d0 - time);
      c.classList.add('cut-l'); right.classList.add('cut-r'); did = true;
      setTimeout(function () { c.classList.remove('cut-l'); right.classList.remove('cut-r'); }, 560);
    });
    if (!did) return false;
    sliceFlash(time); cuts++;
    if (userAction) {
      sparks(time, y == null ? area.clientHeight * 0.45 : y);
      if (flash && !reduce) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
      pop();
    }
    if (live) live.textContent = 'Cut ' + cuts;
    return true;
  }

  /* ---- crisp cut sound (Web Audio, created on the first click or tap) ---- */
  var ac = null, muted = false;
  try { muted = localStorage.getItem('vb-cut-muted') === '1'; } catch (e) {}
  function setMuteUI() { if (!muteBtn) return; muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false'); muteBtn.setAttribute('aria-label', muted ? 'Turn cut sound on' : 'Mute cut sound'); muteBtn.classList.toggle('off', muted); }
  setMuteUI();
  if (muteBtn) muteBtn.addEventListener('click', function (e) { e.stopPropagation(); muted = !muted; setMuteUI(); try { localStorage.setItem('vb-cut-muted', muted ? '1' : '0'); } catch (x) {} });
  function pop() {
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      var t0 = ac.currentTime + 0.045, out = ac.createGain(); out.gain.value = 0.24; out.connect(ac.destination);
      var len = Math.floor(ac.sampleRate * 0.006), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      var n = ac.createBufferSource(); n.buffer = buf; var hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3500;
      var ng = ac.createGain(); ng.gain.value = 0.5; n.connect(hp); hp.connect(ng); ng.connect(out); n.start(t0);
      var o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(880, t0); o.frequency.exponentialRampToValueAtTime(240, t0 + 0.045);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.55, t0 + 0.0015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);
      o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + 0.1);
    } catch (e) {}
  }

  /* ---- video engine ---- */
  var A = vids[0], B = vids[1], active = A, standby = B;
  var t = 0, target = 0, cur = -1, playing = false, userPaused = reduce || saveData, following = false;
  var dragging = false, moved = false, downX = 0, idle = null, visible = true, started = false, width = 1;
  function srcOf(i) { return media + clips[i].slug + (small ? '/video-sm.mp4' : '/video.mp4'); }
  function indexAt(time) { for (var i = 0; i < N; i++) if (time >= clips[i].start && time < clips[i].start + clips[i].dur) return i; return N - 1; }
  function measure() { width = area.getBoundingClientRect().width || 1; }
  measure(); addEventListener('resize', measure);
  function setSrc(v, i) { if (v.dataset.clip === String(i)) return; v.dataset.clip = String(i); v.preload = 'auto'; v.src = srcOf(i); }
  function seek(v, time) { if (v.seeking || v.readyState < 1) { v._pending = time; return; } v._pending = null; try { v.currentTime = time; } catch (e) { v._pending = time; } }
  [A, B].forEach(function (v) { v.muted = true; v.playsInline = true; v.addEventListener('seeked', function () { if (v._pending != null) seek(v, v._pending); }); v.addEventListener('loadedmetadata', function () { if (v._pending != null) seek(v, v._pending); }); });
  function show(v) { if (v === active) return; standby = active; active = v; active.classList.add('on'); standby.classList.remove('on'); standby.pause(); }
  function arm(i) { setSrc(standby, i); seek(standby, clips[i].inp); }
  function goTo(time, play) {
    var i = indexAt(time), c = clips[i];
    if (active.dataset.clip !== String(i)) { if (standby.dataset.clip === String(i)) show(standby); else setSrc(active, i); }
    seek(active, c.inp + (time - c.start)); setClip(i);
    if (play) { var p = active.play(); if (p && p.catch) p.catch(function () { setPlaying(false); }); setTimeout(function () { arm((i + 1) % N); }, 250); }
  }
  function setClip(i) {
    if (i === cur) return;
    root.querySelectorAll('.clip.is-hot').forEach(function (c) { c.classList.remove('is-hot'); });
    cur = i; var c = clips[i];
    root.querySelectorAll('.clip[data-ci="' + i + '"]').forEach(function (e) { e.classList.add('is-hot'); });
    var parts = c.title.split(' · ');
    if (titleEl) titleEl.textContent = parts[0]; if (kindEl) kindEl.textContent = parts[1] || '';
    if (openEl) { openEl.href = link + c.slug + '/index.html'; openEl.setAttribute('aria-label', 'View project: ' + c.title); }
  }
  function setPlaying(p) { playing = p; root.classList.toggle('is-playing', p); if (!p) { A.pause(); B.pause(); } }
  function startPlayback() { if (!visible) return; setPlaying(true); following = false; goTo(t, true); }
  function render() { playhead.style.transform = 'translateX(' + (t / TOTAL * width) + 'px)'; area.setAttribute('aria-valuenow', t.toFixed(1)); area.setAttribute('aria-valuetext', clips[cur > -1 ? cur : 0].title); }
  var last = 0;
  function loop(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
    if (visible) {
      if (dragging) t = target;
      else if (following) t += (target - t) * (reduce ? 1 : Math.min(1, dt * 14));
      else if (playing && cur > -1 && !active.seeking && active.readyState >= 2) {
        var c = clips[cur], vt = active.currentTime;
        if (vt >= c.inp + c.dur - 0.02 || active.ended) {
          var ni = (cur + 1) % N;
          if (standby.dataset.clip === String(ni) && standby.readyState >= 2) { show(standby); var pp = active.play(); if (pp && pp.catch) pp.catch(function () {}); setClip(ni); setTimeout(function () { arm((ni + 1) % N); }, 250); }
          else goTo(clips[ni].start, true);
          t = clips[ni].start; if (ni > 0 && !reduce) sliceFlash(t, true);
        } else t = c.start + Math.max(0, vt - c.inp);
      }
      if (dragging || following) { var i = indexAt(t); if (i !== cur || Math.abs((active.currentTime - clips[i].inp) - (t - clips[i].start)) > 0.04) goTo(t, false); }
      render();
    }
    requestAnimationFrame(loop);
  }

  /* ---- pointer, touch and keyboard ---- */
  function resumeLater() { clearTimeout(idle); idle = setTimeout(function () { following = false; root.classList.remove('is-scrub'); if (!userPaused) startPlayback(); }, 2000); }
  function timeFromEvent(e) { var r = area.getBoundingClientRect(); return Math.max(0, Math.min(TOTAL - 0.01, (e.clientX - r.left) / r.width * TOTAL)); }
  function beginScrub() { if (playing) setPlaying(false); root.classList.add('is-scrub'); clearTimeout(idle); ensureStarted(); }
  area.addEventListener('pointermove', function (e) {
    var time = timeFromEvent(e);
    if (dragging) { target = time; if (Math.abs(e.clientX - downX) > 5) moved = true; return; }
    if (e.pointerType === 'mouse') { beginScrub(); following = true; target = time; }
  });
  area.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !dragging) resumeLater(); });
  area.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    beginScrub(); dragging = true; moved = false; downX = e.clientX; target = t = timeFromEvent(e); goTo(t, false); render();
    if (area.setPointerCapture) { try { area.setPointerCapture(e.pointerId); } catch (x) {} }
  });
  function endDrag(e, cancelled) {
    if (!dragging) return; dragging = false;
    if (!cancelled && !moved) cutAt(timeFromEvent(e), true, e.clientY - area.getBoundingClientRect().top);
    if (e.pointerType === 'mouse') { following = true; target = t; } else { following = false; resumeLater(); }
  }
  area.addEventListener('pointerup', function (e) { endDrag(e, false); });
  area.addEventListener('pointercancel', function (e) { endDrag(e, true); });
  area.addEventListener('keydown', function (e) {
    var k = e.key, step = e.shiftKey ? 1 : 1 / 6, nav = true;
    if (k === 'ArrowRight') t = Math.min(TOTAL - 0.01, t + step); else if (k === 'ArrowLeft') t = Math.max(0, t - step);
    else if (k === 'Home') t = 0; else if (k === 'End') t = TOTAL - 0.01; else nav = false;
    if (nav) { e.preventDefault(); ensureStarted(); userPaused = true; setPlaying(false); following = false; goTo(t, false); render(); return; }
    if (k === 'Enter' || k === 'c' || k === 'C') { e.preventDefault(); cutAt(t, true); }
    else if (k === ' ') { e.preventDefault(); ensureStarted(); if (playing) { userPaused = true; setPlaying(false); } else { userPaused = false; startPlayback(); } }
  });
  function ensureStarted() { if (started) return; started = true; setSrc(A, 0); seek(A, clips[0].inp); A.classList.add('on'); setClip(0); }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (!visible && playing) { setPlaying(false); root.dataset.resume = '1'; }
    else if (visible && root.dataset.resume === '1') { root.dataset.resume = ''; if (!userPaused) startPlayback(); }
  }, { threshold: 0.15 }).observe(root);
  document.addEventListener('visibilitychange', function () { last = 0; if (document.hidden && playing) { setPlaying(false); root.dataset.resume = '1'; } else if (!document.hidden && root.dataset.resume === '1') { root.dataset.resume = ''; if (!userPaused) startPlayback(); } });
  function boot() { loadStrips(); ensureStarted(); if (!userPaused) startPlayback(); else render(); }
  setClip(0); render();
  if (document.readyState === 'complete') setTimeout(boot, 120); else addEventListener('load', function () { setTimeout(boot, 120); });
  requestAnimationFrame(loop);
})();
