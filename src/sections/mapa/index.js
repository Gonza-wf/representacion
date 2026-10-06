import { registerComponent } from '../../../main.js';
import L from 'leaflet';

// ─────────────────────────────────────────────
// Mapa Interactivo — Leaflet + OpenStreetMap
// ─────────────────────────────────────────────

var BRANCHES = [
  { name:'Palermo',    addr:'Av. Santa Fe 3245',   phone:'(011) 4831-0000', hours:'L-V 9-18hs', dist:'0.8 km', lat:-34.5879, lng:-58.4196 },
  { name:'Microcentro',addr:'Florida 550',          phone:'(011) 4311-5500', hours:'L-V 8-19hs', dist:'1.2 km', lat:-34.6037, lng:-58.3736 },
  { name:'Belgrano',   addr:'Cabildo 2040',         phone:'(011) 4783-2200', hours:'L-V 9-18hs', dist:'3.5 km', lat:-34.5614, lng:-58.4563 },
  { name:'San Telmo',  addr:'Defensa 890',          phone:'(011) 4362-1100', hours:'L-S 10-20hs', dist:'2.1 km', lat:-34.6201, lng:-58.3698 },
  { name:'Recoleta',   addr:'Callao 1450',          phone:'(011) 4804-3300', hours:'L-V 9-18hs', dist:'1.8 km', lat:-34.5942, lng:-58.3975 },
  { name:'Villa Crespo',addr:'Thames 880',          phone:'(011) 4857-6600', hours:'L-S 10-19hs', dist:'2.9 km', lat:-34.5987, lng:-58.4326 }
];

const CENTER = [-34.6037, -58.3816];

const html = `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<div class="mapa-wrap">

  <div class="mapa-layout">

    <!-- Map container -->
    <div class="mapa-left">
      <div class="mapa-controls">
        <button class="map-ctrl-btn active" id="map-style-streets"><i class="fa-solid fa-map"></i> Calles</button>
        <button class="map-ctrl-btn" id="map-style-dark"><i class="fa-solid fa-moon"></i> Oscuro</button>
        <button class="map-ctrl-btn" id="map-center-btn"><i class="fa-solid fa-crosshairs"></i> Centrar</button>
        <button class="map-ctrl-btn map-lock-btn" id="map-lock-btn" style="display:none">
          <i class="fa-solid fa-lock"></i> Bloquear (deslizar pág.)
        </button>
      </div>
      <div class="map-stage">
        <div id="map-container" class="map-container-el"></div>
        <!-- Scroll Guard for Mobile -->
        <div class="map-touch-guard" id="map-touch-guard">
          <div class="guard-pill">
            <i class="fa-solid fa-hand-pointer"></i>
            <span>Tocar para mover el mapa</span>
            <small>Desliza para seguir leyendo la página</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Branches panel -->
    <div class="mapa-right">
      <div class="mapa-panel-title">
        <i class="fa-solid fa-store"></i> Nuestras Sucursales
        <span class="mapa-swipe-hint"><i class="fa-solid fa-arrows-left-right"></i> Desliza</span>
      </div>
      <div class="mapa-branches" id="mapa-branches"></div>
    </div>

  </div>

</div>
`;

const css = `
<style>
  .mapa-wrap { padding:1.25rem 1rem; width:100%; max-width:100%; box-sizing:border-box; }
  .mapa-layout { display:grid; grid-template-columns:1.55fr 1fr; border:1px solid var(--border-color); border-radius:var(--radius-lg); overflow:hidden; width:100%; min-width:0; }

  .mapa-left { position:relative; min-width:0; display:flex; flex-direction:column; }
  .mapa-controls { display:flex; gap:0.4rem; padding:0.65rem 0.75rem; background:var(--surface-color); border-bottom:1px solid var(--border-color); flex-wrap:wrap; align-items:center; }
  .map-ctrl-btn { padding:0.3rem 0.75rem; border:1.5px solid var(--border-color); border-radius:999px; background:var(--bg-color); color:var(--text-secondary); font-size:0.78rem; cursor:pointer; font-family:var(--font); transition:var(--transition); display:inline-flex; align-items:center; gap:0.35rem; }
  .map-ctrl-btn.active { background:var(--primary-color); color:white; border-color:var(--primary-color); }
  .map-lock-btn { margin-left:auto; background:rgba(239,68,68,0.1); border-color:#ef4444; color:#ef4444; }
  .map-lock-btn:hover { background:#ef4444; color:white; }

  .map-stage { position:relative; width:100%; min-width:0; }
  .map-container-el { height:430px; width:100%; z-index:1; }

  /* Mobile scroll guard overlay */
  .map-touch-guard {
    position:absolute; inset:0; z-index:500;
    background:rgba(15,23,42,0.4); backdrop-filter:blur(1.5px);
    display:none; align-items:center; justify-content:center;
    cursor:pointer; transition:opacity 0.25s ease; user-select:none;
    padding:1rem;
  }
  .map-touch-guard.hidden { opacity:0; pointer-events:none; }
  .guard-pill {
    background:var(--surface-color); border:1.5px solid var(--primary-color);
    border-radius:var(--radius-lg); padding:0.75rem 1.25rem;
    display:flex; flex-direction:column; align-items:center; gap:0.25rem;
    box-shadow:var(--shadow-lg); text-align:center;
  }
  .guard-pill i { color:var(--primary-color); font-size:1.3rem; }
  .guard-pill span { font-weight:700; font-size:0.88rem; color:var(--text-primary); }
  .guard-pill small { font-size:0.72rem; color:var(--text-muted); }

  /* Right panel */
  .mapa-right { background:var(--surface-color); border-left:1px solid var(--border-color); display:flex; flex-direction:column; min-width:0; }
  .mapa-panel-title { padding:0.85rem 1rem; font-weight:700; font-size:0.92rem; border-bottom:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; }
  .mapa-swipe-hint { font-size:0.72rem; color:var(--text-muted); font-weight:normal; display:none; }
  .mapa-branches { flex:1; overflow-y:auto; max-height:430px; }

  .branch-card { padding:0.85rem 1rem; border-bottom:1px solid var(--border-color); cursor:pointer; transition:var(--transition); box-sizing:border-box; }
  .branch-card:last-child { border-bottom:none; }
  .branch-card:hover { background:rgba(59,130,246,0.05); }
  .branch-card.active { background:rgba(59,130,246,0.08); border-left:3px solid var(--primary-color); }
  .branch-name { font-weight:700; font-size:0.88rem; display:flex; align-items:center; justify-content:space-between; margin-bottom:0.25rem; }
  .branch-dist { font-size:0.7rem; background:rgba(59,130,246,0.1); color:var(--primary-color); padding:0.12rem 0.45rem; border-radius:999px; font-weight:700; }
  .branch-addr { font-size:0.78rem; color:var(--text-muted); margin-bottom:0.25rem; }
  .branch-meta { font-size:0.72rem; color:var(--text-secondary); display:flex; gap:0.75rem; flex-wrap:wrap; }
  .branch-meta span { display:flex; align-items:center; gap:0.25rem; }
  .branch-fly-btn { margin-top:0.45rem; padding:0.22rem 0.6rem; border:1px solid var(--primary-color); border-radius:var(--radius-sm); background:transparent; color:var(--primary-color); font-size:0.72rem; cursor:pointer; font-family:var(--font); transition:var(--transition); }
  .branch-fly-btn:hover { background:var(--primary-color); color:white; }

  /* ──────────────────────────────────────────
     MOBILE RESPONSIVE & SIMULATOR OVERRIDES
     ────────────────────────────────────────── */
  @media(max-width:768px) {
    .mapa-layout { grid-template-columns:1fr; }
    .map-container-el { height:250px !important; }
    .map-touch-guard { display:flex; }
    .mapa-right { border-left:none; border-top:1px solid var(--border-color); }
    .mapa-swipe-hint { display:inline-flex; align-items:center; gap:0.25rem; }
    .mapa-branches {
      display:flex !important;
      flex-direction:row !important;
      overflow-x:auto !important;
      overflow-y:hidden !important;
      -webkit-overflow-scrolling:touch;
      scroll-snap-type:x mandatory;
      gap:0.6rem;
      padding:0.75rem !important;
      max-height:none !important;
    }
    .branch-card {
      flex:0 0 240px !important;
      scroll-snap-align:start;
      border:1.5px solid var(--border-color) !important;
      border-radius:var(--radius-md) !important;
      background:var(--bg-color) !important;
      padding:0.75rem !important;
    }
    .branch-card.active {
      border-color:var(--primary-color) !important;
      background:rgba(59,130,246,0.08) !important;
      border-left:1.5px solid var(--primary-color) !important;
    }
  }

  /* Viewport simulator overrides */
  #showcase-viewport.device-mobile .mapa-layout { grid-template-columns:1fr; }
  #showcase-viewport.device-mobile .map-container-el { height:250px !important; }
  #showcase-viewport.device-mobile .map-touch-guard { display:flex; }
  #showcase-viewport.device-mobile .mapa-right { border-left:none; border-top:1px solid var(--border-color); }
  #showcase-viewport.device-mobile .mapa-swipe-hint { display:inline-flex; }
  #showcase-viewport.device-mobile .mapa-branches {
    display:flex !important;
    flex-direction:row !important;
    overflow-x:auto !important;
    overflow-y:hidden !important;
    -webkit-overflow-scrolling:touch;
    scroll-snap-type:x mandatory;
    gap:0.6rem;
    padding:0.75rem !important;
    max-height:none !important;
  }
  #showcase-viewport.device-mobile .branch-card {
    flex:0 0 230px !important;
    scroll-snap-align:start;
    border:1.5px solid var(--border-color) !important;
    border-radius:var(--radius-md) !important;
    background:var(--bg-color) !important;
    padding:0.75rem !important;
  }
</style>
`;

const code = `// Leaflet map with Mobile Scroll-Guard
const map = L.map(el, { zoomControl: false }).setView(CENTER, 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// On mobile: single-finger swipe scrolls the PAGE
// Tap guard to activate map pan/zoom
guard.addEventListener('click', () => {
  guard.classList.add('hidden');
  lockBtn.style.display = 'inline-flex';
  map.dragging.enable();
});

// Lock button restores smooth page scrolling
lockBtn.addEventListener('click', () => {
  guard.classList.remove('hidden');
  lockBtn.style.display = 'none';
  map.dragging.disable();
});
`;

const explanation = `
<h3>Mapa Interactivo con Protección Táctil para Móviles</h3>
<ul>
  <li><strong>Sin bloqueo de scroll en móviles:</strong> Incluye un protector táctil para que el usuario pueda deslizar la página naturalmente sin que el mapa capture su dedo. Al tocar "Activar", puede mover y hacer zoom libremente.</li>
  <li><strong>Sucursales en carrusel horizontal móvil:</strong> En pantallas táctiles, la lista de sucursales se convierte en una tira horizontal con desplazamiento táctil independiente, evitando que bloquee el scroll vertical de la página.</li>
  <li><strong>OpenStreetMap & Modo Oscuro:</strong> Cambio instantáneo entre mapa estándar y mapa oscuro CartoDB.</li>
  <li><strong>Interacción fluida:</strong> Al tocar cualquier sucursal, el mapa vuela suavemente (<code>flyTo</code>) hacia ella y abre su popup descriptivo.</li>
</ul>
`;

function onMount(container) {
  var mapEl = container.querySelector('#map-container');
  if (!mapEl) return;

  var guardEl   = container.querySelector('#map-touch-guard');
  var lockBtn   = container.querySelector('#map-lock-btn');

  // Check if touch or mobile
  var isMobileViewport = window.innerWidth <= 768 || document.getElementById('showcase-viewport').classList.contains('device-mobile');

  var map = L.map(mapEl, {
    zoomControl: false,
    dragging: !isMobileViewport,
    touchZoom: !isMobileViewport,
    scrollWheelZoom: false
  }).setView(CENTER, 12);

  var streetTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  });

  var darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB',
    maxZoom: 19
  });

  streetTiles.addTo(map);

  // Zoom controls
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Coverage circle
  L.circle(CENTER, {
    radius: 3000,
    color: '#3b82f6',
    fillColor: '#3b82f6',
    fillOpacity: 0.06,
    weight: 2,
    dashArray: '8 4'
  }).addTo(map).bindPopup('<strong>Zona de cobertura (3 km)</strong>');

  // Markers
  var markers = [];
  var activeMarkerIdx = -1;

  BRANCHES.forEach(function(branch, i) {
    var marker = L.circleMarker([branch.lat, branch.lng], {
      radius: 10,
      fillColor: '#3b82f6',
      color: 'white',
      weight: 2.5,
      fillOpacity: 0.9,
      bubblingMouseEvents: false
    }).addTo(map);

    marker.bindPopup(
      '<strong style="font-size:0.95rem">' + branch.name + '</strong><br>' +
      '<span style="color:#6b7280;font-size:0.82rem">' + branch.addr + '</span><br>' +
      '<span style="color:#6b7280;font-size:0.82rem">' + branch.phone + '</span><br>' +
      '<span style="color:#6b7280;font-size:0.82rem">' + branch.hours + '</span>'
    );

    (function(idx) {
      marker.on('click', function() { activateBranch(idx); });
    })(i);

    markers.push(marker);
  });

  function activateBranch(idx) {
    if (activeMarkerIdx >= 0 && markers[activeMarkerIdx]) {
      markers[activeMarkerIdx].setStyle({ fillColor: '#3b82f6' });
      var oldCard = container.querySelectorAll('.branch-card')[activeMarkerIdx];
      if (oldCard) oldCard.classList.remove('active');
    }
    activeMarkerIdx = idx;
    markers[idx].setStyle({ fillColor: '#10b981' });
    markers[idx].openPopup();
    map.flyTo([BRANCHES[idx].lat, BRANCHES[idx].lng], 15, { duration: 1.2 });
    var card = container.querySelectorAll('.branch-card')[idx];
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Build branch cards
  var branchesEl = container.querySelector('#mapa-branches');
  BRANCHES.forEach(function(branch, i) {
    var card = document.createElement('div');
    card.className = 'branch-card';

    var nameRow = document.createElement('div');
    nameRow.className = 'branch-name';
    var nameSpan = document.createElement('span');
    nameSpan.textContent = branch.name;
    var distBadge = document.createElement('span');
    distBadge.className = 'branch-dist';
    distBadge.textContent = branch.dist;
    nameRow.appendChild(nameSpan);
    nameRow.appendChild(distBadge);

    var addr = document.createElement('div');
    addr.className = 'branch-addr';
    addr.textContent = '📍 ' + branch.addr;

    var meta = document.createElement('div');
    meta.className = 'branch-meta';
    var phone = document.createElement('span');
    phone.innerHTML = '<i class="fa-solid fa-phone"></i> ' + branch.phone;
    var hours = document.createElement('span');
    hours.innerHTML = '<i class="fa-regular fa-clock"></i> ' + branch.hours;
    meta.appendChild(phone);
    meta.appendChild(hours);

    var flyBtn = document.createElement('button');
    flyBtn.className = 'branch-fly-btn';
    flyBtn.textContent = '🗺️ Ver en Mapa';
    (function(idx) {
      flyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        activateBranch(idx);
      });
    })(i);

    card.appendChild(nameRow);
    card.appendChild(addr);
    card.appendChild(meta);
    card.appendChild(flyBtn);

    (function(idx) {
      card.addEventListener('click', function() { activateBranch(idx); });
    })(i);

    branchesEl.appendChild(card);
  });

  // Mobile guard interactions
  guardEl.addEventListener('click', function() {
    guardEl.classList.add('hidden');
    lockBtn.style.display = 'inline-flex';
    map.dragging.enable();
    map.touchZoom.enable();
  });

  lockBtn.addEventListener('click', function() {
    guardEl.classList.remove('hidden');
    lockBtn.style.display = 'none';
    map.dragging.disable();
    map.touchZoom.disable();
  });

  // Map style toggles
  var isStreet = true;
  container.querySelector('#map-style-streets').addEventListener('click', function() {
    if (isStreet) return;
    map.removeLayer(darkTiles);
    streetTiles.addTo(map);
    isStreet = true;
    container.querySelector('#map-style-streets').classList.add('active');
    container.querySelector('#map-style-dark').classList.remove('active');
  });

  container.querySelector('#map-style-dark').addEventListener('click', function() {
    if (!isStreet) return;
    map.removeLayer(streetTiles);
    darkTiles.addTo(map);
    isStreet = false;
    container.querySelector('#map-style-dark').classList.add('active');
    container.querySelector('#map-style-streets').classList.remove('active');
  });

  container.querySelector('#map-center-btn').addEventListener('click', function() {
    map.flyTo(CENTER, 12, { duration: 1.5 });
    if (activeMarkerIdx >= 0) {
      markers[activeMarkerIdx].setStyle({ fillColor: '#3b82f6' });
      var card = container.querySelectorAll('.branch-card')[activeMarkerIdx];
      if (card) card.classList.remove('active');
      activeMarkerIdx = -1;
    }
  });

  // ResizeObserver to keep Leaflet map properly sized whenever parent changes
  var ro = new ResizeObserver(function() {
    if (map) map.invalidateSize();
  });
  ro.observe(mapEl);
  setTimeout(function() { map.invalidateSize(); }, 300);
}

export function initMapa() {
  registerComponent({
    id: 'mapa',
    title: 'Mapa Interactivo — Leaflet + OpenStreetMap',
    icon: 'fa-solid fa-map-location-dot',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
