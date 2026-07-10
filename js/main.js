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

// ── reveal on scroll ──
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
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
const NOVIQO_WA = '919876543210'; // TODO: replace with Noviqo's real WhatsApp number
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
  initYear();
});
