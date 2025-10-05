// Simple stepper + fake availability logic (no backend)
(() => {
  const els = {
    stepper: document.querySelectorAll('.step'),
    panels: document.querySelectorAll('.step-panel'),
    restaurant: document.getElementById('restaurant'),
    date: document.getElementById('date'),
    diners: document.getElementById('diners'),
    nexts: document.querySelectorAll('.next'),
    prevs: document.querySelectorAll('.prev'),
    slots: document.getElementById('slots'),
    noSlots: document.getElementById('no-slots'),
    confirmBtn: document.getElementById('confirmBtn'),
    summary: document.getElementById('summary'),
    form: document.getElementById('confirmForm'),
    modal: document.getElementById('confirmModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
  };

  const state = { step: 1, restaurant: '', date: '', diners: 4, slot: '' };

  // Init date (today) i sincronitza l'estat
  const today = new Date();
  const pad = n => String(n).padStart(2,'0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
  els.date.value = todayStr;   // mostra avui
  els.date.min   = todayStr;   // evita dates passades però permet avui
  state.date     = todayStr;   // clau per habilitar el pas 2 amb avui
  // sincronitza restaurant per si el select ja té un valor inicial
  syncRestaurant();
  updateButtons();

  function goto(step) {
    state.step = step;
    els.stepper.forEach(li => {
      const s = Number(li.dataset.step);
      li.classList.toggle('active', s <= step);
      if (s === step) li.setAttribute('aria-current','step'); else li.removeAttribute('aria-current');
    });
    els.panels.forEach(p => p.hidden = Number(p.dataset.step) !== step);
    updateButtons();
  }

  function validateStep(step){
    if (step === 1) return !!state.restaurant;
    if (step === 2) return !!state.date && !!state.diners;
    if (step === 3) return !!state.slot;
    return true;
  }

  function updateButtons() {
    document.querySelectorAll('.step-panel[data-step="1"] .next').forEach(b=> b.disabled = !validateStep(1));
    document.querySelectorAll('.step-panel[data-step="2"] .next').forEach(b=> b.disabled = !validateStep(2));
    document.querySelectorAll('.step-panel[data-step="3"] .next').forEach(b=> b.disabled = !validateStep(3));
  }

  // Generate slots (placeholder). Closed on Mondays 15:00-18:00; Dinner slots 20:00-22:45
  function generateSlots() {
    els.slots.innerHTML = '';
    els.noSlots.hidden = true;
    state.slot = '';
    updateButtons();
    if (!state.restaurant || !state.date) return;

    const d = new Date(state.date + 'T12:00:00');
    const weekday = d.getDay(); // 0 Sun .. 6 Sat
    const base = ['20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45'];
    // Simple fake availability: weekends busier
    const unavailable = new Set();
    base.forEach((t,i)=>{ if ((weekday===5||weekday===6) && i%3===0) unavailable.add(t); });
    if (weekday===1) { // Monday: fewer slots
      base.forEach((t,i)=>{ if (i<3) unavailable.add(t); });
    }

    let any = false;
    base.forEach(time=>{
      const div = document.createElement('button');
      div.type = 'button';
      div.className = 'slot ' + (unavailable.has(time) ? 'unavailable' : 'available');
      div.textContent = time;
      if (unavailable.has(time)) {
        div.disabled = true;
      } else {
        any = true;
        div.addEventListener('click',()=>{
          document.querySelectorAll('.slot.selected').forEach(s=>s.classList.remove('selected'));
          div.classList.add('selected');
          state.slot = time;
          updateButtons();
        });
      }
      els.slots.appendChild(div);
    });
    if (!any) els.noSlots.hidden = false;
  }

  // Summary rendering
  function renderSummary(){
    els.summary.innerHTML = `
      <strong>Resum de la reserva</strong><br>
      Restaurant: ${escapeHtml(labelOf(els.restaurant))}<br>
      Data: ${escapeHtml(state.date)} · Hora: ${escapeHtml(state.slot)}<br>
      Comensals: ${escapeHtml(state.diners.toString())}
    `;
  }

  function labelOf(select){
    const opt = select.options[select.selectedIndex];
    return opt ? opt.textContent : '';
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function syncRestaurant(){
    state.restaurant = els.restaurant.value || '';
    updateButtons();
  }
  function syncDateFromInput(){
    state.date = els.date.value || '';
    updateButtons();
  }

  // Event wiring
  ['change','input','keyup','blur'].forEach(evt => {
    els.restaurant.addEventListener(evt, syncRestaurant);
  });
  ['change','input'].forEach(evt => {
    els.date.addEventListener(evt, syncDateFromInput);
  });
  els.diners.addEventListener('change', e => { state.diners = Number(e.target.value); updateButtons(); });
  els.nexts.forEach(btn=> btn.addEventListener('click', ()=>{
    const target = Number(btn.dataset.next);
    if (target===3) generateSlots();
    if (target===4) renderSummary();
    goto(target);
  }));
  els.prevs.forEach(btn=> btn.addEventListener('click', ()=>{ goto(Number(btn.dataset.prev)); }));

  els.form.addEventListener('submit', e=> e.preventDefault());
  document.getElementById('confirmBtn').addEventListener('click', (e)=>{
    e.preventDefault();
    // Basic client validation
    const required = ['nom','email','telefon'];
    for (const id of required){
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.focus(); return; }
    }
    openModal();
  });

  // Parse query for preselects e.g. ?restaurant=santcugat
  const params = new URLSearchParams(location.search);
  const pre = params.get('restaurant');
  if (pre) {
    els.restaurant.value = pre;
    state.restaurant = pre;
  }
  updateButtons();

  // Modal controls
  function openModal(){
    els.modal.hidden = false;
    els.modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    setTimeout(()=> els.closeModalBtn.focus(), 0);
  }
  function closeModal(){
    els.modal.hidden = true;
    els.modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  els.closeModalBtn.addEventListener('click', closeModal);
  els.modal.addEventListener('click', (ev)=>{ if (ev.target === els.modal) closeModal(); });
  document.addEventListener('keydown', (ev)=>{ if (ev.key === 'Escape' && !els.modal.hidden) closeModal(); });
})();




