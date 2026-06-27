/* ============================================================
   Ruijie Ma — Portfolio interactions (v2)
   Vanilla JS, no dependencies. Progressive enhancement.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.getElementById('nav');

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var menu = document.getElementById('menu');
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('nav-open');
    if (menuToggle) { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu'); }
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
  if (menu) { menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); }); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', function (e) {
    if (nav && nav.classList.contains('nav-open') && !e.target.closest('.nav-inner')) closeMenu();
  });

  /* ---------- Nav shadow on scroll ---------- */
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll-spy ---------- */
  var linkFor = {};
  Array.prototype.forEach.call(document.querySelectorAll('.menu a'), function (a) {
    var id = a.getAttribute('href');
    if (id && id.charAt(0) === '#') linkFor[id.slice(1)] = a;
  });
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Array.prototype.forEach.call(document.querySelectorAll('.menu a.active'), function (a) { a.classList.remove('active'); });
        if (linkFor[entry.target.id]) linkFor[entry.target.id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReduced) {
    var targets = document.querySelectorAll('.sec-head, .sec-sub, .about-portrait, .about-body, .work, .journey, .tl-item, .skill-col, .resume-band, .contact-row');
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ============================================================
     Journey map
     ============================================================ */
  var CITIES = [
    {
      id: 'shanghai', lon: 121.47, lat: 31.23, order: 0,
      label: 'Shanghai', title: 'Shanghai, China',
      meta: 'Shanghai Pacific Securities (2023) · JLL (2024)',
      body: 'My hometown — and where I first learned to turn messy inputs into something a team can act on. Macro research taught me to read data in context; valuation and due diligence at JLL taught me to make it traceable. The data dictionary and QA tracker I built there are habits I still keep.',
      linkText: 'See the JLL role', linkHref: '#tl-jll'
    },
    {
      id: 'madison', lon: -89.40, lat: 43.07, order: 1,
      label: 'Madison', title: 'Madison, Wisconsin',
      meta: 'University of Wisconsin–Madison · B.A. Economics',
      body: 'Economics gave me a way to reason about incentives, trade-offs, and evidence — the backbone of how I frame any analysis. Leading a student organization taught me the other half: set the structure, assign owners, keep cadence, and ship.',
      linkText: 'More about me', linkHref: '#about'
    },
    {
      id: 'nyc', lon: -74.01, lat: 40.71, order: 2, dx: -12, dy: -16,
      label: 'New York', title: 'New York, USA',
      meta: 'World Salon · Research Intern (2025)',
      body: 'New York raised my bar on execution. In a fast, cross-industry environment I built Python crawler pipelines that standardized 200+ executive profiles a week — and learned to make outputs others could use right away, not just technically correct.',
      linkText: 'See the World Salon role', linkHref: '#tl-worldsalon'
    },
    {
      id: 'dc', lon: -77.04, lat: 38.91, order: 3, dx: 16, dy: 22,
      label: 'Washington, DC', title: 'Washington, DC',
      meta: 'Johns Hopkins Carey · M.S. Business Analytics & AI',
      body: 'Where I’m adding the AI layer now. For me, AI/ML isn’t a label — it’s a toolbox that makes analysis more systematic and trustworthy. It’s also where my flagship data-quality and agentic-AI projects came together.',
      linkText: 'See selected work', linkHref: '#work'
    }
  ];

  function project(c) {
    return {
      x: ((c.lon + 180) / 360) * 1000 + (c.dx || 0),
      y: ((90 - c.lat) / 180) * 520 + (c.dy || 0)
    };
  }

  var pinsEl = document.getElementById('pins');
  var routesEl = document.querySelector('.map-routes');
  var elTitle = document.getElementById('storyTitle');
  var elMeta = document.getElementById('storyMeta');
  var elBody = document.getElementById('storyBody');
  var elKicker = document.getElementById('storyKicker');
  var elLink = document.getElementById('storyLink');

  function selectCity(id) {
    var c = CITIES.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    if (elTitle) elTitle.textContent = c.title;
    if (elMeta) elMeta.textContent = c.meta;
    if (elBody) elBody.textContent = c.body;
    if (elKicker) elKicker.textContent = 'The journey · 0' + (c.order + 1);
    if (elLink) {
      elLink.innerHTML = c.linkText + ' <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>';
      elLink.setAttribute('href', c.linkHref);
    }
    Array.prototype.forEach.call(pinsEl ? pinsEl.querySelectorAll('.pin') : [], function (p) {
      p.classList.toggle('active', p.getAttribute('data-id') === id);
      p.setAttribute('aria-pressed', String(p.getAttribute('data-id') === id));
    });
  }

  function buildMap() {
    if (!pinsEl) return;
    pinsEl.innerHTML = '';

    // Pins
    CITIES.forEach(function (c) {
      var p = project(c);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pin';
      btn.setAttribute('data-id', c.id);
      btn.setAttribute('aria-label', c.title);
      btn.style.left = (p.x / 1000 * 100) + '%';
      btn.style.top = (p.y / 520 * 100) + '%';
      btn.addEventListener('click', function () { selectCity(c.id); });

      var label = document.createElement('span');
      label.className = 'pin-label';
      label.textContent = c.label;
      label.style.left = (p.x / 1000 * 100) + '%';
      label.style.top = (p.y / 520 * 100) + '%';

      pinsEl.appendChild(btn);
      pinsEl.appendChild(label);
    });

    // Route arcs between consecutive stops (narrative order)
    if (routesEl) {
      routesEl.innerHTML = '';
      var ordered = CITIES.slice().sort(function (a, b) { return a.order - b.order; });
      for (var i = 0; i < ordered.length - 1; i++) {
        var a = project(ordered[i]); var b = project(ordered[i + 1]);
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        var len = Math.hypot(b.x - a.x, b.y - a.y);
        var cy = my - len * 0.16; // bow upward
        var d = 'M ' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
                ' Q ' + mx.toFixed(1) + ' ' + cy.toFixed(1) +
                ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        routesEl.appendChild(path);
      }
    }

    selectCity('dc'); // default to "now"
  }
  buildMap();

  /* ---------- Story link → scroll + flash the timeline item ---------- */
  if (elLink) {
    elLink.addEventListener('click', function () {
      var href = elLink.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      var target = document.getElementById(href.slice(1));
      if (target && target.classList.contains('tl-item')) {
        setTimeout(function () {
          target.classList.add('flash');
          setTimeout(function () { target.classList.remove('flash'); }, 1400);
        }, 500);
      }
    });
  }
})();
