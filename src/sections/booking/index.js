import { registerComponent } from '../../../main.js';

// ─────────────────────────────────────────────
// Booking — 4-step: Service → Day → Time → Data
// ─────────────────────────────────────────────

var SERVICES = [
  { id: 'corte', icon: '<i class="fa-solid fa-scissors"></i>',      name: 'Corte de Cabello',    dur: '45 min',  price: 2500 },
  { id: 'barba', icon: '<i class="fa-solid fa-person"></i>',        name: 'Corte + Barba',       dur: '60 min',  price: 3500 },
  { id: 'color', icon: '<i class="fa-solid fa-palette"></i>',       name: 'Coloración',          dur: '90 min',  price: 6000 },
  { id: 'trat',  icon: '<i class="fa-solid fa-spa"></i>',           name: 'Tratamiento Capilar', dur: '60 min',  price: 4000 },
  { id: 'ker',   icon: '<i class="fa-solid fa-wand-sparkles"></i>', name: 'Keratina',            dur: '120 min', price: 8000 },
  { id: 'fle',   icon: '<i class="fa-solid fa-cut"></i>',           name: 'Flequillo',           dur: '20 min',  price: 1200 }
];

var DAYS_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
var TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

const html = `
<div class="booking-showcase">
  <div class="booking-wrap">

    <!-- Stepper Header -->
    <div class="stepper" id="bk-stepper">
      <div class="step-item active" data-step="1"><span class="step-circle">1</span><span class="step-txt">Servicio</span></div>
      <div class="step-line"></div>
      <div class="step-item" data-step="2"><span class="step-circle">2</span><span class="step-txt">Día</span></div>
      <div class="step-line"></div>
      <div class="step-item" data-step="3"><span class="step-circle">3</span><span class="step-txt">Horario</span></div>
      <div class="step-line"></div>
      <div class="step-item" data-step="4"><span class="step-circle">4</span><span class="step-txt">Datos</span></div>
    </div>

    <!-- Steps container -->
    <div id="bk-steps">

      <!-- STEP 1: Service -->
      <div class="bk-step active" id="bk-s1">
        <h3 class="step-title">¿Qué servicio necesitás?</h3>
        <div class="service-grid" id="service-grid"></div>
      </div>

      <!-- STEP 2: Day -->
      <div class="bk-step" id="bk-s2">
        <h3 class="step-title">Seleccioná el día</h3>
        <div class="date-scroll" id="date-scroll"></div>
        <button class="btn btn-secondary btn-back" id="bk-back2"><i class="fa-solid fa-arrow-left"></i> Volver</button>
      </div>

      <!-- STEP 3: Time -->
      <div class="bk-step" id="bk-s3">
        <h3 class="step-title">Elegí el horario</h3>
        <div class="time-grid" id="time-grid"></div>
        <button class="btn btn-secondary btn-back" id="bk-back3"><i class="fa-solid fa-arrow-left"></i> Volver</button>
      </div>

      <!-- STEP 4: Personal data -->
      <div class="bk-step" id="bk-s4">
        <h3 class="step-title">Tus datos</h3>
        <div class="bk-summary-mini" id="bk-mini"></div>
        <div class="bk-inputs">
          <input type="text" id="bk-name" placeholder="Nombre completo" autocomplete="name">
          <input type="tel"  id="bk-phone" placeholder="Teléfono (WhatsApp)">
        </div>
        <button class="btn btn-primary btn-confirm" id="bk-confirm" disabled>
          <i class="fa-solid fa-calendar-check"></i> Confirmar Turno
        </button>
        <button class="btn btn-secondary btn-back" id="bk-back4"><i class="fa-solid fa-arrow-left"></i> Volver</button>
      </div>
    </div>

    <!-- Success -->
    <div class="bk-success" id="bk-success" style="display:none">
      <div class="success-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h3>¡Turno Confirmado!</h3>
      <div class="bk-success-detail" id="bk-success-detail"></div>
      <p class="bk-wa-msg"><i class="fa-brands fa-whatsapp"></i> Recibirás confirmación por WhatsApp</p>
      <button class="btn btn-secondary" id="bk-reset">Nueva Reserva</button>
    </div>

  </div>
</div>
`;

const css = `
<style>
  .booking-showcase { display:flex; justify-content:center; padding:2rem 1rem; background:var(--bg-color); }
  .booking-wrap { width:100%; max-width:480px; }

  /* Stepper */
  .stepper { display:flex; align-items:center; margin-bottom:2rem; }
  .step-item { display:flex; flex-direction:column; align-items:center; gap:4px; flex-shrink:0; }
  .step-circle {
    width:32px; height:32px; border-radius:50%;
    background:var(--border-color); color:var(--text-muted);
    display:flex; align-items:center; justify-content:center;
    font-size:0.8rem; font-weight:700; transition:var(--transition);
  }
  .step-txt { font-size:0.7rem; color:var(--text-muted); transition:var(--transition); }
  .step-item.active .step-circle { background:var(--primary-color); color:white; }
  .step-item.active .step-txt { color:var(--primary-color); font-weight:600; }
  .step-item.done .step-circle { background:#10b981; color:white; }
  .step-line { flex:1; height:2px; background:var(--border-color); margin:0 4px; transition:background 0.3s; }
  .step-line.done { background:#10b981; }

  /* Steps */
  .bk-step { display:none; }
  .bk-step.active { display:block; animation:bkSlideIn 0.3s ease; }
  @keyframes bkSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .step-title { font-size:1.1rem; font-weight:700; margin-bottom:1.25rem; }

  /* Service Grid */
  .service-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.5rem; }
  .service-card {
    background:var(--surface-color); border:2px solid var(--border-color);
    border-radius:var(--radius-lg); padding:1rem; cursor:pointer;
    transition:var(--transition); text-align:center;
  }
  .service-card:hover { border-color:var(--primary-color); }
  .service-card.selected { border-color:var(--primary-color); background:rgba(59,130,246,0.06); }
  .svc-icon { font-size:1.8rem; margin-bottom:0.4rem; }
  .svc-name { font-weight:700; font-size:0.9rem; margin-bottom:0.25rem; }
  .svc-meta { font-size:0.75rem; color:var(--text-muted); }
  .svc-price { font-size:0.85rem; color:var(--primary-color); font-weight:700; margin-top:0.25rem; }

  /* Date scroll */
  .date-scroll { display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:0.75rem; margin-bottom:1rem; }
  .date-card {
    flex-shrink:0; width:58px; min-height:68px;
    border:2px solid var(--border-color); border-radius:var(--radius-md);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    cursor:pointer; transition:var(--transition); gap:2px;
  }
  .date-card:hover { border-color:var(--primary-color); }
  .date-card.active { background:var(--primary-color); border-color:var(--primary-color); color:white; }
  .dc-day { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
  .dc-num { font-size:1.4rem; font-weight:800; line-height:1; }

  /* Time grid */
  .time-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem; margin-bottom:1rem; }
  .time-btn {
    padding:0.55rem 0.2rem; border:1.5px solid var(--border-color);
    background:var(--bg-color); border-radius:var(--radius-md);
    font-size:0.85rem; font-weight:500; cursor:pointer;
    color:var(--text-primary); transition:var(--transition); font-family:var(--font);
  }
  .time-btn:hover:not(:disabled) { border-color:var(--primary-color); color:var(--primary-color); }
  .time-btn.active { background:var(--primary-color); color:white; border-color:var(--primary-color); }
  .time-btn:disabled { opacity:0.35; cursor:not-allowed; text-decoration:line-through; }

  /* Step 4 */
  .bk-summary-mini {
    background:var(--surface-color); border:1px solid var(--border-color);
    border-radius:var(--radius-md); padding:0.85rem 1rem;
    margin-bottom:1rem; font-size:0.88rem; color:var(--text-secondary);
  }
  .bk-summary-mini strong { color:var(--text-primary); }
  .bk-inputs { display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem; }
  .bk-inputs input {
    padding:0.7rem 1rem; border:1.5px solid var(--border-color);
    border-radius:var(--radius-md); background:var(--bg-color);
    color:var(--text-primary); font-size:0.95rem; font-family:var(--font); transition:var(--transition);
  }
  .bk-inputs input:focus { outline:none; border-color:var(--primary-color); box-shadow:0 0 0 3px rgba(59,130,246,0.15); }
  .btn-confirm { width:100%; justify-content:center; margin-bottom:0.5rem; }
  .btn-back { width:100%; justify-content:center; margin-top:0.25rem; }

  /* Success */
  .bk-success { text-align:center; padding:2rem 1rem; animation:bkSlideIn 0.4s ease; }
  .success-icon { font-size:3.5rem; margin-bottom:1rem; }
  .bk-success h3 { font-size:1.4rem; margin-bottom:1rem; }
  .bk-success-detail {
    background:var(--surface-color); border:1px solid var(--border-color);
    border-radius:var(--radius-lg); padding:1rem 1.25rem;
    text-align:left; margin-bottom:1rem; font-size:0.9rem;
  }
  .bk-success-detail p { margin-bottom:0.4rem; color:var(--text-secondary); }
  .bk-success-detail p:last-child { margin-bottom:0; }
  .bk-success-detail strong { color:var(--text-primary); }
  .bk-wa-msg { color:#25d366; font-weight:600; margin-bottom:1rem; }
  .bk-wa-msg i { margin-right:0.3rem; }
</style>
`;

const code = `// 4-step booking: Service → Day → Time → Personal data
// Service selector
SERVICES.forEach(svc => {
  var card = document.createElement('div');
  card.className = 'service-card';
  card.innerHTML = '<div>' + svc.icon + '</div><div>' + svc.name + '</div>';
  card.addEventListener('click', () => {
    selectedService = svc;
    goToStep(2); // advance automatically
  });
  serviceGrid.appendChild(card);
});

// Dynamic day generation (no Sundays)
for (var i = 1; i <= 10; i++) {
  var d = new Date();
  d.setDate(d.getDate() + i);
  if (d.getDay() === 0) continue; // skip Sundays
  // render date card...
}

// Time slots with random occupancy
TIME_SLOTS.forEach(t => {
  var btn = document.createElement('button');
  btn.textContent = t;
  btn.disabled = Math.random() > 0.65;
  btn.addEventListener('click', () => { selectedTime = t; goToStep(4); });
  timeGrid.appendChild(btn);
});
`;

const explanation = `
<h3>Sistema de Reservas de 4 Pasos</h3>
<p>Flujo completo para peluquerías, consultorios, talleres y cualquier negocio de turnos:</p>
<ul>
  <li><strong>Paso 1 — Servicio:</strong> Grid visual con icono, nombre, duración y precio. Al seleccionar avanza automáticamente.</li>
  <li><strong>Paso 2 — Día:</strong> Genera los próximos 8 días hábiles con <code>Date</code> nativo, saltea los domingos.</li>
  <li><strong>Paso 3 — Horario:</strong> Franjas de 30 min. Algunas ocupadas simulando carga desde una API.</li>
  <li><strong>Paso 4 — Datos:</strong> Mini-resumen del turno seleccionado + campos de nombre y teléfono. Botón de confirmación habilitado solo con todo completo.</li>
  <li><strong>Pantalla de éxito:</strong> Detalle completo + mensaje de confirmación por WhatsApp.</li>
</ul>
`;

function onMount(container) {
  var currentStep = 1;
  var selectedService = null;
  var selectedDay = null;
  var selectedDayStr = '';
  var selectedTime = null;

  // Stepper items
  var stepItems  = container.querySelectorAll('.step-item');
  var stepLines  = container.querySelectorAll('.step-line');
  var steps      = container.querySelectorAll('.bk-step');
  var stepsWrap  = container.querySelector('#bk-steps');
  var successDiv = container.querySelector('#bk-success');

  function goToStep(n) {
    steps.forEach(function(s) { s.classList.remove('active'); });
    var target = container.querySelector('#bk-s' + n);
    if (target) target.classList.add('active');
    currentStep = n;
    updateStepper();
    if (n === 3) renderTimes();
    if (n === 4) renderMini();
  }

  function updateStepper() {
    stepItems.forEach(function(item, i) {
      var num = i + 1;
      item.classList.remove('active', 'done');
      if (num === currentStep) item.classList.add('active');
      if (num < currentStep) item.classList.add('done');
    });
    stepLines.forEach(function(line, i) {
      if (i + 1 < currentStep) line.classList.add('done');
      else line.classList.remove('done');
    });
  }

  // Build service cards
  var serviceGrid = container.querySelector('#service-grid');
  SERVICES.forEach(function(svc) {
    var card = document.createElement('div');
    card.className = 'service-card';
    var icon = document.createElement('div');
    icon.className = 'svc-icon';
    icon.innerHTML = svc.icon;
    var name = document.createElement('div');
    name.className = 'svc-name';
    name.textContent = svc.name;
    var meta = document.createElement('div');
    meta.className = 'svc-meta';
    meta.textContent = svc.dur;
    var price = document.createElement('div');
    price.className = 'svc-price';
    price.textContent = '$' + svc.price.toLocaleString('es-AR');
    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(meta);
    card.appendChild(price);
    card.addEventListener('click', function() {
      container.querySelectorAll('.service-card').forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      selectedService = svc;
      setTimeout(function() { goToStep(2); }, 250);
    });
    serviceGrid.appendChild(card);
  });

  // Build date cards
  var dateScroll = container.querySelector('#date-scroll');
  var days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var today = new Date();
  var added = 0;
  for (var i = 1; i <= 12 && added < 8; i++) {
    var d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue;
    (function(day, dayName, dayNum) {
      var card = document.createElement('div');
      card.className = 'date-card';
      var dc = document.createElement('div');
      dc.className = 'dc-day';
      dc.textContent = dayName;
      var dn = document.createElement('div');
      dn.className = 'dc-num';
      dn.textContent = dayNum;
      card.appendChild(dc);
      card.appendChild(dn);
      card.addEventListener('click', function() {
        container.querySelectorAll('.date-card').forEach(function(c) { c.classList.remove('active'); });
        card.classList.add('active');
        selectedDay = day;
        selectedDayStr = dayName + ' ' + dayNum;
        setTimeout(function() { goToStep(3); }, 250);
      });
      dateScroll.appendChild(card);
    })(d, days[d.getDay()], d.getDate());
    added++;
  }

  // Render time grid
  function renderTimes() {
    var timeGrid = container.querySelector('#time-grid');
    timeGrid.innerHTML = '';
    selectedTime = null;
    TIME_SLOTS.forEach(function(t) {
      var btn = document.createElement('button');
      btn.className = 'time-btn';
      btn.textContent = t;
      if (Math.random() > 0.65) {
        btn.disabled = true;
        btn.title = 'Horario ocupado';
      }
      btn.addEventListener('click', function() {
        container.querySelectorAll('.time-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedTime = t;
        setTimeout(function() { goToStep(4); }, 250);
      });
      timeGrid.appendChild(btn);
    });
  }

  // Mini summary in step 4
  function renderMini() {
    var mini = container.querySelector('#bk-mini');
    mini.innerHTML = '';
    if (selectedService) {
      var p1 = document.createElement('p');
      var b1 = document.createElement('strong');
      b1.textContent = 'Servicio: ';
      p1.appendChild(b1);
      p1.appendChild(document.createTextNode(selectedService.icon + ' ' + selectedService.name + ' — $' + selectedService.price.toLocaleString('es-AR')));
      mini.appendChild(p1);
    }
    if (selectedDayStr) {
      var p2 = document.createElement('p');
      var b2 = document.createElement('strong');
      b2.textContent = 'Día: ';
      p2.appendChild(b2);
      p2.appendChild(document.createTextNode(selectedDayStr));
      mini.appendChild(p2);
    }
    if (selectedTime) {
      var p3 = document.createElement('p');
      var b3 = document.createElement('strong');
      b3.textContent = 'Horario: ';
      p3.appendChild(b3);
      p3.appendChild(document.createTextNode(selectedTime + 'hs'));
      mini.appendChild(p3);
    }
    checkConfirm();
  }

  // Back buttons
  container.querySelector('#bk-back2').addEventListener('click', function() { goToStep(1); });
  container.querySelector('#bk-back3').addEventListener('click', function() { goToStep(2); });
  container.querySelector('#bk-back4').addEventListener('click', function() { goToStep(3); });

  // Confirm button logic
  var nameInput  = container.querySelector('#bk-name');
  var phoneInput = container.querySelector('#bk-phone');
  var confirmBtn = container.querySelector('#bk-confirm');

  function checkConfirm() {
    if (selectedService && selectedDay && selectedTime && nameInput.value.trim().length > 2 && phoneInput.value.trim().length > 6) {
      confirmBtn.disabled = false;
    } else {
      confirmBtn.disabled = true;
    }
  }

  nameInput.addEventListener('input', checkConfirm);
  phoneInput.addEventListener('input', checkConfirm);

  confirmBtn.addEventListener('click', function() {
    stepsWrap.style.display = 'none';
    container.querySelector('#bk-stepper').style.display = 'none';
    successDiv.style.display = 'block';

    var detail = container.querySelector('#bk-success-detail');
    detail.innerHTML = '';
    var rows = [
      ['Servicio', selectedService.icon + ' ' + selectedService.name + ' (' + selectedService.dur + ')'],
      ['Precio', '$' + selectedService.price.toLocaleString('es-AR')],
      ['Día', selectedDayStr],
      ['Horario', selectedTime + 'hs'],
      ['Nombre', nameInput.value.trim()],
      ['Teléfono', phoneInput.value.trim()]
    ];
    rows.forEach(function(row) {
      var p = document.createElement('p');
      var b = document.createElement('strong');
      b.textContent = row[0] + ': ';
      p.appendChild(b);
      p.appendChild(document.createTextNode(row[1]));
      detail.appendChild(p);
    });
  });

  container.querySelector('#bk-reset').addEventListener('click', function() {
    selectedService = null;
    selectedDay = null;
    selectedDayStr = '';
    selectedTime = null;
    nameInput.value = '';
    phoneInput.value = '';
    container.querySelectorAll('.service-card').forEach(function(c) { c.classList.remove('selected'); });
    container.querySelectorAll('.date-card').forEach(function(c) { c.classList.remove('active'); });
    successDiv.style.display = 'none';
    stepsWrap.style.display = 'block';
    container.querySelector('#bk-stepper').style.display = 'flex';
    goToStep(1);
  });

  updateStepper();
}

export function initBooking() {
  registerComponent({
    id: 'booking',
    title: 'Reserva de Turnos — 4 Pasos',
    icon: 'fa-regular fa-calendar-check',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
