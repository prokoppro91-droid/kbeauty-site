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
const emojiFor = p => (CATEGORIES.find(c=>c.id===p.cat)||{}).icon || "🧴";
const saveCart = () => localStorage.setItem("kb_cart", JSON.stringify(state.cart));
const cartCount = () => Object.values(state.cart).reduce((a,b)=>a+b,0);
const cartTotal = () => Object.entries(state.cart)
  .reduce((s,[id,q])=>{const p=PRODUCTS.find(x=>x.id==id);return s+(p?p.price*q:0);},0);

/* ---------- рендер категорій ---------- */
function renderCats(){
  const cats = CATEGORIES.filter(c=>c.group===state.group);
  const counts = {};
  PRODUCTS.forEach(p=>{counts[p.cat]=(counts[p.cat]||0)+1;});
  $("#cats").innerHTML = cats.map(c=>`
    <button class="cat ${state.cat===c.id?'active':''} ${c.group==='pro'?'pro':''}" data-cat="${c.id}">
      <span class="n">${counts[c.id]||0}</span>
      <div class="ic">${c.icon}</div>
      <b>${c.name}</b><small>${c.desc}</small>
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
    cats.map(c=>`<button class="chip ${state.cat===c.id?'active':''}" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join("");
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
    return `<article class="card" data-id="${p.id}">
      <div class="thumb" data-open="${p.id}">
        <img class="pimg" src="img/p${p.id}.jpg" alt="${p.name}" loading="lazy"
             onerror="this.style.display='none';this.parentNode.classList.add('noimg')">
        <span class="em">${emojiFor(p)}</span>
        <span class="brandtag">${p.brand}</span>
        ${p.badge?`<span class="badge ${p.badge}">${badgeLbl[p.badge]||p.badge}</span>`:""}
      </div>
      <div class="body">
        <span class="cat-lbl">${catName(p.cat)}</span>
        <h3 data-open="${p.id}">${p.name}</h3>
        <span class="vol">${p.vol||""}</span>
        <div class="foot">
          <div class="price">${UAH(p.price)} <span class="cur">грн</span>
            ${p.old?`<span class="old">${UAH(p.old)}</span>`:""}</div>
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
  $("#modal").innerHTML=`
    <button class="close" data-mclose>×</button>
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
        <div class="mvol">${p.vol?("Обʼєм / фасування: "+p.vol):""}</div>
        <p class="desc">${p.desc||""}</p>
        <div class="mtags">${(p.tags||[]).map(t=>`<span>#${t}</span>`).join("")}</div>
        <div class="mprice">${UAH(p.price)} грн
          ${p.old?`<span class="old" style="font-size:16px;color:#b9aa92;text-decoration:line-through">${UAH(p.old)}</span>`:""}</div>
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
  state.group=g; state.cat="all";
  $$("#gt button").forEach(b=>b.classList.toggle("active",b.dataset.group===g));
  $("#secTitle").textContent = g==="care" ? "Косметика для догляду" : "Професійна косметологія";
  $("#secDesc").textContent  = g==="care"
    ? "Корейські засоби для домашнього та салонного догляду — від очищення до антивікових кремів."
    : "Інʼєкційні препарати, біоревіталізанти, пілінги та розхідники. Відпуск — лише сертифікованим фахівцям.";
  renderCats(); renderChips(); renderGrid();
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
  $("#heroBrowse").onclick=()=>document.getElementById("cats-sec").scrollIntoView({behavior:"smooth"});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeDrawer();}});

  setGroup("care");
  updateCartUI();
}
document.addEventListener("DOMContentLoaded",init);
