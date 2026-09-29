import './style.css'
import { initForms } from './src/sections/forms/index.js';
import { initGalleries } from './src/sections/galleries/index.js';
import { initEcommerce } from './src/sections/ecommerce/index.js';
import { initDashboard } from './src/sections/dashboard/index.js';
import { initBooking } from './src/sections/booking/index.js';
import { initAdvanced } from './src/sections/advanced/index.js';
import { initApi } from './src/sections/api/index.js';
import { initMapa } from './src/sections/mapa/index.js';
import { playSound, toggleSound, isSoundEnabled } from './src/utils/audio.js';
import { showToast } from './src/utils/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSoundSystem();
  initQuoteModal();
  initNavbarScroll();
  initScrollProgress();
  initBackToTop();
  initHeroStatsCounters();
  initInteractiveGlow();
  initDeviceSimulator();
  initMobileDrawer();
  initShowcase();
  initTechFooter();
});

// --- Theme Toggle ---
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const drawerThemeBtn = document.getElementById('drawer-theme-toggle');
  const body = document.body;
  const icon = toggleBtn.querySelector('i');

  function updateThemeUI(theme) {
    const isDark = theme === 'dark';
    if (drawerThemeBtn) {
      drawerThemeBtn.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i> Modo Claro'
        : '<i class="fa-solid fa-moon"></i> Modo Oscuro';
    }
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.replace('light-mode', 'dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
    updateThemeUI('dark');
  }

  toggleBtn.addEventListener('click', () => {
    playSound('toggle');
    if (body.classList.contains('light-mode')) {
      body.classList.replace('light-mode', 'dark-mode');
      icon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
      updateThemeUI('dark');
    } else {
      body.classList.replace('dark-mode', 'light-mode');
      icon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
      updateThemeUI('light');
    }
  });

  if (drawerThemeBtn) {
    drawerThemeBtn.addEventListener('click', () => {
      toggleBtn.click();
    });
  }
}

// --- Web Audio Sound System & Toggles ---
function initSoundSystem() {
  const soundBtn = document.getElementById('sound-toggle');
  const drawerSoundBtn = document.getElementById('drawer-sound-toggle');

  function updateSoundUI(enabled) {
    if (soundBtn) {
      soundBtn.title = enabled ? 'Sonidos: Activados' : 'Sonidos: Desactivados';
      soundBtn.innerHTML = enabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
      soundBtn.classList.toggle('sound-active', enabled);
    }
    if (drawerSoundBtn) {
      drawerSoundBtn.innerHTML = enabled
        ? '<i class="fa-solid fa-volume-high"></i> Sonidos: On'
        : '<i class="fa-solid fa-volume-xmark"></i> Sonidos: Off';
      drawerSoundBtn.classList.toggle('sound-active', enabled);
    }
  }

  // Initial UI state
  updateSoundUI(isSoundEnabled());

  function handleToggle() {
    const newState = toggleSound();
    updateSoundUI(newState);
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', handleToggle);
  }
  if (drawerSoundBtn) {
    drawerSoundBtn.addEventListener('click', handleToggle);
  }
}

// --- Mobile Drawer Navigation ---
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  const drawerLinks = drawer.querySelectorAll('a');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    playSound('tab');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    playSound('tab');
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

// --- Navbar scroll effect ---
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// --- Responsive Simulator ---
function initDeviceSimulator() {
  const buttons = document.querySelectorAll('.device-btn');
  const viewport = document.getElementById('showcase-viewport');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.dataset.device;
      viewport.className = '';
      viewport.classList.add(`device-${device}`);
    });
  });
}

// --- Component Wrapper Generator ---
/**
 * Inyecta un componente en el DOM envuelto con pestañas de Demo, Código y Explicación.
 * @param {Object} config - Configuración del componente
 */
export function registerComponent(config) {
  const viewport = document.getElementById('showcase-viewport');

  const wrapper = document.createElement('div');
  wrapper.className = 'component-wrapper';
  wrapper.id = `comp-${config.id}`;

  wrapper.innerHTML = `
    <div class="component-header">
      <div class="component-title">
        <i class="${config.icon}"></i> ${config.title}
      </div>
      <div class="component-tabs">
        <button class="tab-btn active" data-target="demo-${config.id}">
          <i class="fa-solid fa-play"></i> Demo
        </button>
        <button class="tab-btn" data-target="code-${config.id}">
          <i class="fa-solid fa-code"></i> Código
        </button>
        <button class="tab-btn" data-target="exp-${config.id}">
          <i class="fa-solid fa-circle-info"></i> Info
        </button>
      </div>
    </div>
    <div class="component-body">
      <div id="demo-${config.id}" class="tab-content demo-content active">
        ${config.html}
      </div>
      <div id="code-${config.id}" class="tab-content code-content">
        <pre><code>${escapeHTML(config.code)}</code></pre>
      </div>
      <div id="exp-${config.id}" class="tab-content exp-content">
        ${config.explanation}
      </div>
    </div>
  `;

  viewport.appendChild(wrapper);

  // Tab logic
  const tabs = wrapper.querySelectorAll('.tab-btn');
  const contents = wrapper.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playSound('tab');
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      wrapper.querySelector(`#${tab.dataset.target}`).classList.add('active');
    });
  });

  // Mount component JS
  if (config.onMount) {
    config.onMount(wrapper.querySelector(`#demo-${config.id}`));
  }
}

// --- Utility ---
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// --- Tech Footer Animation ---
function initTechFooter() {
  const techItems = document.querySelectorAll('.tech-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Animate progress bar: read width from inline style on .tech-progress
          const bar = entry.target.querySelector('.tech-progress');
          if (bar) {
            const targetWidth = bar.style.width; // e.g. "95%"
            bar.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => {
                bar.style.width = targetWidth;
              }, 50);
            });
          }
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  techItems.forEach(item => observer.observe(item));
}

// --- Initialize All Showcase Components (ordered) ---
function initShowcase() {
  initEcommerce();
  initDashboard();
  initBooking();
  initGalleries();
  initForms();
  initAdvanced();
  initApi();
  initMapa();
}

// --- Scroll Progress Bar ---
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }, { passive: true });
}

// --- Back to Top Button ---
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    playSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Animated Counting Stats in Hero ---
function initHeroStatsCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          // Cubic ease-out
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(ease * target);
          el.textContent = current + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

// --- Subtle Interactive Mouse Glow in Hero ---
function initInteractiveGlow() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const shape3 = hero.querySelector('.shape-3');
    if (shape3) {
      shape3.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
    }
  }, { passive: true });
}

// --- Interactive Project Quote Modal ---
function initQuoteModal() {
  const openBtn = document.getElementById('open-quote-modal');
  const overlay = document.getElementById('quote-modal-overlay');
  const closeBtn = document.getElementById('quote-close-btn');
  const form = document.getElementById('quote-form');
  const typeBtns = document.querySelectorAll('.quote-type-btn');

  if (!overlay || !form) return;

  function openModal() {
    overlay.classList.add('open');
    document.body.classList.add('drawer-open');
    playSound('click');
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('drawer-open');
    playSound('click');
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on overlay backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Type selection chips
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playSound('click');
    });
  });

  // Form submission & WhatsApp redirect
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const activeType = document.querySelector('.quote-type-btn.active');
    const selectedType = activeType ? activeType.dataset.type : 'Desarrollo Web a Medida';
    const name = document.getElementById('quote-name').value.trim();
    const contact = document.getElementById('quote-contact').value.trim();
    const notes = document.getElementById('quote-notes').value.trim();

    playSound('success');

    const submitBtn = form.querySelector('.quote-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Generando Consulta WhatsApp...!';
    submitBtn.disabled = true;

    // Build formatted message
    let msg = `*¡Hola! Me gustaría cotizar un proyecto web:*\n\n`;
    msg += `📌 *Tipo de solución:* ${selectedType}\n`;
    msg += `👤 *Nombre/Empresa:* ${name}\n`;
    msg += `📱 *Contacto:* ${contact}\n`;
    if (notes) {
      msg += `📝 *Detalles:* ${notes}\n`;
    }
    msg += `\n_Consulta enviada desde el Laboratorio de Componentes Web_`;

    const waUrl = `https://wa.me/542615511349?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      closeModal();
      form.reset();
      typeBtns.forEach((b, idx) => b.classList.toggle('active', idx === 0));
    }, 700);
  });
}


