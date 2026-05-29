/* ============================================================
   CARREIRA FRONT-END — script.js
   Premium Dark Mode com Animações Avançadas
   Vanilla JS ES6+ | Intersection Observer | Smooth Scrolling
============================================================ */

'use strict';

/* ============================================================
   1. STICKY HEADER — glassmorphism ao rolar
============================================================ */
(function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const SCROLL_THRESHOLD = 50;

  const onScroll = () => {
    requestAnimationFrame(() => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Verifica estado inicial
  onScroll();
})();

/* ============================================================
   2. HAMBURGER MENU — mobile navigation
============================================================ */
(function initHamburgerMenu() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');

  if (!btn || !nav) return;

  const openMenu = () => {
    btn.classList.add('open');
    nav.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu de navegação');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    btn.classList.remove('open');
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu de navegação');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Close on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      btn.focus();
    }
  });
})();

/* ============================================================
   3. ACTIVE NAV LINK — Intersection Observer
============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => observer.observe(section));
})();

/* ============================================================
   4. SCROLL REVEAL — Fade In Up com stagger
============================================================ */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal--right');
  if (!revealElements.length) return;

  // Respeita prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        // Remove will-change após animação
        const cleanUp = () => {
          el.style.willChange = 'auto';
        };

        el.style.willChange = 'opacity, transform';

        setTimeout(() => {
          el.classList.add('is-visible');

          // Clean up após transição
          const duration = 800; // ms
          setTimeout(cleanUp, duration);
        }, delay);

        revealObserver.unobserve(el);
      });
    },
    {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));
})();

/* ============================================================
   5. ACCORDIONS — Tendências
============================================================ */
(function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  const closeAccordion = (item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!trigger || !content) return;

    trigger.setAttribute('aria-expanded', 'false');
    item.classList.remove('is-open');
    content.style.maxHeight = '0';
  };

  const openAccordion = (item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!trigger || !content) return;

    trigger.setAttribute('aria-expanded', 'true');
    item.classList.add('is-open');
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all others
      accordionItems.forEach(other => {
        if (other !== item) closeAccordion(other);
      });

      isOpen ? closeAccordion(item) : openAccordion(item);
    });

    // Keyboard support
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
})();

/* ============================================================
   6. SMOOTH SCROLL — navegacao suave
============================================================ */
(function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72',
        10
      );

      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });

      // Update URL without jumping
      history.pushState(null, '', href);
    });
  });
})();

/* ============================================================
   7. PARALLAX ORBS — movimento sutil dos orbs hero
============================================================ */
(function initParallaxOrbs() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const orbs = document.querySelectorAll('.hero-glow');
  if (!orbs.length) return;

  let ticking = false;

  const updateOrbPositions = () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

    if (scrollY > heroHeight) {
      ticking = false;
      return;
    }

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 0.05;
      const yOffset = scrollY * speed;
      orb.style.transform = `translateY(${yOffset}px)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateOrbPositions);
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   8. BUTTON RIPPLE EFFECT — on click
============================================================ */
(function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn-primary');

  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple-expand 0.6s ease-out forwards;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation to CSS dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-expand {
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   9. TILT CARDS — efeito 3D sutil (desktop only)
============================================================ */
(function initTiltEffect() {
  const isMobile = () => window.innerWidth <= 768;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll('.triade-card');

  cards.forEach(card => {
    const handleMove = (e) => {
      if (isMobile()) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
        scale(1.02)
      `;
    };

    const handleLeave = () => {
      card.style.transform = '';
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
  });
})();

/* ============================================================
   10. SCROLL HINT — hide after scroll
============================================================ */
(function initScrollHint() {
  const hint = document.querySelector('.scroll-hint');
  if (!hint) return;

  let isVisible = true;

  const updateVisibility = () => {
    const shouldHide = window.scrollY > 150;

    if (shouldHide && isVisible) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
      isVisible = false;
    } else if (!shouldHide && !isVisible) {
      hint.style.opacity = '0.6';
      hint.style.pointerEvents = 'all';
      isVisible = true;
    }
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
})();

/* ============================================================
   11. TYPEWRITER + FLOAT — Hero code card animation
============================================================== */
(function initTypewriter() {
  const codeOutput = document.getElementById('codeOutput');
  const codeCard = document.getElementById('codeCard');
  const segmentsEl = document.getElementById('codeSegments');

  if (!codeOutput || !codeCard || !segmentsEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let segments;
  try {
    segments = JSON.parse(segmentsEl.textContent.trim());
  } catch (e) {
    return;
  }

  if (prefersReducedMotion) {
    // Show full code immediately and start float
    renderAllSegments();
    startFloat();
    return;
  }

  // Find the cursor span
  const cursor = codeOutput.querySelector('.tw-cursor');

  let segIdx = 0;
  let charIdx = 0;
  let currentSpan = null;

  const CHAR_DELAY = 32;   // ms per character
  const LINE_PAUSE = 220;  // extra pause on newlines

  function renderAllSegments() {
    if (cursor) cursor.remove();
    segments.forEach(seg => {
      const span = seg.c ? document.createElement('span') : null;
      if (span) span.className = 't-' + seg.c;
      const text = seg.t;
      if (span) {
        span.textContent = text;
        codeOutput.appendChild(span);
      } else {
        codeOutput.appendChild(document.createTextNode(text));
      }
    });
  }

  function typeNextChar() {
    if (segIdx >= segments.length) {
      // Typewriter done — fade out cursor and start float
      if (cursor) cursor.classList.add('done');
      setTimeout(startFloat, 800);
      return;
    }

    const seg = segments[segIdx];
    const text = seg.t;

    if (charIdx === 0) {
      // Start a new segment — create its span
      if (seg.c) {
        currentSpan = document.createElement('span');
        currentSpan.className = 't-' + seg.c;
        codeOutput.insertBefore(currentSpan, cursor);
      } else {
        currentSpan = null;
      }
    }

    const ch = text[charIdx];
    if (currentSpan) {
      currentSpan.textContent += ch;
    } else {
      codeOutput.insertBefore(document.createTextNode(ch), cursor);
    }

    charIdx++;

    if (charIdx >= text.length) {
      segIdx++;
      charIdx = 0;
      currentSpan = null;
    }

    // Vary speed: pause longer on newlines
    const delay = ch === '\n' ? LINE_PAUSE : CHAR_DELAY;
    setTimeout(typeNextChar, delay);
  }

  function startFloat() {
    codeCard.classList.add('is-floating');
  }

  // Start after a brief delay so the page settles
  setTimeout(typeNextChar, 600);
})();

/* ============================================================
   INIT — Console branding
============================================================ */
console.log(
  '%cCarreira Front-End',
  'font-size: 24px; font-weight: bold; color: #00f2fe; text-shadow: 0 0 10px #00f2fe;'
);
console.log(
  '%cDesenvolvido por Pedro Henrique Alves de Aguiar',
  'font-size: 12px; color: #a0aec0;'
);
