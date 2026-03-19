/* ── NAVEGACIÓN ─────────────────────────────────────────────── */
function show(id) {
  document.querySelectorAll('.psec').forEach(function(s){ s.classList.remove('active'); });
  document.querySelectorAll('.ntb').forEach(function(b){ b.classList.remove('active'); });

  var s = document.getElementById('sec-' + id);
  if (s) s.classList.add('active');

  document.querySelectorAll('.ntb').forEach(function(b){
    if (b.getAttribute('onclick') === "show('" + id + "')") b.classList.add('active');
  });

  var mob = document.getElementById('mobNav');
  if (mob) mob.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'inicio')   { animNums(); startTimer(); }
  if (id === 'contacto') { initForm(); }
}

/* ── HAMBURGUESA ─────────────────────────────────────────────── */
document.getElementById('ham').addEventListener('click', function(){
  document.getElementById('mobNav').classList.toggle('open');
});

/* ── NÚMEROS ANIMADOS ────────────────────────────────────────── */
function animNums() {
  document.querySelectorAll('.hm-n[data-t]').forEach(function(el){
    var t    = parseInt(el.dataset.t);
    var sf   = el.dataset.s || '';
    var c    = 0;
    var step = Math.ceil(t / 40);
    var tmr  = setInterval(function(){
      c = Math.min(c + step, t);
      el.textContent = c + sf;
      if (c >= t) clearInterval(tmr);
    }, 30);
  });
}
animNums();

/* ── LIVE BADGE ──────────────────────────────────────────────── */
(function(){
  var badge = document.getElementById('liveBadge');
  if (!badge) return;
  var h = new Date().getHours();
  var open = h >= 7 && h < 18;
  if (open) {
    badge.innerHTML = '<div class="hero-dot"></div>Servicio disponible ahora';
  } else {
    badge.innerHTML = '<div class="hero-dot-off"></div>Oficinas cerradas — dejanos tu mensaje';
    badge.style.opacity = '.55';
  }
})();

/* ── URGENCY TIMER ───────────────────────────────────────────── */
function startTimer() {
  var timerEl = document.getElementById('ubTimer');
  if (!timerEl) return;

  // Count down to end of business day (17:30), or 2h if outside hours
  var now  = new Date();
  var end  = new Date(now);
  end.setHours(17, 30, 0, 0);
  if (now >= end) {
    end.setDate(end.getDate() + 1);
    end.setHours(9, 0, 0, 0);
  }

  function tick() {
    var diff = Math.max(0, end - new Date());
    var h    = Math.floor(diff / 3600000);
    var m    = Math.floor((diff % 3600000) / 60000);
    var ss   = Math.floor((diff % 60000) / 1000);
    timerEl.textContent =
      String(h).padStart(2,'0') + ':' +
      String(m).padStart(2,'0') + ':' +
      String(ss).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}
startTimer();

/* ── HERO CARD: selección de volqueta ───────────────────────── */
document.querySelectorAll('.hc-opt').forEach(function(opt){
  opt.addEventListener('click', function(){
    document.querySelectorAll('.hc-opt').forEach(function(o){ o.classList.remove('selected'); });
    this.classList.add('selected');
  });
});
// Seleccionar primera por defecto
var firstOpt = document.querySelector('.hc-opt');
if (firstOpt) firstOpt.classList.add('selected');

/* ── FAQ ACCORDEON ───────────────────────────────────────────── */
document.querySelectorAll('.fq').forEach(function(fq){
  fq.addEventListener('click', function(){
    var isOpen = this.classList.contains('open');
    document.querySelectorAll('.fq').forEach(function(f){ f.classList.remove('open'); });
    if (!isOpen) this.classList.add('open');
  });
});

/* ── TIPO CLIENTE ────────────────────────────────────────────── */
function setTipo(btn, tipo) {
  document.querySelectorAll('.tipo-btn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  document.getElementById('tipo_cliente').value = tipo;
}

/* ── TOAST ───────────────────────────────────────────────────── */
function toast(msg, ok) {
  var el = document.getElementById('toastEl');
  el.textContent = msg;
  el.style.borderLeftColor = ok ? '#22c55e' : '#D91A1A';
  el.classList.add('show');
  setTimeout(function(){ el.classList.remove('show'); }, 4000);
}

/* ── FORMULARIO ──────────────────────────────────────────────── */
function initForm() {
  var form = document.getElementById('cform');
  if (!form || form.dataset.bound === '1') return;
  form.dataset.bound = '1';

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    var n = document.getElementById('nombre').value.trim();
    var t = document.getElementById('tel').value.trim();

    if (!n || !t) {
      toast('Completá al menos tu nombre y teléfono.', false);
      return;
    }
    if (!/^09\d{7}$/.test(t.replace(/\s/g,''))) {
      toast('El teléfono debe empezar con 09 y tener 9 dígitos.', false);
      return;
    }

    var btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      var res = await fetch('https://formspree.io/f/xeerkepg', {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        toast('✅ ¡Mensaje enviado! Te contactamos a la brevedad.', true);
        this.reset();
        document.querySelectorAll('.tipo-btn').forEach(function(b){ b.classList.remove('on'); });
        document.querySelector('.tipo-btn[data-tipo="Empresa"]').classList.add('on');
      } else {
        toast('❌ Error al enviar. Probá por WhatsApp.', false);
      }
    } catch(err) {
      toast('❌ Error al enviar. Probá por WhatsApp.', false);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar consulta →';
    }
  });
}
initForm();
