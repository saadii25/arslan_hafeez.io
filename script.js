// ── Preloader ──
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 800);
});

// ── Custom Cursor ──
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if (dot && ring) {
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX - 4 + 'px';
    dot.style.top = e.clientY - 4 + 'px';
    ring.style.left = e.clientX - 17 + 'px';
    ring.style.top = e.clientY - 17 + 'px';
  });
  document.querySelectorAll('a, button, .doc-card, .cert-card, .timeline-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.transform = 'scale(1.5)'; ring.style.borderColor = 'var(--gold)'; });
    el.addEventListener('mouseleave', () => { ring.style.transform = 'scale(1)'; ring.style.borderColor = 'var(--teal)'; });
  });
}

// ── Nav Scroll ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile Menu ──
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ── Reveal on Scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .timeline-item').forEach(el => observer.observe(el));

// ── Count-Up Animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 25);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── Hero Particles ──
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 188, 212, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 188, 212, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ── Smooth active nav highlighting ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 150;
    if (window.scrollY >= top) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) a.style.color = 'var(--gold)';
  });
});
