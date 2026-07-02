/* Gut Steinbach — Motion & Interaktion
   Vanilla JS, keine Abhängigkeiten. Respektiert prefers-reduced-motion. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var docEl = document.documentElement;
  docEl.classList.add('js');

  /* ---------- Header: transparent → solid, hide on scroll down ---------- */
  var header = document.querySelector('.site-header');
  var lastY = 0;
  var heroEl = document.querySelector('.hero, .page-hero');

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      var threshold = heroEl ? Math.max(80, heroEl.offsetHeight - 120) : 80;
      header.classList.toggle('is-solid', y > threshold);
      if (y > threshold && y > lastY + 4 && !header.classList.contains('is-menu-open')) {
        header.classList.add('is-hidden');
      } else if (y < lastY - 4 || y <= threshold) {
        header.classList.remove('is-hidden');
      }
    }
    var pill = document.querySelector('.book-pill');
    if (pill) pill.classList.toggle('is-visible', y > window.innerHeight * 0.7);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Vollbild-Menü ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (menuBtn && menu) {
    var focusables = 'a[href], button:not([disabled])';
    function setMenu(open) {
      menu.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      header.classList.toggle('is-menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      menuBtn.querySelector('.menu-btn__label').textContent = open ? 'Schließen' : 'Menü';
      if (open) {
        var links = menu.querySelectorAll('.menu__link');
        links.forEach(function (l, i) { l.style.transitionDelay = (0.08 + i * 0.05) + 's'; });
        (menu.querySelector(focusables) || menu).focus({ preventScroll: true });
      } else {
        menuBtn.focus({ preventScroll: true });
      }
    }
    menuBtn.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
      if (e.key === 'Tab' && menu.classList.contains('is-open')) {
        var f = menu.querySelectorAll(focusables);
        var first = menuBtn, last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

  document.querySelectorAll('[data-reveal], .lines, .frame').forEach(function (el) {
    io.observe(el);
  });

  /* Stagger-Gruppen: Kinder bekommen automatisch Verzögerung */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseFloat(group.getAttribute('data-stagger')) || 0.09;
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--d', (i * step) + 's');
    });
  });

  /* Kapitel-Labels + Überschriften: automatisch beim Scrollen einblenden */
  document.querySelectorAll('.chapter').forEach(function (el) { io.observe(el); });
  document.querySelectorAll('.section h2, .split__body h2, .ratio-mark, .voice blockquote')
    .forEach(function (el) {
      if (el.closest('[data-reveal]') || el.classList.contains('lines')) return;
      el.classList.add('rise');
      io.observe(el);
    });

  /* Wichtige Preise/Zahlen hervorheben (Unterstrich läuft ein) */
  document.querySelectorAll('.stay-card__price strong, .offer__terms b')
    .forEach(function (el) { el.classList.add('emph-underline'); io.observe(el); });

  /* Scroll-Fortschrittsbalken */
  if (!reduceMotion) {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    var barTick = false;
    function updateProgress() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      barTick = false;
    }
    window.addEventListener('scroll', function () {
      if (!barTick) { requestAnimationFrame(updateProgress); barTick = true; }
    }, { passive: true });
    updateProgress();
  }

  /* Magnetische Buttons (nur Maus, nicht Touch) */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.18;
        var my = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.classList.add('is-magnetic');
        btn.style.setProperty('--mx', mx.toFixed(1) + 'px');
        btn.style.setProperty('--my', my.toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
        setTimeout(function () { btn.classList.remove('is-magnetic'); }, 250);
      });
    });
  }

  /* ---------- Wort-für-Wort-Aufhellung (Manifest) ---------- */
  document.querySelectorAll('.words').forEach(function (el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (!node.textContent.trim()) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (/^\s+$/.test(part) || part === '') {
          frag.appendChild(document.createTextNode(part));
        } else {
          var s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.appendChild(s);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });

    var wordEls = el.querySelectorAll('.w');
    if (reduceMotion) {
      wordEls.forEach(function (w) { w.classList.add('is-lit'); });
      return;
    }
    function update() {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.85;
      var end = vh * 0.35;
      var progress = (start - rect.top) / (rect.height + (start - end));
      progress = Math.max(0, Math.min(1, progress));
      var lit = Math.floor(progress * wordEls.length * 1.15);
      wordEls.forEach(function (w, i) { w.classList.toggle('is-lit', i < lit); });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  });

  /* ---------- Parallax ---------- */
  if (!reduceMotion) {
    var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var ticking = false;
    function parallax() {
      pEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var rect = el.getBoundingClientRect();
        var vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) return;
        var center = rect.top + rect.height / 2 - vh / 2;
        el.style.transform = 'translate3d(0,' + (center * -speed).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------- Zahlen-Counter ---------- */
  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counterIO.unobserve(el);
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1800;
      if (reduceMotion) { el.textContent = target.toLocaleString('de-DE') + suffix; return; }
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - p, 4);
        var val = Math.round(target * eased);
        el.textContent = val.toLocaleString('de-DE') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) {
    el.textContent = '0';
    counterIO.observe(el);
  });

  /* ---------- Horizontaler Scroller (Chalets) ---------- */
  document.querySelectorAll('.hscroll').forEach(function (scroller) {
    var bar = scroller.parentElement.querySelector('.hscroll-progress i');
    function updateBar() {
      if (!bar) return;
      var max = scroller.scrollWidth - scroller.clientWidth;
      var p = max > 0 ? scroller.scrollLeft / max : 0;
      bar.style.transform = 'scaleX(' + (0.15 + p * 0.85) + ')';
    }
    scroller.addEventListener('scroll', updateBar, { passive: true });
    updateBar();

    /* Drag-to-scroll auf Desktop */
    var isDown = false, startX = 0, scrollStart = 0, moved = false;
    scroller.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      isDown = true; moved = false;
      startX = e.clientX; scrollStart = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      scroller.scrollLeft = scrollStart - dx;
    });
    window.addEventListener('pointerup', function () {
      isDown = false;
      scroller.classList.remove('is-dragging');
    });
    scroller.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); moved = false; }
    }, true);
  });

  /* ---------- Hero-Video: Autoplay mit sauberem Poster-Fallback ---------- */
  var heroVideo = document.querySelector('.hero__media video');
  if (heroVideo) {
    // iOS/Autoplay-Anforderungen hart setzen
    heroVideo.muted = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.playsInline = true;

    // Standbild bleibt sichtbar, bis das Video wirklich Bilder liefert.
    // 'timeupdate' feuert nur während echter Wiedergabe -> zuverlässigstes Signal.
    var revealVideo = function () { heroVideo.classList.add('is-playing'); };
    heroVideo.addEventListener('playing', revealVideo);
    heroVideo.addEventListener('timeupdate', function () {
      if (heroVideo.currentTime > 0.08) revealVideo();
    });

    if (reduceMotion) {
      heroVideo.removeAttribute('autoplay');
    } else {
      var tryPlay = function () {
        var pr = heroVideo.play();
        if (pr && typeof pr.then === 'function') { pr.catch(function () {}); }
      };
      var vIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { tryPlay(); }
          else if (!heroVideo.paused) { heroVideo.pause(); }
        });
      }, { threshold: 0.1 });
      vIO.observe(heroVideo);
    }
  }

  /* ---------- Buchungsleiste → OnePageBooking Deeplink ---------- */
  var bookForm = document.getElementById('bookform');
  if (bookForm) {
    var arrivalInput = bookForm.querySelector('[name="arrival"]');
    var departureInput = bookForm.querySelector('[name="departure"]');
    if (arrivalInput) {
      var today = new Date();
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
      arrivalInput.min = iso(today);
      if (departureInput) departureInput.min = iso(today);
      arrivalInput.addEventListener('change', function () {
        if (!departureInput) return;
        departureInput.min = arrivalInput.value;
        if (departureInput.value && departureInput.value <= arrivalInput.value) {
          var d = new Date(arrivalInput.value);
          d.setDate(d.getDate() + 1);
          departureInput.value = iso(d);
        }
      });
    }
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var params = new URLSearchParams({ lang: 'de' });
      var arrival = bookForm.querySelector('[name="arrival"]');
      var departure = bookForm.querySelector('[name="departure"]');
      var adults = bookForm.querySelector('[name="adults"]');
      if (arrival && arrival.value) params.set('arrival', arrival.value);
      if (departure && departure.value) params.set('departure', departure.value);
      if (adults && adults.value) params.set('adults', adults.value);
      window.open('https://onepagebooking.com/gut-steinbach?' + params.toString(), '_blank', 'noopener');
    });
  }

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
