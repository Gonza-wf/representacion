import { registerComponent } from '../../../main.js';

// ─────────────────────────────────────────────
// E-commerce — Cart, Filters, Modal de Producto
// ─────────────────────────────────────────────

var PRODUCTS = [
  { id:1, name:'Auriculares Sony WH-1000XM5', cat:'audio',       price:199, rating:4.8, reviews:312, img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', desc:'Los mejores auriculares con cancelación activa de ruido. Hasta 30 horas de batería, micrófono de alta definición y conexión multipunto.' },
  { id:2, name:'Smartwatch Galaxy Watch 6',   cat:'tecnologia',   price:299, rating:4.5, reviews:187, img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', desc:'Smartwatch con monitor de salud 24/7, GPS integrado, seguimiento de sueño y más de 70 modos de ejercicio.' },
  { id:3, name:'Teclado Mecánico RGB',         cat:'tecnologia',   price:149, rating:4.7, reviews:524, img:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', desc:'Switches mecánicos táctiles, retroiluminación RGB personalizable por zona, construcción de aluminio y teclas PBT duales.' },
  { id:4, name:'Parlante Portátil JBL Flip 6', cat:'audio',       price:89,  rating:4.3, reviews:891, img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', desc:'Sonido potente en formato compacto. Resistente al agua IP67, 12 horas de batería y conexión por pares para sonido estéreo.' },
  { id:5, name:'Funda Laptop Premium 15"',     cat:'accesorios',  price:39,  rating:4.1, reviews:203, img:'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', desc:'Fabricada en material de alta resistencia con interior suave aterciopelado. Bolsillos adicionales para cargador y accesorios.' },
  { id:6, name:'Mouse Ergonómico Logitech',    cat:'accesorios',  price:59,  rating:4.6, reviews:445, img:'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80', desc:'Diseño ergonómico vertical que reduce la tensión en muñeca y brazo. Sensor óptico de 4000 DPI y 18 meses de batería.' }
];

const html = `
<div class="ec-wrap">

  <!-- Top bar -->
  <div class="ec-topbar">
    <div class="ec-search-wrap">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" id="ec-search" placeholder="Buscar productos...">
    </div>
    <div class="ec-actions">
      <button class="icon-btn" id="ec-fav-btn" title="Favoritos">
        <i class="fa-regular fa-heart"></i>
        <span class="ec-badge" id="fav-badge" style="display:none">0</span>
      </button>
      <button class="icon-btn" id="ec-cart-btn" title="Carrito">
        <i class="fa-solid fa-cart-shopping"></i>
        <span class="ec-badge" id="cart-badge" style="display:none">0</span>
      </button>
    </div>
  </div>

  <!-- Filters -->
  <div class="ec-filters">
    <div class="ec-cats">
      <button class="cat-chip active" data-cat="todos">Todos</button>
      <button class="cat-chip" data-cat="tecnologia">Tecnología</button>
      <button class="cat-chip" data-cat="audio">Audio</button>
      <button class="cat-chip" data-cat="accesorios">Accesorios</button>
    </div>
    <div class="ec-price-filter">
      <span class="price-label">Precio máx: <strong id="price-val">$1000</strong></span>
      <input type="range" id="price-range" min="30" max="350" value="350" step="10">
    </div>
  </div>

  <!-- Product Grid -->
  <div class="ec-grid" id="ec-grid"></div>
  <p class="ec-empty" id="ec-empty" style="display:none">
    <i class="fa-solid fa-box-open"></i> Sin resultados para tu búsqueda
  </p>

  <!-- Cart Panel -->
  <div class="ec-cart-overlay" id="ec-cart-overlay"></div>
  <div class="ec-cart-panel" id="ec-cart-panel">
    <div class="cart-header">
      <h3><i class="fa-solid fa-cart-shopping"></i> Mi Carrito</h3>
      <button class="icon-btn" id="ec-cart-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="cart-items" id="cart-items">
      <div class="cart-empty-msg" id="cart-empty-msg"><i class="fa-regular fa-face-sad-tear"></i> Tu carrito está vacío</div>
    </div>
    <div class="cart-footer" id="cart-footer" style="display:none">
      <div class="cart-total-row"><span>Total:</span><strong id="cart-total">$0</strong></div>
      <button class="btn btn-primary" style="width:100%;justify-content:center" id="checkout-btn">
        <i class="fa-solid fa-lock"></i> Comprar Ahora
      </button>
    </div>
  </div>

  <!-- Product Modal -->
  <div class="product-modal-overlay" id="product-modal-overlay">
    <div class="product-modal" id="product-modal">
      <button class="modal-close" id="modal-close"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-body">
        <div class="modal-img-side">
          <img id="modal-img" src="" alt="Detalle del producto seleccionado" loading="lazy">
        </div>
        <div class="modal-info-side">
          <span class="modal-cat" id="modal-cat"></span>
          <h2 class="modal-name" id="modal-name"></h2>
          <div class="modal-stars" id="modal-stars"></div>
          <p class="modal-desc" id="modal-desc"></p>
          <div class="modal-price-row">
            <span class="modal-price" id="modal-price"></span>
          </div>
          <div class="modal-qty-row">
            <span>Cantidad:</span>
            <div class="qty-ctrl">
              <button class="qty-btn" id="modal-minus">−</button>
              <span class="qty-num" id="modal-qty">1</span>
              <button class="qty-btn" id="modal-plus">+</button>
            </div>
          </div>
          <button class="btn btn-primary modal-add-btn" id="modal-add-btn">
            <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  </div>

</div>
`;

const css = `
<style>
  .ec-wrap { padding:1.5rem 1rem; position:relative; }

  /* Top bar */
  .ec-topbar { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
  .ec-search-wrap { flex:1; display:flex; align-items:center; gap:0.5rem; background:var(--bg-color); border:1.5px solid var(--border-color); border-radius:var(--radius-lg); padding:0.55rem 1rem; }
  .ec-search-wrap i { color:var(--text-muted); }
  .ec-search-wrap input { border:none; background:transparent; outline:none; width:100%; font-family:var(--font); font-size:0.95rem; color:var(--text-primary); }
  .ec-actions { display:flex; gap:0.5rem; }
  .ec-badge { position:absolute; top:-4px; right:-4px; width:18px; height:18px; border-radius:50%; background:#ef4444; color:white; font-size:0.65rem; font-weight:700; display:flex; align-items:center; justify-content:center; }
  .icon-btn { position:relative; }

  /* Filters */
  .ec-filters { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; margin-bottom:1.25rem; }
  .ec-cats { display:flex; gap:0.4rem; flex-wrap:wrap; }
  .cat-chip { padding:0.35rem 0.85rem; border:1.5px solid var(--border-color); border-radius:999px; background:var(--bg-color); color:var(--text-secondary); font-size:0.82rem; cursor:pointer; font-family:var(--font); transition:var(--transition); }
  .cat-chip.active { background:var(--primary-color); color:white; border-color:var(--primary-color); }
  .ec-price-filter { display:flex; align-items:center; gap:0.6rem; font-size:0.85rem; color:var(--text-secondary); margin-left:auto; }
  .ec-price-filter input[type=range] { width:100px; accent-color:var(--primary-color); }

  /* Grid */
  .ec-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:1rem; }
  .ec-card { background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-lg); overflow:hidden; transition:var(--transition); cursor:pointer; }
  .ec-card:hover { border-color:var(--primary-color); box-shadow:var(--shadow-md); transform:translateY(-2px); }
  .ec-card-img { position:relative; height:170px; overflow:hidden; }
  .ec-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
  .ec-card:hover .ec-card-img img { transform:scale(1.06); }
  .fav-toggle { position:absolute; top:0.6rem; right:0.6rem; background:white; border:none; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#ef4444; font-size:1rem; box-shadow:var(--shadow-sm); transition:var(--transition); }
  .fav-toggle:hover { transform:scale(1.15); }
  .ec-card-body { padding:0.85rem; }
  .ec-cat-badge { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--primary-color); margin-bottom:0.3rem; }
  .ec-card-name { font-weight:700; font-size:0.92rem; margin-bottom:0.4rem; color:var(--text-primary); line-height:1.3; }
  .ec-card-rating { font-size:0.8rem; color:#f59e0b; margin-bottom:0.6rem; }
  .ec-card-rating span { color:var(--text-muted); margin-left:0.25rem; }
  .ec-card-footer { display:flex; align-items:center; justify-content:space-between; }
  .ec-price { font-size:1.05rem; font-weight:800; color:var(--primary-color); }
  .ec-add-btn { padding:0.35rem 0.75rem; border-radius:var(--radius-md); background:var(--primary-color); color:white; border:none; font-size:0.8rem; cursor:pointer; font-family:var(--font); font-weight:600; transition:var(--transition); }
  .ec-add-btn:hover { opacity:0.85; transform:scale(1.05); }
  .ec-empty { text-align:center; color:var(--text-muted); padding:3rem; grid-column:1/-1; }
  .ec-empty i { margin-right:0.4rem; }

  /* Cart panel (Teleported to body) */
  .ec-cart-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 2400;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .ec-cart-overlay.open { opacity: 1; pointer-events: all; }
  .ec-cart-panel {
    position: fixed;
    top: 0;
    right: -420px;
    width: 380px;
    max-width: 90vw;
    height: 100%;
    height: 100dvh;
    background: var(--surface-color);
    box-shadow: -10px 0 35px rgba(0, 0, 0, 0.3);
    z-index: 2401;
    display: flex;
    flex-direction: column;
    transition: right 0.35s cubic-bezier(.4,0,.2,1);
    box-sizing: border-box;
  }
  .ec-cart-panel.open { right: 0; }
  .cart-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-bottom: 1px solid var(--border-color); }
  .cart-header h3 { margin: 0; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
  .cart-items { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .cart-empty-msg { text-align: center; color: var(--text-muted); padding: 2rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .cart-item { display: flex; gap: 0.75rem; align-items: flex-start; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; }
  .cart-item-img { width: 52px; height: 52px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
  .cart-item-info { flex: 1; min-width: 0; }
  .cart-item-name { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary); }
  .cart-item-row { display: flex; align-items: center; gap: 0.4rem; }
  .cart-item-price { color: var(--primary-color); font-weight: 700; font-size: 0.9rem; }
  .ci-qty-btn { background: var(--surface-color); border: 1px solid var(--border-color); width: 22px; height: 22px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
  .ci-qty-num { min-width: 20px; text-align: center; font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
  .cart-item-remove { background: none; border: none; cursor: pointer; color: #ef4444; font-size: 0.85rem; margin-left: auto; opacity: 0.7; transition: var(--transition); align-self: flex-start; padding: 0; }
  .cart-item-remove:hover { opacity: 1; }
  .cart-footer { padding: 1.25rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.75rem; background: var(--surface-color); }
  .cart-total-row { display: flex; justify-content: space-between; font-size: 1.05rem; color: var(--text-primary); }
  .cart-total-row strong { color: var(--primary-color); font-size: 1.25rem; }

  /* Product Modal (Teleported to body) */
  .product-modal-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 2600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    box-sizing: border-box;
  }
  .product-modal-overlay.open { opacity: 1; pointer-events: all; }
  .product-modal {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    width: 100%;
    max-width: 720px;
    max-height: 90vh;
    max-height: 90dvh;
    position: relative;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    animation: modalPop 0.35s cubic-bezier(.4,0,.2,1);
  }
  @keyframes modalPop { from{transform:scale(0.92) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
  .modal-close {
    position: absolute;
    top: 0.85rem;
    right: 0.85rem;
    background: rgba(0, 0, 0, 0.35);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    font-size: 1rem;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }
  .modal-close:hover { background: rgba(239, 68, 68, 0.8); transform: rotate(90deg); }
  .modal-body { display: flex; min-height: 400px; }
  .modal-img-side { width: 45%; flex-shrink: 0; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; }
  .modal-img-side img { width: 100%; height: 100%; object-fit: cover; }
  .modal-info-side { flex: 1; padding: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; max-height: 85vh; }
  .modal-cat { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary-color); background: rgba(59,130,246,0.1); padding: 0.2rem 0.6rem; border-radius: 999px; align-self: flex-start; }
  .modal-name { font-size: 1.25rem; font-weight: 800; line-height: 1.3; margin: 0; color: var(--text-primary); }
  .modal-stars { color: #f59e0b; font-size: 0.9rem; }
  .modal-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
  .modal-price { font-size: 1.6rem; font-weight: 900; color: var(--primary-color); }
  .modal-qty-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
  .qty-ctrl { display: flex; align-items: center; gap: 0.4rem; }
  .qty-btn { width: 30px; height: 30px; border-radius: var(--radius-md); border: 1.5px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: var(--font); transition: var(--transition); }
  .qty-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
  .qty-num { min-width: 24px; text-align: center; font-weight: 700; font-size: 1.05rem; color: var(--text-primary); }
  .modal-add-btn { width: 100%; justify-content: center; margin-top: auto; padding: 0.85rem; font-size: 0.95rem; font-weight: 700; }

  @media (max-width: 600px) {
    .modal-body { flex-direction: column; }
    .modal-img-side { width: 100%; height: 220px; }
    .modal-info-side { padding: 1.25rem; }
    .ec-cart-panel { width: 100%; max-width: 100vw; }
  }
</style>
`;

const code = `// Product modal opens on card click
card.addEventListener('click', (e) => {
  if (e.target.closest('.fav-toggle') || e.target.closest('.ec-add-btn')) return;
  openModal(product);
});

function openModal(p) {
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-img').src = p.img;
  document.getElementById('modal-price').textContent = '$' + p.price;
  // ... set stars, cat, desc
  modalOverlay.classList.add('open');
}

// Add to cart from modal
modalAddBtn.addEventListener('click', () => {
  addToCart(currentModalProduct, qty);
  closeModal();
});
`;

const explanation = `
<h3>E-commerce Interactivo Completo</h3>
<ul>
  <li><strong>Modal de producto:</strong> Click en tarjeta → modal fullscreen con imagen grande, descripción detallada, selector de cantidad y botón de agregar.</li>
  <li><strong>Carrito lateral:</strong> Panel deslizable con gestión completa de items, incremento/decremento y total dinámico.</li>
  <li><strong>Filtros en tiempo real:</strong> Por categoría + precio máximo con slider.</li>
  <li><strong>Favoritos:</strong> Toggle por producto con contador.</li>
  <li><strong>Buscador:</strong> Filtra por nombre en tiempo real.</li>
</ul>
`;

function onMount(container) {
  var cart = {};
  var favs = {};
  var currentModalProduct = null;
  var modalQty = 1;

  var cartOverlay = container.querySelector('#ec-cart-overlay');
  var cartPanel   = container.querySelector('#ec-cart-panel');
  var productOverlay = container.querySelector('#product-modal-overlay');

  // Move overlays to document.body so they are never trapped inside component-wrapper
  if (cartOverlay && cartOverlay.parentElement !== document.body) {
    document.body.appendChild(cartOverlay);
  }
  if (cartPanel && cartPanel.parentElement !== document.body) {
    document.body.appendChild(cartPanel);
  }
  if (productOverlay && productOverlay.parentElement !== document.body) {
    document.body.appendChild(productOverlay);
  }

  // --- Render products ---
  function renderGrid(filteredProducts) {
    var grid = container.querySelector('#ec-grid');
    var emptyMsg = container.querySelector('#ec-empty');
    grid.innerHTML = '';
    if (filteredProducts.length === 0) { emptyMsg.style.display = 'block'; return; }
    emptyMsg.style.display = 'none';
    filteredProducts.forEach(function(p) {
      var card = document.createElement('div');
      card.className = 'ec-card';

      var imgWrap = document.createElement('div');
      imgWrap.className = 'ec-card-img';
      var img = document.createElement('img');
      img.src = p.img;
      img.alt = p.name;
      img.loading = 'lazy';

      var favBtn = document.createElement('button');
      favBtn.className = 'fav-toggle';
      favBtn.innerHTML = favs[p.id] ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
      favBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        favs[p.id] = !favs[p.id];
        favBtn.innerHTML = favs[p.id] ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
        updateBadges();
      });

      imgWrap.appendChild(img);
      imgWrap.appendChild(favBtn);

      var body = document.createElement('div');
      body.className = 'ec-card-body';

      var catBadge = document.createElement('div');
      catBadge.className = 'ec-cat-badge';
      catBadge.textContent = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);

      var nameEl = document.createElement('div');
      nameEl.className = 'ec-card-name';
      nameEl.textContent = p.name;

      var ratingEl = document.createElement('div');
      ratingEl.className = 'ec-card-rating';
      var stars = '';
      for (var s = 0; s < 5; s++) {
        stars += s < Math.round(p.rating)
          ? '<i class="fa-solid fa-star"></i>'
          : '<i class="fa-regular fa-star"></i>';
      }
      ratingEl.innerHTML = stars + '<span>(' + p.reviews + ')</span>';

      var footer = document.createElement('div');
      footer.className = 'ec-card-footer';
      var priceEl = document.createElement('span');
      priceEl.className = 'ec-price';
      priceEl.textContent = '$' + p.price;
      var addBtn = document.createElement('button');
      addBtn.className = 'ec-add-btn';
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Carrito';
      addBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        addToCart(p, 1);
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        setTimeout(function() { addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Carrito'; }, 1000);
      });
      footer.appendChild(priceEl);
      footer.appendChild(addBtn);

      body.appendChild(catBadge);
      body.appendChild(nameEl);
      body.appendChild(ratingEl);
      body.appendChild(footer);
      card.appendChild(imgWrap);
      card.appendChild(body);

      card.addEventListener('click', function() { openModal(p); });
      grid.appendChild(card);
    });
  }

  // --- Filter logic ---
  var searchInput = container.querySelector('#ec-search');
  var priceRange  = container.querySelector('#price-range');
  var priceVal    = container.querySelector('#price-val');
  var catChips    = container.querySelectorAll('.cat-chip');
  var activecat   = 'todos';

  function filterProducts() {
    var q = searchInput.value.toLowerCase();
    var maxPrice = parseInt(priceRange.value);
    priceVal.textContent = '$' + maxPrice;
    return PRODUCTS.filter(function(p) {
      return (activecat === 'todos' || p.cat === activecat) &&
             p.price <= maxPrice &&
             p.name.toLowerCase().includes(q);
    });
  }

  function refresh() { renderGrid(filterProducts()); }

  searchInput.addEventListener('input', refresh);
  priceRange.addEventListener('input', refresh);

  catChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      catChips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      activecat = chip.dataset.cat;
      refresh();
    });
  });

  // --- Cart ---
  function addToCart(p, qty) {
    if (cart[p.id]) cart[p.id].qty += qty;
    else cart[p.id] = { product: p, qty: qty };
    updateBadges();
    renderCart();
    if (window.showToast) {
      window.showToast({
        title: 'Agregado al Carrito',
        message: (qty > 1 ? qty + 'x ' : '') + p.name + ' ($' + (p.price * qty) + ')',
        type: 'success',
        duration: 2500,
        icon: 'fa-solid fa-cart-plus'
      });
    }
  }

  function updateBadges() {
    var cartCount = Object.values(cart).reduce(function(a, c) { return a + c.qty; }, 0);
    var favCount  = Object.values(favs).filter(Boolean).length;
    var cartBadge = container.querySelector('#cart-badge');
    var favBadge  = container.querySelector('#fav-badge');
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    favBadge.textContent = favCount;
    favBadge.style.display = favCount > 0 ? 'flex' : 'none';
  }

  function renderCart() {
    var itemsEl  = cartPanel.querySelector('#cart-items');
    var footerEl = cartPanel.querySelector('#cart-footer');
    var emptyMsg = cartPanel.querySelector('#cart-empty-msg');
    var items = Object.values(cart);
    emptyMsg.style.display = items.length === 0 ? 'flex' : 'none';
    footerEl.style.display = items.length === 0 ? 'none' : 'flex';

    // Remove old items (keep emptyMsg)
    var existing = itemsEl.querySelectorAll('.cart-item');
    existing.forEach(function(el) { el.remove(); });

    var total = 0;
    items.forEach(function(item) {
      total += item.product.price * item.qty;
      var div = document.createElement('div');
      div.className = 'cart-item';

      var img = document.createElement('img');
      img.className = 'cart-item-img';
      img.src = item.product.img;
      img.alt = item.product.name;

      var info = document.createElement('div');
      info.className = 'cart-item-info';
      var nameEl = document.createElement('div');
      nameEl.className = 'cart-item-name';
      nameEl.textContent = item.product.name;

      var row = document.createElement('div');
      row.className = 'cart-item-row';

      var minusBtn = document.createElement('button');
      minusBtn.className = 'ci-qty-btn';
      minusBtn.textContent = '−';
      minusBtn.addEventListener('click', function() {
        if (cart[item.product.id].qty > 1) cart[item.product.id].qty--;
        else delete cart[item.product.id];
        updateBadges(); renderCart();
      });

      var qtyEl = document.createElement('span');
      qtyEl.className = 'ci-qty-num';
      qtyEl.textContent = item.qty;

      var plusBtn = document.createElement('button');
      plusBtn.className = 'ci-qty-btn';
      plusBtn.textContent = '+';
      plusBtn.addEventListener('click', function() {
        cart[item.product.id].qty++;
        updateBadges(); renderCart();
      });

      var priceEl = document.createElement('span');
      priceEl.className = 'cart-item-price';
      priceEl.textContent = '$' + (item.product.price * item.qty);

      row.appendChild(minusBtn);
      row.appendChild(qtyEl);
      row.appendChild(plusBtn);
      row.appendChild(priceEl);

      var removeBtn = document.createElement('button');
      removeBtn.className = 'cart-item-remove';
      removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      removeBtn.addEventListener('click', function() {
        delete cart[item.product.id];
        updateBadges(); renderCart();
      });

      info.appendChild(nameEl);
      info.appendChild(row);
      div.appendChild(img);
      div.appendChild(info);
      div.appendChild(removeBtn);
      itemsEl.appendChild(div);
    });

    cartPanel.querySelector('#cart-total').textContent = '$' + total;
  }

  // Cart open/close - use teleported element references
  function openCart() {
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.classList.add('modal-open');
  }
  function closeCart() {
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  // Cart: renderCart accesses teleported cart items inside cartPanel
  function getCartEl(id) { return cartPanel.querySelector(id) || document.getElementById(id.slice(1)); }

  container.querySelector('#ec-cart-btn').addEventListener('click', openCart);
  cartPanel.querySelector('#ec-cart-close').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  container.querySelector('#ec-fav-btn').addEventListener('click', function() {
    var favProds = PRODUCTS.filter(function(p) { return favs[p.id]; });
    if (favProds.length) { activecat = 'todos'; catChips.forEach(function(c) { c.classList.remove('active'); if (c.dataset.cat === 'todos') c.classList.add('active'); }); renderGrid(favProds); }
  });

  cartPanel.querySelector('#checkout-btn').addEventListener('click', function() {
    cart = {};
    updateBadges();
    renderCart();
    closeCart();
    if (window.showToast) {
      window.showToast({
        title: '¡Compra Simulada Exitosa!',
        message: 'Tu pedido fue procesado correctamente. ¡Gracias por probar el e-commerce!',
        type: 'success',
        duration: 4000,
        icon: 'fa-solid fa-bag-shopping'
      });
    }
  });

  // --- Product Modal (uses teleported productOverlay) ---
  var overlay = productOverlay;

  function openModal(p) {
    currentModalProduct = p;
    modalQty = 1;
    productOverlay.querySelector('#modal-img').src = p.img;
    productOverlay.querySelector('#modal-name').textContent = p.name;
    productOverlay.querySelector('#modal-cat').textContent = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);
    productOverlay.querySelector('#modal-desc').textContent = p.desc;
    productOverlay.querySelector('#modal-price').textContent = '$' + p.price;
    productOverlay.querySelector('#modal-qty').textContent = '1';
    var stars = '';
    for (var s = 0; s < 5; s++) {
      stars += s < Math.round(p.rating)
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
    }
    productOverlay.querySelector('#modal-stars').innerHTML = stars + ' <small style="color:var(--text-muted)">(' + p.reviews + ' reseñas)</small>';
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  productOverlay.querySelector('#modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeModal(); closeCart(); } });

  productOverlay.querySelector('#modal-minus').addEventListener('click', function() {
    if (modalQty > 1) { modalQty--; productOverlay.querySelector('#modal-qty').textContent = modalQty; }
  });
  productOverlay.querySelector('#modal-plus').addEventListener('click', function() {
    modalQty++;
    productOverlay.querySelector('#modal-qty').textContent = modalQty;
  });
  productOverlay.querySelector('#modal-add-btn').addEventListener('click', function() {
    if (currentModalProduct) {
      addToCart(currentModalProduct, modalQty);
      closeModal();
      openCart();
    }
  });

  // Initial render
  renderGrid(PRODUCTS);
  renderCart();
}

export function initEcommerce() {
  registerComponent({
    id: 'ecommerce',
    title: 'E-commerce — Carrito, Filtros & Modal',
    icon: 'fa-solid fa-store',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
