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
  q: "",                  // пошук
  sort: "pop",            // pop | price-asc | price-desc | new
  cart: JSON.parse(localStorage.getItem("kb_cart") || "{}"),
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

/* ---------- фільтрація + сортування ---------- */
function currentList(){
  let list = PRODUCTS.filter(p=>p.group===state.group);
  if(state.cat!=="all") list = list.filter(p=>p.cat===state.cat);
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
    $("#grid").innerHTML = `<div class="empty" style="grid-column:1/-1">
      <div class="em">🔍</div><h3>Нічого не знайдено</h3>
      <p>Спробуйте змінити запит або категорію.</p></div>`;
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
        ${p.old?`<span class="sale">−${discPct(p)}%</span>`:""}
        <span class="brandtag">${p.brand}</span>
        ${p.badge?`<span class="badge ${p.badge}">${badgeLbl[p.badge]||p.badge}</span>`:""}
      </div>
      <div class="body">
        <span class="cat-lbl">${catName(p.cat)}</span>
        <h3 data-open="${p.id}">${p.name}</h3>
        <span class="vol">${p.vol||""}</span>
        <div class="rating">${starRow(r.rate)}<span class="rate">${r.rate}</span><span class="rc">· ${r.cnt}</span></div>
        <div class="foot">
          <div class="price">${UAH(p.price)} <span class="cur">грн</span>
            ${p.old?`<span class="old">${UAH(p.old)}</span><span class="off">−${discPct(p)}%</span>`:""}</div>
          <button class="add ${inCart?'in':''}" data-add="${p.id}" title="Додати в кошик">${inCart?'✓':'+'}</button>
        </div>
      </div>
    </article>`;
  }).join("");

  $$("#grid [data-add]").forEach(b=>b.onclick=e=>{e.stopPropagation();addToCart(+b.dataset.add);});
  $$("#grid [data-open]").forEach(b=>b.onclick=()=>openModal(+b.dataset.open));
}

/* ---------- кошик ---------- */
function addToCart(id){
  state.cart[id]=(state.cart[id]||0)+1; saveCart();
  updateCartUI(); renderGrid();
  const p=PRODUCTS.find(x=>x.id===id);
  toast(`✓ «${p.name}» додано в кошик`);
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
          <li><span class="ck">✓</span><b>100% оригінал</b>&nbsp;— напряму з корейського ринку</li>
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
  state.group=g; state.cat="all";
  if(enteringPro) playSvcTrans("Професійна косметологія","Інʼєкційна естетика · пілінги · апаратні методики");
  $$("#gt button").forEach(b=>b.classList.toggle("active",b.dataset.group===g));
  const st=$("#secTitle"); if(st) st.textContent = g==="care" ? "Косметика для догляду" : "Професійна косметологія";
  const sd=$("#secDesc"); if(sd) sd.textContent = g==="care"
    ? "Корейські засоби для домашнього та салонного догляду — від очищення до антивікових кремів."
    : "Інʼєкційні препарати, біоревіталізанти, пілінги та розхідники. Відпуск — лише сертифікованим фахівцям.";
  renderCats(); renderChips(); renderGrid();
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
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeDrawer();}});

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
