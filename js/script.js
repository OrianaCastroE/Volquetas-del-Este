// ── NAVEGACIÓN — mostrar sección y cerrar menú móvil ──────────
function show(id){
  document.querySelectorAll('.psec').forEach(function(s){s.classList.remove('active')});
  document.querySelectorAll('.ntb').forEach(function(b){b.classList.remove('active')});
  var s=document.getElementById('sec-'+id);
  if(s)s.classList.add('active');
  document.querySelectorAll('.ntb').forEach(function(b){
    if(b.getAttribute('onclick')==="show('"+id+"')")b.classList.add('active');
  });
  document.getElementById('mobNav').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='contacto')contactForm();
  if(id==='inicio')animatedNumbers();
}
document.getElementById('ham').addEventListener('click',function(){
  document.getElementById('mobNav').classList.toggle('open');
});

function animatedNumbers(){
  document.querySelectorAll('.hs-n[data-t]').forEach(
    function(el){
      var t = parseInt(el.dataset.t),sf=el.dataset.s||'',c=0,step=Math.ceil(t/40);
      var tmr = setInterval(
        function(){
          c=Math.min(c+step,t);
          el.textContent = c + sf;
          if(c>=t){
            clearInterval(tmr);
          }
        },35);
    }
  );
}
animatedNumbers();
document.getElementById('cform').addEventListener('submit',function(e){
document.getElementById('cform').addEventListener('submit', async function(e){
  e.preventDefault();
  this.reset();
});
});

// ── CONTACT FORM — validación y envío con Formspree ──────────
function contactForm(){
  var form = document.getElementById('cform');
  if(!form || form.dataset.bound === '1') return;
  form.dataset.bound = '1';

  form.addEventListener('submit', async function(e){
  e.preventDefault();

  var n = document.getElementById('nombre').value.trim();
  var t = document.getElementById('tel').value.trim();

  if(!n || !t){
    toast('Completá al menos tu nombre y teléfono.', '#78350f', '#fffbeb');
    return;
  }

  if(!/^09\d{7}$/.test(t.replace(/\s/g, ''))){
    toast('El teléfono debe empezar con 09 y tener 9 dígitos.', '#78350f', '#fffbeb');
    return;
  }

  const btn = this.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const formData = new FormData(this);

  try {
    const res = await fetch('https://formspree.io/f/xeerkepg', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if(res.ok){
      toast('✅ ¡Mensaje enviado! Te contactamos pronto.', '#166534', '#f0fdf4');
      this.reset();
    } else {
      toast('❌ Error al enviar. Intentá por WhatsApp.', '#7f1d1d', '#fef2f2');
    }
  } catch(err){
    toast('❌ Error al enviar. Intentá por WhatsApp.', '#7f1d1d', '#fef2f2');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar mensaje →';
  }
});}

contactForm();

// ── TOASTS — mensajes temporales para feedback al usuario ──────────
function toast(msg,color,bg){
  var el=document.getElementById('tmsg');
  el.textContent=msg;el.style.background=bg;el.style.color=color;
  el.classList.add('show');setTimeout(function(){el.classList.remove('show');},3800);
}

// ── MARQUEE — animación continua para logos de marcas ──────────
/*
(function(){
  var track = document.getElementById('mqTrack');
  if(!track) return;
  var pos = 0;
  var speed = 0.6; // px per frame
  function step(){
    pos -= speed;
    // When first half scrolled away, reset to start seamlessly
    var half = track.scrollWidth / 2;
    if(Math.abs(pos) >= half) pos = 0;
    track.style.transform = 'translateX(' + pos + 'px)';
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();
*/

// ── LIVE BADGE — disponible solo 8:00 a 18:00 ──────────
(function(){
  var badge = document.querySelector('.live-badge');
  var dot = document.querySelector('.ldot');
  if(!badge) return;

  var hora = new Date().getHours();
  var disponible = hora >= 7.5 && hora < 18;

  if(disponible){
    badge.innerHTML = '<div class="ldot"></div>Servicio disponible ahora';
    dot.style.background = '#4ade80'; // verde
  } else {
    badge.innerHTML = '<div class="ldot ldot-off"></div>Oficinas cerradas, dejanos tu mensaje.';
    badge.style.opacity = '0.6';
  }
})();

/* tipo de cliente: particular o empresa, con campos dinámicos */
function seleccionarTipo(btn, tipo) {
  // Actualiza botones
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');

  // Guarda el valor en el input oculto
  document.getElementById('tipo_cliente').value = tipo;
}