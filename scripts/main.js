/* =============================================
   THEME TOGGLE
   ============================================= */

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function getStoredTheme() {
  return localStorage.getItem('theme') || 'dark';
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Initialize theme
setTheme(getStoredTheme());

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* =============================================
   MOBILE MENU
   ============================================= */

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
  mobileMenu.classList.add('open');
  menuBtn.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.setAttribute('aria-label', 'Close menu');
  mobileMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close on outside click
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMenu();
  }
});

/* =============================================
   SMOOTH ACTIVE NAV HIGHLIGHTING
   ============================================= */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* =============================================
   TYPED TEXT EFFECT
   ============================================= */

const roles = [
  'ML Engineer',
  'Software Developer',
  'AWS Cloud Enthusiast',
  'CS Grad Student at Oregon State',
];

const typedEl = document.getElementById('typedText');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 80;
const deletingSpeed = 45;
const pauseAfterType = 1800;
const pauseAfterDelete = 500;

function type() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === current.length) {
    delay = pauseAfterType;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = pauseAfterDelete;
  }

  setTimeout(type, delay);
}

type();

/* =============================================
   SCROLL REVEAL
   ============================================= */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

/**
 * Add scroll reveal to a set of elements.
 * @param {string} selector - CSS selector
 * @param {string} dirClass - 'reveal-up' | 'reveal-left' | 'reveal-right'
 * @param {boolean} stagger - whether to add incremental stagger delays
 */
function addReveal(selector, dirClass = 'reveal-up', stagger = false) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('pre-reveal', dirClass);
    if (stagger && i < 4) el.classList.add(`stagger-${i + 1}`);
    revealObserver.observe(el);
  });
}

// Section headings — fade up
addReveal('.section-title', 'reveal-up');
addReveal('.section-subtitle', 'reveal-up');

// About grid columns — slide in from sides
addReveal('.about-photo-col', 'reveal-left');
addReveal('.about-text', 'reveal-right');

// Skill cards — staggered fade up
addReveal('.skill-card', 'reveal-up', true);

// Project cards — staggered fade up
addReveal('.project-card', 'reveal-up', true);

// Timeline items — slide from left
addReveal('.tl-item', 'reveal-left', true);

// Contact grid columns
addReveal('.contact-info', 'reveal-left');
addReveal('.contact-form-wrap', 'reveal-right');


/* =============================================
   CONTACT FORM
   ============================================= */

const form        = document.getElementById('contactForm');
const formWrap    = document.getElementById('formSuccess');
const resetBtn    = document.getElementById('resetFormBtn');
const charCountEl = document.getElementById('charCount');
const messageEl   = document.getElementById('message');

/* Field-level validation with inline error messages */
const ERRORS = {
  name:    { empty: 'Name is required.' },
  email:   { empty: 'Email is required.', invalid: 'Please enter a valid email address.' },
  message: { empty: 'Message is required.' },
};

function showError(input, msg) {
  const errEl = document.getElementById(input.id + '-error');
  input.classList.add('error');
  if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
}

function clearError(input) {
  const errEl = document.getElementById(input.id + '-error');
  input.classList.remove('error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
}

function validateField(input) {
  const value = input.value.trim();
  const rules = ERRORS[input.name];
  if (!rules) return true;

  if (!value) {
    showError(input, rules.empty);
    return false;
  }
  if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showError(input, rules.invalid);
    return false;
  }
  clearError(input);
  return true;
}

/* Attach live validation listeners */
form.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) validateField(input);
  });
});

/* Character counter for message textarea */
if (messageEl && charCountEl) {
  const MAX = parseInt(messageEl.getAttribute('maxlength'), 10) || 500;
  messageEl.addEventListener('input', () => {
    const len = messageEl.value.length;
    charCountEl.textContent = `${len} / ${MAX}`;
    charCountEl.classList.toggle('near-limit', len >= MAX * 0.8 && len < MAX);
    charCountEl.classList.toggle('at-limit',   len >= MAX);
  });
}

/* Submit handler */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fields   = [...form.querySelectorAll('input, textarea')];
  const allValid = fields.every(validateField);
  if (!allValid) {
    // Focus the first invalid field for accessibility
    const first = fields.find(f => f.classList.contains('error'));
    if (first) first.focus();
    return;
  }

  const submitBtn  = document.getElementById('submitBtn');
  const btnLabel   = form.querySelector('.btn-label');
  const btnSending = form.querySelector('.btn-sending');
  const btnIcon    = form.querySelector('.btn-icon');

  /* Sending state */
  btnLabel.style.display   = 'none';
  btnIcon.style.display    = 'none';
  btnSending.style.display = 'flex';
  submitBtn.disabled       = true;

  /* Simulate submission — swap in with a real fetch() when backend is ready */
  setTimeout(() => {
    form.reset();
    if (charCountEl) charCountEl.textContent = '0 / 500';

    /* Restore button state (hidden behind success panel, but reset cleanly) */
    btnLabel.style.display   = 'inline';
    btnIcon.style.display    = 'inline';
    btnSending.style.display = 'none';
    submitBtn.disabled       = false;

    /* Swap form → success panel */
    form.style.display       = 'none';
    formWrap.style.display   = 'flex';
  }, 1500);
});

/* "Send another" resets back to the form */
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    formWrap.style.display = 'none';
    form.style.display     = 'flex';
    form.querySelector('input')?.focus();
  });
}

/* =============================================
   NAV SHRINK ON SCROLL
   ============================================= */

const navHeader = document.querySelector('.nav-header');
window.addEventListener('scroll', () => {
  navHeader.style.boxShadow = window.scrollY > 20
    ? '0 2px 20px rgba(0,0,0,0.15)'
    : 'none';
}, { passive: true });
