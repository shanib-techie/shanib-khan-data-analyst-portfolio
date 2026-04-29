/* ===========================
   MAIN.JS — Shanib Portfolio
=========================== */

// ── CUSTOM CURSOR ──────────────────────────────────────
const glow = document.querySelector('.cursor-glow');
const dot  = document.querySelector('.cursor-dot');

document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
  dot.style.left  = e.clientX + 'px';
  dot.style.top   = e.clientY + 'px';
});

document.querySelectorAll('a, button, .project-card, .stat-card, .skill-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => glow.classList.add('hover'));
  el.addEventListener('mouseleave', () => glow.classList.remove('hover'));
});

// ── PARTICLE CANVAS ────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 60;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // Draw faint connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── DARK MODE TOGGLE ───────────────────────────────────
(function initDarkMode() {
  const btn = document.getElementById('darkModeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    const icon = btn.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
})();

// ── HAMBURGER NAV ──────────────────────────────────────
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

// ── ACTIVE NAV LINK ────────────────────────────────────
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || (page === 'index.html' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });
})();

// ── REVEAL ON SCROLL ───────────────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => observer.observe(t));
})();

// ── COUNTER ANIMATION ──────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          el.textContent = Math.round(start) + suffix;
          if (start >= target) clearInterval(timer);
        }, 20);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

// ── SKILL BAR ANIMATION ────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-progress');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = width; }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
})();

// ── TYPED TEXT EFFECT ──────────────────────────────────
(function initTyped() {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const words = ['Data Analyst', 'Python Developer', 'BI Dashboard Builder', 'SQL Expert'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
})();

// ── HERO CARD 3D TILT ──────────────────────────────────
(function initTilt() {
  const card = document.querySelector('.hero-card');
  if (!card) return;
  const wrapper = card.closest('.hero-3d-wrapper');

  wrapper.addEventListener('mousemove', e => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 10}deg)`;
  });
  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0) rotateX(0)';
  });
})();

// ── PROJECT FILTER ─────────────────────────────────────
(function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const categories = card.dataset.category || '';
        
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
})();

// ── CONTACT FORM (static — shows confirmation) ─────────
(function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00d464, #00f5aa)';
    let success = form.querySelector('.form-success');
    if (!success) {
      success = document.createElement('div');
      success.className = 'form-success';
      success.textContent = "Thanks for reaching out! I'll get back to you soon.";
      form.appendChild(success);
    }
    success.style.display = 'block';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      success.style.display = 'none';
    }, 4000);
  });
})();
