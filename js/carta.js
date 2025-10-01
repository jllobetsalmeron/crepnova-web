/* Carta page rendering */
(function(){
  const root = document.getElementById('menuRoot');
  const search = document.getElementById('menuSearch');
  const tabs = document.querySelectorAll('.menu-tabs .tab');

  // Load data
  async function loadData(){
    // 1) Preferir dades inline per assegurar català i evitar restriccions de fetch local
    const inline = readInline();
    if (inline) return inline;
    // 2) Si hi ha servidor, provar JSON extern
    try {
      const res = await fetch('data/menu.json', {cache: 'no-cache'});
      if (!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    } catch (e) {
      console.warn('No s\'ha pogut carregar data/menu.json. S\'usa demo.', e);
      return demoData();
    }
  }

  function readInline(){
    try {
      const el = document.getElementById('menuData');
      if (el && el.textContent.trim().length) {
        return JSON.parse(el.textContent);
      }
    } catch(err){ console.warn('Error parsejant dades inline', err); }
    return null;
  }

  function demoData(){
    return {
      sections: [
        { id:'pizzes', title:'Pizzes', items:[
          { name:'Nova 1 (Margarita)', desc:'tomàquet i mozzarella', price:11.6 },
          { name:'Nova 4 (Anxoves i tonyina)', desc:'tomàquet, mozzarella, anxoves, tonyina i olives', price:13.5 },
          { name:'Vegetal', desc:'tomàquet, mozzarella, carbassó, albergínia, espàrrecs, xampinyons i tomàquets cherry', price:13.5 }
        ]},
        { id:'creps-salades', title:'Creps salades', items:[
          { name:'Especial', desc:'ou, pernil dolç i formatge', price:6.55 },
          { name:'Sobrassada i formatge', desc:'', price:5.85 }
        ]},
        { id:'creps-dolces', title:'Creps dolces', items:[
          { name:'Nutella', price:6.55 },
          { name:'Xocolata negra', price:6.35 }
        ]},
        { id:'amanides', title:'Amanides', items:[
          { name:'Varietat', desc:'enciam, tomàquet cherry, tonyina, formatge de cabra i fruits secs', price:8.9 },
          { name:'Burrata', desc:'burrata, rúcula, tomàquet i pesto', price:9.95 }
        ]},
        { id:'pastes', title:'Pastes fresques', items:[
          { name:'Amb salsa bolonyesa', price:12.4 },
          { name:'Amb salsa pesto', price:12.4 }
        ]},
        { id:'arrossos', title:'Arrossos', items:[
          { name:'Arròs amb verdures', desc:'saltat amb espàrrecs, carbassó i albergínia', price:11.5 }
        ]},
        { id:'sandvitxos', title:'Sandvitxos i bocadillos', items:[
          { name:'Bikini', desc:'pernil dolç i formatge', price:5.8 },
          { name:'Serrà', desc:'ou ferrat, pernil ibèric, tomàquet, enciam i maionesa', price:6.6 }
        ]},
        { id:'begudes', title:'Begudes', subsections:[
          { title:'Vins blancs', items:[
            { name:'Afortunado (D.O. Rueda)', desc:'Botella 75cl · Verdejo', price:17.0 },
            { name:'Perro Verde (D.O. Rueda)', desc:'Botella 75cl · Verdejo', price:20.0 }
          ]},
          { title:'Vins rosats', items:[
            { name:'Lambrusco Bellavita (D.O.C)', desc:'Botella 75cl · Lambrusco', price:13.0 }
          ]},
          { title:'Vins negres', items:[
            { name:'Entre Lobos (Ribera del Duero) - Botella', desc:'Tinto Fino', price:29.0 },
            { name:'Entre Lobos (Ribera del Duero) - Copa', desc:'Tinto Fino', price:4.2 }
          ]},
          { title:'Cava', items:[
            { name:'Torelló Brut Reserva - Botella 75cl', desc:'Macabeu, Xarel·lo, Parellada', price:24.15 },
            { name:'Torelló Brut Reserva - Copa', desc:'Macabeu, Xarel·lo, Parellada', price:4.95 }
          ]},
          { title:'Sangria', items:[
            { name:'De vi (Rioja o Penedès) 1L', price:17.6 },
            { name:'De cava (Torelló Brut Reserva) 1L', price:24.15 }
          ]},
          { title:'Cafès especials', items:[
            { name:'Cafè vienès', desc:'cafè amb nata', price:4.65 },
            { name:'Irish coffee', desc:'cafè, whisky i nata', price:7.25 }
          ]}
        ]},
        { id:'postres', title:'Postres', items:[
          { name:'Cheesecake', price:5.7 },
          { name:'Tiramisú', price:5.7 }
        ]}
      ]
    };
  }

  function render(data){
    root.innerHTML = '';
    data.sections.forEach(section => {
      const sec = document.createElement('section');
      sec.className = 'menu-section';
      sec.id = section.id;
      const head = document.createElement('div');
      head.className = 'section-head';
      head.setAttribute('role','button');
      head.setAttribute('tabindex','0');
      head.setAttribute('aria-controls', `${section.id}-card`);
      head.setAttribute('aria-expanded','true');
      const descHtml = section.description ? `<div class="desc" style="color:#e5e5e5; font-size:.95rem;">${escapeHtml(section.description)}</div>` : '';
      head.innerHTML = `<div><h2>${section.title}</h2>${descHtml}</div>` +
        `<div class="section-actions"><span class="chev" aria-hidden="true">&#9662;</span></div>`;
      sec.appendChild(head);

      const card = document.createElement('div');
      card.className = 'menu-card';
      card.id = `${section.id}-card`;

      if (section.items){
        card.appendChild(renderItems(section.items));
      }
      if (section.subsections){
        section.subsections.forEach(sub => {
          const wrap = document.createElement('div');
          wrap.className = 'subsection';
          const h3 = document.createElement('h3'); h3.textContent = sub.title; wrap.appendChild(h3);
          wrap.appendChild(renderItems(sub.items));
          card.appendChild(wrap);
        });
      }

      sec.appendChild(card);
      root.appendChild(sec);
    });
  }

  function renderItems(items){
    const grid = document.createElement('div');
    grid.className = 'items-grid';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      const row = document.createElement('div'); row.className = 'item-row';
      const name = document.createElement('div'); name.className = 'item-name'; name.innerHTML = escapeHtml(item.name);
      const price = document.createElement('div'); price.className = 'item-price'; if (item.price!=null) price.textContent = formatPrice(item.price);
      row.appendChild(name); row.appendChild(price); div.appendChild(row);
      if (item.desc){ const p = document.createElement('div'); p.className = 'desc'; p.innerHTML = escapeHtml(item.desc); div.appendChild(p); }
      if (item.variants){
        const cont = document.createElement('div'); cont.className = 'variants';
        item.variants.forEach(v => {
          const chip = document.createElement('span'); chip.className = 'variant'; chip.textContent = v.label + ' - ' + formatPrice(v.price); cont.appendChild(chip);
        });
        div.appendChild(cont);
      }
      grid.appendChild(div);
    });
    return grid;
  }

  function formatPrice(n){
  try {
    return new Intl.NumberFormat("ca-ES", { style: "currency", currency: "EUR" }).format(Number(n));
  } catch(e) {
    return Number(n).toFixed(2).replace('.', ',') + " €";
  }
}

  // Search + highlight
  function setupSearch(){
    let q = '';
    const handler = () => {
      q = search.value.toLowerCase().trim();
      const items = document.querySelectorAll('.menu-item');
      const anyQuery = q.length>0;
      items.forEach(el => {
        const text = el.textContent.toLowerCase();
        el.style.display = (!anyQuery || text.includes(q)) ? '' : 'none';
        if (anyQuery) {
          // expand all sections if searching
          const sectionCard = el.closest('.menu-card');
          if (sectionCard) sectionCard.style.display = '';
          // highlight name/desc
          ['.item-name', '.desc'].forEach(sel=>{
            const node = el.querySelector(sel); if (!node) return;
            const raw = node.textContent; node.innerHTML = highlight(raw, q);
          });
        } else {
          // remove marks
          ['.item-name', '.desc'].forEach(sel=>{
            const node = el.querySelector(sel); if (!node) return; node.textContent = node.textContent;
          });
        }
      });
    };
    search && search.addEventListener('input', debounce(handler, 120));
  }

  function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); } }

  function escapeHtml(s){ return (s||'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  function highlight(text, q){
    if (!q) return escapeHtml(text);
    const re = new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');
    return escapeHtml(text).replace(re,'<mark>$1</mark>');
  }

  // Tabs active on scroll
  function setupTabs(){
    const map = new Map();
    tabs.forEach(t => map.set(t.getAttribute('href').slice(1), t));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){
          const id = e.target.id; tabs.forEach(t=>t.classList.remove('active')); const a = map.get(id); if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 });
    document.querySelectorAll('.menu-section').forEach(s => io.observe(s));
  }

  // Toggle collapse
  function setupToggles(){
    const toggle = (headEl)=>{
      const sec = headEl.closest('.menu-section'); if (!sec) return;
      const collapsed = sec.classList.toggle('collapsed');
      headEl.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    };
    root.addEventListener('click', (ev)=>{
      const headEl = ev.target.closest('.section-head'); if (!headEl) return; toggle(headEl);
    });
    root.addEventListener('keydown', (ev)=>{
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      const headEl = ev.target.closest('.section-head'); if (!headEl) return; ev.preventDefault(); toggle(headEl);
    });
  }

  // Init
  loadData().then(data => { render(data); setupTabs(); });
  setupSearch();
  setupToggles();

  // Jump to anchor if present
  if (location.hash){
    const el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView();
  }
})();













