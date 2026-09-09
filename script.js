(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  /* Active nav link on scroll */
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.nav-links a');
  function setActive() {
    var current = '';
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top < 130) current = sec.id;
    });
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* Count-up hero stats */
  var statEls = document.querySelectorAll('.stat-num[data-count]');
  var statsDone = false;
  var statIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !statsDone) {
        statsDone = true;
        statEls.forEach(function (el) {
          var target = parseFloat(el.getAttribute('data-count'));
          var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var dur = reduceMotion ? 0 : 1000;
          var start = null;
          function step(ts) {
            if (start === null) start = ts;
            var progress = dur === 0 ? 1 : Math.min((ts - start) / dur, 1);
            el.textContent = (target * progress).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals) + suffix;
          }
          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.4 });
  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) statIo.observe(heroStats);

  document.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
