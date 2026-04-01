// ============================================
// $ELOKO — The Animal Runner of April
// Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCopyCA();
  initCountUp();
  initSmoothScroll();
});

// ============================================
// FIRE PARTICLE SYSTEM
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;

      // Fire colors
      const colors = [
        { r: 255, g: 106, b: 0 },   // orange
        { r: 255, g: 149, b: 0 },   // light orange
        { r: 255, g: 204, b: 0 },   // yellow
        { r: 255, g: 69, b: 0 },    // red-orange
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.life * 0.02) * 0.3;
      this.life++;
      this.opacity = Math.max(0, this.opacity - 0.002);
      this.size = Math.max(0, this.size - 0.005);

      if (this.life > this.maxLife || this.opacity <= 0 || this.y < -10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.5})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Create particles
  const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // Spread initial positions
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('active');
    btn.classList.toggle('active');
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      btn.classList.remove('active');
    });
  });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
  // Add reveal class to elements
  const revealSelectors = [
    '.section-tag', '.section-title', '.section-desc',
    '.about-image', '.about-text',
    '.why-card', '.step-card', '.social-card',
    '.token-card', '.token-details', '.ca-box',
    '.feature', '.cta-content',
    '.hero-badge', '.hero-title', '.hero-subtitle', '.hero-desc', '.hero-buttons', '.hero-stats'
  ];

  document.querySelectorAll(revealSelectors.join(',')).forEach(el => {
    el.classList.add('reveal');
  });

  // Make hero elements visible immediately with stagger
  const heroEls = document.querySelectorAll('.hero .reveal');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });

  // Intersection Observer for other elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for grid items
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.children).filter(c => c.classList.contains('reveal')) : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// COPY CONTRACT ADDRESS
// ============================================
function initCopyCA() {
  const copyBtn = document.getElementById('copyBtn');
  const caAddress = document.getElementById('caAddress');

  if (!copyBtn || !caAddress) return;

  const handleCopy = () => {
    const code = caAddress.querySelector('code');
    if (!code) return;

    const text = code.textContent.trim();
    if (text === 'COMING SOON') return;

    navigator.clipboard.writeText(text).then(() => {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      }, 2000);
    });
  };

  copyBtn.addEventListener('click', handleCopy);
  caAddress.addEventListener('click', handleCopy);
}

// ============================================
// COUNT UP ANIMATION
// ============================================
function initCountUp() {
  const holderEl = document.getElementById('statHolders');
  if (!holderEl) return;

  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        countUp(holderEl, 0, 1247, 2000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(holderEl);
}

function countUp(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * eased);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // navbar height
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
