import { registerComponent } from '../../../main.js';

// ─────────────────────────────────────────────
// API Simulada — Fetch Demo con loading states
// ─────────────────────────────────────────────

const html = `
<div class="api-wrap">

  <!-- Header -->
  <div class="api-header">
    <div class="api-title-row">
      <span class="api-dot" id="api-dot"></span>
      <h3 class="api-title">API REST Explorer</h3>
      <span class="api-base-url">jsonplaceholder.typicode.com</span>
    </div>
    <p class="api-subtitle">Hacé clic en un endpoint para ver cómo funciona Fetch, los estados de carga y el manejo de errores.</p>
  </div>

  <!-- Endpoint buttons -->
  <div class="api-endpoints">
    <button class="api-ep-btn" data-ep="users">
      <span class="ep-method get">GET</span>
      <span class="ep-path">/users</span>
      <span class="ep-desc">Lista de usuarios</span>
    </button>
    <button class="api-ep-btn" data-ep="posts">
      <span class="ep-method get">GET</span>
      <span class="ep-path">/posts</span>
      <span class="ep-desc">Últimos artículos</span>
    </button>
    <button class="api-ep-btn" data-ep="post">
      <span class="ep-method post">POST</span>
      <span class="ep-path">/posts</span>
      <span class="ep-desc">Crear recurso</span>
    </button>
    <button class="api-ep-btn" data-ep="error">
      <span class="ep-method err">404</span>
      <span class="ep-path">/error</span>
      <span class="ep-desc">Simular error</span>
    </button>
    <button class="api-ep-btn api-clear-btn" id="api-clear">
      <span class="ep-method clr">CLR</span>
      <span class="ep-path">Limpiar</span>
    </button>
  </div>

  <!-- Request panel -->
  <div class="api-request-panel" id="api-request-panel" style="display:none">
    <div class="req-row">
      <span class="req-method-badge" id="req-method-badge"></span>
      <span class="req-url" id="req-url"></span>
    </div>
    <div class="req-timing" id="req-timing" style="display:none">
      <i class="fa-regular fa-clock"></i> <span id="req-time"></span>ms
    </div>
  </div>

  <!-- Loading skeleton -->
  <div class="api-skeleton" id="api-skeleton" style="display:none">
    <div class="sk-bar sk-w80"></div>
    <div class="sk-bar sk-w60"></div>
    <div class="sk-bar sk-w75"></div>
    <div class="sk-bar sk-w50"></div>
    <div class="sk-bar sk-w85"></div>
    <div class="sk-bar sk-w65"></div>
  </div>

  <!-- Results -->
  <div class="api-results" id="api-results" style="display:none">
    <div class="api-results-header">
      <span class="api-results-title" id="results-title"></span>
      <input type="text" class="api-filter-input" id="api-filter" placeholder="🔍 Filtrar resultados...">
      <span class="api-results-count" id="results-count"></span>
    </div>
    <div class="api-results-grid" id="results-grid"></div>
  </div>

  <!-- Raw JSON -->
  <div class="api-raw-section" id="api-raw-section" style="display:none">
    <button class="api-raw-toggle" id="api-raw-toggle">
      <i class="fa-solid fa-code"></i> Ver JSON Raw <i class="fa-solid fa-chevron-down" id="raw-chevron"></i>
    </button>
    <pre class="api-raw-pre" id="api-raw-pre" style="display:none"></pre>
  </div>

  <!-- Error state -->
  <div class="api-error-state" id="api-error-state" style="display:none">
    <div class="api-error-card">
      <div class="api-error-code" id="api-error-code"></div>
      <div class="api-error-msg" id="api-error-msg"></div>
      <button class="btn btn-secondary" id="api-retry"><i class="fa-solid fa-rotate-right"></i> Reintentar</button>
    </div>
  </div>

  <!-- POST mock panel -->
  <div class="api-post-panel" id="api-post-panel" style="display:none">
    <div class="post-cols">
      <div class="post-col">
        <div class="post-col-title"><span class="ep-method post">REQUEST</span> Cuerpo enviado</div>
        <pre class="post-code" id="post-req-code"></pre>
      </div>
      <div class="post-col">
        <div class="post-col-title"><span class="ep-method get" style="background:#10b981">201 CREATED</span> Respuesta</div>
        <pre class="post-code" id="post-res-code"></pre>
      </div>
    </div>
  </div>

</div>
`;

const css = `
<style>
  .api-wrap { padding:1.5rem 1rem; display:flex; flex-direction:column; gap:1.25rem; }

  /* Header */
  .api-header { }
  .api-title-row { display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.4rem; }
  .api-dot { width:10px; height:10px; border-radius:50%; background:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,0.2); }
  .api-dot.loading { background:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,0.2); animation:dotPulse 0.8s infinite; }
  .api-dot.error { background:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,0.2); }
  @keyframes dotPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .api-title { font-size:1.05rem; font-weight:700; margin:0; }
  .api-base-url { font-size:0.78rem; color:var(--text-muted); background:var(--bg-color); border:1px solid var(--border-color); padding:0.2rem 0.6rem; border-radius:999px; font-family:monospace; }
  .api-subtitle { font-size:0.85rem; color:var(--text-muted); margin:0; }

  /* Endpoints */
  .api-endpoints { display:flex; gap:0.5rem; flex-wrap:wrap; }
  .api-ep-btn { display:flex; align-items:center; gap:0.5rem; padding:0.5rem 0.85rem; background:var(--surface-color); border:1.5px solid var(--border-color); border-radius:var(--radius-md); cursor:pointer; font-family:var(--font); transition:var(--transition); }
  .api-ep-btn:hover { border-color:var(--primary-color); }
  .api-ep-btn.active { border-color:var(--primary-color); background:rgba(59,130,246,0.06); }
  .ep-method { padding:0.2rem 0.5rem; border-radius:var(--radius-sm); font-size:0.72rem; font-weight:800; letter-spacing:0.03em; }
  .ep-method.get  { background:rgba(59,130,246,0.15); color:#3b82f6; }
  .ep-method.post { background:rgba(16,185,129,0.15); color:#10b981; }
  .ep-method.err  { background:rgba(239,68,68,0.15);  color:#ef4444; }
  .ep-method.clr  { background:rgba(100,116,139,0.15); color:#64748b; }
  .ep-path { font-size:0.85rem; font-weight:600; color:var(--text-primary); font-family:monospace; }
  .ep-desc { font-size:0.75rem; color:var(--text-muted); }
  .api-clear-btn { opacity:0.7; }
  .api-clear-btn:hover { opacity:1; border-color:var(--border-color) !important; }

  /* Request panel */
  .api-request-panel { background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem 1rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
  .req-row { display:flex; align-items:center; gap:0.5rem; }
  .req-method-badge { padding:0.2rem 0.55rem; border-radius:var(--radius-sm); font-size:0.72rem; font-weight:800; }
  .req-url { font-size:0.85rem; font-family:monospace; color:var(--text-secondary); }
  .req-timing { font-size:0.82rem; color:#10b981; font-weight:600; display:flex; align-items:center; gap:0.3rem; }

  /* Skeleton */
  .api-skeleton { display:flex; flex-direction:column; gap:0.5rem; padding:0.5rem 0; }
  .sk-bar { height:14px; border-radius:4px; background:var(--border-color); animation:skShimmer 1.5s infinite; }
  .sk-w80 { width:80%; } .sk-w60 { width:60%; } .sk-w75 { width:75%; }
  .sk-w50 { width:50%; } .sk-w85 { width:85%; } .sk-w65 { width:65%; }
  @keyframes skShimmer {
    0%{background:var(--border-color)} 50%{background:var(--surface-color)} 100%{background:var(--border-color)}
  }

  /* Results */
  .api-results-header { display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; margin-bottom:1rem; }
  .api-results-title { font-weight:700; font-size:0.95rem; }
  .api-filter-input { flex:1; min-width:140px; padding:0.4rem 0.75rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-color); color:var(--text-primary); font-size:0.85rem; font-family:var(--font); outline:none; transition:var(--transition); }
  .api-filter-input:focus { border-color:var(--primary-color); }
  .api-results-count { font-size:0.78rem; color:var(--text-muted); white-space:nowrap; }
  .api-results-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:0.75rem; }

  /* User card */
  .user-card { background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.85rem; display:flex; flex-direction:column; gap:0.3rem; transition:var(--transition); }
  .user-card:hover { border-color:var(--primary-color); }
  .user-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg, var(--primary-color), #8b5cf6); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1rem; margin-bottom:0.25rem; }
  .user-name { font-weight:700; font-size:0.9rem; }
  .user-email { font-size:0.75rem; color:var(--text-muted); }
  .user-city { font-size:0.75rem; color:var(--primary-color); }

  /* Post card */
  .post-card { background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.85rem; transition:var(--transition); }
  .post-card:hover { border-color:var(--primary-color); }
  .post-card-title { font-weight:700; font-size:0.88rem; margin-bottom:0.35rem; text-transform:capitalize; }
  .post-card-body { font-size:0.78rem; color:var(--text-muted); display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .post-card-user { font-size:0.72rem; color:var(--primary-color); margin-top:0.5rem; font-weight:600; }

  /* Raw JSON */
  .api-raw-section { border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; }
  .api-raw-toggle { width:100%; padding:0.65rem 1rem; background:var(--surface-color); border:none; cursor:pointer; font-family:var(--font); font-size:0.85rem; color:var(--text-secondary); display:flex; align-items:center; gap:0.5rem; transition:var(--transition); }
  .api-raw-toggle:hover { background:var(--bg-color); }
  .api-raw-pre { margin:0; padding:1rem; background:#1e1e2e; border-radius:0; font-size:0.75rem; overflow-x:auto; max-height:280px; line-height:1.6; color:#cdd6f4; }
  .json-key { color:#89b4fa; }
  .json-str { color:#a6e3a1; }
  .json-num { color:#fab387; }
  .json-bool { color:#f5c2e7; }
  .json-null { color:#6c7086; }

  /* Error state */
  .api-error-card { background:var(--surface-color); border:2px solid #ef4444; border-radius:var(--radius-lg); padding:2rem; text-align:center; }
  .api-error-code { font-size:3rem; font-weight:900; color:#ef4444; line-height:1; margin-bottom:0.5rem; }
  .api-error-msg { font-size:0.95rem; color:var(--text-secondary); margin-bottom:1rem; }

  /* POST panel */
  .post-cols { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  @media(max-width:500px) { .post-cols { grid-template-columns:1fr; } }
  .post-col-title { display:flex; align-items:center; gap:0.5rem; font-size:0.82rem; font-weight:700; margin-bottom:0.5rem; }
  .post-code { background:#1e1e2e; color:#a6e3a1; border-radius:var(--radius-md); padding:0.85rem; font-size:0.78rem; overflow-x:auto; margin:0; line-height:1.6; }
  .api-post-panel { background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1rem; }
</style>
`;

const code = `// Real fetch with artificial latency
async function callEndpoint(ep) {
  setLoading(true);
  const start = Date.now();
  await new Promise(r => setTimeout(r, 600 + Math.random() * 700));
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await res.json();
  setLoading(false);
  showResults(data, Date.now() - start);
}

// Live filter over results
filterInput.addEventListener('input', () => {
  const q = filterInput.value.toLowerCase();
  const filtered = allData.filter(u => u.name.toLowerCase().includes(q));
  renderCards(filtered);
  countEl.textContent = 'Total: ' + filtered.length;
});
`;

const explanation = `
<h3>API Simulada — Fetch &amp; Async en Acción</h3>

<div class="exp-section">
  <h4><i class="fa-solid fa-bullseye"></i> Para qué sirve</h4>
  <p>Demuestra al cliente cómo su sitio puede conectarse a servicios externos en tiempo real: cargar datos de usuarios, publicaciones, productos o cualquier recurso desde una API REST. Visualiza el ciclo completo request → loading → response → render de forma interactiva, incluyendo el manejo de errores.</p>
  <div class="exp-industries">
    <span class="exp-industry-badge"><i class="fa-solid fa-code"></i> Desarrollo Web &amp; Apps</span>
    <span class="exp-industry-badge"><i class="fa-solid fa-database"></i> Integración de Datos</span>
    <span class="exp-industry-badge"><i class="fa-solid fa-plug"></i> Conectores &amp; Webhooks</span>
    <span class="exp-industry-badge"><i class="fa-solid fa-chart-bar"></i> Dashboards con API</span>
  </div>
</div>

<div class="exp-section">
  <h4><i class="fa-solid fa-gears"></i> Cómo funciona</h4>
  <ul>
    <li><strong>Fetch real:</strong> Los endpoints GET Users y GET Posts hacen peticiones reales a <code>jsonplaceholder.typicode.com</code> con <code>async/await</code> y captura de errores con <code>try/catch</code>.</li>
    <li><strong>Latencia artificial:</strong> Un <code>setTimeout</code> de 800–1500ms se aplica antes de mostrar los resultados para simular la latencia de red real y hacer visible el estado de carga.</li>
    <li><strong>Skeleton loading:</strong> Mientras espera la respuesta, se muestran 3 bloques animados con CSS <code>@keyframes shimmer</code> que imitan la estructura de las tarjetas resultantes.</li>
    <li><strong>Modo Postman:</strong> El endpoint POST simula una request con body JSON y muestra ambos paneles (request / response) lado a lado, igual que una herramienta de desarrollo real.</li>
    <li><strong>Filtro en tiempo real:</strong> Una vez cargados los datos, el input de búsqueda filtra el array en memoria y re-renderiza sin hacer una nueva petición al servidor.</li>
    <li><strong>Coloreado de JSON:</strong> El panel Raw usa <code>String.replace</code> con regex para envolver keys, strings y números en <code>&lt;span&gt;</code> con clases CSS de color.</li>
  </ul>
  <div class="exp-tech-tags">
    <span class="exp-tech-tag">Fetch API</span>
    <span class="exp-tech-tag">Async/Await</span>
    <span class="exp-tech-tag">Skeleton UI</span>
    <span class="exp-tech-tag">Error Handling</span>
    <span class="exp-tech-tag">JSON Highlight</span>
  </div>
</div>

<div class="exp-section">
  <h4><i class="fa-solid fa-lightbulb"></i> Cuándo recomendaría usarlo</h4>
  <div class="exp-recommend-box">
    Recomiendo este componente como demostración técnica clave cuando el cliente no entiende qué es una API o cómo beneficia a su negocio. Verlo en acción —datos reales cargándose en tiempo real— es más persuasivo que cualquier explicación. En proyectos reales, esta arquitectura se usa para <strong>conectar el frontend con cualquier backend</strong>: stock desde ERP, pedidos desde WooCommerce, clima desde OpenWeather, o clientes desde HubSpot.
  </div>
</div>
`;


function onMount(container) {
  var allData = [];
  var activeEp = null;
  var lastEp   = null;

  var dotEl     = container.querySelector('#api-dot');
  var reqPanel  = container.querySelector('#api-request-panel');
  var reqMethod = container.querySelector('#req-method-badge');
  var reqUrl    = container.querySelector('#req-url');
  var reqTiming = container.querySelector('#req-timing');
  var reqTime   = container.querySelector('#req-time');
  var skeleton  = container.querySelector('#api-skeleton');
  var resultsEl = container.querySelector('#api-results');
  var resultsGrid = container.querySelector('#results-grid');
  var resultTitle = container.querySelector('#results-title');
  var resultCount = container.querySelector('#results-count');
  var filterInput = container.querySelector('#api-filter');
  var rawSection  = container.querySelector('#api-raw-section');
  var rawPre      = container.querySelector('#api-raw-pre');
  var rawToggle   = container.querySelector('#api-raw-toggle');
  var rawChevron  = container.querySelector('#raw-chevron');
  var errorState  = container.querySelector('#api-error-state');
  var postPanel   = container.querySelector('#api-post-panel');

  function clearAll() {
    skeleton.style.display = 'none';
    resultsEl.style.display = 'none';
    rawSection.style.display = 'none';
    errorState.style.display = 'none';
    postPanel.style.display = 'none';
    reqTiming.style.display = 'none';
    allData = [];
  }

  function setLoading(on, method, url) {
    dotEl.className = on ? 'api-dot loading' : 'api-dot';
    reqPanel.style.display = 'flex';
    reqMethod.textContent = method;
    reqMethod.className = 'req-method-badge';
    if (method === 'GET') { reqMethod.style.background = 'rgba(59,130,246,0.15)'; reqMethod.style.color = '#3b82f6'; }
    else if (method === 'POST') { reqMethod.style.background = 'rgba(16,185,129,0.15)'; reqMethod.style.color = '#10b981'; }
    else { reqMethod.style.background = 'rgba(239,68,68,0.15)'; reqMethod.style.color = '#ef4444'; }
    reqUrl.textContent = url;
    skeleton.style.display = on ? 'flex' : 'none';
  }

  function syntaxHighlight(json) {
    var str = JSON.stringify(json, null, 2);
    return str
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) return '<span class="json-key">' + match + '</span>';
          return '<span class="json-str">' + match + '</span>';
        }
        if (/true|false/.test(match)) return '<span class="json-bool">' + match + '</span>';
        if (/null/.test(match)) return '<span class="json-null">' + match + '</span>';
        return '<span class="json-num">' + match + '</span>';
      });
  }

  function renderUserCards(data) {
    resultsGrid.innerHTML = '';
    data.forEach(function(u) {
      var card = document.createElement('div');
      card.className = 'user-card';
      var av = document.createElement('div');
      av.className = 'user-avatar';
      av.textContent = u.name.charAt(0);
      var name = document.createElement('div');
      name.className = 'user-name';
      name.textContent = u.name;
      var email = document.createElement('div');
      email.className = 'user-email';
      email.textContent = u.email;
      var city = document.createElement('div');
      city.className = 'user-city';
      city.textContent = '📍 ' + (u.address ? u.address.city : '');
      card.appendChild(av);
      card.appendChild(name);
      card.appendChild(email);
      card.appendChild(city);
      resultsGrid.appendChild(card);
    });
    resultCount.textContent = 'Total: ' + data.length + ' usuarios';
  }

  function renderPostCards(data) {
    resultsGrid.innerHTML = '';
    data.forEach(function(p) {
      var card = document.createElement('div');
      card.className = 'post-card';
      var title = document.createElement('div');
      title.className = 'post-card-title';
      title.textContent = p.title;
      var body = document.createElement('div');
      body.className = 'post-card-body';
      body.textContent = p.body;
      var user = document.createElement('div');
      user.className = 'post-card-user';
      user.textContent = 'Usuario #' + p.userId;
      card.appendChild(title);
      card.appendChild(body);
      card.appendChild(user);
      resultsGrid.appendChild(card);
    });
    resultCount.textContent = 'Total: ' + data.length + ' posts';
  }

  // Endpoint actions
  var epBtns = container.querySelectorAll('.api-ep-btn[data-ep]');
  epBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var ep = btn.dataset.ep;
      lastEp = ep;
      epBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      clearAll();
      rawPre.style.display = 'none';
      rawChevron.className = 'fa-solid fa-chevron-down';

      if (ep === 'users') {
        setLoading(true, 'GET', 'https://jsonplaceholder.typicode.com/users');
        var t0 = Date.now();
        setTimeout(function() {
          fetch('https://jsonplaceholder.typicode.com/users')
            .then(function(r) { return r.json(); })
            .then(function(data) {
              var elapsed = Date.now() - t0;
              setLoading(false, 'GET', 'https://jsonplaceholder.typicode.com/users');
              dotEl.className = 'api-dot';
              reqTiming.style.display = 'flex';
              reqTime.textContent = elapsed;
              allData = data;
              resultTitle.textContent = '👥 Usuarios';
              resultsEl.style.display = 'block';
              rawSection.style.display = 'block';
              filterInput.value = '';
              renderUserCards(allData);
              rawPre.innerHTML = syntaxHighlight(allData.slice(0, 3));
            })
            .catch(function() {
              dotEl.className = 'api-dot error';
              skeleton.style.display = 'none';
              errorState.style.display = 'block';
              container.querySelector('#api-error-code').textContent = 'ERR';
              container.querySelector('#api-error-msg').textContent = 'No se pudo conectar con la API. Verificá tu conexión.';
            });
        }, 600 + Math.random() * 600);

      } else if (ep === 'posts') {
        setLoading(true, 'GET', 'https://jsonplaceholder.typicode.com/posts?_limit=8');
        var t0 = Date.now();
        setTimeout(function() {
          fetch('https://jsonplaceholder.typicode.com/posts?_limit=8')
            .then(function(r) { return r.json(); })
            .then(function(data) {
              var elapsed = Date.now() - t0;
              setLoading(false, 'GET', 'https://jsonplaceholder.typicode.com/posts?_limit=8');
              dotEl.className = 'api-dot';
              reqTiming.style.display = 'flex';
              reqTime.textContent = elapsed;
              allData = data;
              resultTitle.textContent = '📰 Posts';
              resultsEl.style.display = 'block';
              rawSection.style.display = 'block';
              filterInput.value = '';
              renderPostCards(allData);
              rawPre.innerHTML = syntaxHighlight(allData.slice(0, 2));
            });
        }, 600 + Math.random() * 600);

      } else if (ep === 'post') {
        setLoading(true, 'POST', 'https://jsonplaceholder.typicode.com/posts');
        var t0 = Date.now();
        setTimeout(function() {
          var elapsed = Date.now() - t0;
          setLoading(false, 'POST', 'https://jsonplaceholder.typicode.com/posts');
          dotEl.className = 'api-dot';
          reqTiming.style.display = 'flex';
          reqTime.textContent = elapsed;
          var reqBody = { title: 'Mi nuevo artículo', body: 'Contenido del artículo creado desde la app demo.', userId: 1 };
          var resBody = Object.assign({ id: 101 }, reqBody);
          container.querySelector('#post-req-code').innerHTML = syntaxHighlight(reqBody);
          container.querySelector('#post-res-code').innerHTML = syntaxHighlight(resBody);
          postPanel.style.display = 'block';
        }, 800 + Math.random() * 500);

      } else if (ep === 'error') {
        setLoading(true, '404', 'https://jsonplaceholder.typicode.com/error');
        setTimeout(function() {
          skeleton.style.display = 'none';
          dotEl.className = 'api-dot error';
          reqTiming.style.display = 'none';
          errorState.style.display = 'block';
          container.querySelector('#api-error-code').textContent = '404';
          container.querySelector('#api-error-msg').textContent = 'Recurso no encontrado. El endpoint /error no existe en la API.';
        }, 700 + Math.random() * 500);
      }
    });
  });

  container.querySelector('#api-clear').addEventListener('click', function() {
    clearAll();
    reqPanel.style.display = 'none';
    dotEl.className = 'api-dot';
    epBtns.forEach(function(b) { b.classList.remove('active'); });
  });

  container.querySelector('#api-retry').addEventListener('click', function() {
    var btn = container.querySelector('[data-ep="' + lastEp + '"]');
    if (btn) btn.click();
  });

  rawToggle.addEventListener('click', function() {
    var isOpen = rawPre.style.display !== 'none';
    rawPre.style.display = isOpen ? 'none' : 'block';
    rawChevron.className = isOpen ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
  });

  filterInput.addEventListener('input', function() {
    var q = filterInput.value.toLowerCase();
    if (lastEp === 'users') {
      var filtered = allData.filter(function(u) { return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q); });
      renderUserCards(filtered);
      resultCount.textContent = 'Total: ' + filtered.length + ' usuarios';
    } else if (lastEp === 'posts') {
      var filtered = allData.filter(function(p) { return p.title.toLowerCase().includes(q); });
      renderPostCards(filtered);
      resultCount.textContent = 'Total: ' + filtered.length + ' posts';
    }
  });
}

export function initApi() {
  registerComponent({
    id: 'api',
    title: 'API Simulada — Fetch, Loading & Error Handling',
    icon: 'fa-solid fa-satellite-dish',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
