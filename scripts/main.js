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
   EMAILJS SETUP INSTRUCTIONS
   ================================================
   1. Go to https://www.emailjs.com and create a free account.

   2. Add an Email Service:
      Dashboard → Email Services → Add New Service
      Connect your Gmail (or other provider).
      Copy the Service ID (e.g. "service_abc123") → replace YOUR_SERVICE_ID below.

   3. Create an Email Template:
      Dashboard → Email Templates → Create New Template
      Use these template variables so the fields map correctly:
        From name:    {{from_name}}
        From email:   {{from_email}}
        Message:      {{message}}
        To email:     your personal email address
      Save and copy the Template ID (e.g. "template_xyz789") → replace YOUR_TEMPLATE_ID below.

   4. Get your Public Key:
      Dashboard → Account → General → Public Key
      Copy it → replace YOUR_EMAILJS_PUBLIC_KEY below.

   5. Free tier allows 200 emails/month — enough for a portfolio.
   ============================================= */

/* =============================================
   CONTACT FORM
   ============================================= */

emailjs.init('CgQDkSZzyijk3-ZFN');

const EMAILJS_SERVICE_ID  = 'service_kceso5e';
const EMAILJS_TEMPLATE_ID = 'template_akr0wdf';

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

/* Toast notification helper */
function showToast(msg, isError = false) {
  const existing = document.getElementById('formToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'formToast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${isError ? 'var(--color-error, #ef4444)' : 'var(--color-accent, #6c63ff)'};
    color: #fff;
    padding: 0.85rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    max-width: 90vw;
    text-align: center;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/* Submit handler */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // 1. Run validation before anything else
  const fields   = [...form.querySelectorAll('input, textarea')];
  const allValid = fields.every(validateField);
  if (!allValid) {
    const first = fields.find(f => f.classList.contains('error'));
    if (first) first.focus();
    return;
  }

  const submitBtn  = document.getElementById('submitBtn');
  const btnLabel   = form.querySelector('.btn-label');
  const btnSending = form.querySelector('.btn-sending');
  const btnIcon    = form.querySelector('.btn-icon');

  // 2. Show loading state
  btnLabel.style.display   = 'none';
  btnIcon.style.display    = 'none';
  btnSending.style.display = 'flex';
  submitBtn.disabled       = true;

  // 3. Send via EmailJS
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      form.reset();
      if (charCountEl) charCountEl.textContent = '0 / 500';

      // Restore button
      btnLabel.style.display   = 'inline';
      btnIcon.style.display    = 'inline';
      btnSending.style.display = 'none';
      submitBtn.disabled       = false;

      // Show success panel and toast
      form.style.display     = 'none';
      formWrap.style.display = 'flex';
      showToast("Message sent successfully! I'll get back to you soon.");
    })
    .catch(() => {
      // Restore button on error
      btnLabel.style.display   = 'inline';
      btnIcon.style.display    = 'inline';
      btnSending.style.display = 'none';
      submitBtn.disabled       = false;

      showToast('Oops! Something went wrong. Please try emailing directly.', true);
    });
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
