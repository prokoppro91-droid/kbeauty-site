/* =====================================================================
   K-BEAUTY PROFI — рушій каталогу
   ===================================================================== */
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const UAH = n => n.toLocaleString("uk-UA");

const ORDER_IG = "https://www.instagram.com/face_expert_anna";
const ORDER_TG = "https://t.me/kbeauty_profi";

const state = {
  group: "care",          // care | pro
  cat: "all",             // активна категорія
  brand: "all",           // активний бренд (фільтр через вікно «Бренди»)
  concern: "all",         // мета догляду (тип шкіри / задача)
  q: "",                  // пошук
  sort: "pop",            // pop | price-asc | price-desc | new
  maxPrice: null,         // фільтр ціни (грн) або null
  favOnly: false,         // показувати лише «Обране»
  cart: JSON.parse(localStorage.getItem("kb_cart") || "{}"),
  fav: JSON.parse(localStorage.getItem("kb_fav") || "[]"),
};
const saveFav = () => localStorage.setItem("kb_fav", JSON.stringify(state.fav));
const isFav = id => state.fav.includes(id);
const originOf = p => p.origin || "kr";   // kr (Корея) | eu (Європа/світові)

/* мета догляду → ключові слова (шукаються у tags/назві/описі) */
const CONCERNS = [
  { id:"hydra",    name:"Зволоження",   icon:"💧", kw:["зволож","гіалурон","береза","зневодн"] },
  { id:"aging",    name:"Антиейдж",     icon:"⏳", kw:["антиейдж","зморшк","колаген","ретин","пружн","ліфтинг","пептид"] },
  { id:"acne",     name:"Акне / жирна", icon:"🌿", kw:["акне","себор","пори","bha","низький ph","постакне","матов"] },
  { id:"tone",     name:"Тон / сяйво",  icon:"✨", kw:["сяйв","пігмент","тон","вітамін c","арбутин","ніацинамід","ресвератрол","thiamidol"] },
  { id:"calm",     name:"Чутлива",      icon:"🤍", kw:["чутлив","заспок","центел","термальн","реактивн","почервон"] },
  { id:"spf",      name:"Сонцезахист",  icon:"☀️", kw:["spf","сонцезахист","uva"] },
];
const matchConcern = (p,c)=>{
  const conf=CONCERNS.find(x=>x.id===c); if(!conf) return true;
  const hay=(p.name+" "+(p.tags||[]).join(" ")+" "+(p.desc||"")).toLowerCase();
  if(c==="spf" && p.cat==="sun") return true;
  return conf.kw.some(k=>hay.includes(k));
};

/* ---------- утиліти ---------- */
const catName = id => (CATEGORIES.find(c=>c.id===id)||{}).name || "";
/* стабільний рейтинг + к-сть відгуків (соц-доказ, детермінований за id) */
function ratingFor(id){
  const s=(id*2654435761)>>>0;
  return { rate:(4.6+(s%5)/10).toFixed(1), cnt:28+(s%172) };   // 4.6–5.0 · 28–199
}
const starRow = rate => {
  const f=Math.round(+rate);
  return `<span class="stars">${'★'.repeat(f)}${'☆'.repeat(5-f)}</span>`;
};
const discPct = p => p.old ? Math.round((1-p.price/p.old)*100) : 0;
const emojiFor = p => (CATEGORIES.find(c=>c.id===p.cat)||{}).icon || "🧴";
const saveCart = () => localStorage.setItem("kb_cart", JSON.stringify(state.cart));
const cartCount = () => Object.values(state.cart).reduce((a,b)=>a+b,0);
const cartTotal = () => Object.entries(state.cart)
  .reduce((s,[id,q])=>{const p=PRODUCTS.find(x=>x.id==id);return s+(p?p.price*q:0);},0);

/* ---------- преміальні SVG-іконки категорій ---------- */
const ICONS = {
  cream:'<rect x="5.5" y="9" width="13" height="11" rx="3"/><path d="M8 9V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M9.5 14h5"/>',
  serum:'<path d="M10 3h4"/><path d="M10.5 3v3.4L8.7 9.6A3 3 0 0 0 8 11.5V18a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-6.5a3 3 0 0 0-.7-1.9L13.5 6.4V3"/><path d="M9 13.5h6"/>',
  cleanser:'<circle cx="9" cy="13.5" r="4"/><circle cx="16" cy="9" r="2.6"/><circle cx="17.2" cy="16" r="1.6"/>',
  toner:'<rect x="8" y="8" width="8" height="12" rx="2.5"/><path d="M10.5 8V5.5h3V8"/><path d="M12.2 14.4c1.6-1.4 3-1 3-1s.1 1.7-1.3 2.7"/>',
  mask:'<path d="M7 5h10a1 1 0 0 1 1 1v6a6 6 0 0 1-12 0V6a1 1 0 0 1 1-1z"/><circle cx="9.6" cy="10.5" r="1"/><circle cx="14.4" cy="10.5" r="1"/><path d="M10 14.2c1.1.9 2.9.9 4 0"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  body:'<rect x="8" y="9" width="8" height="11" rx="2.6"/><path d="M11 9V6h3l1.4-1.4"/><path d="M11 6H9.2"/>',
  hair:'<path d="M6 4c2 3 2 6.5 0 9.5S4 19.5 6 21"/><path d="M11 4c2 3 2 6.5 0 9.5s-2 6 0 7.5"/><path d="M16 4c2 3 2 6.5 0 9.5s-2 6 0 7.5"/>',
  foot:'<path d="M9 3.5c-1.7 0-2.7 1.4-2.7 3.4 0 2 .7 3.8.7 6.1 0 2.2.5 4.5 3 4.5 1.9 0 2.4-1.6 2.6-3 .2-1.5.9-2.6 2.1-3.3 1.3-.8 2-2 2-3.6C18.7 5 16 3.4 13 3.6"/><circle cx="16.5" cy="6" r=".9"/><circle cx="18" cy="8.4" r=".9"/>',
  meso:'<path d="M4 20l3.5-3.5"/><path d="M14 4l6 6"/><path d="M16.5 6.5l-9 9-1.6 3.6 3.6-1.6 9-9z"/><path d="M12.5 8.5l3 3"/>',
  biorevi:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 15.5l.6 1.8.6-1.8"/>',
  filler:'<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/><path d="M9.6 14a2.4 2.4 0 0 0 2.4 2.4"/>',
  toxin:'<path d="M13 2.5 4.5 14H11l-1 7.5L19.5 10H13z"/>',
  collagen:'<path d="M12 4l6.1 3.5v7L12 18l-6.1-3.5v-7z"/><circle cx="12" cy="11" r="2"/><path d="M12 4.2v2.6M6.2 8l3.3 1.6M17.8 8l-3.3 1.6"/>',
  threads:'<path d="M4 20 17 7"/><path d="M14.5 4.5l5 5"/><circle cx="6.3" cy="17.7" r="1.4"/>',
  peel:'<path d="M10 3h4M11 3v5L6.6 16a2 2 0 0 0 1.8 3h7.2a2 2 0 0 0 1.8-3L13 8V3"/><path d="M8.6 15h6.8"/>',
  device:'<rect x="3.5" y="7" width="17" height="10" rx="3"/><path d="M7.5 12h2.5M14 12h2.5"/><circle cx="12" cy="12" r="1.5"/>'
};
const iconFor = id => `<img src="img/ic3d/${id}.png?v=3" alt="" loading="lazy" aria-hidden="true">`;

/* колір картки під фон кожної іконки (м'які пастелі однакового відтінку) */
const CARDCOLORS = {
  cream:"#f8dee4", serum:"#fbdcc1", cleanser:"#d9ece2", toner:"#e6ecd9", mask:"#e8e1f1",
  sun:"#fce6b6", eye:"#f8dbe1", body:"#f3e7d3", hair:"#dcebf8", foot:"#dcefe2",
  meso:"#dbe9f5", biorevi:"#d3efe9", filler:"#e7dff1", toxin:"#e1e8f2", collagen:"#f8e6bf",
  threads:"#ece7e1", peel:"#f4e0c2", device:"#e6eaef"
};
const cardColor = id => CARDCOLORS[id] || "#f3ece3";

/* ---------- рендер категорій ---------- */
function renderCats(){
  if(!$("#cats")) return;            // блок категорій прибрано — навігація через фільтри
  const cats = CATEGORIES.filter(c=>c.group===state.group);
  const counts = {};
  PRODUCTS.forEach(p=>{counts[p.cat]=(counts[p.cat]||0)+1;});
  $("#cats").innerHTML = cats.map(c=>`
    <button class="cat ${state.cat===c.id?'active':''} ${c.group==='pro'?'pro':''}" data-cat="${c.id}"
            style="background-image:url('img/ic3d/${c.id}.png?v=3')">
      <span class="n">${counts[c.id]||0}</span>
      <span class="cat-tx"><b>${c.name}</b><small>${c.desc}</small></span>
    </button>`).join("");
  $$("#cats .cat").forEach(b=>b.onclick=()=>{
    state.cat = state.cat===b.dataset.cat ? "all" : b.dataset.cat;
    renderCats(); renderChips(); renderGrid();
    document.getElementById("catalog").scrollIntoView({behavior:"smooth",block:"start"});
  });
}

/* ---------- чіпи-фільтри ---------- */
function renderChips(){
  const cats = CATEGORIES.filter(c=>c.group===state.group);
  $("#chips").innerHTML =
    `<button class="chip ${state.cat==='all'?'active':''}" data-cat="all">Усі</button>` +
    cats.map(c=>`<button class="chip ${state.cat===c.id?'active':''}" data-cat="${c.id}">${c.name}</button>`).join("");
  $$("#chips .chip").forEach(b=>b.onclick=()=>{
    state.cat=b.dataset.cat; renderCats(); renderChips(); renderGrid();
  });
}

/* ---------- чіпи «мета догляду» (лише care) ---------- */
function renderConcerns(){
  const row=$("#concernRow"); if(!row) return;
  if(state.group!=="care"){ row.style.display="none"; row.innerHTML=""; return; }
  row.style.display="flex";
  row.innerHTML=`<span class="cn-lbl">Мета:</span>`+
    `<button class="cn ${state.concern==='all'?'active':''}" data-cn="all">Будь-яка</button>`+
    CONCERNS.map(c=>`<button class="cn ${state.concern===c.id?'active':''}" data-cn="${c.id}"><span>${c.icon}</span>${c.name}</button>`).join("");
  $$("#concernRow .cn").forEach(b=>b.onclick=()=>{
    state.concern=b.dataset.cn; renderConcerns(); renderGrid();
  });
}

/* ---------- БРЕНДИ (вікно-перемикач + фільтр) ---------- */
function brandsByOrigin(origin){
  const set=new Set();
  PRODUCTS.forEach(p=>{ if(originOf(p)===origin) set.add(p.brand); });
  return [...set].sort((a,b)=>a.localeCompare(b,"uk",{sensitivity:"base"})); // за абеткою
}
function openBrands(){
  const eu=brandsByOrigin("eu"), kr=brandsByOrigin("kr");
  const chip=b=>`<button class="brand-chip ${state.brand===b?'active':''}" data-brand="${b}">
      <span class="bc-mono">${b.trim()[0]}</span><span class="bc-n">${b}</span></button>`;
  $("#brandsModal").innerHTML=`
    <button class="close" data-bclose aria-label="Закрити">×</button>
    <div class="bm-head"><span class="k">Каталог брендів</span>
      <h2>Оберіть бренд</h2>
      <p>Корейська та європейська професійна косметика — топові світові марки в одному каталозі.</p></div>
    <div class="bm-body">
      <div class="bm-sec"><h4>🌍 Світові топ-бренди</h4><div class="brand-wrap">${eu.map(chip).join("")}</div></div>
      <div class="bm-sec"><h4>🇰🇷 Корейські бренди</h4><div class="brand-wrap">${kr.map(chip).join("")}</div></div>
    </div>
    <div class="bm-foot"><button class="btn ghost" data-brand="all">Показати всі бренди</button></div>`;
  $$("#brandsModal [data-brand]").forEach(b=>b.onclick=()=>selectBrand(b.dataset.brand));
  $("#brandsModal [data-bclose]").onclick=closeBrands;
  $("#brandsOverlay").classList.add("open");
}
function closeBrands(){$("#brandsOverlay").classList.remove("open");}
function selectBrand(brand){
  state.brand=brand;
  if(brand!=="all"){
    const p=PRODUCTS.find(x=>x.brand===brand);
    if(p && p.group!==state.group){
      state.group=p.group;
      $$("#gt button").forEach(b=>b.classList.toggle("active",b.dataset.group===p.group));
    }
  }
  state.cat="all"; state.concern="all";
  renderChips(); renderConcerns(); renderGrid(); renderBrandBar();
  closeBrands();
  document.getElementById("catalog").scrollIntoView({behavior:"smooth",block:"start"});
}
function renderBrandBar(){
  const bar=$("#brandBar"); if(!bar) return;
  if(state.brand==="all"){ bar.innerHTML=""; bar.style.display="none"; return; }
  bar.style.display="flex";
  bar.innerHTML=`<span class="bb-lbl">Бренд:</span>
    <span class="bb-tag">${state.brand}<button data-brandclear aria-label="Скинути бренд">×</button></span>`;
  bar.querySelector("[data-brandclear]").onclick=()=>selectBrand("all");
}
/* ---------- ОБРАНЕ (wishlist) ---------- */
function toggleFav(id){
  const i=state.fav.indexOf(id), adding=i<0;
  if(adding) state.fav.push(id); else state.fav.splice(i,1);
  saveFav(); updateFavUI(); renderGrid();
  toast(adding?"❤️ Додано в обране":"Прибрано з обраного");
}
function updateFavUI(){
  const fc=$("#favCount"); if(fc){ fc.textContent=state.fav.length; fc.style.display=state.fav.length?"inline-grid":"none"; }
  const ft=$("#favToggle"); if(ft) ft.classList.toggle("on",state.favOnly);
}
/* ---------- фільтр ціни ---------- */
function setPriceBounds(){
  const r=$("#priceRange"); if(!r) return;
  const max=Math.max(...PRODUCTS.filter(p=>p.group===state.group).map(p=>p.price));
  const top=Math.ceil(max/100)*100;
  r.min=0; r.max=top; r.step=100; r.value=top;
  state.maxPrice=null;
  const pv=$("#priceVal"); if(pv) pv.textContent="будь-яка";
}

/* рухомий рядок брендів (marquee) — клік фільтрує */
function buildMarquee(){
  const row=$("#brandMarquee"); if(!row) return;
  const featured=["La Roche-Posay","Estée Lauder","COSRX","Vichy","Beauty of Joseon","CeraVe",
    "Clarins","Laneige","SkinCeuticals","Anua","Bioderma","SKIN1004","Caudalíe","Avène","Eucerin","Medytox"];
  const seq=[...featured,...featured];
  row.innerHTML=seq.map(b=>`<button class="mq-item" data-brand="${b}">${b}</button>`).join("");
  $$("#brandMarquee .mq-item").forEach(b=>b.onclick=()=>selectBrand(b.dataset.brand));
}
/* анімація «політ у кошик» */
function flyToCart(srcEl){
  const cart=$("#cartBtn"); if(!srcEl||!cart) return;
  const s=srcEl.getBoundingClientRect(), t=cart.getBoundingClientRect();
  const dot=document.createElement("span"); dot.className="fly-dot";
  dot.style.left=(s.left+s.width/2)+"px"; dot.style.top=(s.top+s.height/2)+"px";
  document.body.appendChild(dot);
  requestAnimationFrame(()=>{
    dot.style.transform=`translate(${t.left+t.width/2-(s.left+s.width/2)}px,${t.top+t.height/2-(s.top+s.height/2)}px) scale(.3)`;
    dot.style.opacity="0.2";
  });
  setTimeout(()=>{dot.remove(); cart.classList.add("bump"); setTimeout(()=>cart.classList.remove("bump"),360);},520);
}

/* ---------- бестселери (горизонтальна каруселя) ---------- */
function renderBest(){
  const row=$("#bestRow"); if(!row) return;
  const list=PRODUCTS.filter(p=>p.group===state.group && p.badge==="hit").slice(0,12);
  const sec=$("#bestSec");
  if(!list.length){ if(sec) sec.style.display="none"; return; }
  if(sec) sec.style.display="";
  row.innerHTML=list.map(p=>`
    <article class="bcard" data-open="${p.id}">
      <div class="bthumb">
        <img src="img/p${p.id}.jpg" alt="${p.name}" loading="lazy"
             onerror="this.style.display='none';this.parentNode.classList.add('noimg')">
        <span class="em">${emojiFor(p)}</span>
        <span class="brandtag">${p.brand}</span>
      </div>
      <div class="bbody">
        <h4>${p.name}</h4>
        <div class="bfoot"><span class="bprice">${UAH(p.price)} грн</span>
          <button class="add ${state.cart[p.id]?'in':''}" data-add="${p.id}" aria-label="${state.cart[p.id]?'Прибрати з кошика':'Додати в кошик'}">${state.cart[p.id]?'✓':'+'}</button></div>
      </div>
    </article>`).join("");
  $$("#bestRow [data-open]").forEach(b=>b.onclick=e=>{ if(e.target.closest("[data-add]"))return; openModal(+b.dataset.open);});
  $$("#bestRow [data-add]").forEach(b=>b.onclick=e=>{e.stopPropagation();
    const id=+b.dataset.add, adding=!state.cart[id];
    toggleCart(id); if(adding) flyToCart(b);});
}
/* синхронізувати стан кнопок «+/✓» у бестселерах без перебудови (щоб не скидати скрол) */
function syncBest(){
  $$("#bestRow [data-add]").forEach(b=>{
    const inc=!!state.cart[+b.dataset.add];
    b.classList.toggle("in",inc); b.textContent=inc?"✓":"+";
    b.setAttribute("aria-label",inc?"Прибрати з кошика":"Додати в кошик");
  });
}
function bestScroll(dir){ const r=$("#bestRow"); if(r) r.scrollBy({left:dir*Math.min(560,r.clientWidth*.8),behavior:"smooth"}); }

/* ---------- «Зібрати рутину» ---------- */
const ROUTINE = [
  {cat:"cleanser", step:"Очищення",  why:"М'яко очищає шкіру вранці та ввечері"},
  {cat:"toner",    step:"Тонер",     why:"Відновлює pH і готує до активів"},
  {cat:"serum",    step:"Сироватка", why:"Активний концентрат під вашу мету"},
  {cat:"eye",      step:"Зона очей", why:"Делікатний догляд проти втоми"},
  {cat:"cream",    step:"Крем",      why:"Зволоження та захист бар'єру"},
  {cat:"sun",      step:"SPF удень", why:"Головний крок проти старіння шкіри"},
];
function buildRoutine(){
  return ROUTINE.map(r=>{
    let pool=PRODUCTS.filter(p=>p.group==="care" && p.cat===r.cat);
    if(state.concern!=="all"){ const m=pool.filter(p=>matchConcern(p,state.concern)); if(m.length) pool=m; }
    const pick=pool.find(p=>p.badge==="hit")||pool[0];
    return pick?{...r,p:pick}:null;
  }).filter(Boolean);
}
function openRoutine(){
  const steps=buildRoutine();
  const total=steps.reduce((s,x)=>s+x.p.price,0);
  const cname=(CONCERNS.find(c=>c.id===state.concern)||{}).name;
  $("#routineModal").innerHTML=`
    <button class="close" data-rclose aria-label="Закрити">×</button>
    <div class="rt-head"><span class="k">Догляд під ключ</span>
      <h2>Ваша рутина догляду</h2>
      <p>Покрокова схема корейського догляду${cname?` · акцент: <b>${cname}</b>`:""}. Можна додати все одним кліком.</p></div>
    <div class="rt-steps">${steps.map((x,i)=>`
      <div class="rt-step">
        <div class="rt-num">${i+1}</div>
        <div class="rt-art"><img src="img/p${x.p.id}.jpg" alt="" loading="lazy"
             onerror="this.style.display='none';this.parentNode.classList.add('noimg')"><span class="em">${emojiFor(x.p)}</span></div>
        <div class="rt-info"><span class="rt-step-n">${x.step}</span><b>${x.p.name}</b><small>${x.p.brand} · ${x.why}</small></div>
        <div class="rt-price">${UAH(x.p.price)} грн</div>
      </div>`).join("")}</div>
    <div class="rt-foot">
      <div class="rt-total"><span>Разом за рутину:</span><b>${UAH(total)} грн</b></div>
      <button class="btn primary" data-radd>Додати всю рутину в кошик →</button>
    </div>`;
  $("#routineModal [data-rclose]").onclick=closeRoutine;
  $("#routineModal [data-radd]").onclick=()=>{
    steps.forEach(x=>{state.cart[x.p.id]=(state.cart[x.p.id]||0)+1;});
    saveCart(); updateCartUI(); renderGrid();
    closeRoutine(); openDrawer(); toast("✨ Рутину додано в кошик");
  };
  $("#routineOverlay").classList.add("open");
}
function closeRoutine(){$("#routineOverlay").classList.remove("open");}

/* =====================================================================
   КВІЗ «Розумний підбір догляду» — персональна рутина за відповідями
   ===================================================================== */
const QUIZ = [
  {key:"type", q:"Який у вас тип шкіри?", sub:"Оберіть найближче відчуття протягом дня",
   opts:[{v:"dry",l:"Суха",i:"🏜️"},{v:"oily",l:"Жирна",i:"💧"},{v:"combo",l:"Комбінована",i:"🌗"},
         {v:"normal",l:"Нормальна",i:"🤍"},{v:"sensitive",l:"Чутлива",i:"🌸"}]},
  {key:"goal", q:"Головна мета догляду?", sub:"На чому хочете зосередитись",
   opts:[{v:"hydra",l:"Зволоження",i:"💧"},{v:"aging",l:"Антиейдж",i:"⏳"},{v:"acne",l:"Акне і жирність",i:"🌿"},
         {v:"tone",l:"Рівний тон і сяйво",i:"✨"},{v:"calm",l:"Заспокоєння",i:"🤍"}]},
  {key:"sens", q:"Чи реагує шкіра подразненням на нові засоби?", sub:"Почервоніння, поколювання, лущення",
   opts:[{v:"high",l:"Так, часто",i:"⚠️"},{v:"mid",l:"Інколи",i:"😐"},{v:"low",l:"Майже ніколи",i:"👍"}]},
  {key:"exp", q:"Ваш досвід із активами?", sub:"Ретинол, кислоти (AHA/BHA), вітамін C",
   opts:[{v:"new",l:"Новачок",i:"🌱"},{v:"some",l:"Трохи маю",i:"📘"},{v:"pro",l:"Досвідчена шкіра",i:"🔬"}]},
  {key:"budget", q:"Орієнтовний бюджет на один засіб?", sub:"Підберемо в межах комфорту",
   opts:[{v:"low",l:"Економний",i:"💸"},{v:"mid",l:"Середній",i:"💳"},{v:"high",l:"Преміум",i:"💎"}]},
];
const quiz = {step:0, answers:{}};
const STRONG_RE = /ретин|кислот|\baha\b|\bbha\b|\btca\b|пілінг|джесснер/i;

function openQuiz(){ quiz.step=0; quiz.answers={}; renderQuiz(); $("#quizOverlay").classList.add("open"); }
function closeQuiz(){ $("#quizOverlay").classList.remove("open"); }
function renderQuiz(){
  const total=QUIZ.length, i=quiz.step, Q=QUIZ[i], cur=quiz.answers[Q.key];
  $("#quizModal").innerHTML=`
    <button class="close" data-qclose aria-label="Закрити">×</button>
    <div class="qz-prog"><span style="width:${Math.round((i)/total*100)}%"></span></div>
    <div class="qz-step">Питання ${i+1} з ${total}</div>
    <h2 class="qz-q">${Q.q}</h2>
    <p class="qz-sub">${Q.sub}</p>
    <div class="qz-opts">${Q.opts.map(o=>`
      <button class="qz-opt ${cur===o.v?'sel':''}" data-v="${o.v}"><span class="qi">${o.i}</span><b>${o.l}</b></button>`).join("")}</div>
    <div class="qz-nav">
      ${i>0?`<button class="btn ghost" data-qback>← Назад</button>`:`<span></span>`}
      <span class="qz-dots">${QUIZ.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join("")}</span>
    </div>`;
  $("#quizModal [data-qclose]").onclick=closeQuiz;
  const back=$("#quizModal [data-qback]"); if(back) back.onclick=()=>{quiz.step--;renderQuiz();};
  $$("#quizModal .qz-opt").forEach(b=>b.onclick=()=>{
    quiz.answers[Q.key]=b.dataset.v;
    if(quiz.step<QUIZ.length-1){ quiz.step++; renderQuiz(); }
    else quizResult();
  });
}
function recommendFromQuiz(a){
  const maxPrice = a.budget==="low"?700 : a.budget==="mid"?1600 : 99999;
  const avoidStrong = a.sens==="high" || a.exp==="new";
  const steps=[
    {cat:"cleanser", step:"Очищення"},
    {cat:"toner",    step:"Тонер"},
    {cat:"serum",    step:"Сироватка"},
    {cat:"cream",    step:"Крем"},
    {cat:"sun",      step:"SPF удень"},
  ];
  if(a.budget!=="low") steps.splice(3,0,{cat:"eye", step:"Зона очей"});
  const picks = steps.map(s=>{
    let pool=PRODUCTS.filter(p=>p.group==="care" && p.cat===s.cat);
    const byConcern=pool.filter(p=>matchConcern(p,a.goal)); if(byConcern.length) pool=byConcern;
    if(avoidStrong){ const soft=pool.filter(p=>!STRONG_RE.test((p.name+" "+(p.tags||[]).join(" ")))); if(soft.length) pool=soft; }
    const inBudget=pool.filter(p=>p.price<=maxPrice); if(inBudget.length) pool=inBudget;
    // преміум-бюджет → надати перевагу світовим брендам, інакше — хіт/дешевше
    pool.sort((x,y)=> a.budget==="high"
      ? (originOf(y)==="eu")-(originOf(x)==="eu") || (y.badge==="hit")-(x.badge==="hit")
      : (y.badge==="hit")-(x.badge==="hit") || x.price-y.price);
    const p=pool[0];
    return p?{...s, p, why:reasonFor(s.cat,a)}:null;
  }).filter(Boolean);
  return {picks, maxPrice, avoidStrong};
}
function reasonFor(cat,a){
  const goalTxt={hydra:"глибокого зволоження",aging:"антивікового догляду",acne:"контролю жирності й акне",
    tone:"рівного тону та сяйва",calm:"заспокоєння шкіри"}[a.goal]||"вашої мети";
  const base={
    cleanser:"М'яко очищає, не порушуючи бар'єр",
    toner:"Готує шкіру та підсилює зволоження",
    serum:`Активний концентрат для ${goalTxt}`,
    eye:"Делікатний догляд за зоною очей",
    cream:a.type==="dry"?"Насичене зволоження для сухої шкіри":a.type==="oily"?"Легке зволоження без жирності":"Зволоження та захист бар'єру",
    sun:"Захист від UV — головний крок проти старіння",
  };
  return base[cat]||"";
}
function quizResult(){
  const a=quiz.answers;
  const {picks}=recommendFromQuiz(a);
  const total=picks.reduce((s,x)=>s+x.p.price,0);
  const typeTxt={dry:"Суха",oily:"Жирна",combo:"Комбінована",normal:"Нормальна",sensitive:"Чутлива"}[a.type];
  const goalTxt={hydra:"Зволоження",aging:"Антиейдж",tone:"Тон і сяйво",acne:"Акне / жирність",calm:"Заспокоєння"}[a.goal];
  $("#quizModal").innerHTML=`
    <button class="close" data-qclose aria-label="Закрити">×</button>
    <div class="qz-prog done"><span style="width:100%"></span></div>
    <div class="rt-head" style="margin-top:8px">
      <span class="k">Готово ✨</span><h2>Ваша персональна рутина</h2>
      <p>Підібрано під вашу шкіру за ${QUIZ.length} відповідями. Можна додати все одним кліком.</p></div>
    <div class="qz-profile">
      <span>🧴 ${typeTxt} шкіра</span><span>🎯 ${goalTxt}</span>
      <span>${a.sens==="high"?"🌸 Чутлива":a.sens==="mid"?"😐 Помірна реактивність":"👍 Стійка"}</span>
      <span>${a.budget==="low"?"💸 Економний":a.budget==="mid"?"💳 Середній":"💎 Преміум"}</span></div>
    <div class="rt-steps">${picks.map((x,i)=>`
      <div class="rt-step">
        <div class="rt-num">${i+1}</div>
        <div class="rt-art"><img src="img/p${x.p.id}.jpg" alt="" loading="lazy"
             onerror="this.style.display='none';this.parentNode.classList.add('noimg')"><span class="em">${emojiFor(x.p)}</span></div>
        <div class="rt-info"><span class="rt-step-n">${x.step}</span><b>${x.p.name}</b><small>${x.p.brand} · ${x.why}</small></div>
        <div class="rt-price">${UAH(x.p.price)} грн</div>
      </div>`).join("")}</div>
    <div class="rt-foot">
      <div class="rt-total"><span>Разом за рутину:</span><b>${UAH(total)} грн</b></div>
      <button class="btn primary" data-qadd>Додати всю рутину в кошик →</button>
      <button class="btn ghost" data-qrestart style="height:44px">↺ Пройти ще раз</button>
    </div>`;
  $("#quizModal [data-qclose]").onclick=closeQuiz;
  $("#quizModal [data-qrestart]").onclick=()=>{quiz.step=0;quiz.answers={};renderQuiz();};
  $("#quizModal [data-qadd]").onclick=()=>{
    picks.forEach(x=>{state.cart[x.p.id]=(state.cart[x.p.id]||0)+1;});
    saveCart(); updateCartUI(); renderGrid();
    closeQuiz(); openDrawer(); toast("✨ Персональну рутину додано в кошик");
  };
}

/* =====================================================================
   ПЕРЕВІРКА СУМІСНОСТІ АКТИВІВ — аналізує кошик (або обране) на конфлікти
   ===================================================================== */
const ACTIVES = [
  {id:"retinoid", label:"Ретиноїди",        re:/ретин/i,                                          when:"pm"},
  {id:"acid",     label:"Кислоти (AHA/BHA)", re:/кислот|\baha\b|\bbha\b|\btca\b|пілінг|джесснер|саліцил|гліко|молочн/i, when:"pm"},
  {id:"vitc",     label:"Вітамін C",        re:/вітамін c|віт\. c|ферул|c[\s-]?23/i,              when:"am"},
  {id:"niac",     label:"Ніацинамід",       re:/ніацинамід/i,                                     when:"any"},
  {id:"pept",     label:"Пептиди",          re:/пептид|колаген/i,                                 when:"any"},
  {id:"hydra",    label:"Гіалуронова к-та", re:/гіалурон/i,                                       when:"any"},
  {id:"soothe",   label:"Заспокійливі",     re:/центел|заспок|пантенол|термальн/i,                when:"any"},
];
function activesOf(p){
  const hay=(p.name+" "+(p.tags||[]).join(" ")+" "+(p.desc||"")).toLowerCase();
  return ACTIVES.filter(a=>a.re.test(hay));
}
function analyzeCompat(list){
  const present=new Set(); list.forEach(p=>activesOf(p).forEach(a=>present.add(a.id)));
  const warns=[];
  const has=id=>present.has(id);
  if(has("retinoid")&&has("acid")) warns.push("Ретиноїди й кислоти разом сильно подразнюють — застосовуйте їх у різні вечори (через день).");
  if(has("retinoid")&&has("vitc")) warns.push("Вітамін C — уранці, ретиноїд — увечері. Разом їхня ефективність знижується.");
  if(has("acid")&&has("vitc"))     warns.push("Кислоти й вітамін C краще рознести: C зранку, кислоти ввечері.");
  const strong=list.filter(p=>activesOf(p).some(a=>a.id==="retinoid"||a.id==="acid"));
  if(strong.length>1) warns.push("У наборі кілька сильних активів — вводьте їх поступово, по одному раз на 1–2 тижні.");
  // розклад am/pm
  const am=[], pm=[];
  list.forEach(p=>{
    const acts=activesOf(p);
    if(acts.some(a=>a.when==="pm")) pm.push(p);
    else if(acts.some(a=>a.when==="am")) am.push(p);
    else { am.push(p); pm.push(p); }
  });
  return {present:[...present], warns, am, pm, strong:strong.length};
}
function openCompat(){
  let list=Object.keys(state.cart).map(id=>PRODUCTS.find(p=>p.id==id)).filter(Boolean);
  let src="кошика";
  if(!list.length){ list=state.fav.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean); src="обраного"; }
  const m=$("#compatModal");
  if(!list.length){
    m.innerHTML=`<button class="close" data-cclose aria-label="Закрити">×</button>
      <div class="rt-head"><span class="k">🧪 Сумісність активів</span><h2>Поки нема що перевіряти</h2>
      <p>Додайте засоби в кошик або в ♥ обране — і я перевірю, чи добре поєднуються їхні активні інгредієнти, та складу безпечну схему ранок/вечір.</p></div>
      <div class="rt-foot"><button class="btn primary" data-cclose>Зрозуміло</button></div>`;
    m.querySelectorAll("[data-cclose]").forEach(b=>b.onclick=closeCompat);
    $("#compatOverlay").classList.add("open"); return;
  }
  const {present,warns,am,pm}=analyzeCompat(list);
  const lbl=id=>(ACTIVES.find(a=>a.id===id)||{}).label||id;
  const row=p=>`<div class="cp-item"><span class="em">${emojiFor(p)}</span><div><b>${p.name}</b><small>${p.brand}</small></div>
    <span class="cp-acts">${activesOf(p).map(a=>a.label).join(", ")||"базовий догляд"}</span></div>`;
  m.innerHTML=`<button class="close" data-cclose aria-label="Закрити">×</button>
    <div class="rt-head"><span class="k">🧪 Сумісність активів</span><h2>Аналіз вашого ${src}</h2>
      <p>${present.length?`Активні інгредієнти: ${present.map(lbl).join(" · ")}`:"Сильних активів не виявлено — засоби м'які та добре поєднуються."}</p></div>
    ${warns.length
      ? `<div class="cp-warns">${warns.map(w=>`<div class="cp-warn"><span>⚠️</span><p>${w}</p></div>`).join("")}</div>`
      : `<div class="cp-ok">✅ Чудово! Ваші засоби добре поєднуються — конфліктів активів немає.</div>`}
    <div class="cp-sched">
      <div class="cp-col am"><h4>☀️ Ранок</h4>${am.map(row).join("")||"<small>—</small>"}<div class="cp-tip">Завершуйте SPF</div></div>
      <div class="cp-col pm"><h4>🌙 Вечір</h4>${pm.map(row).join("")||"<small>—</small>"}${present.includes("retinoid")&&present.includes("acid")?`<div class="cp-tip">Ретиноїд і кислоти — через вечір</div>`:""}</div>
    </div>
    <div class="rt-foot"><button class="btn primary" data-cclose>Готово</button></div>`;
  m.querySelectorAll("[data-cclose]").forEach(b=>b.onclick=closeCompat);
  $("#compatOverlay").classList.add("open");
}
function closeCompat(){$("#compatOverlay").classList.remove("open");}

/* ---------- фільтрація + сортування ---------- */
function currentList(){
  let list = PRODUCTS.filter(p=>p.group===state.group);
  if(state.cat!=="all") list = list.filter(p=>p.cat===state.cat);
  if(state.brand!=="all") list = list.filter(p=>p.brand===state.brand);
  if(state.concern!=="all") list = list.filter(p=>matchConcern(p,state.concern));
  if(state.favOnly) list = list.filter(p=>isFav(p.id));
  if(state.maxPrice) list = list.filter(p=>p.price<=state.maxPrice);
  if(state.q){
    const q = state.q.toLowerCase();
    list = list.filter(p =>
      (p.name+" "+p.brand+" "+catName(p.cat)+" "+(p.tags||[]).join(" "))
      .toLowerCase().includes(q));
  }
  const order = {hit:0,new:1,pro:2};
  switch(state.sort){
    case "price-asc":  list.sort((a,b)=>a.price-b.price); break;
    case "price-desc": list.sort((a,b)=>b.price-a.price); break;
    case "new":        list.sort((a,b)=>(a.badge==="new"?-1:1)-(b.badge==="new"?-1:1)); break;
    default:           list.sort((a,b)=>(order[a.badge]??3)-(order[b.badge]??3)); // популярне
  }
  return list;
}

/* ---------- рендер сітки ---------- */
function renderGrid(){
  const list = currentList();
  const badgeLbl = {hit:"Хіт",new:"Новинка",pro:"Преміум"};
  $("#result").textContent = `Знайдено товарів: ${list.length}`;

  // PRO-попередження
  $("#proNote").style.display = (state.group==="pro") ? "flex" : "none";

  if(!list.length){
    $("#grid").innerHTML = state.favOnly
      ? `<div class="empty" style="grid-column:1/-1"><div class="em">🤍</div><h3>В обраному поки порожньо</h3>
         <p>Натискайте ♥ на картках товарів, щоб зберегти їх сюди.</p></div>`
      : `<div class="empty" style="grid-column:1/-1"><div class="em">🔍</div><h3>Нічого не знайдено</h3>
         <p>Спробуйте змінити запит, ціну або категорію.</p></div>`;
    return;
  }
  $("#grid").innerHTML = list.map(p=>{
    const inCart = state.cart[p.id];
    const r = ratingFor(p.id);
    return `<article class="card" data-id="${p.id}">
      <div class="thumb" data-open="${p.id}">
        <img class="pimg" src="img/p${p.id}.jpg" alt="${p.name}" loading="lazy"
             onerror="this.style.display='none';this.parentNode.classList.add('noimg')">
        <span class="em">${emojiFor(p)}</span>
        <span class="ph-brand">${p.brand}<small>${catName(p.cat)}</small></span>
        ${p.old?`<span class="sale">−${discPct(p)}%</span>`:""}
        <span class="brandtag">${p.brand}</span>
        ${p.badge?`<span class="badge ${p.badge}">${badgeLbl[p.badge]||p.badge}</span>`:""}
        <span class="qv">👁 Швидкий перегляд</span>
      </div>
      <div class="body">
        <span class="cat-lbl">${catName(p.cat)}</span>
        <h3 data-open="${p.id}">${p.name}</h3>
        <span class="vol">${p.vol||""}</span>
        <div class="rating">${starRow(r.rate)}<span class="rate">${r.rate}</span><span class="rc">· ${r.cnt}</span></div>
        <div class="foot">
          <div class="price">${UAH(p.price)} <span class="cur">грн</span>
            ${p.old?`<span class="old">${UAH(p.old)}</span><span class="off">−${discPct(p)}%</span>`:""}</div>
          <button class="fav ${isFav(p.id)?'on':''}" data-fav="${p.id}" aria-label="${isFav(p.id)?'Прибрати з обраного':'Додати в обране'}" title="Обране">♥</button>
          <button class="add ${inCart?'in':''}" data-add="${p.id}" aria-label="${inCart?'Прибрати з кошика':'Додати в кошик'}" title="${inCart?'У кошику — натисніть, щоб прибрати':'Додати в кошик'}">${inCart?'✓':'+'}</button>
        </div>
      </div>
    </article>`;
  }).join("");

  $$("#grid [data-add]").forEach(b=>b.onclick=e=>{e.stopPropagation();
    const id=+b.dataset.add, adding=!state.cart[id];
    toggleCart(id); if(adding) flyToCart(b);});
  $$("#grid [data-fav]").forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(+b.dataset.fav);});
  $$("#grid [data-open]").forEach(b=>b.onclick=()=>openModal(+b.dataset.open));
}

/* ---------- кошик ---------- */
function addToCart(id){
  state.cart[id]=(state.cart[id]||0)+1; saveCart();
  updateCartUI(); renderGrid();
  const p=PRODUCTS.find(x=>x.id===id);
  toast(`✓ «${p.name}» додано в кошик`);
}
/* перемикач на картці: якщо вже в кошику → прибрати (повертає «+»), інакше → додати */
function toggleCart(id){
  if(state.cart[id]){
    const p=PRODUCTS.find(x=>x.id===id);
    removeFromCart(id);
    if(p) toast(`✕ «${p.name}» прибрано з кошика`);
  } else {
    addToCart(id);
  }
}
function removeFromCart(id){delete state.cart[id];saveCart();updateCartUI();renderGrid();renderDrawer();}
function setQty(id,d){
  state.cart[id]=(state.cart[id]||0)+d;
  if(state.cart[id]<=0) delete state.cart[id];
  saveCart();updateCartUI();renderGrid();renderDrawer();
}
function updateCartUI(){
  $("#cartCount").textContent = cartCount();
  $("#cartCount").style.display = cartCount()? "grid":"none";
  syncBest();
}
function renderDrawer(){
  const ids=Object.keys(state.cart);
  if(!ids.length){
    $("#ditems").innerHTML=`<div class="cart-empty"><div class="em">🛍️</div>
      <h3>Кошик порожній</h3><p>Додайте товари з каталогу.</p></div>`;
    $("#dfoot").style.display="none"; return;
  }
  $("#dfoot").style.display="block";
  $("#ditems").innerHTML=ids.map(id=>{
    const p=PRODUCTS.find(x=>x.id==id); if(!p)return"";
    const q=state.cart[id];
    return `<div class="ditem">
      <div class="di-art">
        <img src="img/p${p.id}.jpg" alt="${p.name}"
             onerror="this.style.display='none';this.parentNode.classList.add('noimg')">
        <span class="em">${emojiFor(p)}</span>
      </div>
      <div class="di-info">
        <b>${p.name}</b><small>${p.brand} · ${p.vol||""}</small>
        <div class="di-price">${UAH(p.price*q)} грн</div>
        <div class="qty">
          <button data-dec="${id}">−</button><span>${q}</span><button data-inc="${id}">+</button>
        </div>
      </div>
      <button class="di-rm" data-rm="${id}">видалити</button>
    </div>`;
  }).join("");
  $("#dtotal").textContent=UAH(cartTotal())+" грн";
  $$("#ditems [data-inc]").forEach(b=>b.onclick=()=>setQty(+b.dataset.inc,1));
  $$("#ditems [data-dec]").forEach(b=>b.onclick=()=>setQty(+b.dataset.dec,-1));
  $$("#ditems [data-rm]").forEach(b=>b.onclick=()=>removeFromCart(+b.dataset.rm));
}
function openDrawer(){renderDrawer();$("#drawer").classList.add("open");$("#scrim").classList.add("open");}
function closeDrawer(){$("#drawer").classList.remove("open");$("#scrim").classList.remove("open");}

/* ---------- замовлення ---------- */
function checkout(){
  const ids=Object.keys(state.cart); if(!ids.length)return;
  let msg="Вітаю! Хочу замовити:%0A%0A";
  ids.forEach(id=>{const p=PRODUCTS.find(x=>x.id==id);const q=state.cart[id];
    msg+=`• ${p.name} (${p.brand}) ×${q} — ${UAH(p.price*q)} грн%0A`;});
  msg+=`%0AРазом: ${UAH(cartTotal())} грн`;
  // Telegram приймає текст через ?text у deep-link на бота недоступний для каналу,
  // тому ведемо в Direct Instagram + копіюємо список у буфер
  navigator.clipboard?.writeText(decodeURIComponent(msg)).catch(()=>{});
  toast("📋 Список скопійовано — вставте у повідомлення");
  setTimeout(()=>window.open(ORDER_IG,"_blank"),700);
}

/* ---------- модалка товару ---------- */
function openModal(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p)return;
  const badgeLbl={hit:"Хіт продажів",new:"Новинка",pro:"Преміум"};
  const r=ratingFor(p.id);
  $("#modal").innerHTML=`
    <button class="close" data-mclose aria-label="Закрити">×</button>
    <div class="mbody">
      <div class="mart">
        <img class="mimg" src="img/p${p.id}.jpg" alt="${p.name}"
             onerror="this.style.display='none';this.parentNode.classList.add('noimg')">
        <span class="em">${emojiFor(p)}</span>
        ${p.badge?`<span class="badge ${p.badge}" style="top:18px;left:18px;right:auto">${badgeLbl[p.badge]||p.badge}</span>`:""}
      </div>
      <div class="minfo">
        ${p.pro?`<span class="pro-tag">⚕️ Лише для фахівців</span>`:""}
        <span class="cat-lbl">${catName(p.cat)}</span>
        <h2>${p.name}</h2>
        <div class="br">${p.brand}</div>
        <div class="mrating">${starRow(r.rate)}<b>${r.rate}</b><span>· ${r.cnt} відгуків</span></div>
        <div class="mvol">${p.vol?("Обʼєм / фасування: "+p.vol):""}</div>
        <p class="desc">${p.desc||""}</p>
        <div class="mtags">${(p.tags||[]).map(t=>`<span>#${t}</span>`).join("")}</div>
        <div class="mprice">${UAH(p.price)} грн
          ${p.old?`<span class="old" style="font-size:16px;color:#b9aa92;text-decoration:line-through">${UAH(p.old)}</span><span class="off">−${discPct(p)}%</span>`:""}</div>
        <ul class="mtrust">
          <li><span class="ck">✓</span><b>100% оригінал</b>&nbsp;— ${originOf(p)==="eu"?"офіційний імпорт із Європи":"напряму з корейського ринку"}</li>
          <li><span class="ck">✓</span>Доставка&nbsp;<b>Новою Поштою</b>&nbsp;по Україні, 1–2 дні</li>
          <li><span class="ck">✓</span>${p.pro?"Відпуск і консультація сертифікованим фахівцям":"Оплата при отриманні або підбір косметолога"}</li>
        </ul>
        <button class="madd" data-add="${p.id}">🛍️ Додати в кошик</button>
      </div>
    </div>`;
  $("#modal [data-mclose]").onclick=closeModal;
  $("#modal [data-add]").onclick=()=>{addToCart(p.id);closeModal();openDrawer();};
  $("#overlay").classList.add("open");
}
function closeModal(){$("#overlay").classList.remove("open");}

/* ---------- розділ (group) ---------- */
function setGroup(g){
  const enteringPro = (g==="pro" && state.group!=="pro");
  state.group=g; state.cat="all"; state.brand="all"; state.concern="all"; renderBrandBar();
  if(enteringPro) playSvcTrans("Професійна косметологія","Інʼєкційна естетика · пілінги · апаратні методики");
  $$("#gt button").forEach(b=>b.classList.toggle("active",b.dataset.group===g));
  const st=$("#secTitle"); if(st) st.textContent = g==="care" ? "Косметика для догляду" : "Професійна косметологія";
  const sd=$("#secDesc"); if(sd) sd.textContent = g==="care"
    ? "Корейські засоби для домашнього та салонного догляду — від очищення до антивікових кремів."
    : "Інʼєкційні препарати, біоревіталізанти, пілінги та розхідники. Відпуск — лише сертифікованим фахівцям.";
  setPriceBounds(); updateFavUI();
  renderCats(); renderChips(); renderConcerns(); renderGrid(); renderBest();
}

/* ---------- інтро-заставка (показ раз за сесію) ---------- */
function runIntro(){
  const intro=document.getElementById("intro"); if(!intro) return;
  if(sessionStorage.getItem("kb_intro")){ intro.remove(); return; }
  const dismiss=()=>{ if(!intro.parentNode)return; intro.classList.add("hide");
    sessionStorage.setItem("kb_intro","1"); setTimeout(()=>intro.remove(),1100); };
  const t=setTimeout(dismiss,3100);
  intro.addEventListener("click",()=>{clearTimeout(t);dismiss();});
}

/* ---------- поява при скролі (reveal) ---------- */
let revObs;
function observeReveals(){
  const els=$$(".reveal:not(.in)");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
  if(!revObs) revObs=new IntersectionObserver(ents=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); revObs.unobserve(en.target); } });
  },{threshold:.12,rootMargin:"0px 0px -7% 0px"});
  els.forEach(e=>revObs.observe(e));
}

/* ---------- перехід у розділ послуг (hiskin-style) ---------- */
function playSvcTrans(title,sub){
  const el=document.getElementById("svcTrans"); if(!el) return;
  el.querySelector(".st-tx").innerHTML=`${title}<span>${sub||""}</span>`;
  el.classList.remove("run"); void el.offsetWidth; el.classList.add("run");
  setTimeout(()=>el.classList.remove("run"),1250);
}

/* ---------- toast ---------- */
let toastT;
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"),2200);
}

/* ---------- ініціалізація ---------- */
function init(){
  $$("#gt button").forEach(b=>b.onclick=()=>setGroup(b.dataset.group));
  $("#searchInput").addEventListener("input",e=>{state.q=e.target.value.trim();renderGrid();});
  $("#sortSel").addEventListener("change",e=>{state.sort=e.target.value;renderGrid();});
  $("#cartBtn").onclick=openDrawer;
  $("#drawerClose").onclick=closeDrawer;
  $("#scrim").onclick=()=>{closeDrawer();};
  $("#overlay").onclick=e=>{if(e.target.id==="overlay")closeModal();};
  $("#orderBtn").onclick=checkout;
  $("#heroBrowse").onclick=()=>document.getElementById("catalog").scrollIntoView({behavior:"smooth"});
  const scb=document.getElementById("scBtn"); if(scb) scb.onclick=()=>document.getElementById("catalog").scrollIntoView({behavior:"smooth"});

  // бренди
  const bb=document.getElementById("brandBtn"); if(bb) bb.onclick=openBrands;
  const bo=document.getElementById("brandsOverlay"); if(bo) bo.onclick=e=>{if(e.target.id==="brandsOverlay")closeBrands();};
  buildMarquee(); renderBrandBar();

  // рутина
  const rb=document.getElementById("routineBtn"); if(rb) rb.onclick=openRoutine;
  const hr=document.getElementById("heroRoutine"); if(hr) hr.onclick=openRoutine;
  const ro=document.getElementById("routineOverlay"); if(ro) ro.onclick=e=>{if(e.target.id==="routineOverlay")closeRoutine();};

  // квіз «розумний підбір»
  $$("[data-quiz]").forEach(el=>el.onclick=openQuiz);
  const qo=document.getElementById("quizOverlay"); if(qo) qo.onclick=e=>{if(e.target.id==="quizOverlay")closeQuiz();};

  // сумісність активів
  $$("[data-compat]").forEach(el=>el.onclick=openCompat);
  const co=document.getElementById("compatOverlay"); if(co) co.onclick=e=>{if(e.target.id==="compatOverlay")closeCompat();};

  // обране + фільтр ціни
  const ft=document.getElementById("favToggle");
  if(ft) ft.onclick=()=>{ state.favOnly=!state.favOnly; updateFavUI(); renderGrid();
    if(state.favOnly) document.getElementById("catalog").scrollIntoView({behavior:"smooth",block:"start"}); };
  const pr=document.getElementById("priceRange");
  if(pr) pr.oninput=()=>{ const v=+pr.value; state.maxPrice=(v>=+pr.max)?null:v;
    $("#priceVal").textContent=state.maxPrice?`${UAH(v)} грн`:"будь-яка"; renderGrid(); };
  updateFavUI();

  // бестселери — стрілки
  const bp=document.getElementById("bestPrev"); if(bp) bp.onclick=()=>bestScroll(-1);
  const bn=document.getElementById("bestNext"); if(bn) bn.onclick=()=>bestScroll(1);

  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeDrawer();closeBrands();closeRoutine();closeQuiz();closeCompat();}});

  // кнопка «догори»
  const toTop=document.getElementById("toTop");
  if(toTop){
    const onScroll=()=>toTop.classList.toggle("show", window.scrollY>700);
    window.addEventListener("scroll",onScroll,{passive:true}); onScroll();
    toTop.onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
  }

  setGroup("care");
  updateCartUI();
  runIntro();
  observeReveals();
}
document.addEventListener("DOMContentLoaded",init);
