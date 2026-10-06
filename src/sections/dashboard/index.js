import { registerComponent } from '../../../main.js';
import Chart from 'chart.js/auto';

// ─────────────────────────────────────────────
// Dashboard — KPIs, Chart, Table, Stock Panel
// ─────────────────────────────────────────────

var ORDERS = [
  { id:'#4821', client:'María García',    status:'completado', total:1250 },
  { id:'#4820', client:'Carlos López',    status:'pendiente',  total:899  },
  { id:'#4819', client:'Ana Martínez',    status:'completado', total:2100 },
  { id:'#4818', client:'Pedro Sánchez',   status:'cancelado',  total:450  },
  { id:'#4817', client:'Laura Jiménez',   status:'completado', total:3200 },
  { id:'#4816', client:'Diego Torres',    status:'pendiente',  total:760  },
  { id:'#4815', client:'Sofia Ramírez',   status:'completado', total:1890 }
];

var STOCK = [
  { name:'iPhone 15 Pro',      cat:'Tech',       stock:8,   max:100 },
  { name:'AirPods Pro',        cat:'Audio',      stock:45,  max:80  },
  { name:'MacBook Air M2',     cat:'Tech',       stock:3,   max:50  },
  { name:'Funda MagSafe',      cat:'Accesorios', stock:120, max:100 },
  { name:'Teclado Logitech',   cat:'Tech',       stock:22,  max:60  },
  { name:'Monitor 4K LG',      cat:'Tech',       stock:2,   max:30  },
  { name:'Cable USB-C',        cat:'Accesorios', stock:200, max:150 },
  { name:'Soporte Laptop',     cat:'Accesorios', stock:18,  max:40  }
];

const html = `
<div class="dash-wrap">

  <!-- KPI Cards -->
  <div class="kpi-row" id="kpi-row"></div>

  <!-- Chart + Table row -->
  <div class="dash-main">
    <div class="dash-chart-card">
      <div class="dash-section-title">
        <span><i class="fa-solid fa-chart-line"></i> Ventas Semanales</span>
        <div class="chart-legend">
          <span class="legend-dot" style="background:#3b82f6"></span> Ingresos
          <span class="legend-dot" style="background:#8b5cf6;margin-left:8px"></span> Órdenes
        </div>
      </div>
      <div class="chart-container">
        <canvas id="dash-chart"></canvas>
      </div>
    </div>

    <div class="dash-table-card">
      <div class="dash-section-title"><span><i class="fa-solid fa-bag-shopping"></i> Últimos Pedidos</span></div>
      <div class="table-scroll">
        <table class="dash-table" id="orders-table">
          <thead>
            <tr>
              <th data-col="id">ID <span class="sort-arrow">↕</span></th>
              <th data-col="client">Cliente <span class="sort-arrow">↕</span></th>
              <th data-col="status">Estado</th>
              <th data-col="total">Total <span class="sort-arrow">↕</span></th>
            </tr>
          </thead>
          <tbody id="orders-tbody"></tbody>
        </table>
      </div>
      <div class="table-pagination" id="table-pagination"></div>
    </div>
  </div>

  <!-- Stock Panel -->
  <div class="dash-stock-card">
    <div class="dash-section-title">
      <span><i class="fa-solid fa-boxes-stacked"></i> Inventario & Stock en Tiempo Real</span>
      <div class="stock-filters">
        <button class="stock-filter active" data-filter="todos">Todos</button>
        <button class="stock-filter" data-filter="critico">Crítico</button>
        <button class="stock-filter" data-filter="normal">Normal</button>
        <button class="stock-filter" data-filter="excedente">Excedente</button>
      </div>
    </div>
    <div class="stock-grid" id="stock-grid"></div>
  </div>

  <!-- Toast -->
  <div class="dash-toast" id="dash-toast"></div>

</div>
`;

const css = `
<style>
  .dash-wrap {
    padding:1.25rem 1rem;
    display:flex;
    flex-direction:column;
    gap:1.25rem;
    width:100%;
    max-width:100%;
    box-sizing:border-box;
    min-width:0;
    overflow-x:hidden;
  }

  /* KPI row */
  .kpi-row {
    display:grid;
    grid-template-columns:repeat(4, 1fr);
    gap:1rem;
    width:100%;
    min-width:0;
    box-sizing:border-box;
  }
  @media(max-width:768px) { .kpi-row { grid-template-columns:repeat(2,1fr); gap:0.5rem; } }
  @media(max-width:400px) { .kpi-row { grid-template-columns:1fr 1fr; gap:0.4rem; } }

  .kpi-card {
    background:var(--surface-color);
    border:1px solid var(--border-color);
    border-radius:var(--radius-lg);
    padding:1rem;
    min-width:0;
    box-sizing:border-box;
  }
  .kpi-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; font-size:0.8rem; color:var(--text-muted); font-weight:600; }
  .kpi-icon { width:32px; height:32px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:0.95rem; flex-shrink:0; }
  .kpi-value { font-size:1.4rem; font-weight:800; line-height:1.1; margin-bottom:0.25rem; }
  .kpi-trend { font-size:0.75rem; font-weight:600; }
  .kpi-trend.up { color:#10b981; }
  .kpi-trend.down { color:#ef4444; }

  /* Main row */
  .dash-main {
    display:grid;
    grid-template-columns:1.35fr 1fr;
    gap:1rem;
    width:100%;
    min-width:0;
    box-sizing:border-box;
  }
  @media(max-width:768px) { .dash-main { grid-template-columns:1fr; } }

  .dash-chart-card, .dash-table-card, .dash-stock-card {
    background:var(--surface-color);
    border:1px solid var(--border-color);
    border-radius:var(--radius-lg);
    padding:1.1rem;
    min-width:0;
    max-width:100%;
    box-sizing:border-box;
    overflow:hidden;
  }
  @media(max-width:600px) {
    .dash-wrap { padding:0.75rem 0.4rem; gap:0.85rem; }
    .dash-chart-card, .dash-table-card, .dash-stock-card { padding:0.85rem 0.65rem; }
  }

  .dash-section-title {
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap;
    gap:0.5rem; margin-bottom:1rem; font-weight:700; font-size:0.92rem;
  }
  .chart-legend { display:flex; align-items:center; font-size:0.75rem; color:var(--text-muted); }
  .legend-dot { width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:4px; }
  .chart-container { position:relative; height:230px; width:100%; min-width:0; max-width:100%; overflow:hidden; }

  /* Table */
  .table-scroll { overflow-x:auto; width:100%; max-width:100%; -webkit-overflow-scrolling:touch; }
  .dash-table { width:100%; min-width:280px; border-collapse:collapse; font-size:0.82rem; }
  .dash-table th { padding:0.45rem 0.5rem; text-align:left; font-size:0.75rem; color:var(--text-muted); border-bottom:1.5px solid var(--border-color); cursor:pointer; white-space:nowrap; }
  .dash-table th:hover { color:var(--primary-color); }
  .sort-arrow { font-size:0.7rem; margin-left:2px; }
  .dash-table td { padding:0.5rem 0.5rem; border-bottom:1px solid var(--border-color); color:var(--text-secondary); vertical-align:middle; font-size:0.82rem; }
  .dash-table tbody tr:hover { background:var(--bg-color); }
  .status-badge { padding:0.18rem 0.5rem; border-radius:999px; font-size:0.7rem; font-weight:700; white-space:nowrap; }
  .status-completado { background:rgba(16,185,129,0.12); color:#10b981; }
  .status-pendiente  { background:rgba(245,158,11,0.12);  color:#f59e0b; }
  .status-cancelado  { background:rgba(239,68,68,0.12);   color:#ef4444; }
  .table-pagination { display:flex; align-items:center; justify-content:space-between; padding-top:0.75rem; font-size:0.78rem; color:var(--text-muted); }
  .pg-btns { display:flex; gap:0.25rem; }
  .pg-btn { padding:0.2rem 0.55rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--bg-color); color:var(--text-secondary); cursor:pointer; font-family:var(--font); font-size:0.78rem; }
  .pg-btn.active { background:var(--primary-color); color:white; border-color:var(--primary-color); }
  .pg-btn:disabled { opacity:0.4; cursor:default; }

  /* Stock */
  .stock-filters { display:flex; gap:0.35rem; flex-wrap:wrap; }
  .stock-filter { padding:0.25rem 0.65rem; border:1.5px solid var(--border-color); border-radius:999px; background:transparent; color:var(--text-muted); font-size:0.75rem; cursor:pointer; font-family:var(--font); transition:var(--transition); }
  .stock-filter.active { background:var(--primary-color); color:white; border-color:var(--primary-color); }
  .stock-grid { display:flex; flex-direction:column; gap:0.65rem; width:100%; min-width:0; }
  .stock-row {
    display:flex;
    flex-wrap:wrap;
    align-items:center;
    justify-content:space-between;
    gap:0.65rem;
    padding:0.65rem 0.85rem;
    border-radius:var(--radius-md);
    background:var(--bg-color);
    border:1px solid var(--border-color);
    min-width:0;
    box-sizing:border-box;
  }
  .stock-info { flex:1 1 110px; min-width:0; }
  .stock-name { font-weight:600; font-size:0.88rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .stock-cat { font-size:0.72rem; color:var(--text-muted); }
  .stock-bar-wrap { flex:2 1 120px; min-width:0; display:flex; flex-direction:column; gap:4px; }
  @media(max-width:540px) { .stock-bar-wrap { flex:1 1 100%; order:3; } }
  .stock-bar-bg { height:6px; border-radius:3px; background:var(--border-color); overflow:hidden; }
  .stock-bar-fill { height:100%; border-radius:3px; transition:width 1s cubic-bezier(.4,0,.2,1); }
  .stock-qty { font-size:0.72rem; color:var(--text-muted); text-align:right; }
  .stock-right { flex:0 0 auto; display:flex; align-items:center; gap:0.35rem; }
  .stock-badge { padding:0.18rem 0.5rem; border-radius:999px; font-size:0.7rem; font-weight:700; white-space:nowrap; }
  .badge-critico   { background:rgba(239,68,68,0.12);    color:#ef4444; }
  .badge-normal    { background:rgba(16,185,129,0.12);   color:#10b981; }
  .badge-excedente { background:rgba(59,130,246,0.12);   color:#3b82f6; }
  .reponer-btn { padding:0.18rem 0.55rem; border:1px solid #ef4444; border-radius:var(--radius-sm); background:transparent; color:#ef4444; font-size:0.7rem; cursor:pointer; font-family:var(--font); transition:var(--transition); white-space:nowrap; }
  .reponer-btn:hover { background:#ef4444; color:white; }

  /* Toast */
  .dash-toast {
    position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%) translateY(100px);
    background:var(--surface-color); border:1px solid var(--border-color);
    border-radius:var(--radius-md); padding:0.85rem 1.5rem;
    box-shadow:var(--shadow-lg); font-size:0.9rem; white-space:nowrap;
    opacity:0; transition:all 0.35s cubic-bezier(.4,0,.2,1); z-index:999; pointer-events:none;
  }
  .dash-toast.show { transform:translateX(-50%) translateY(0); opacity:1; }
</style>
`;

const code = `// KPI cards
const kpis = [
  { label:'Usuarios Activos', value:'2,450', trend:'+12%', dir:'up', icon:'👥', color:'#3b82f6' },
  // ...
];

// Chart.js with ResizeObserver
const chart = new Chart(canvas, { type: 'line', data: {...}, options: { responsive: true, maintainAspectRatio: false } });
const ro = new ResizeObserver(() => chart.resize());
ro.observe(canvas.parentElement);

// Sortable table
th.addEventListener('click', () => sortTable(col));

// Stock: filter by status
filterBtn.addEventListener('click', () => renderStock(filterStock(activeFilter)));
`;

const explanation = `
<h3>Dashboard Empresarial Completo</h3>
<ul>
  <li><strong>4 KPIs animados:</strong> Usuarios activos, ingresos, órdenes y stock crítico con badges de tendencia.</li>
  <li><strong>Gráfico de ventas:</strong> Chart.js con ResizeObserver para adaptarse al contenedor.</li>
  <li><strong>Tabla de pedidos:</strong> Ordenable por columna, paginada de 4 en 4.</li>
  <li><strong>Panel de Stock en tiempo real:</strong> Barra de progreso por producto, badges de estado (Crítico/Normal/Excedente) y botón de reposición instantánea.</li>
</ul>
`;

// helpers — note: these are top-level vars, not inside onMount, so string concat rule is relaxed
var KPI_DATA = [
  { label:'Usuarios Activos', value:'2,450', trend:'+12%', dir:'up',   icon:'<i class="fa-solid fa-users"></i>', color:'#3b82f6' },
  { label:'Ingresos Mensuales', value:'$34,500', trend:'+8%', dir:'up', icon:'<i class="fa-solid fa-circle-dollar-sign"></i>', color:'#8b5cf6' },
  { label:'Órdenes del Mes',  value:'843',   trend:'+5%',  dir:'up',   icon:'<i class="fa-solid fa-bag-shopping"></i>', color:'#10b981' },
  { label:'Stock Crítico',    value:'3',     trend:'¡Urgente!', dir:'down', icon:'<i class="fa-solid fa-triangle-exclamation"></i>', color:'#ef4444' }
];

function onMount(container) {
  var toastEl = container.querySelector('#dash-toast');

  function showToast(msg) {
    if (window.showToast) {
      window.showToast({
        title: 'Gestión de Inventario',
        message: msg,
        type: 'success',
        duration: 3500,
        icon: 'fa-solid fa-boxes-stacked'
      });
    } else {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      setTimeout(function() { toastEl.classList.remove('show'); }, 3000);
    }
  }

  // --- KPIs ---
  var kpiRow = container.querySelector('#kpi-row');
  KPI_DATA.forEach(function(k) {
    var card = document.createElement('div');
    card.className = 'kpi-card';

    var header = document.createElement('div');
    header.className = 'kpi-header';
    var label = document.createElement('span');
    label.textContent = k.label;
    var ico = document.createElement('div');
    ico.className = 'kpi-icon';
    ico.style.background = k.color + '22';
    ico.innerHTML = k.icon;
    header.appendChild(label);
    header.appendChild(ico);

    var val = document.createElement('div');
    val.className = 'kpi-value';
    val.textContent = k.value;
    val.style.color = k.color;

    var trend = document.createElement('div');
    trend.className = 'kpi-trend ' + k.dir;
    trend.textContent = (k.dir === 'up' ? '▲ ' : '▼ ') + k.trend;

    card.appendChild(header);
    card.appendChild(val);
    card.appendChild(trend);
    kpiRow.appendChild(card);
  });

  // --- Chart.js ---
  var canvas = container.querySelector('#dash-chart');
  var chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
      datasets: [
        {
          label: 'Ingresos ($)',
          data: [4200, 5800, 3900, 7100, 6300, 8900, 7600],
          borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true, tension: 0.4, pointRadius: 4, yAxisID: 'y'
        },
        {
          label: 'Órdenes',
          data: [42, 58, 35, 71, 63, 89, 74],
          borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.08)',
          fill: false, tension: 0.4, pointRadius: 4, yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { size: 9 }, maxTicksLimit: 7 }, grid: { color: 'rgba(128,128,128,0.08)' } },
        y: {
          position: 'left',
          ticks: {
            font: { size: 9 },
            maxTicksLimit: 5,
            callback: function(v) { return v >= 1000 ? (v / 1000) + 'k' : v; }
          },
          grid: { color: 'rgba(128,128,128,0.08)' }
        },
        y1: {
          position: 'right',
          ticks: { font: { size: 9 }, maxTicksLimit: 5 },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });

  var ro = new ResizeObserver(function() { if (chart) chart.resize(); });
  ro.observe(canvas.parentElement);

  // --- Orders table with sort + pagination ---
  var ordersData = ORDERS.slice();
  var orderPage = 1;
  var orderPageSize = 4;
  var sortCol = 'id';
  var sortDir = 1;

  function renderOrders() {
    var tbody = container.querySelector('#orders-tbody');
    tbody.innerHTML = '';
    var sorted = ordersData.slice().sort(function(a, b) {
      var av = a[sortCol], bv = b[sortCol];
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
    var start = (orderPage - 1) * orderPageSize;
    var page  = sorted.slice(start, start + orderPageSize);
    page.forEach(function(o) {
      var tr = document.createElement('tr');
      var cells = [o.id, o.client, '', o.total];
      var keys  = ['id', 'client', 'status', 'total'];
      keys.forEach(function(k, i) {
        var td = document.createElement('td');
        if (k === 'status') {
          var badge = document.createElement('span');
          badge.className = 'status-badge status-' + o.status;
          badge.textContent = o.status.charAt(0).toUpperCase() + o.status.slice(1);
          td.appendChild(badge);
        } else {
          td.textContent = k === 'total' ? '$' + o[k] : o[k];
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    renderPagination(sorted.length);
  }

  function renderPagination(total) {
    var pg = container.querySelector('#table-pagination');
    pg.innerHTML = '';
    var totalPages = Math.ceil(total / orderPageSize);
    var info = document.createElement('span');
    info.textContent = 'Página ' + orderPage + ' de ' + totalPages;
    var btns = document.createElement('div');
    btns.className = 'pg-btns';
    for (var i = 1; i <= totalPages; i++) {
      var btn = document.createElement('button');
      btn.className = 'pg-btn' + (i === orderPage ? ' active' : '');
      btn.textContent = i;
      (function(page) {
        btn.addEventListener('click', function() { orderPage = page; renderOrders(); });
      })(i);
      btns.appendChild(btn);
    }
    pg.appendChild(info);
    pg.appendChild(btns);
  }

  container.querySelector('#orders-table').querySelectorAll('th[data-col]').forEach(function(th) {
    th.addEventListener('click', function() {
      var col = th.dataset.col;
      if (col === 'status') return;
      if (sortCol === col) sortDir *= -1; else { sortCol = col; sortDir = 1; }
      orderPage = 1;
      renderOrders();
    });
  });

  renderOrders();

  // --- Stock Panel ---
  var activeStockFilter = 'todos';

  function getStockStatus(item) {
    var pct = item.stock / item.max;
    if (pct < 0.2) return 'critico';
    if (pct > 0.85) return 'excedente';
    return 'normal';
  }

  function renderStock(items) {
    var grid = container.querySelector('#stock-grid');
    grid.innerHTML = '';
    items.forEach(function(item) {
      var pct = Math.min(item.stock / item.max, 1);
      var status = getStockStatus(item);
      var barColor = status === 'critico' ? '#ef4444' : (status === 'excedente' ? '#3b82f6' : '#10b981');

      var row = document.createElement('div');
      row.className = 'stock-row';
      row.dataset.status = status;

      var info = document.createElement('div');
      info.className = 'stock-info';
      var name = document.createElement('div');
      name.className = 'stock-name';
      name.textContent = item.name;
      var cat = document.createElement('div');
      cat.className = 'stock-cat';
      cat.textContent = item.cat;
      info.appendChild(name);
      info.appendChild(cat);

      var barWrap = document.createElement('div');
      barWrap.className = 'stock-bar-wrap';
      var barBg = document.createElement('div');
      barBg.className = 'stock-bar-bg';
      var barFill = document.createElement('div');
      barFill.className = 'stock-bar-fill';
      barFill.style.background = barColor;
      barFill.style.width = '0%';
      setTimeout(function() { barFill.style.width = (pct * 100) + '%'; }, 100);
      barBg.appendChild(barFill);
      var qty = document.createElement('div');
      qty.className = 'stock-qty';
      qty.textContent = item.stock + ' / ' + item.max + ' unidades';
      barWrap.appendChild(barBg);
      barWrap.appendChild(qty);

      var right = document.createElement('div');
      right.className = 'stock-right';
      var badge = document.createElement('span');
      badge.className = 'stock-badge badge-' + status;
      badge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      right.appendChild(badge);

      if (status === 'critico') {
        var reponerBtn = document.createElement('button');
        reponerBtn.className = 'reponer-btn';
        reponerBtn.textContent = '⚡ Reponer';
        (function(itm, stockRow, fill) {
          reponerBtn.addEventListener('click', function() {
            var newStock = itm.max;
            fill.style.width = '100%';
            fill.style.background = '#10b981';
            stockRow.querySelector('.stock-qty').textContent = newStock + ' / ' + itm.max + ' unidades';
            stockRow.querySelector('.stock-badge').className = 'stock-badge badge-normal';
            stockRow.querySelector('.stock-badge').textContent = 'Normal';
            reponerBtn.remove();
            showToast('✅ Stock de ' + itm.name + ' repuesto correctamente');
          });
        })(item, row, barFill);
        right.appendChild(reponerBtn);
      }

      row.appendChild(info);
      row.appendChild(barWrap);
      row.appendChild(right);
      grid.appendChild(row);
    });
  }

  container.querySelectorAll('.stock-filter').forEach(function(btn) {
    btn.addEventListener('click', function() {
      container.querySelectorAll('.stock-filter').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeStockFilter = btn.dataset.filter;
      var filtered = activeStockFilter === 'todos' ? STOCK : STOCK.filter(function(i) { return getStockStatus(i) === activeStockFilter; });
      renderStock(filtered);
    });
  });

  renderStock(STOCK);
}

export function initDashboard() {
  registerComponent({
    id: 'dashboard',
    title: 'Dashboard Empresarial — KPIs, Gráficos & Stock',
    icon: 'fa-solid fa-chart-line',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
