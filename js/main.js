/* Noviqo Studio — behavior module (deferred; zero render-blocking).
   Responsibilities: skeleton→loaded swaps, scroll reveal, mobile nav, WhatsApp form. */

// ── skeletons: mark .skel wrappers loaded when their img/iframe finishes ──
function initSkeletons() {
  document.querySelectorAll('.skel').forEach((wrap) => {
    const media = wrap.querySelector('img, iframe');
    if (!media) { wrap.classList.add('loaded'); return; }
    const done = () => wrap.classList.add('loaded');
    if (media.tagName === 'IMG' && media.complete && media.naturalWidth > 0) return done();
    media.addEventListener('load', done, { once: true });
    media.addEventListener('error', done, { once: true }); // fail open — never shimmer forever
    setTimeout(done, 6000); // hard cap: skeleton must never outlive patience
  });
}

// ── reveal on scroll (with per-group stagger via --i) ──
function initReveal() {
  // stagger siblings inside each grid/steps container so they cascade, not pop together
  document.querySelectorAll('.portfolio-grid, .grid3, .steps, .price-grid, .hero-actions').forEach((group) => {
    [...group.children].forEach((child, i) => {
      if (child.classList.contains('reveal')) child.style.setProperty('--i', i % 6);
    });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

// ── nav: frost only after scrolling past the hero top ──
function initNavScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

// ── mobile nav ──
function initNav() {
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  if (!burger || !links) return;
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => links.classList.remove('open')));
}

// ── enquiry form → WhatsApp ──
const NOVIQO_WA = '919535278181'; // Noviqo Studio WhatsApp
function sendWhatsApp(e) {
  e.preventDefault();
  const nm = document.getElementById('nm').value.trim();
  const biz = document.getElementById('biz').value.trim();
  const msg = document.getElementById('msg').value.trim();
  const text = `Hi Noviqo Studio! Website enquiry:\n• Name: ${nm}\n• Business: ${biz}${msg ? `\n• Note: ${msg}` : ''}`;
  window.open(`https://wa.me/${NOVIQO_WA}?text=${encodeURIComponent(text)}`, '_blank');
  return false;
}
window.sendWhatsApp = sendWhatsApp;

// ── footer year ──
function initYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initSkeletons();
  initReveal();
  initNav();
  initNavScroll();
  initYear();
});
