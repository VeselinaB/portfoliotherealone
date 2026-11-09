(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverable = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Links are written with an explicit index.html so they work everywhere
     (file://, any local server, Netlify). On a real web server show the clean URL instead. */
  if (/^https?:$/.test(location.protocol)) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!/^(https?:|mailto:|#)/.test(h) && /(^|\/)index\.html(#.*)?$/.test(h)) a.setAttribute('href', h.replace(/index\.html(?=#|$)/, '') || './');
    });
    if (/\/index\.html$/.test(location.pathname)) history.replaceState(null, '', location.pathname.replace(/index\.html$/, '') + location.search + location.hash);
  }

  /* mobile menu */
  var btn = document.querySelector('.menu-btn'), menu = document.getElementById('mobile-nav');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true'); menu.classList.toggle('open', !open);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
  }

  /* reveal on scroll */
  var rev = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('in'); });

  /* work page: highlight the section in view */
  var jump = document.querySelectorAll('.jumpbar a');
  if (jump.length && 'IntersectionObserver' in window) {
    var groups = document.querySelectorAll('.group');
    var gio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) jump.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href').split('#')[1] === e.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    groups.forEach(function (g) { gio.observe(g); });
  }

  /* horizontal carousels: buttons, drag with mouse, native swipe and trackpad */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.car-track'), prev = car.querySelector('.car-btn.prev'), next = car.querySelector('.car-btn.next');
    function stepSize() { var c = track.children[0]; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : 300; }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2; if (next) next.disabled = track.scrollLeft >= max;
      car.classList.toggle('no-scroll', max <= 0);
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -stepSize(), behavior: reduce ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: stepSize(), behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; track.classList.add('dragging'); } if (moved) track.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!down) return; down = false; setTimeout(function () { track.classList.remove('dragging'); }, 0); });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); next && next.click(); } if (e.key === 'ArrowLeft') { e.preventDefault(); prev && prev.click(); } });
  });

  /* ---------- project peek: hover (desktop) or tap (touch) expands a card into a larger preview ---------- */
  var cards = document.querySelectorAll('[data-peek]');
  if (cards.length) {
    var peek = document.createElement('div'); peek.className = 'peek'; peek.setAttribute('role', 'dialog'); peek.setAttribute('aria-label', 'Project preview');
    peek.innerHTML = '<div class="peek-media"><img alt=""><video muted playsinline loop preload="none"></video>' +
      '<button class="ctrl snd" type="button" aria-pressed="false"><span class="lbl">Sound off</span></button></div>' +
      '<div class="peek-info"><div class="peek-text"><span class="kicker"></span><h3></h3><p class="desc"></p><span class="meta-line"></span></div>' +
      '<div class="peek-actions"><a class="btn btn-primary btn-sm" href="#">View project <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a></div></div>' +
      '<button class="peek-close" type="button" aria-label="Close preview"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>';
    var backdrop = document.createElement('div'); backdrop.className = 'peek-backdrop';
    document.body.appendChild(backdrop); document.body.appendChild(peek);
    var pImg = peek.querySelector('img'), pVid = peek.querySelector('video'), pMedia = peek.querySelector('.peek-media');
    var pK = peek.querySelector('.kicker'), pH = peek.querySelector('h3'), pD = peek.querySelector('.desc'), pM = peek.querySelector('.meta-line'), pA = peek.querySelector('.peek-actions a'), pS = peek.querySelector('.snd');
    var openCard = null, timer = null, closeTimer = null, touchMode = false, soundOn = false;

    function layout(card, touch) {
      var r = card.getBoundingClientRect(), vw = innerWidth, vh = innerHeight, m = 16, v = card.dataset.orient === 'v';
      var W, H, mw, mh;
      if (v) {
        mh = Math.min(vh - 2 * m - (touch ? 0 : 0), touch ? vh * 0.62 : 620); mw = mh * 9 / 16;
        var info = touch && vw < 640 ? 0 : 250;
        if (touch && vw < 640) { mh = Math.min(vh * 0.5, (vw - 2 * m) * 16 / 9); mw = mh * 9 / 16; }
        W = info ? mw + info : Math.min(vw - 2 * m, Math.max(mw, 300)); H = mh + (info ? 0 : 230);
        peek.classList.toggle('stack', !info);
      } else {
        mw = Math.min(vw - 2 * m, touch ? 760 : Math.max(r.width * 1.6, 780)); mh = mw * 9 / 16; if (mh > vh - 2 * m - 130) { mh = vh - 2 * m - 130; mw = mh * 16 / 9; } W = mw; H = mh + 120;
      }
      pMedia.style.width = mw + 'px'; pMedia.style.height = mh + 'px'; peek.style.width = W + 'px';
      var x, y;
      if (touch) { x = (vw - W) / 2; y = Math.max(m, (vh - Math.min(H, vh - 2 * m)) / 2); }
      else { x = r.left + r.width / 2 - W / 2; y = r.top + r.height / 2 - H / 2; x = Math.max(m, Math.min(vw - W - m, x)); y = Math.max(m + 64, Math.min(vh - H - m, y)); }
      return { x: x, y: y, W: W, r: r };
    }
    function fill(card) {
      var d = card.dataset;
      peek.className = 'peek ' + (d.orient === 'v' ? 'v' : 'h') + (touchMode ? ' touch' : '');
      pImg.src = d.poster; pK.textContent = d.kicker; pH.textContent = d.title; pD.textContent = d.desc; pM.textContent = d.meta; pA.href = card.getAttribute('href');
      pVid.classList.remove('ready'); pVid.muted = !soundOn;
      if (pVid.getAttribute('src') !== d.video) { pVid.setAttribute('src', d.video); }
      pVid.currentTime = 0;
      pVid.oncanplay = function () { pVid.classList.add('ready'); };
      var p = pVid.play(); if (p && p.catch) p.catch(function () {});
    }
    function open(card, touch) {
      clearTimeout(closeTimer);
      if (openCard === card) return;
      touchMode = !!touch; openCard = card; fill(card);
      peek.classList.add('open'); backdrop.classList.toggle('open', touchMode);
      var L = layout(card, touchMode);
      peek.style.left = L.x + 'px'; peek.style.top = L.y + 'px';
      if (reduce) { peek.style.transition = 'none'; peek.style.transform = 'none'; peek.style.opacity = '1'; }
      else {
        var sx = L.r.width / L.W, from = 'translate(' + (L.r.left - L.x) + 'px,' + (L.r.top - L.y) + 'px) scale(' + sx + ')';
        peek.style.transition = 'none'; peek.style.transform = from; peek.style.opacity = '0.4';
        peek.getBoundingClientRect();
        peek.style.transition = 'transform .38s cubic-bezier(.2,.7,.2,1), opacity .25s ease'; peek.style.transform = 'none'; peek.style.opacity = '1';
      }
      if (touchMode) setTimeout(function () { peek.querySelector('.peek-close').focus({ preventScroll: true }); }, 50);
    }
    function close(immediate) {
      if (!openCard) return;
      var card = openCard; openCard = null; clearTimeout(timer);
      pVid.pause(); backdrop.classList.remove('open');
      if (reduce || immediate) { peek.classList.remove('open'); return; }
      var r = card.getBoundingClientRect(), pr = peek.getBoundingClientRect();
      peek.style.transform = 'translate(' + (r.left - pr.left) + 'px,' + (r.top - pr.top) + 'px) scale(' + (r.width / pr.width) + ')'; peek.style.opacity = '0';
      closeTimer = setTimeout(function () { if (!openCard) peek.classList.remove('open'); }, 300);
    }
    cards.forEach(function (card) {
      if (hoverable) {
        card.addEventListener('mouseenter', function () { clearTimeout(timer); timer = setTimeout(function () { open(card, false); }, 260); });
        card.addEventListener('mouseleave', function (e) { clearTimeout(timer); if (openCard === card && !peek.contains(e.relatedTarget)) close(); });
      } else {
        card.addEventListener('click', function (e) { if (openCard !== card) { e.preventDefault(); open(card, true); } });
      }
    });
    peek.addEventListener('mouseleave', function (e) { if (!touchMode && !(openCard && openCard.contains(e.relatedTarget))) close(); });
    peek.querySelector('.peek-close').addEventListener('click', function () { close(); });
    backdrop.addEventListener('click', function () { close(); });
    pMedia.addEventListener('click', function (e) { if (e.target.closest('.snd')) return; if (openCard) location.href = pA.href; });
    pS.addEventListener('click', function () { soundOn = !soundOn; pVid.muted = !soundOn; pS.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); pS.querySelector('.lbl').textContent = soundOn ? 'Sound on' : 'Sound off'; });
    addEventListener('scroll', function () { if (openCard && !touchMode) close(true); }, { passive: true });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* viewer dialog for earlier work */
  var dlg = document.getElementById('viewer');
  if (dlg && typeof dlg.showModal === 'function') {
    var holder = dlg.querySelector('[data-holder]'), cap = dlg.querySelector('[data-caption]');
    document.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        holder.innerHTML = '';
        var src = b.getAttribute('data-view');
        if (/\.(mp4|webm)$/i.test(src)) {
          var v = document.createElement('video'); v.controls = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'metadata';
          if (b.dataset.poster) v.poster = b.dataset.poster; v.src = src; holder.appendChild(v); dlg.showModal();
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else { var img = document.createElement('img'); img.src = src; img.alt = b.dataset.alt || ''; holder.appendChild(img); dlg.showModal(); }
        cap.textContent = b.dataset.caption || '';
      });
    });
    dlg.addEventListener('close', function () { var v = holder.querySelector('video'); if (v) v.pause(); holder.innerHTML = ''; });
    dlg.querySelector('.viewer-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* copy email */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy'), out = document.getElementById(b.getAttribute('aria-describedby'));
      function done(ok) { if (out) out.textContent = ok ? 'Email address copied.' : 'Copy failed. The address is ' + text; }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (x) {} ta.remove(); done(ok); }
    });
  });

  /* sample request: Netlify Forms submission with validation, success and error states */
  var form = document.getElementById('sample-form');
  if (form) {
    var msg = document.getElementById('sample-status'), btnS = form.querySelector('button[type="submit"]'), lbl = btnS.querySelector('.lbl');
    var rules = {
      name: function (v) { return v.trim() ? '' : 'Please add your name.'; },
      email: function (v) { return !v.trim() ? 'Please add your email so I can reply.' : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email address looks incomplete.'); },
      footage: function (v) { return !v.trim() ? 'Please add a link to the clip.' : (/^https?:\/\/\S+\.\S+/.test(v.trim()) ? '' : 'Please paste a full link starting with https://'); },
      reference: function (v) { return !v.trim() || /^https?:\/\/\S+\.\S+/.test(v.trim()) ? '' : 'Please paste a full link starting with https://'; }
    };
    var errId = { name: 'e-name', email: 'e-email', footage: 'e-footage', reference: 'e-ref' };
    function check(field) {
      var f = form.elements[field], e = document.getElementById(errId[field]), m = rules[field](f.value);
      f.setAttribute('aria-invalid', m ? 'true' : 'false'); if (m) f.setAttribute('aria-describedby', errId[field]); else f.removeAttribute('aria-describedby');
      if (e) e.textContent = m; return !m;
    }
    Object.keys(rules).forEach(function (k) { var f = form.elements[k]; f.addEventListener('blur', function () { if (f.value) check(k); }); f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(k); }); });
    function show(kind, html) { msg.className = 'form-msg ' + kind; msg.innerHTML = html; msg.focus({ preventScroll: true }); msg.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      Object.keys(rules).forEach(function (k) { if (!check(k)) { ok = false; first = first || form.elements[k]; } });
      if (!ok) { show('error', 'Please check the highlighted fields.'); first.focus(); return; }
      var body = new URLSearchParams(new FormData(form)).toString();
      btnS.disabled = true; lbl.textContent = 'Sending...'; msg.className = 'form-msg'; msg.textContent = '';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); })
        .then(function () {
          form.reset(); form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
          show('success', '<b>Thanks, your request is in.</b> I’ll look at your clip and reply by email.');
        })
        .catch(function () {
          show('error', '<b>Your request could not be sent.</b> Please try again in a moment, or use the email address on this page.');
        })
        .then(function () { btnS.disabled = false; lbl.textContent = 'Send request'; });
    });
  }
})();
