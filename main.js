import './style.css'
import { initForms } from './src/sections/forms/index.js';
import { initGalleries } from './src/sections/galleries/index.js';
import { initEcommerce } from './src/sections/ecommerce/index.js';
import { initDashboard } from './src/sections/dashboard/index.js';
import { initBooking } from './src/sections/booking/index.js';
import { initAdvanced } from './src/sections/advanced/index.js';
import { initApi } from './src/sections/api/index.js';
import { initMapa } from './src/sections/mapa/index.js';
import { showToast } from './src/utils/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initQuoteModal();
  initNavbarScroll();
  initScrollProgress();
  initBackToTop();
  initInteractiveGlow();
  initDeviceSimulator();
  initMobileDrawer();
  initShowcase();
  initShowcaseTabs();
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
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const compId = link.dataset.comp;
      closeDrawer();
      if (compId) {
        e.preventDefault();
        switchComponent(compId, true);
      }
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
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.dataset.device;
      viewport.className = '';
      viewport.classList.add(`device-${device}`);
    });
  });
}

// --- Component Switcher System 2.0 ---
export const COMPONENT_ORDER = [
  'ecommerce',
  'dashboard',
  'booking',
  'galleries',
  'forms',
  'advanced-comps',
  'api',
  'mapa'
];

let currentCompIndex = 0;

export function switchComponent(targetId, shouldScroll = false) {
  const index = COMPONENT_ORDER.indexOf(targetId);
  if (index === -1) return;
  currentCompIndex = index;

  // Update nav tabs
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  tabBtns.forEach(btn => {
    const isActive = btn.dataset.comp === targetId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });

  // Update component wrappers
  const wrappers = document.querySelectorAll('.component-wrapper');
  wrappers.forEach(w => {
    const isTarget = w.id === `comp-${targetId}`;
    w.classList.toggle('active', isTarget);
  });

  // Update stepper counter
  const counter = document.getElementById('showcase-tab-counter');
  if (counter) {
    counter.textContent = `${currentCompIndex + 1} / ${COMPONENT_ORDER.length}`;
  }

  // Trigger resize event so Chart.js and Leaflet re-render crisp
  window.dispatchEvent(new Event('resize'));

  if (shouldScroll) {
    const showcaseSection = document.getElementById('components');
    if (showcaseSection) {
      const topOffset = showcaseSection.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }
}

function initShowcaseTabs() {
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchComponent(btn.dataset.comp);
    });
  });

  const prevBtn = document.getElementById('showcase-prev-btn');
  const nextBtn = document.getElementById('showcase-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentCompIndex - 1 + COMPONENT_ORDER.length) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[prevIndex]);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentCompIndex + 1) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[nextIndex]);
    });
  }
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

  // First component active by default
  if (config.id === COMPONENT_ORDER[0]) {
    wrapper.classList.add('active');
  }

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
        <div class="code-toolbar">
          <span class="code-badge"><i class="fa-brands fa-square-js"></i> JavaScript ES6+</span>
          <button class="copy-code-btn" type="button" aria-label="Copiar código al portapapeles">
            <i class="fa-regular fa-copy"></i> Copiar Código
          </button>
        </div>
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
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      wrapper.querySelector(`#${tab.dataset.target}`).classList.add('active');
    });
  });

  // Copy code handler
  const copyBtn = wrapper.querySelector('.copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(config.code).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
        if (window.showToast) {
          window.showToast({
            title: 'Código Copiado',
            message: `Código de ${config.title} copiado al portapapeles.`,
            type: 'success',
            duration: 2500,
            icon: 'fa-regular fa-copy'
          });
        }
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar Código';
        }, 2000);
      }).catch(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
      });
    });
  }

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
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('drawer-open');
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

    const submitBtn = form.querySelector('.quote-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Abriendo WhatsApp...!';
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


