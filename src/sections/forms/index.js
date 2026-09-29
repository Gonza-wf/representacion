import { registerComponent } from '../../../main.js';

// ─────────────────────────────────────────────
// Forms — Login/Registro + Multi-Step
// ─────────────────────────────────────────────

const html = `
<div class="forms-showcase">

  <!-- Sub-tabs -->
  <div class="form-tabs">
    <button class="form-tab active" data-tab="auth">🔐 Login / Registro</button>
    <button class="form-tab" data-tab="multi">📋 Formulario Multi-Step</button>
  </div>

  <!-- AUTH panel -->
  <div class="form-panel active" id="panel-auth">
    <div class="auth-card">

      <!-- Auth toggle -->
      <div class="auth-toggle">
        <button class="auth-btn active" id="btn-login">Iniciar Sesión</button>
        <button class="auth-btn" id="btn-register">Crear Cuenta</button>
      </div>

      <!-- LOGIN FORM -->
      <form id="login-form" class="auth-form active" autocomplete="off">
        <div class="field-wrap">
          <input type="email" id="l-email" placeholder="Correo electrónico" autocomplete="email">
          <span class="field-err" id="l-email-err"></span>
        </div>
        <div class="field-wrap password-wrap">
          <input type="password" id="l-pass" placeholder="Contraseña" autocomplete="current-password">
          <button type="button" class="eye-btn" id="l-eye"><i class="fa-regular fa-eye"></i></button>
          <span class="field-err" id="l-pass-err"></span>
        </div>
        <div class="auth-row">
          <label class="check-label"><input type="checkbox" id="l-remember"> Recordarme</label>
          <button type="button" class="link-btn" id="l-forgot">¿Olvidaste tu contraseña?</button>
        </div>
        <button type="submit" class="btn btn-primary auth-submit">
          <i class="fa-solid fa-right-to-bracket"></i> Ingresar
        </button>
        <div class="divider"><span>o continuar con</span></div>
        <button type="button" class="btn btn-secondary google-btn" id="l-google">
          <svg width="18" height="18" viewBox="0 0 48 48" style="vertical-align:middle;margin-right:6px"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-21 0-1.3-.2-2.7-.5-4z"/></svg>
          Continuar con Google
        </button>
      </form>

      <!-- LOGIN SUCCESS -->
      <div class="auth-success" id="login-success" style="display:none">
        <div class="success-avatar" id="login-avatar">👤</div>
        <h3>¡Bienvenido de vuelta!</h3>
        <p id="login-welcome-msg"></p>
        <button class="btn btn-secondary" id="login-logout">Cerrar Sesión</button>
      </div>

      <!-- REGISTER FORM -->
      <form id="register-form" class="auth-form" autocomplete="off">
        <div class="field-wrap">
          <input type="text" id="r-name" placeholder="Nombre completo" autocomplete="name">
          <span class="field-err" id="r-name-err"></span>
        </div>
        <div class="field-wrap">
          <input type="email" id="r-email" placeholder="Correo electrónico" autocomplete="email">
          <span class="field-err" id="r-email-err"></span>
        </div>
        <div class="field-wrap password-wrap">
          <input type="password" id="r-pass" placeholder="Contraseña" autocomplete="new-password">
          <button type="button" class="eye-btn" id="r-eye"><i class="fa-regular fa-eye"></i></button>
          <span class="field-err" id="r-pass-err"></span>
        </div>
        <div class="strength-bar-wrap">
          <div class="strength-bar"><div class="strength-fill" id="strength-fill"></div></div>
          <span class="strength-label" id="strength-label"></span>
        </div>
        <div class="field-wrap password-wrap">
          <input type="password" id="r-pass2" placeholder="Confirmar contraseña" autocomplete="new-password">
          <button type="button" class="eye-btn" id="r-eye2"><i class="fa-regular fa-eye"></i></button>
          <span class="field-err" id="r-pass2-err"></span>
        </div>
        <label class="check-label" style="margin-bottom:0.75rem">
          <input type="checkbox" id="r-terms">
          Acepto los <button type="button" class="link-btn">Términos y Condiciones</button>
        </label>
        <span class="field-err" id="r-terms-err"></span>
        <button type="submit" class="btn btn-primary auth-submit">
          <i class="fa-solid fa-user-plus"></i> Crear Cuenta
        </button>
      </form>

      <!-- REGISTER SUCCESS -->
      <div class="auth-success" id="register-success" style="display:none">
        <div class="success-avatar">🎉</div>
        <h3>¡Cuenta creada!</h3>
        <p id="reg-welcome-msg"></p>
        <button class="btn btn-secondary" id="reg-back">Iniciar Sesión</button>
      </div>

    </div>
  </div>

  <!-- MULTI-STEP panel -->
  <div class="form-panel" id="panel-multi">
    <div class="multi-card">

      <!-- Progress -->
      <div class="multi-progress" id="multi-progress">
        <div class="mp-step active" data-step="1"><span class="mp-circle">1</span><span class="mp-label">Datos</span></div>
        <div class="mp-line"></div>
        <div class="mp-step" data-step="2"><span class="mp-circle">2</span><span class="mp-label">Empresa</span></div>
        <div class="mp-line"></div>
        <div class="mp-step" data-step="3"><span class="mp-circle">3</span><span class="mp-label">Confirmar</span></div>
      </div>

      <!-- Step 1 -->
      <div class="ms-step active" id="ms-s1">
        <h3>Datos Personales</h3>
        <div class="field-wrap"><input type="text" id="ms-name" placeholder="Nombre completo"><span class="field-err" id="ms-name-err"></span></div>
        <div class="field-wrap"><input type="email" id="ms-email" placeholder="Email profesional"><span class="field-err" id="ms-email-err"></span></div>
        <div class="field-wrap"><input type="tel" id="ms-phone" placeholder="Teléfono"><span class="field-err" id="ms-phone-err"></span></div>
        <button class="btn btn-primary ms-next" id="ms-next1">Siguiente →</button>
      </div>

      <!-- Step 2 -->
      <div class="ms-step" id="ms-s2">
        <h3>Información de Empresa</h3>
        <div class="field-wrap"><input type="text" id="ms-company" placeholder="Nombre de empresa"><span class="field-err" id="ms-company-err"></span></div>
        <div class="field-wrap">
          <select id="ms-sector">
            <option value="">Seleccionar sector...</option>
            <option>Tecnología</option><option>Retail</option>
            <option>Salud</option><option>Educación</option><option>Otro</option>
          </select>
          <span class="field-err" id="ms-sector-err"></span>
        </div>
        <div class="field-wrap">
          <textarea id="ms-desc" placeholder="Describe brevemente tu empresa (máx. 200 caracteres)" maxlength="200"></textarea>
          <span class="char-counter" id="ms-counter">0/200</span>
        </div>
        <div class="ms-btn-row">
          <button class="btn btn-secondary" id="ms-back2">← Volver</button>
          <button class="btn btn-primary" id="ms-next2">Siguiente →</button>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div class="ms-step" id="ms-s3">
        <h3>Revisá tu información</h3>
        <div class="ms-summary" id="ms-summary"></div>
        <div class="ms-btn-row">
          <button class="btn btn-secondary" id="ms-back3">← Volver</button>
          <button class="btn btn-primary" id="ms-send"><i class="fa-solid fa-paper-plane"></i> Enviar</button>
        </div>
      </div>

      <!-- Multi success -->
      <div class="ms-step" id="ms-success" style="display:none">
        <div class="ms-success-inner">
          <div class="ms-check-anim">✅</div>
          <h3>¡Formulario enviado!</h3>
          <p>Nos contactaremos pronto.</p>
          <button class="btn btn-secondary" id="ms-reset">Empezar de nuevo</button>
        </div>
      </div>

    </div>
  </div>

  <!-- Toast -->
  <div class="form-toast" id="form-toast"></div>

</div>
`;

const css = `
<style>
  .forms-showcase { padding:1.5rem 1rem; }
  .form-tabs { display:flex; gap:0.5rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .form-tab {
    padding:0.5rem 1rem; border-radius:var(--radius-md);
    border:1.5px solid var(--border-color); background:var(--bg-color);
    color:var(--text-secondary); cursor:pointer; font-family:var(--font);
    font-size:0.9rem; font-weight:500; transition:var(--transition);
  }
  .form-tab.active { background:var(--primary-color); color:white; border-color:var(--primary-color); }
  .form-panel { display:none; }
  .form-panel.active { display:flex; justify-content:center; animation:formFade 0.3s ease; }
  @keyframes formFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  /* Auth card */
  .auth-card { width:100%; max-width:380px; background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:2rem; }
  .auth-toggle { display:flex; gap:0.25rem; background:var(--bg-color); border-radius:var(--radius-lg); padding:4px; margin-bottom:1.5rem; }
  .auth-btn { flex:1; padding:0.5rem; border-radius:var(--radius-md); border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-family:var(--font); font-weight:600; font-size:0.88rem; transition:var(--transition); }
  .auth-btn.active { background:var(--primary-color); color:white; box-shadow:var(--shadow-sm); }

  .auth-form { display:none; flex-direction:column; gap:0.75rem; }
  .auth-form.active { display:flex; }
  .field-wrap { display:flex; flex-direction:column; position:relative; }
  .field-wrap input, .field-wrap select, .field-wrap textarea {
    padding:0.7rem 1rem; border:1.5px solid var(--border-color);
    border-radius:var(--radius-md); background:var(--bg-color);
    color:var(--text-primary); font-size:0.95rem; font-family:var(--font);
    transition:var(--transition); resize:none; min-height:80px;
  }
  .field-wrap input:focus, .field-wrap select:focus, .field-wrap textarea:focus { outline:none; border-color:var(--primary-color); box-shadow:0 0 0 3px rgba(59,130,246,0.12); }
  .field-wrap input.valid { border-color:#10b981; }
  .field-wrap input.invalid { border-color:#ef4444; }
  .field-err { font-size:0.75rem; color:#ef4444; min-height:1rem; padding-top:2px; }
  .password-wrap input { padding-right:2.8rem; }
  .eye-btn { position:absolute; right:0.75rem; top:0.7rem; background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0; font-size:1rem; }
  .auth-row { display:flex; align-items:center; justify-content:space-between; font-size:0.85rem; }
  .check-label { display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; color:var(--text-secondary); cursor:pointer; }
  .link-btn { background:none; border:none; color:var(--primary-color); cursor:pointer; font-size:0.85rem; padding:0; text-decoration:underline; font-family:var(--font); }
  .auth-submit { width:100%; justify-content:center; margin-top:0.25rem; }
  .divider { text-align:center; color:var(--text-muted); font-size:0.8rem; margin:0.5rem 0; position:relative; }
  .divider::before, .divider::after { content:''; position:absolute; top:50%; width:35%; height:1px; background:var(--border-color); }
  .divider::before { left:0; } .divider::after { right:0; }
  .google-btn { width:100%; justify-content:center; gap:0; }

  /* Strength bar */
  .strength-bar-wrap { display:flex; align-items:center; gap:0.5rem; margin-top:-0.25rem; }
  .strength-bar { flex:1; height:4px; background:var(--border-color); border-radius:2px; overflow:hidden; }
  .strength-fill { height:100%; width:0%; border-radius:2px; transition:all 0.4s; }
  .strength-label { font-size:0.75rem; color:var(--text-muted); white-space:nowrap; }

  /* Auth success */
  .auth-success { text-align:center; padding:1rem 0; animation:formFade 0.4s ease; }
  .success-avatar { font-size:3rem; margin-bottom:1rem; }
  .auth-success h3 { margin-bottom:0.5rem; }
  .auth-success p { color:var(--text-secondary); margin-bottom:1rem; }

  /* Multi card */
  .multi-card { width:100%; max-width:420px; background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:2rem; }
  .multi-progress { display:flex; align-items:center; margin-bottom:2rem; }
  .mp-step { display:flex; flex-direction:column; align-items:center; gap:4px; flex-shrink:0; }
  .mp-circle { width:30px; height:30px; border-radius:50%; background:var(--border-color); color:var(--text-muted); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; transition:var(--transition); }
  .mp-label { font-size:0.68rem; color:var(--text-muted); transition:var(--transition); }
  .mp-step.active .mp-circle { background:var(--primary-color); color:white; }
  .mp-step.active .mp-label { color:var(--primary-color); font-weight:600; }
  .mp-step.done .mp-circle { background:#10b981; color:white; }
  .mp-line { flex:1; height:2px; background:var(--border-color); margin:0 4px; transition:background 0.3s; }
  .mp-line.done { background:#10b981; }
  .ms-step { display:none; flex-direction:column; gap:0.75rem; }
  .ms-step.active { display:flex; }
  .ms-step h3 { font-size:1.05rem; font-weight:700; margin-bottom:0.25rem; }
  .ms-btn-row { display:flex; gap:0.5rem; }
  .ms-btn-row .btn { flex:1; justify-content:center; }
  .ms-next { width:100%; justify-content:center; }
  .char-counter { font-size:0.75rem; color:var(--text-muted); text-align:right; margin-top:2px; }
  .ms-summary { background:var(--bg-color); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem; font-size:0.9rem; }
  .ms-summary-row { display:flex; gap:0.5rem; padding:0.35rem 0; border-bottom:1px solid var(--border-color); }
  .ms-summary-row:last-child { border-bottom:none; }
  .ms-summary-key { color:var(--text-muted); min-width:90px; flex-shrink:0; }
  .ms-summary-val { color:var(--text-primary); font-weight:600; }
  .ms-success-inner { text-align:center; padding:1rem 0; animation:formFade 0.4s ease; }
  .ms-check-anim { font-size:3.5rem; margin-bottom:1rem; }
  .ms-success-inner h3 { margin-bottom:0.5rem; }
  .ms-success-inner p { color:var(--text-secondary); margin-bottom:1rem; }

  /* Toast */
  .form-toast {
    position:fixed; bottom:1.5rem; right:1.5rem;
    background:var(--surface-color); border:1px solid var(--border-color);
    border-radius:var(--radius-md); padding:0.85rem 1.25rem;
    box-shadow:var(--shadow-lg); font-size:0.9rem;
    transform:translateY(100px); opacity:0; transition:all 0.35s cubic-bezier(.4,0,.2,1);
    z-index:999; pointer-events:none; max-width:300px;
  }
  .form-toast.show { transform:translateY(0); opacity:1; }
</style>
`;

const code = `// Toggle between Login and Register
btnLogin.addEventListener('click', () => {
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
});

// Real-time validation on password strength
rPass.addEventListener('input', () => {
  const v = rPass.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  // Update strength bar width and color
  const pct = (score / 4) * 100 + '%';
  strengthFill.style.width = pct;
});
`;

const explanation = `
<h3>Autenticación Completa + Formulario Multi-Step</h3>
<ul>
  <li><strong>Toggle Login/Registro:</strong> Transición suave entre dos formularios en la misma tarjeta.</li>
  <li><strong>Validación en tiempo real:</strong> Cada campo se valida mientras el usuario escribe: borde verde = válido, rojo = inválido.</li>
  <li><strong>Barra de fortaleza de contraseña:</strong> Evalúa longitud, mayúsculas, números y caracteres especiales.</li>
  <li><strong>Multi-Step (3 pasos):</strong> Progreso visual, validación antes de avanzar, resumen en el paso final.</li>
</ul>
`;

function onMount(container) {
  var toastEl = container.querySelector('#form-toast');

  function showToast(msg, icon) {
    if (window.showToast) {
      window.showToast({
        title: 'Formulario',
        message: msg,
        type: 'info',
        duration: 3500
      });
    } else {
      toastEl.textContent = (icon || 'ℹ️') + ' ' + msg;
      toastEl.classList.add('show');
      setTimeout(function() { toastEl.classList.remove('show'); }, 3000);
    }
  }

  // ---- Sub-tab switch ----
  container.querySelectorAll('.form-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      container.querySelectorAll('.form-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var panelId = 'panel-' + tab.dataset.tab;
      container.querySelectorAll('.form-panel').forEach(function(p) { p.classList.remove('active'); });
      container.querySelector('#' + panelId).classList.add('active');
    });
  });

  // ===== AUTH =====
  var btnLogin    = container.querySelector('#btn-login');
  var btnRegister = container.querySelector('#btn-register');
  var loginForm   = container.querySelector('#login-form');
  var registerForm= container.querySelector('#register-form');
  var loginSuccess  = container.querySelector('#login-success');
  var registerSuccess = container.querySelector('#register-success');

  function showAuth(which) {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    loginSuccess.style.display = 'none';
    registerSuccess.style.display = 'none';
    btnLogin.classList.remove('active');
    btnRegister.classList.remove('active');
    if (which === 'login') { loginForm.classList.add('active'); btnLogin.classList.add('active'); }
    else { registerForm.classList.add('active'); btnRegister.classList.add('active'); }
  }

  btnLogin.addEventListener('click', function() { showAuth('login'); });
  btnRegister.addEventListener('click', function() { showAuth('register'); });

  // Eye toggles
  function eyeToggle(inputId, btnId) {
    var inp = container.querySelector('#' + inputId);
    var btn = container.querySelector('#' + btnId);
    btn.addEventListener('click', function() {
      if (inp.type === 'password') { inp.type = 'text'; btn.querySelector('i').className = 'fa-regular fa-eye-slash'; }
      else { inp.type = 'password'; btn.querySelector('i').className = 'fa-regular fa-eye'; }
    });
  }
  eyeToggle('l-pass', 'l-eye');
  eyeToggle('r-pass', 'r-eye');
  eyeToggle('r-pass2', 'r-eye2');

  // Forgot password
  container.querySelector('#l-forgot').addEventListener('click', function() {
    showToast('Enviamos un enlace de recuperación a tu email', '📧');
  });

  // Google button
  container.querySelector('#l-google').addEventListener('click', function() {
    showToast('Conectando con Google OAuth...', '🔗');
  });

  // Password strength
  var strengthFill  = container.querySelector('#strength-fill');
  var strengthLabel = container.querySelector('#strength-label');
  var rPass = container.querySelector('#r-pass');
  var strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  var strengthNames  = ['', 'Débil', 'Regular', 'Buena', 'Muy fuerte'];
  rPass.addEventListener('input', function() {
    var v = rPass.value;
    var score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    strengthFill.style.width = (v.length === 0 ? 0 : Math.max(score, 1)) * 25 + '%';
    strengthFill.style.background = strengthColors[score] || '';
    strengthLabel.textContent = v.length === 0 ? '' : strengthNames[score];
    strengthLabel.style.color = strengthColors[score] || '';
  });

  // Confirm password match
  var rPass2 = container.querySelector('#r-pass2');
  var rPass2Err = container.querySelector('#r-pass2-err');
  rPass2.addEventListener('input', function() {
    if (rPass2.value !== rPass.value) {
      rPass2.classList.add('invalid'); rPass2.classList.remove('valid');
      rPass2Err.textContent = 'Las contraseñas no coinciden';
    } else {
      rPass2.classList.add('valid'); rPass2.classList.remove('invalid');
      rPass2Err.textContent = '';
    }
  });

  // Login submit
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = container.querySelector('#l-email').value;
    var pass  = container.querySelector('#l-pass').value;
    var ok = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      container.querySelector('#l-email-err').textContent = 'Email inválido';
      container.querySelector('#l-email').classList.add('invalid'); ok = false;
    } else { container.querySelector('#l-email-err').textContent = ''; container.querySelector('#l-email').classList.remove('invalid'); }
    if (!pass || pass.length < 6) {
      container.querySelector('#l-pass-err').textContent = 'Mínimo 6 caracteres';
      container.querySelector('#l-pass').classList.add('invalid'); ok = false;
    } else { container.querySelector('#l-pass-err').textContent = ''; container.querySelector('#l-pass').classList.remove('invalid'); }
    if (!ok) return;
    loginForm.classList.remove('active');
    loginSuccess.style.display = 'block';
    container.querySelector('#login-welcome-msg').textContent = 'Sesión iniciada como ' + email;
  });

  container.querySelector('#login-logout').addEventListener('click', function() { showAuth('login'); });

  // Register submit
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var name  = container.querySelector('#r-name').value;
    var email = container.querySelector('#r-email').value;
    var pass  = container.querySelector('#r-pass').value;
    var pass2 = container.querySelector('#r-pass2').value;
    var terms = container.querySelector('#r-terms').checked;
    var ok = true;
    if (!name || name.trim().length < 3) { container.querySelector('#r-name-err').textContent = 'Mínimo 3 caracteres'; ok = false; }
    else container.querySelector('#r-name-err').textContent = '';
    if (!email || !/\S+@\S+\.\S+/.test(email)) { container.querySelector('#r-email-err').textContent = 'Email inválido'; ok = false; }
    else container.querySelector('#r-email-err').textContent = '';
    if (!pass || pass.length < 6) { container.querySelector('#r-pass-err').textContent = 'Mínimo 6 caracteres'; ok = false; }
    else container.querySelector('#r-pass-err').textContent = '';
    if (pass !== pass2) { container.querySelector('#r-pass2-err').textContent = 'Las contraseñas no coinciden'; ok = false; }
    else container.querySelector('#r-pass2-err').textContent = '';
    if (!terms) { container.querySelector('#r-terms-err').textContent = 'Debes aceptar los términos'; ok = false; }
    else container.querySelector('#r-terms-err').textContent = '';
    if (!ok) return;
    registerForm.classList.remove('active');
    registerSuccess.style.display = 'block';
    container.querySelector('#reg-welcome-msg').textContent = '¡Hola ' + name.split(' ')[0] + '! Tu cuenta fue creada con ' + email;
  });

  container.querySelector('#reg-back').addEventListener('click', function() { showAuth('login'); });

  // ===== MULTI-STEP =====
  var msData = {};
  var currentMs = 1;

  function goMs(n) {
    container.querySelectorAll('.ms-step').forEach(function(s) { s.classList.remove('active'); });
    var target = container.querySelector('#ms-s' + n);
    if (target) { target.classList.add('active'); }
    currentMs = n;
    // Update progress
    container.querySelectorAll('.mp-step').forEach(function(step) {
      var num = parseInt(step.dataset.step);
      step.classList.remove('active', 'done');
      if (num === n) step.classList.add('active');
      if (num < n) step.classList.add('done');
    });
    container.querySelectorAll('.mp-line').forEach(function(line, i) {
      if (i + 1 < n) line.classList.add('done'); else line.classList.remove('done');
    });
  }

  container.querySelector('#ms-next1').addEventListener('click', function() {
    var name  = container.querySelector('#ms-name').value.trim();
    var email = container.querySelector('#ms-email').value.trim();
    var phone = container.querySelector('#ms-phone').value.trim();
    var ok = true;
    if (name.length < 3) { container.querySelector('#ms-name-err').textContent = 'Mínimo 3 caracteres'; ok = false; }
    else container.querySelector('#ms-name-err').textContent = '';
    if (!/\S+@\S+\.\S+/.test(email)) { container.querySelector('#ms-email-err').textContent = 'Email inválido'; ok = false; }
    else container.querySelector('#ms-email-err').textContent = '';
    if (!/^\d{8,}$/.test(phone.replace(/[\s()-]/g, ''))) { container.querySelector('#ms-phone-err').textContent = 'Mínimo 8 dígitos'; ok = false; }
    else container.querySelector('#ms-phone-err').textContent = '';
    if (!ok) return;
    msData.name = name; msData.email = email; msData.phone = phone;
    goMs(2);
  });

  container.querySelector('#ms-desc').addEventListener('input', function() {
    container.querySelector('#ms-counter').textContent = this.value.length + '/200';
  });

  container.querySelector('#ms-back2').addEventListener('click', function() { goMs(1); });
  container.querySelector('#ms-next2').addEventListener('click', function() {
    var company = container.querySelector('#ms-company').value.trim();
    var sector  = container.querySelector('#ms-sector').value;
    var ok = true;
    if (company.length < 2) { container.querySelector('#ms-company-err').textContent = 'Campo obligatorio'; ok = false; }
    else container.querySelector('#ms-company-err').textContent = '';
    if (!sector) { container.querySelector('#ms-sector-err').textContent = 'Seleccioná un sector'; ok = false; }
    else container.querySelector('#ms-sector-err').textContent = '';
    if (!ok) return;
    msData.company = company; msData.sector = sector; msData.desc = container.querySelector('#ms-desc').value;
    // Build summary
    var summary = container.querySelector('#ms-summary');
    summary.innerHTML = '';
    var rows2 = [['Nombre', msData.name], ['Email', msData.email], ['Teléfono', msData.phone], ['Empresa', msData.company], ['Sector', msData.sector], ['Descripción', msData.desc || '—']];
    rows2.forEach(function(row) {
      var div = document.createElement('div');
      div.className = 'ms-summary-row';
      var k = document.createElement('span');
      k.className = 'ms-summary-key';
      k.textContent = row[0];
      var v = document.createElement('span');
      v.className = 'ms-summary-val';
      v.textContent = row[1];
      div.appendChild(k);
      div.appendChild(v);
      summary.appendChild(div);
    });
    goMs(3);
  });

  container.querySelector('#ms-back3').addEventListener('click', function() { goMs(2); });
  container.querySelector('#ms-send').addEventListener('click', function() {
    container.querySelectorAll('.ms-step').forEach(function(s) { s.classList.remove('active'); });
    container.querySelector('#ms-success').style.display = 'flex';
    container.querySelector('#ms-success').classList.add('active');
    container.querySelector('.multi-progress').style.display = 'none';
  });

  container.querySelector('#ms-reset').addEventListener('click', function() {
    container.querySelector('#ms-success').style.display = 'none';
    container.querySelector('#ms-success').classList.remove('active');
    container.querySelector('.multi-progress').style.display = 'flex';
    container.querySelectorAll('.ms-step input, .ms-step select, .ms-step textarea').forEach(function(el) { el.value = ''; });
    msData = {};
    goMs(1);
  });
}

export function initForms() {
  registerComponent({
    id: 'forms',
    title: 'Formularios Avanzados — Login & Multi-Step',
    icon: 'fa-solid fa-file-lines',
    html: html + css,
    code: code,
    explanation: explanation,
    onMount: onMount
  });
}
