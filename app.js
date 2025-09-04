// --------- Init une fois le DOM prêt ---------
document.addEventListener('DOMContentLoaded', () => {
  // ===== NAV BURGER =====
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  let lastFocus = null;

  const isOpen = () => nav?.classList.contains('is-open');

  function openNav() {
    if (!nav) return;
    lastFocus = document.activeElement;
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
    navToggle?.setAttribute('aria-expanded', 'true');

    // focus premier lien du menu pour l’accessibilité
    const firstLink = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    firstLink?.focus({ preventScroll: true });
  }

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    lastFocus?.focus?.({ preventScroll: true });
  }

  navToggle?.addEventListener('click', () => {
    isOpen() ? closeNav() : openNav();
  });

  // Fermer si clic en dehors du nav (sur mobile aussi)
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    const target = e.target;
    const clickedToggle = navToggle && (target === navToggle || navToggle.contains(target));
    const clickedNav = nav && (target === nav || nav.contains(target));
    if (!clickedToggle && !clickedNav) closeNav();
  });

  // Fermer sur ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeNav();
  });

  // Fermer après clic sur un lien du menu
  nav?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => closeNav());
  });

  // Recalibrer si on repasse en desktop
  const MQ = window.matchMedia('(min-width: 992px)');
  function handleMQ(e) {
    if (e.matches) {
      // Vue desktop : forcer le menu visible et état propre
      nav?.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  }
  MQ.addEventListener?.('change', handleMQ);
  handleMQ(MQ);

  // ===== CAROUSEL (protégé) =====
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const dots = Array.from(document.querySelectorAll('.dot'));

  if (track && slides.length) {
    let index = 0;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, k) => {
        const current = k === index;
        s.classList.toggle('is-current', current);
        s.toggleAttribute('hidden', !current);
      });
      dots.forEach((d, k) => {
        const active = k === index;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
        d.tabIndex = active ? 0 : -1;
      });
    }

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => goTo(k)));

    // clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    });

    // swipe (mobile)
    let startX = null;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      if (startX === null) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        goTo(index + (dx < 0 ? 1 : -1));
        startX = null;
      }
    }, { passive: true });

    // auto-play (optionnel)
    let autop = setInterval(() => goTo(index + 1), 6000);
    track.addEventListener('mouseenter', () => clearInterval(autop));
    track.addEventListener('mouseleave', () => (autop = setInterval(() => goTo(index + 1), 6000)));

    // init
    goTo(0);
  }
});
