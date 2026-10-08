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
  initLegalModals();
  initCookieConsent();
  initNavbarScroll();
  initScrollProgress();
  initBackToTop();
  initInteractiveGlow();
  initDeviceSimulator();
  initMobileDrawer();
  initShowcase();
  initShowcaseTabs();
  initKeyboardNavigation();
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
// --- Responsive Simulator & Device Mockup Shell ---
function initDeviceSimulator() {
  const buttons = document.querySelectorAll('.device-btn');
  const shell = document.getElementById('device-shell');
  const viewport = document.getElementById('showcase-viewport');
  const statusText = document.getElementById('device-status-text');

  const LABELS = {
    desktop: 'DESKTOP 60FPS • LIVE',
    notebook: 'NOTEBOOK 60FPS • LIVE',
    tablet: 'TABLET 60FPS • LIVE',
    mobile: 'MOBILE 60FPS • LIVE'
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.dataset.device;

      if (shell) {
        shell.className = `showcase-device-shell device-${device}`;
      }
      if (viewport) {
        viewport.className = `device-${device}`;
      }
      if (statusText) {
        statusText.textContent = LABELS[device] || '60 FPS • LIVE';
      }

      window.dispatchEvent(new Event('resize'));
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

/**
 * Updates the floating glowing pill behind active tab button
 */
export function updateTabPill(activeBtn) {
  const pill = document.getElementById('showcase-tab-pill');
  const track = document.getElementById('showcase-tabs-track');
  if (!pill || !track) return;

  if (!activeBtn) {
    activeBtn = track.querySelector('.showcase-tab-btn.active');
  }
  if (!activeBtn) return;

  const trackRect = track.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  const left = (btnRect.left - trackRect.left) + track.scrollLeft;

  pill.style.width = `${btnRect.width}px`;
  pill.style.transform = `translateX(${left}px)`;
  pill.style.opacity = '1';
}

export function switchComponent(targetId, shouldScroll = false) {
  const index = COMPONENT_ORDER.indexOf(targetId);
  if (index === -1) return;
  currentCompIndex = index;

  // Update nav tabs
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  let activeTabBtn = null;
  tabBtns.forEach(btn => {
    const isActive = btn.dataset.comp === targetId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) {
      activeTabBtn = btn;
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });

  // Smooth sliding pill update
  if (activeTabBtn) {
    updateTabPill(activeTabBtn);
  }

  // Update address bar path
  const urlPathEl = document.getElementById('device-url-path');
  if (urlPathEl) {
    urlPathEl.textContent = `/${targetId}`;
  }

  // Update component wrappers
  const wrappers = document.querySelectorAll('.component-wrapper');
  wrappers.forEach(w => {
    const isTarget = w.id === `comp-${targetId}`;
    w.classList.toggle('active', isTarget);
  });

  // Update stepper counter with pop bounce
  const counter = document.getElementById('showcase-tab-counter');
  if (counter) {
    counter.textContent = `${currentCompIndex + 1} / ${COMPONENT_ORDER.length}`;
    counter.classList.remove('counter-pop');
    void counter.offsetWidth; // trigger reflow
    counter.classList.add('counter-pop');
  }

  // Sync mobile counter
  const counterM = document.getElementById('showcase-tab-counter-m');
  if (counterM) {
    counterM.textContent = `${currentCompIndex + 1} / ${COMPONENT_ORDER.length}`;
    counterM.classList.remove('counter-pop');
    void counterM.offsetWidth;
    counterM.classList.add('counter-pop');
  }

  // Update mobile top-bar: icon + label from active button
  if (activeTabBtn) {
    const labelEl = document.getElementById('mobile-comp-label');
    const iconEl  = document.querySelector('#mobile-comp-name i');
    const btnIcon = activeTabBtn.querySelector('i');
    const btnLabel = activeTabBtn.querySelector('.tab-label');
    if (labelEl && btnLabel) labelEl.textContent = btnLabel.textContent;
    if (iconEl && btnIcon) iconEl.className = btnIcon.className;
  }

  // Trigger resize event so Chart.js and Leaflet re-render crisp
  window.dispatchEvent(new Event('resize'));

  if (shouldScroll) {
    requestAnimationFrame(() => {
      const deviceShell = document.getElementById('device-shell');
      const tabsNav = document.querySelector('.showcase-tabs-nav');
      const target = deviceShell || document.getElementById('components');
      if (target) {
        const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 64;
        // If tabs nav is sticky, account for it too
        const tabsHeight = tabsNav ? tabsNav.offsetHeight + 12 : 0;
        const topOffset = target.getBoundingClientRect().top + window.scrollY - navbarHeight - tabsHeight - 16;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    });
  }
}

function initShowcaseTabs() {
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchComponent(btn.dataset.comp, true);
    });
  });

  const prevBtn = document.getElementById('showcase-prev-btn');
  const nextBtn = document.getElementById('showcase-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentCompIndex - 1 + COMPONENT_ORDER.length) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[prevIndex], true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentCompIndex + 1) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[nextIndex], true);
    });
  }

  // Mobile duplicate prev/next buttons
  const prevBtnM = document.getElementById('showcase-prev-btn-m');
  const nextBtnM = document.getElementById('showcase-next-btn-m');
  if (prevBtnM) {
    prevBtnM.addEventListener('click', () => {
      const prevIndex = (currentCompIndex - 1 + COMPONENT_ORDER.length) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[prevIndex], true);
    });
  }
  if (nextBtnM) {
    nextBtnM.addEventListener('click', () => {
      const nextIndex = (currentCompIndex + 1) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[nextIndex], true);
    });
  }

  // Footer component links
  document.querySelectorAll('.footer-links a[data-comp]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchComponent(link.dataset.comp, true);
    });
  });

  // Sliding pill listeners
  const track = document.getElementById('showcase-tabs-track');
  if (track) {
    track.addEventListener('scroll', () => updateTabPill(), { passive: true });
  }
  window.addEventListener('resize', () => updateTabPill(), { passive: true });
  setTimeout(() => updateTabPill(), 100);
}

// --- Keyboard Navigation (Power User Shortcuts) ---
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || activeEl?.isContentEditable) {
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentCompIndex + 1) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentCompIndex - 1 + COMPONENT_ORDER.length) % COMPONENT_ORDER.length;
      switchComponent(COMPONENT_ORDER[prevIndex]);
    } else if (e.key >= '1' && e.key <= '8') {
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < COMPONENT_ORDER.length) {
        e.preventDefault();
        switchComponent(COMPONENT_ORDER[idx]);
      }
    }
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

// --- Tech Architecture HUD Animation ---
function initTechFooter() {
  const specCards = document.querySelectorAll('.tech-spec-card');
  if (!specCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          const meter = entry.target.querySelector('.spec-meter-fill');
          if (meter) {
            const targetWidth = meter.style.width; // e.g. "98%"
            meter.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => {
                meter.style.width = targetWidth;
              }, 40);
            });
          }
        }, i * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  specCards.forEach(card => observer.observe(card));
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

// --- Interactive Project Quote Modal with Anti-Spam Protection ---
function initQuoteModal() {
  const openBtn = document.getElementById('open-quote-modal');
  const overlay = document.getElementById('quote-modal-overlay');
  const closeBtn = document.getElementById('quote-close-btn');
  const form = document.getElementById('quote-form');
  const typeBtns = document.querySelectorAll('.quote-type-btn');

  if (!overlay || !form) return;

  let modalOpenedAt = 0;
  let lastSubmitTime = 0;

  function openModal() {
    overlay.classList.add('open');
    document.body.classList.add('drawer-open');
    modalOpenedAt = Date.now();
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

  // Form submission & WhatsApp redirect with Anti-Spam protection
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Anti-Spam Honeypot check
    const honeypot = document.getElementById('quote-hp');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('Bot submission blocked via honeypot.');
      closeModal();
      return;
    }

    // 2. Anti-Spam Time check (minimum human interaction time 1000ms)
    const elapsed = Date.now() - modalOpenedAt;
    if (elapsed < 1000 && modalOpenedAt > 0) {
      console.warn('Bot submission blocked via timing threshold.');
      return;
    }

    // 3. Rate limiting (minimum 6s between submits)
    const now = Date.now();
    if (now - lastSubmitTime < 6000) {
      if (window.showToast) {
        window.showToast({
          title: 'Por favor aguarda',
          message: 'Espera unos segundos antes de enviar otra consulta.',
          type: 'warning',
          duration: 3000
        });
      }
      return;
    }
    lastSubmitTime = now;

    const activeType = document.querySelector('.quote-type-btn.active');
    const selectedType = activeType ? activeType.dataset.type : 'Desarrollo Web a Medida';
    const name = document.getElementById('quote-name').value.trim();
    const contact = document.getElementById('quote-contact').value.trim();
    const notes = document.getElementById('quote-notes').value.trim();

    // Trigger Analytics Event
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent('conversion', 'quote_submit', selectedType);
    }

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

// --- Legal & Privacy Modals System ---
function initLegalModals() {
  const legalModal = document.getElementById('modal-legal-overlay');
  const privacyModal = document.getElementById('modal-privacy-overlay');
  const legalBtn = document.getElementById('link-aviso-legal');
  const privacyBtn = document.getElementById('link-privacidad');
  const closeLegal = document.getElementById('legal-close-btn');
  const closePrivacy = document.getElementById('privacy-close-btn');

  function openLegal() {
    if (legalModal) {
      legalModal.classList.add('open');
      document.body.classList.add('drawer-open');
    }
  }

  function closeLegalModal() {
    if (legalModal) {
      legalModal.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }
  }

  function openPrivacy() {
    if (privacyModal) {
      privacyModal.classList.add('open');
      document.body.classList.add('drawer-open');
    }
  }

  function closePrivacyModal() {
    if (privacyModal) {
      privacyModal.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }
  }

  if (legalBtn) legalBtn.addEventListener('click', openLegal);
  if (closeLegal) closeLegal.addEventListener('click', closeLegalModal);
  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeLegalModal();
    });
  }

  if (privacyBtn) privacyBtn.addEventListener('click', openPrivacy);
  if (closePrivacy) closePrivacy.addEventListener('click', closePrivacyModal);
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closePrivacyModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLegalModal();
      closePrivacyModal();
    }
  });
}

// --- Cookie Consent Banner Management ---
function initCookieConsent() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const rejectBtn = document.getElementById('cookie-reject-btn');
  const cookiePrefBtn = document.getElementById('link-cookies');

  if (!banner) return;

  const currentConsent = localStorage.getItem('cookie_consent');

  if (!currentConsent) {
    // Show banner smoothly after initial load
    setTimeout(() => {
      banner.classList.remove('hidden');
    }, 1200);
  } else {
    banner.classList.add('hidden');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      banner.classList.add('hidden');
      if (window.showToast) {
        window.showToast({
          title: 'Preferencias Guardadas',
          message: 'Has aceptado las cookies de navegación y analítica anónima.',
          type: 'success',
          duration: 3000,
          icon: 'fa-solid fa-cookie-bite'
        });
      }
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'essential');
      banner.classList.add('hidden');
      if (window.showToast) {
        window.showToast({
          title: 'Preferencias Guardadas',
          message: 'Solo se utilizarán las cookies técnicas esenciales.',
          type: 'info',
          duration: 3000,
          icon: 'fa-solid fa-shield-halved'
        });
      }
    });
  }

  if (cookiePrefBtn) {
    cookiePrefBtn.addEventListener('click', () => {
      banner.classList.remove('hidden');
    });
  }
}


