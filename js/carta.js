/* Carta page rendering */
(function(){
  const root = document.getElementById('menuRoot');
  const search = document.getElementById('menuSearch');
  const tabs = document.querySelectorAll('.menu-tabs .tab');
  let __originalOrderSet = false;
  let __pinnedSectionId = null;   // secció \u201cfixada\u201d a dalt

  // Load data
  async function loadData(){
  const inline = readInline();
  try {
    const res = await fetch('assets/data/menu.json', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.sections && data.sections.length) return data;
    }
  } catch(e){}
  if (inline && inline.sections && inline.sections.length) return inline;
  return demoData();
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
    data.sections.forEach((section, idx) => {
      const sec = document.createElement('section');
      sec.className = 'menu-section';
      sec.id = section.id;
      sec.dataset.order = String(idx);
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
        const plain=[]; const groups=[];
        section.items.forEach(entry=>{
          if (isItemGroup(entry)) groups.push(entry); else plain.push(entry);
        });
        if (plain.length) card.appendChild(renderItems(plain));
        groups.forEach(sub=>appendSubsection(card, sub));
      }
      if (section.subsections){
        section.subsections.forEach(sub=>appendSubsection(card, sub));
      }

      sec.appendChild(card);
      root.appendChild(sec);
    });
  }

  function appendSubsection(card, sub){
    const wrap = document.createElement('div'); wrap.className = 'subsection';
    if (sub.title){ const h3 = document.createElement('h3'); h3.textContent = sub.title; wrap.appendChild(h3); }
    if (sub.description){ const p = document.createElement('p'); p.className = 'subsection-desc'; p.textContent = sub.description; wrap.appendChild(p); }
    const items = Array.isArray(sub.items) ? sub.items : [];
    if (items.length) wrap.appendChild(renderItems(items));
    card.appendChild(wrap);
  }
  function isItemGroup(entry){ return entry && typeof entry==='object' && !Array.isArray(entry) && Array.isArray(entry.items) && !('name' in entry); }

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
      const raw=[item.name,item.desc].filter(Boolean).join(' ');
      div.setAttribute('data-terms', buildSearchTerms(raw));
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

  function sectionHasVisibleItems(sec){
    const items = Array.from(sec.querySelectorAll('.menu-item'));
    return items.some(el => el.style.display !== 'none');
  }

  function reorderSectionsByMatch(q){
    const sections = Array.from(document.querySelectorAll('.menu-section'));
    if(!__originalOrderSet){
      sections.forEach((s,i)=>{ if(!s.dataset.order) s.dataset.order = String(i); });
      __originalOrderSet = true;
    }
    const pinned = __pinnedSectionId ? document.getElementById(__pinnedSectionId) : null;
    if(!q){
      const rest = sections.filter(s => s !== pinned);
      rest.sort((a,b)=>Number(a.dataset.order)-Number(b.dataset.order));
      const newOrder = pinned ? [pinned, ...rest] : rest;
      newOrder.forEach(s => root.appendChild(s));
      return;
    }
    const hasVisible = s => Array.from(s.querySelectorAll('.menu-item')).some(it => it.style.display !== 'none');
    const matched = sections.filter(s => s !== pinned && hasVisible(s))
                          .sort((a,b)=>Number(a.dataset.order)-Number(b.dataset.order));
    const unmatched = sections.filter(s => s !== pinned && !hasVisible(s))
                            .sort((a,b)=>Number(a.dataset.order)-Number(b.dataset.order));
    const newOrder = pinned ? [pinned, ...matched, ...unmatched] : [...matched, ...unmatched];
    newOrder.forEach(s => root.appendChild(s));
  }

  // Oculta cada .subsection si no li queda cap .menu-item visible.
  function updateSubsectionsVisibility(){
    const subs = document.querySelectorAll('.subsection');
    subs.forEach(sub => {
      const items = Array.from(sub.querySelectorAll('.menu-item'));
      const hasVisible = items.some(it => it.style.display !== 'none');
      sub.style.display = hasVisible ? '' : 'none';
    });
  }

  // Oculta la .menu-card d'una secció si no hi ha cap .menu-item visible en tota la secció
  // (ni dins de subseccions ni fora).
  function updateSectionCardsVisibility(){
    document.querySelectorAll('.menu-section').forEach(sec => {
      const card = sec.querySelector('.menu-card');
      if (!card) return;
      const visibleItems = Array.from(card.querySelectorAll('.menu-item'))
        .some(it => it.style.display !== 'none');
      card.style.display = visibleItems ? '' : 'none';
    });
  }

  // Search + highlight (diacritics-insensitive, matches ingredients)
  function setupSearch(){
    const handler=()=>{
      const qRaw=(search?.value||'').trim(); const q=normalize(qRaw);
      document.querySelectorAll('.menu-item').forEach(el=>{
        const terms=el.getAttribute('data-terms')||'';
        const match=!q||terms.includes(q); el.style.display=match?'':'none';
        if(match){ const s=el.closest('.menu-section'); if(s) s.classList.remove('collapsed'); }
        const n=el.querySelector('.item-name'), d=el.querySelector('.desc');
        if(q){ if(n) n.innerHTML=highlightInsensitive(n.textContent,qRaw); if(d) d.innerHTML=highlightInsensitive(d.textContent,qRaw); }
        else { if(n) n.textContent=n.textContent; if(d) d.textContent=d.textContent; }
      });
      updateSubsectionsVisibility();
      updateSectionCardsVisibility();
      reorderSectionsByMatch(q);
    };
    if(search){ search.addEventListener('input',handler); search.addEventListener('change',handler); }
  }


  function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); } }

  function escapeHtml(s){ return (s||'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  function removeDiacritics(s){return (s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'');}
  function normalize(s){return removeDiacritics((s||'').toLowerCase());}
  function addSynonyms(text){
    const t=' '+normalize(text)+' '; const ex=[];
    if (t.includes(' ruca ')) ex.push(' rucula rúcula ');
    if (t.includes(' pernil dolc ')||t.includes(' york ')) ex.push(' pernil dolc york ');
    if (t.includes(' taperes ')) ex.push(' alcaparres ');
    if (t.includes(' escalivada ')) ex.push(' pebrot alberginia ceba ');
    if (t.includes(' pepperoni ')) ex.push(' salami picant ');
    if (t.includes(' tofona ')) ex.push(' trufa ');
    return ex.join(' ');
  }
  function buildSearchTerms(src){const b=normalize(src);return (b+' '+addSynonyms(src)).replace(/\s+/g,' ').trim();}
  function highlightInsensitive(text,qRaw){
    if(!qRaw) return text.replace(/[&<>]/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
    const esc=t=>t.replace(/[&<>]/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
    const q=removeDiacritics(qRaw).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const src=removeDiacritics(text); let out='',i=0,m,rx=new RegExp(q,'ig');
    while((m=rx.exec(src))){out+=esc(text.slice(i,m.index))+'<mark>'+esc(text.slice(m.index,m.index+m[0].length))+'</mark>';i=m.index+m[0].length;}
    return out+esc(text.slice(i));
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



  function getHeaderH(){const h=document.querySelector('.header');return h?h.getBoundingClientRect().height:0;}
  function getTabsH(){const t=document.querySelector('.menu-tabs');return t?t.getBoundingClientRect().height:0;}
  function scrollToId(id){
    const el=document.getElementById(id); if(!el) return;
    const y=window.pageYOffset+el.getBoundingClientRect().top-getHeaderH()-getTabsH()-8;
    window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
  }
  function setupTabClicks(){
    document.querySelectorAll('.menu-tabs .tab[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const id = a.getAttribute('href').slice(1);
        const sec = document.getElementById(id);
        if (!sec) return;

        e.preventDefault();                 // no hash ni navegació
        __pinnedSectionId = id;             // fixa la secció clicada a dalt
        sec.classList.remove('collapsed');  // assegura-la oberta

        // Reordena respectant la cerca actual
        const q = normalize((search?.value || '').trim());
        reorderSectionsByMatch(q);

        // Marca la pestanya com activa
        document.querySelectorAll('.menu-tabs .tab').forEach(t=>t.classList.remove('active'));
        a.classList.add('active');

        // ---- SCROLL NOMÉS CAP AMUNT ----
        requestAnimationFrame(() => {
          const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
          const targetY = Math.max(
            0,
            window.pageYOffset + sec.getBoundingClientRect().top - getHeaderH() - getTabsH() - 8
          );
          const THRESHOLD = 6;
          if ((currentY - targetY) > THRESHOLD) {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
        });
      });
    });
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
  loadData().then(data => {
    render(data);
    setupTabs();
    setupTabClicks();
    const legacy=['#creps-salades','#creps-dolces'];
    if(legacy.includes(location.hash)) history.replaceState(null,'','#creps');
    if(location.hash) scrollToId(location.hash.slice(1));
  });
  setupSearch();
  setupToggles();

})();

















