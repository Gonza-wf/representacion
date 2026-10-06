import { registerComponent } from '../../../main.js';

// ─────────────────────────────────────────────
// Galleries — Before/After + Auto Carousel + Manual Slider + Masonry Lightbox
// ─────────────────────────────────────────────

var CAROUSEL_SLIDES = [
  { img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', title:'Dolomitas, Italia', sub:'Un paisaje de cuento' },
  { img:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80', title:'Costa de Amalfi', sub:'El sur de Italia' },
  { img:'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80', title:'Patagonia, Argentina', sub:'El fin del mundo' },
  { img:'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=80', title:'Selva Amazónica', sub:'El pulmón del mundo' },
  { img:'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1200&q=80', title:'Fiordos de Noruega', sub:'Majestuoso norte' }
];

var SLIDER_SLIDES = [
  { img:'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80', title:'Chicago, EE.UU.' },
  { img:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80', title:'Paris, Francia' },
  { img:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80', title:'Londres, UK' },
  { img:'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80', title:'Tokyo, Japón' }
];

var MASONRY_IMGS = [
  { img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80', caption:'Ferrari en pista', tall:true  },
  { img:'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=700&q=80', caption:'Gaming setup', tall:false },
  { img:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80', caption:'Montaña nevada', tall:true  },
  { img:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80', caption:'Restaurante íntimo', tall:false },
  { img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80', caption:'Playa tropical', tall:false },
  { img:'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?w=700&q=80', caption:'Cascada oculta', tall:true  },
  { img:'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=700&q=80', caption:'Café de specialty', tall:false },
  { img:'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=700&q=80', caption:'Santorini al atardecer', tall:true  }
];

var BEFORE_AFTER_PRESETS = {
  detailing: {
    label: 'Detailing Automotriz',
    beforeSrc: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80',
    afterSrc:  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80',
    beforeFilter: 'grayscale(0.85) contrast(0.8) brightness(0.6) blur(0.5px)',
    afterFilter:  'saturate(1.4) contrast(1.12) brightness(1.06)',
    beforeLabel: 'ANTES: Pintura rayada y opaca',
    afterLabel:  'DESPUÉS: Vitrificado cerámico'
  },
  interior: {
    label: 'Reforma de Interiores',
    beforeSrc: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    afterSrc:  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    beforeFilter: 'grayscale(0.9) brightness(0.52) contrast(0.88)',
    afterFilter:  'saturate(1.28) brightness(1.05) contrast(1.05)',
    beforeLabel:  'ANTES: Sin iluminación ni vida',
    afterLabel:   'DESPUÉS: Moderno y luminoso'
  },
  photo: {
    label: 'Edición Fotográfica',
    beforeSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    afterSrc:  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    beforeFilter: 'grayscale(1) brightness(0.6) contrast(0.8)',
    afterFilter:  'saturate(1.5) contrast(1.15) brightness(1.1)',
    beforeLabel:  'ANTES: Archivo RAW sin procesar',
    afterLabel:   'DESPUÉS: Color grading profesional'
  }
};

const html = `
<div class="gal-wrap">

  <!-- Section 1: Before / After -->
  <div class="gal-section">
    <div class="gal-sec-header">
      <div class="gal-sec-title"><span class="gal-sec-icon"><i class="fa-solid fa-code-compare"></i></span> Comparador Antes / Después</div>
      <p class="gal-sec-desc">Arrastrá el control para comparar. Seleccioná un preset de industria.</p>
    </div>
    <div class="ba-presets" id="ba-presets">
      <button class="ba-chip active" data-preset="detailing"><i class="fa-solid fa-car"></i> Detailing</button>
      <button class="ba-chip" data-preset="interior"><i class="fa-solid fa-house"></i> Reforma</button>
      <button class="ba-chip" data-preset="photo"><i class="fa-solid fa-camera"></i> Fotografía</button>
    </div>
    <div class="ba-container" id="ba-container">
      <div class="ba-before" id="ba-before">
        <img id="ba-before-img" src="" alt="Antes">
        <span class="ba-label ba-label-before" id="ba-label-before"></span>
      </div>
      <div class="ba-after" id="ba-after">
        <img id="ba-after-img" src="" alt="Después">
        <span class="ba-label ba-label-after" id="ba-label-after"></span>
      </div>
      <div class="ba-handle" id="ba-handle">
        <div class="ba-handle-line"></div>
        <div class="ba-handle-circle"><i class="fa-solid fa-arrows-left-right"></i></div>
        <div class="ba-handle-line"></div>
      </div>
      <input type="range" class="ba-range" id="ba-range" min="0" max="100" value="50">
    </div>
  </div>

  <!-- Section 2: Auto Carousel -->
  <div class="gal-section">
    <div class="gal-sec-header">
      <div class="gal-sec-title"><span class="gal-sec-icon"><i class="fa-solid fa-play"></i></span> Carrusel Automático</div>
      <p class="gal-sec-desc">Avanza solo cada 3 segundos. Hacé hover para pausarlo.</p>
    </div>
    <div class="carousel-wrap" id="carousel-wrap">
      <div class="carousel-track" id="carousel-track"></div>
      <div class="carousel-counter" id="carousel-counter">1 / 5</div>
      <div class="carousel-dots" id="carousel-dots"></div>
    </div>
  </div>

  <!-- Section 3: Manual Slider -->
  <div class="gal-section">
    <div class="gal-sec-header">
      <div class="gal-sec-title"><span class="gal-sec-icon"><i class="fa-solid fa-sliders"></i></span> Slider Manual</div>
      <p class="gal-sec-desc">Navegá con flechas o deslizá en pantallas táctiles.</p>
    </div>
    <div class="slider-wrap" id="slider-wrap">
      <button class="slider-btn slider-btn-prev" id="sl-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <div class="slider-viewport">
        <div class="slider-track" id="slider-track"></div>
      </div>
      <button class="slider-btn slider-btn-next" id="sl-next"><i class="fa-solid fa-chevron-right"></i></button>
      <div class="slider-info">
        <div class="slider-title-display" id="sl-title"></div>
        <div class="slider-count" id="sl-count">1 / 4</div>
      </div>
      <div class="slider-thumbs" id="slider-thumbs"></div>
    </div>
  </div>

  <!-- Section 4: Masonry + Lightbox -->
  <div class="gal-section">
    <div class="gal-sec-header">
      <div class="gal-sec-title"><span class="gal-sec-icon"><i class="fa-solid fa-table-cells"></i></span> Galería Masonry + Lightbox</div>
      <p class="gal-sec-desc">Hacé clic en cualquier imagen para abrirla en pantalla completa.</p>
    </div>
    <div class="masonry-grid" id="masonry-grid"></div>
  </div>

  <!-- Lightbox -->
  <div class="lightbox-overlay" id="lightbox-overlay">
    <button class="lb-close" id="lb-close"><i class="fa-solid fa-xmark"></i></button>
    <button class="lb-nav lb-prev" id="lb-prev"><i class="fa-solid fa-chevron-left"></i></button>
    <div class="lb-content">
      <img id="lb-img" src="" alt="">
      <div class="lb-caption" id="lb-caption"></div>
      <div class="lb-counter" id="lb-counter"></div>
    </div>
    <button class="lb-nav lb-next" id="lb-next"><i class="fa-solid fa-chevron-right"></i></button>
  </div>

</div>
`;

const css = `
<style>
  .gal-wrap { padding:1.5rem 1rem; display:flex; flex-direction:column; gap:2.5rem; }
  .gal-section { display:flex; flex-direction:column; gap:1rem; }
  .gal-sec-header { }
  .gal-sec-title { font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem; }
  .gal-sec-icon { font-size:1.2rem; }
  .gal-sec-desc { font-size:0.85rem; color:var(--text-muted); margin:0; }

  /* Before / After */
  .ba-presets { display:flex; gap:0.5rem; flex-wrap:wrap; }
  .ba-chip { padding:0.35rem 0.85rem; border:1.5px solid var(--border-color); border-radius:999px; background:var(--bg-color); color:var(--text-secondary); font-size:0.82rem; cursor:pointer; font-family:var(--font); transition:var(--transition); }
  .ba-chip.active { background:var(--primary-color); color:white; border-color:var(--primary-color); }
  .ba-container { position:relative; width:100%; height:380px; border-radius:var(--radius-lg); overflow:hidden; user-select:none; touch-action:none; }
  @media(max-width:480px) { .ba-container { height:240px; } }
  .ba-before, .ba-after { position:absolute; inset:0; width:100%; height:100%; }
  .ba-after { z-index:1; }
  .ba-before { z-index:2; clip-path:polygon(0 0, 50% 0, 50% 100%, 0 100%); }
  .ba-before img, .ba-after img { width:100%; height:100%; object-fit:cover; display:block; }
  .ba-label { position:absolute; padding:0.3rem 0.65rem; border-radius:var(--radius-md); font-size:0.78rem; font-weight:700; backdrop-filter:blur(6px); background:rgba(0,0,0,0.55); color:white; z-index:5; pointer-events:none; white-space:nowrap; }
  .ba-label-before { top:0.75rem; left:0.75rem; }
  .ba-label-after  { bottom:0.75rem; right:0.75rem; }
  .ba-handle { position:absolute; top:0; bottom:0; z-index:10; display:flex; flex-direction:column; align-items:center; left:50%; transform:translateX(-50%); cursor:ew-resize; gap:0; }
  .ba-handle-line { flex:1; width:3px; background:white; box-shadow:0 0 8px rgba(0,0,0,0.4); }
  .ba-handle-circle { width:38px; height:38px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; color:var(--primary-color); font-size:1rem; box-shadow:var(--shadow-md); flex-shrink:0; }
  .ba-range { position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:ew-resize; z-index:20; margin:0; }

  /* Carousel */
  .carousel-wrap { position:relative; border-radius:var(--radius-lg); overflow:hidden; height:340px; background:#000; }
  @media(max-width:480px) { .carousel-wrap { height:220px; } }
  .carousel-track { position:relative; width:100%; height:100%; }
  .carousel-slide { position:absolute; inset:0; opacity:0; transition:opacity 0.7s ease; }
  .carousel-slide.active { opacity:1; z-index:2; }
  .carousel-slide img { width:100%; height:100%; object-fit:cover; }
  .carousel-slide-info { position:absolute; bottom:0; left:0; right:0; padding:1.25rem; background:linear-gradient(to top, rgba(0,0,0,0.75), transparent); color:white; }
  .carousel-slide-info h3 { font-size:1.1rem; margin:0 0 0.2rem; }
  .carousel-slide-info p { font-size:0.82rem; opacity:0.85; margin:0; }
  .carousel-counter { position:absolute; top:0.75rem; right:0.75rem; z-index:10; background:rgba(0,0,0,0.5); color:white; font-size:0.78rem; font-weight:700; padding:0.25rem 0.65rem; border-radius:999px; backdrop-filter:blur(4px); }
  .carousel-dots { position:absolute; bottom:1rem; left:50%; transform:translateX(-50%); z-index:10; display:flex; gap:0.4rem; }
  .carousel-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.5); cursor:pointer; transition:var(--transition); border:none; }
  .carousel-dot.active { background:white; width:20px; border-radius:4px; }

  /* Manual Slider */
  .slider-wrap { position:relative; }
  .slider-viewport { overflow:hidden; border-radius:var(--radius-lg); height:320px; }
  @media(max-width:480px) { .slider-viewport { height:200px; } }
  .slider-track { display:flex; height:100%; transition:transform 0.5s cubic-bezier(.4,0,.2,1); }
  .slider-slide { min-width:100%; height:100%; flex-shrink:0; position:relative; }
  .slider-slide img { width:100%; height:100%; object-fit:cover; }
  .slider-slide-label { position:absolute; bottom:0; left:0; right:0; padding:1rem; background:linear-gradient(to top, rgba(0,0,0,0.7), transparent); color:white; font-weight:700; font-size:1rem; }
  .slider-btn { position:absolute; top:50%; transform:translateY(-60%); z-index:10; width:40px; height:40px; border-radius:50%; background:rgba(0,0,0,0.55); color:white; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1rem; transition:var(--transition); backdrop-filter:blur(4px); }
  .slider-btn:hover { background:rgba(0,0,0,0.8); }
  .slider-btn-prev { left:0.75rem; }
  .slider-btn-next { right:0.75rem; }
  .slider-info { display:flex; align-items:center; justify-content:space-between; margin-top:0.75rem; font-size:0.88rem; }
  .slider-title-display { font-weight:600; }
  .slider-count { color:var(--text-muted); font-size:0.82rem; }
  .slider-thumbs { display:flex; gap:0.5rem; margin-top:0.5rem; overflow-x:auto; }
  .slider-thumb { width:64px; height:44px; object-fit:cover; border-radius:var(--radius-sm); cursor:pointer; border:2px solid transparent; opacity:0.65; transition:var(--transition); flex-shrink:0; }
  .slider-thumb.active { border-color:var(--primary-color); opacity:1; }

  /* Masonry */
  .masonry-grid { columns:3; column-gap:0.6rem; }
  @media(max-width:600px) { .masonry-grid { columns:2; } }
  .masonry-item { break-inside:avoid; margin-bottom:0.6rem; border-radius:var(--radius-md); overflow:hidden; cursor:pointer; position:relative; }
  .masonry-item img { width:100%; display:block; transition:transform 0.4s; }
  .masonry-item:hover img { transform:scale(1.05); }
  .masonry-item-tall img { height:240px; object-fit:cover; }
  .masonry-item-short img { height:155px; object-fit:cover; }
  .masonry-item-overlay { position:absolute; inset:0; background:rgba(0,0,0,0); transition:background 0.3s; display:flex; align-items:flex-end; padding:0.5rem; opacity:0; transition:all 0.3s; }
  .masonry-item:hover .masonry-item-overlay { background:rgba(0,0,0,0.35); opacity:1; }
  .masonry-item-caption { color:white; font-size:0.75rem; font-weight:600; }

  /* Lightbox (Teleported to body) */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: rgba(10, 15, 29, 0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 3000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
  }
  .lightbox-overlay.open { display: flex; animation: lbFade 0.25s ease; }
  @keyframes lbFade { from{opacity:0} to{opacity:1} }
  .lb-close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    z-index: 10;
  }
  .lb-close:hover { background: rgba(239, 68, 68, 0.8); border-color: rgba(239, 68, 68, 0.8); transform: rotate(90deg); }
  .lb-nav {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.15);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: white;
    font-size: 1.15rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
    z-index: 10;
  }
  .lb-nav:hover { background: var(--primary-color); border-color: var(--primary-color); transform: scale(1.08); }
  .lb-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-height: 90vh;
    max-width: 90vw;
    margin: 0 1rem;
    text-align: center;
  }
  .lb-content img {
    max-width: 100%;
    max-height: 76vh;
    object-fit: contain;
    border-radius: var(--radius-lg);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  }
  .lb-caption { color: rgba(255, 255, 255, 0.95); margin-top: 0.85rem; font-size: 0.95rem; font-weight: 600; }
  .lb-counter { color: rgba(255, 255, 255, 0.6); font-size: 0.82rem; margin-top: 0.25rem; font-weight: 500; }

  @media(max-width: 600px) {
    .lightbox-overlay { padding: 0.5rem; }
    .lb-nav { width: 40px; height: 40px; font-size: 1rem; }
    .lb-content { margin: 0 0.25rem; }
    .lb-content img { max-height: 68vh; }
    .lb-close { top: 0.75rem; right: 0.75rem; width: 38px; height: 38px; font-size: 1rem; }
  }
</style>
`;

const code = `// Auto carousel with pause-on-hover
let autoplay = setInterval(() => goToSlide((current + 1) % slides.length), 3000);
wrap.addEventListener('mouseenter', () => clearInterval(autoplay));
wrap.addEventListener('mouseleave', () => { autoplay = setInterval(..., 3000); });

// Manual slider with touch support
let touchStartX = 0;
track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
track.addEventListener('touchend', e => {
  if (e.changedTouches[0].clientX - touchStartX < -50) nextSlide();
  else if (e.changedTouches[0].clientX - touchStartX > 50) prevSlide();
});

// Lightbox keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextLb();
  if (e.key === 'ArrowLeft') prevLb();
});
`;

const explanation = `
<h3>4 Tipos de Galería e Imagen</h3>
<ul>
  <li><strong>Before/After:</strong> Divisor arrastrable con presets de industria. Contraste dramático antes/después.</li>
  <li><strong>Carrusel automático:</strong> Avanza cada 3s con fade, se pausa al hover. Dots de navegación.</li>
  <li><strong>Slider manual:</strong> Botones, teclado y swipe táctil. Miniaturas clickeables debajo.</li>
  <li><strong>Masonry + Lightbox:</strong> Grid con columnas sin altura fija. Click → lightbox fullscreen con navegación.</li>
</ul>
`;

function onMount(container) {
  // ===== BEFORE / AFTER =====
  var currentPreset = BEFORE_AFTER_PRESETS.detailing;

  function applyPreset(preset) {
    var beforeImg = container.querySelector('#ba-before-img');
    var afterImg  = container.querySelector('#ba-after-img');
    var rangeEl   = container.querySelector('#ba-range');
    beforeImg.src = preset.beforeSrc;
    afterImg.src  = preset.afterSrc;
    beforeImg.style.filter = preset.beforeFilter;
    afterImg.style.filter  = preset.afterFilter;
    container.querySelector('#ba-label-before').textContent = preset.beforeLabel;
    container.querySelector('#ba-label-after').textContent  = preset.afterLabel;
    rangeEl.value = 50;
    updateBA(50);
    currentPreset = preset;
  }

  function updateBA(val) {
    var beforeEl  = container.querySelector('#ba-before');
    var handleEl  = container.querySelector('#ba-handle');
    beforeEl.style.clipPath = 'polygon(0 0, ' + val + '% 0, ' + val + '% 100%, 0 100%)';
    handleEl.style.left  = val + '%';
  }

  container.querySelector('#ba-range').addEventListener('input', function() {
    updateBA(this.value);
  });

  container.querySelectorAll('.ba-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      container.querySelectorAll('.ba-chip').forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      applyPreset(BEFORE_AFTER_PRESETS[chip.dataset.preset]);
    });
  });

  applyPreset(BEFORE_AFTER_PRESETS.detailing);

  // ===== AUTO CAROUSEL =====
  var carouselTrack = container.querySelector('#carousel-track');
  var carouselDots  = container.querySelector('#carousel-dots');
  var carouselCounter = container.querySelector('#carousel-counter');
  var carouselIndex = 0;
  var carouselSlides = [];
  var carouselAutoplay = null;

  CAROUSEL_SLIDES.forEach(function(slide, i) {
    var el = document.createElement('div');
    el.className = 'carousel-slide' + (i === 0 ? ' active' : '');
    var img = document.createElement('img');
    img.src = slide.img;
    img.alt = slide.title;
    img.loading = 'lazy';
    var info = document.createElement('div');
    info.className = 'carousel-slide-info';
    var h3 = document.createElement('h3');
    h3.textContent = slide.title;
    var p = document.createElement('p');
    p.textContent = slide.sub;
    info.appendChild(h3);
    info.appendChild(p);
    el.appendChild(img);
    el.appendChild(info);
    carouselTrack.appendChild(el);
    carouselSlides.push(el);

    var dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    (function(idx) {
      dot.addEventListener('click', function() { goCarousel(idx); });
    })(i);
    carouselDots.appendChild(dot);
  });

  function goCarousel(idx) {
    carouselSlides[carouselIndex].classList.remove('active');
    carouselDots.children[carouselIndex].classList.remove('active');
    carouselIndex = (idx + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
    carouselSlides[carouselIndex].classList.add('active');
    carouselDots.children[carouselIndex].classList.add('active');
    carouselCounter.textContent = (carouselIndex + 1) + ' / ' + CAROUSEL_SLIDES.length;
  }

  function startAutoplay() {
    carouselAutoplay = setInterval(function() { goCarousel(carouselIndex + 1); }, 3000);
  }

  var carouselWrap = container.querySelector('#carousel-wrap');
  carouselWrap.addEventListener('mouseenter', function() { clearInterval(carouselAutoplay); });
  carouselWrap.addEventListener('mouseleave', startAutoplay);
  startAutoplay();

  // ===== MANUAL SLIDER =====
  var sliderTrack  = container.querySelector('#slider-track');
  var sliderIndex  = 0;
  var sliderThumbs = container.querySelector('#slider-thumbs');
  var sliderTitle  = container.querySelector('#sl-title');
  var sliderCount  = container.querySelector('#sl-count');
  var touchStartX  = 0;

  SLIDER_SLIDES.forEach(function(slide, i) {
    var el = document.createElement('div');
    el.className = 'slider-slide';
    var img = document.createElement('img');
    img.src = slide.img;
    img.alt = slide.title;
    img.loading = 'lazy';
    var label = document.createElement('div');
    label.className = 'slider-slide-label';
    label.textContent = slide.title;
    el.appendChild(img);
    el.appendChild(label);
    sliderTrack.appendChild(el);

    var thumb = document.createElement('img');
    thumb.src = slide.img;
    thumb.alt = slide.title;
    thumb.className = 'slider-thumb' + (i === 0 ? ' active' : '');
    thumb.loading = 'lazy';
    (function(idx) {
      thumb.addEventListener('click', function() { goSlider(idx); });
    })(i);
    sliderThumbs.appendChild(thumb);
  });

  sliderTitle.textContent = SLIDER_SLIDES[0].title;

  function goSlider(idx) {
    sliderIndex = (idx + SLIDER_SLIDES.length) % SLIDER_SLIDES.length;
    sliderTrack.style.transform = 'translateX(-' + (sliderIndex * 100) + '%)';
    sliderTitle.textContent = SLIDER_SLIDES[sliderIndex].title;
    sliderCount.textContent = (sliderIndex + 1) + ' / ' + SLIDER_SLIDES.length;
    sliderThumbs.querySelectorAll('.slider-thumb').forEach(function(t, i) {
      t.classList.toggle('active', i === sliderIndex);
    });
  }

  container.querySelector('#sl-prev').addEventListener('click', function() { goSlider(sliderIndex - 1); });
  container.querySelector('#sl-next').addEventListener('click', function() { goSlider(sliderIndex + 1); });

  // Touch swipe
  sliderTrack.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; });
  sliderTrack.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -50) goSlider(sliderIndex + 1);
    else if (dx > 50) goSlider(sliderIndex - 1);
  });

  // ===== MASONRY + LIGHTBOX =====
  var masonryGrid = container.querySelector('#masonry-grid');
  var lbOverlay   = container.querySelector('#lightbox-overlay');
  var lbImg       = lbOverlay.querySelector('#lb-img');
  var lbCaption   = lbOverlay.querySelector('#lb-caption');
  var lbCounter   = lbOverlay.querySelector('#lb-counter');
  var lbIndex     = 0;

  // Move lightbox overlay to document.body so position:fixed is never trapped in component-wrapper
  if (lbOverlay && lbOverlay.parentElement !== document.body) {
    document.body.appendChild(lbOverlay);
  }

  MASONRY_IMGS.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'masonry-item ' + (item.tall ? 'masonry-item-tall' : 'masonry-item-short');
    var img = document.createElement('img');
    img.src = item.img;
    img.alt = item.caption;
    img.loading = 'lazy';
    var overlay = document.createElement('div');
    overlay.className = 'masonry-item-overlay';
    var caption = document.createElement('span');
    caption.className = 'masonry-item-caption';
    caption.textContent = item.caption;
    overlay.appendChild(caption);
    div.appendChild(img);
    div.appendChild(overlay);
    (function(idx) {
      div.addEventListener('click', function() { openLightbox(idx); });
    })(i);
    masonryGrid.appendChild(div);
  });

  function openLightbox(idx) {
    lbIndex = idx;
    lbImg.src = MASONRY_IMGS[idx].img;
    lbCaption.textContent = MASONRY_IMGS[idx].caption;
    lbCounter.textContent = (idx + 1) + ' / ' + MASONRY_IMGS.length;
    lbOverlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeLightbox() {
    lbOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function lbNext() { openLightbox((lbIndex + 1) % MASONRY_IMGS.length); }
  function lbPrev() { openLightbox((lbIndex + MASONRY_IMGS.length - 1) % MASONRY_IMGS.length); }

  lbOverlay.querySelector('#lb-close').addEventListener('click', closeLightbox);
  lbOverlay.querySelector('#lb-next').addEventListener('click', lbNext);
  lbOverlay.querySelector('#lb-prev').addEventListener('click', lbPrev);
  lbOverlay.addEventListener('click', function(e) { if (e.target === lbOverlay) closeLightbox(); });

  document.addEventListener('keydown', function(e) {
    if (!lbOverlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'ArrowLeft') lbPrev();
  });
}

export function initGalleries() {
  registerComponent({
    id: 'galleries',
    title: 'Galerías — Carrusel, Slider & Lightbox',
    icon: 'fa-solid fa-images',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
