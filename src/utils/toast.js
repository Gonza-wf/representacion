// ─────────────────────────────────────────────
// Premium Toast Notification System
// Sleek, accessible, responsive & Web Audio integrated
// ─────────────────────────────────────────────

import { playSound } from './audio.js';

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.getElementById('global-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'global-toast-container';
      toastContainer.className = 'global-toast-container';
      toastContainer.setAttribute('role', 'region');
      toastContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

const DEFAULT_ICONS = {
  success: 'fa-solid fa-circle-check',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error: 'fa-solid fa-circle-xmark'
};

/**
 * Displays a sleek toast notification.
 * @param {Object} options
 * @param {string} [options.title] - Notification title
 * @param {string} options.message - Notification message
 * @param {'success'|'info'|'warning'|'error'} [options.type='success'] - Type of toast
 * @param {number} [options.duration=3800] - Duration in ms before auto-close
 * @param {string} [options.icon] - Custom FontAwesome icon class
 */
export function showToast({
  title = '',
  message = '',
  type = 'success',
  duration = 3800,
  icon = null
} = {}) {
  const container = ensureToastContainer();
  const soundType = type === 'error' ? 'click' : 'success';
  playSound(soundType);

  const toast = document.createElement('div');
  toast.className = `g-toast g-toast-${type}`;

  const iconClass = icon || DEFAULT_ICONS[type] || DEFAULT_ICONS.info;

  const headerHtml = title ? `<div class="g-toast-title">${title}</div>` : '';

  toast.innerHTML = `
    <div class="g-toast-icon">
      <i class="${iconClass}"></i>
    </div>
    <div class="g-toast-content">
      ${headerHtml}
      <div class="g-toast-message">${message}</div>
    </div>
    <button class="g-toast-close" aria-label="Cerrar notificación">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="g-toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  // Close handler
  let isClosing = false;
  function closeToast() {
    if (isClosing) return;
    isClosing = true;
    toast.classList.add('g-toast-hiding');
    toast.addEventListener('animationend', () => {
      if (toast.parentElement) toast.remove();
    }, { once: true });
    // Fallback if animation doesn't fire
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 350);
  }

  const closeBtn = toast.querySelector('.g-toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeToast();
    });
  }

  // Auto-dismiss timer
  const timer = setTimeout(closeToast, duration);

  // Pause timer on hover
  toast.addEventListener('mouseenter', () => {
    toast.querySelector('.g-toast-progress').style.animationPlayState = 'paused';
    clearTimeout(timer);
  });

  toast.addEventListener('mouseleave', () => {
    toast.querySelector('.g-toast-progress').style.animationPlayState = 'running';
    setTimeout(closeToast, 1200);
  });

  container.appendChild(toast);
  return toast;
}

// Global window attachment for easy access across any component
if (typeof window !== 'undefined') {
  window.showToast = showToast;
}
