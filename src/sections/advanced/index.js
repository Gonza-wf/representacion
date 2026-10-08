import { registerComponent } from '../../../main.js';
import Sortable from 'sortablejs';

// -----------------------------------------------------------------------
// Advanced Component: Kanban Drag&Drop + Pricing Plans + Notifications
// -----------------------------------------------------------------------

const html = `
<div class="advanced-showcase">

  <!-- Kanban Board -->
  <div class="adv-section">
    <div class="adv-section-header">
      <h4><i class="fa-solid fa-list-check"></i> Kanban Board (Drag &amp; Drop)</h4>
      <p>Arrastra las tarjetas entre columnas</p>
    </div>
    <div class="kanban-board">
      <div class="kanban-col">
        <div class="kanban-header">
          <span class="k-dot k-todo"></span> Pendientes
          <span class="k-count" id="count-todo"></span>
        </div>
        <div class="kanban-items" id="kb-todo">
          <div class="k-item">Diseñar mockups de UI</div>
          <div class="k-item">Reunión con cliente</div>
          <div class="k-item">Setup base de datos</div>
        </div>
      </div>
      <div class="kanban-col">
        <div class="kanban-header">
          <span class="k-dot k-prog"></span> En Progreso
          <span class="k-count" id="count-prog"></span>
        </div>
        <div class="kanban-items" id="kb-prog">
          <div class="k-item">Componente Kanban</div>
          <div class="k-item">Integrar Chart.js</div>
        </div>
      </div>
      <div class="kanban-col">
        <div class="kanban-header">
          <span class="k-dot k-done"></span> Completado
          <span class="k-count" id="count-done"></span>
        </div>
        <div class="kanban-items" id="kb-done">
          <div class="k-item">Sistema de Tabs</div>
          <div class="k-item">Theme Switcher</div>
          <div class="k-item">Navbar responsiva</div>
        </div>
      </div>
    </div>
  </div>

  <hr class="section-divider">

  <!-- Pricing Plans -->
  <div class="adv-section">
    <div class="adv-section-header">
      <h4><i class="fa-solid fa-tags"></i> Planes de Precios</h4>
      <div class="billing-toggle-wrap">
        <span>Mensual</span>
        <label class="toggle-switch">
          <input type="checkbox" id="billing-toggle">
          <span class="toggle-track"></span>
        </label>
        <span>Anual <em class="badge-save">-20%</em></span>
      </div>
    </div>
    <div class="pricing-grid">
      <div class="p-card">
        <div class="p-tier">Básico</div>
        <div class="p-price">$<span class="price-val" data-m="9" data-a="7">9</span><small>/mes</small></div>
        <ul class="p-features">
          <li><i class="fa-solid fa-check"></i> 1 Proyecto activo</li>
          <li><i class="fa-solid fa-check"></i> Soporte por email</li>
          <li><i class="fa-solid fa-check"></i> 5 GB de almacenamiento</li>
        </ul>
        <button class="btn btn-secondary btn-full toast-trigger" data-msg="Plan Basico seleccionado">Empezar gratis</button>
      </div>
      <div class="p-card p-popular">
        <div class="p-popular-badge">Mas Popular</div>
        <div class="p-tier">Pro</div>
        <div class="p-price">$<span class="price-val" data-m="29" data-a="23">29</span><small>/mes</small></div>
        <ul class="p-features">
          <li><i class="fa-solid fa-check"></i> Proyectos ilimitados</li>
          <li><i class="fa-solid fa-check"></i> Soporte prioritario</li>
          <li><i class="fa-solid fa-check"></i> 100 GB de almacenamiento</li>
          <li><i class="fa-solid fa-check"></i> Analytics avanzado</li>
        </ul>
        <button class="btn btn-primary btn-full toast-trigger" data-msg="Plan Pro seleccionado - ¡Inicio de prueba de 14 días!">Elegir Pro</button>
      </div>
      <div class="p-card">
        <div class="p-tier">Enterprise</div>
        <div class="p-price">$<span class="price-val" data-m="79" data-a="63">79</span><small>/mes</small></div>
        <ul class="p-features">
          <li><i class="fa-solid fa-check"></i> Todo de Pro</li>
          <li><i class="fa-solid fa-check"></i> SLA garantizado</li>
          <li><i class="fa-solid fa-check"></i> Almacenamiento ilimitado</li>
          <li><i class="fa-solid fa-check"></i> Manager dedicado</li>
        </ul>
        <button class="btn btn-secondary btn-full toast-trigger" data-msg="Contacto con ventas iniciado">Contactar ventas</button>
      </div>
    </div>
  </div>

</div>

<!-- Toast Container (Global) -->
<div id="toast-container" style="position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;"></div>
`;

const css = `
<style>
  .advanced-showcase { padding: 1.5rem; background: var(--bg-color); }
  .adv-section { margin-bottom: 2rem; }
  .adv-section-header { margin-bottom: 1.5rem; }
  .adv-section-header h4 { font-size: 1.1rem; margin-bottom: 0.25rem; }
  .adv-section-header h4 i { color: var(--primary-color); margin-right: 0.25rem; }
  .adv-section-header p { color: var(--text-secondary); font-size: 0.875rem; }
  .section-divider { margin: 2.5rem 0; border: 0; border-top: 1px dashed var(--border-color); }

  /* Kanban */
  .kanban-board { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
  .kanban-col {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    min-width: 220px;
    flex: 1;
  }
  .kanban-header {
    padding: 0.9rem 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .k-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    display: inline-block;
  }
  .k-todo { background: #f59e0b; }
  .k-prog { background: #3b82f6; }
  .k-done { background: #10b981; }
  .k-count {
    margin-left: auto;
    background: var(--border-color);
    color: var(--text-secondary);
    font-size: 0.75rem;
    padding: 1px 7px;
    border-radius: 10px;
    font-weight: 700;
  }
  .kanban-items {
    padding: 0.75rem;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .k-item {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    padding: 0.65rem 0.9rem;
    border-radius: var(--radius-md);
    cursor: grab;
    font-size: 0.875rem;
    box-shadow: var(--shadow-xs);
    transition: var(--transition);
    user-select: none;
  }
  .k-item:hover { box-shadow: var(--shadow-sm); border-color: var(--primary-color); }
  .k-item:active { cursor: grabbing; opacity: 0.8; }
  .sortable-ghost { opacity: 0.3; background: var(--primary-light); }

  /* Pricing Toggle */
  .billing-toggle-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }
  .toggle-switch { position: relative; display: inline-block; width: 44px; height: 22px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-track {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--border-color);
    border-radius: 22px;
    cursor: pointer;
    transition: 0.3s;
  }
  .toggle-track::before {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    left: 3px; bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: 0.3s;
  }
  input:checked + .toggle-track { background: var(--primary-color); }
  input:checked + .toggle-track::before { transform: translateX(22px); }
  .badge-save {
    font-style: normal;
    background: rgba(16,185,129,0.15);
    color: #059669;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 700;
  }

  /* Pricing Cards */
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  .p-card {
    background: var(--surface-color);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-xl);
    padding: 1.75rem;
    position: relative;
    transition: var(--transition);
  }
  .p-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
  .p-popular {
    border-color: var(--primary-color);
    box-shadow: 0 8px 30px rgba(59,130,246,0.15);
    transform: translateY(-6px);
  }
  .p-popular-badge {
    position: absolute;
    top: -13px; left: 50%;
    transform: translateX(-50%);
    background: var(--primary-color);
    color: white;
    padding: 3px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
  }
  .p-tier { color: var(--text-secondary); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
  .p-price { font-size: 2.2rem; font-weight: 800; margin-bottom: 1.25rem; color: var(--text-primary); }
  .p-price small { font-size: 0.9rem; font-weight: 400; color: var(--text-secondary); }
  .p-features { list-style: none; margin-bottom: 1.5rem; }
  .p-features li { padding: 0.4rem 0; font-size: 0.875rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem; }
  .p-features li i { color: #10b981; }
  .btn-full { width: 100%; justify-content: center; }

  /* Toast */
  .toast {
    background: var(--text-primary);
    color: var(--bg-color);
    padding: 0.85rem 1.25rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xl);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    font-weight: 500;
    animation: toastIn 0.3s cubic-bezier(0.4,0,0.2,1) forwards;
    pointer-events: auto;
    max-width: 320px;
  }
  @keyframes toastIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes toastOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }
  .toast.hiding { animation: toastOut 0.3s forwards; }
</style>
`;

const code = `// SortableJS: Drag & Drop between Kanban columns
const groups = ['#kb-todo', '#kb-prog', '#kb-done'];
groups.forEach(sel => {
  new Sortable(container.querySelector(sel), {
    group: 'kanban',  // same group = shared drag
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: updateCounts  // recalculate badges
  });
});

// Pricing Toggle
const toggle = container.querySelector('#billing-toggle');
toggle.addEventListener('change', e => {
  const isAnnual = e.target.checked;
  container.querySelectorAll('.price-val').forEach(el => {
    el.textContent = isAnnual ? el.dataset.a : el.dataset.m;
  });
});

// Toast Notifications
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
`;

const explanation = `
<h3>Componentes Avanzados de UI</h3>

<div class="exp-section">
  <h4><i class="fa-solid fa-bullseye"></i> Para qué sirve</h4>
  <p>Tres patrones de UI de nivel profesional que aparecen en casi todos los proyectos de gestión: un tablero Kanban para organizar tareas visualmente, un sistema de precios con toggle mensual/anual que incentiva la conversión al plan anual, y un sistema de notificaciones toast no intrusivo para feedback de acciones.</p>
  <div class="exp-industries">
    <span class="exp-industry-badge"><i class="fa-solid fa-list-check"></i> Project Management</span>
    <span class="exp-industry-badge"><i class="fa-solid fa-tag"></i> SaaS & Pricing Pages</span>
    <span class="exp-industry-badge"><i class="fa-solid fa-bell"></i> Cualquier App Web</span>
    <span class="exp-industry-badge"><i class="fa-solid fa-users-gear"></i> Herramientas de Equipo</span>
  </div>
</div>

<div class="exp-section">
  <h4><i class="fa-solid fa-gears"></i> Cómo funciona</h4>
  <ul>
    <li><strong>Kanban Drag & Drop:</strong> Utiliza la librería <code>SortableJS</code> con <code>group: 'kanban'</code> para compartir elementos entre columnas. El evento <code>onEnd</code> de cada instancia llama a <code>updateCounts()</code> que recuenta los <code>.k-item</code> y actualiza los badges.</li>
    <li><strong>Toggle de Facturación:</strong> Un <code>&lt;input type="checkbox"&gt;</code> estilizado como switch CSS dispara un evento <code>change</code>. El handler recorre todos los elementos con <code>data-m</code> (mensual) y <code>data-a</code> (anual) y actualiza su <code>textContent</code> dinámicamente sin recargar nada.</li>
    <li><strong>Sistema de Toasts:</strong> <code>createElement('div')</code> con clase <code>toast</code>, insertado en <code>#toast-container</code> (portal en <code>body</code>). La animación de entrada y salida usa transiciones CSS + <code>setTimeout</code> de 3s para auto-destruir el elemento del DOM.</li>
  </ul>
  <div class="exp-tech-tags">
    <span class="exp-tech-tag">SortableJS</span>
    <span class="exp-tech-tag">Drag & Drop</span>
    <span class="exp-tech-tag">CSS Toggle Switch</span>
    <span class="exp-tech-tag">Toast Notifications</span>
    <span class="exp-tech-tag">Data Attributes</span>
  </div>
</div>

<div class="exp-section">
  <h4><i class="fa-solid fa-lightbulb"></i> Cuándo recomendaría usarlo</h4>
  <div class="exp-recommend-box">
    El <strong>Kanban</strong> es indispensable en cualquier herramienta interna de gestión de tareas, pipeline de ventas o seguimiento de proyectos. El <strong>toggle de precios</strong> es un must-have para landing pages de SaaS con planes; el descuento visual al activar "Anual" aumenta significativamente las conversiones. Los <strong>toasts</strong> mejoran la percepción de calidad en cualquier aplicación porque dan feedback inmediato a cada acción del usuario sin interrumpir su flujo de trabajo.
  </div>
</div>
`;


function updateCounts(container) {
  var colIds = ['kb-todo', 'kb-prog', 'kb-done'];
  colIds.forEach(function(id) {
    var col = container.querySelector('#' + id);
    var countEl = container.querySelector('#count-' + id);
    if (col && countEl) {
      countEl.textContent = col.querySelectorAll('.k-item').length;
    }
  });
}

function showToast(msg) {
  var container = document.getElementById('toast-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981"></i> ' + msg;
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('hiding');
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
  }, 3000);
}

function onMount(container) {
  // Kanban Sortable
  var groups = ['kb-todo', 'kb-prog', 'kb-done'];
  groups.forEach(function(id) {
    var el = container.querySelector('#' + id);
    if (el) {
      new Sortable(el, {
        group: 'kanban-shared',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function() { updateCounts(container); }
      });
    }
  });

  // Initial counts
  updateCounts(container);

  // Billing Toggle
  var toggle = container.querySelector('#billing-toggle');
  var prices = container.querySelectorAll('.price-val');
  if (toggle) {
    toggle.addEventListener('change', function(e) {
      var isAnnual = e.target.checked;
      prices.forEach(function(el) {
        el.style.opacity = '0';
        setTimeout(function() {
          el.textContent = isAnnual ? el.dataset.a : el.dataset.m;
          el.style.opacity = '1';
        }, 150);
      });
    });
    prices.forEach(function(el) { el.style.transition = 'opacity 0.15s'; });
  }

  // Toast triggers
  container.querySelectorAll('.toast-trigger').forEach(function(btn) {
    btn.addEventListener('click', function() {
      showToast(btn.dataset.msg || 'Accion realizada');
    });
  });
}

export function initAdvanced() {
  registerComponent({
    id: 'advanced-comps',
    title: 'Kanban, Planes & Notificaciones',
    icon: 'fa-solid fa-rocket',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
