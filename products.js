/* =====================================================================
   K-BEAUTY PROFI — каталог товарів
   Дані каталогу. Кожен товар можна редагувати/додавати тут.
   Поля: id, name, brand, group, cat, vol, price, old, badge, desc, tags
   group: "care" (косметика) | "pro" (професійна косметологія)
   ===================================================================== */

const CATEGORIES = [
  // --- Косметика (домашній / салонний догляд) ---
  { id: "cream",      group: "care", name: "Креми",            icon: "🧴", desc: "Зволоження, ліфтинг, бар'єрний догляд" },
  { id: "serum",      group: "care", name: "Сироватки та есенції", icon: "💧", desc: "Активні концентрати: вітамін C, ретинол, пептиди" },
  { id: "cleanser",   group: "care", name: "Очищення",         icon: "🫧", desc: "Гідрофільні олії, пінки, гель-клінзери" },
  { id: "toner",      group: "care", name: "Тонери та есенції", icon: "🌿", desc: "pH-баланс, зволоження, підготовка шкіри" },
  { id: "mask",       group: "care", name: "Маски",            icon: "🎭", desc: "Тканинні, нічні, глиняні, гідрогелеві" },
  { id: "sun",        group: "care", name: "Сонцезахист",      icon: "☀️", desc: "SPF-флюїди, сонцезахисні креми K-beauty" },
  { id: "eye",        group: "care", name: "Догляд за зоною очей", icon: "👁️", desc: "Креми та патчі під очі" },
  { id: "body",       group: "care", name: "Догляд за тілом",      icon: "🤍", desc: "Лосьйони, креми та олії для тіла" },
  { id: "hair",       group: "care", name: "Догляд за волоссям",   icon: "💆", desc: "Шампуні, сироватки, догляд за шкірою голови" },
  { id: "foot",       group: "care", name: "Догляд за ногами",     icon: "🦶", desc: "Пілінги, маски та креми для ніг" },

  // --- Професійна косметологія (ін'єкційні / апаратні, тільки для фахівців) ---
  { id: "meso",       group: "pro",  name: "Мезотерапія",      icon: "💉", desc: "Мезококтейлі, PDRN, вітамінні комплекси" },
  { id: "biorevi",    group: "pro",  name: "Біоревіталізація", icon: "✨", desc: "Гіалуронові біоревіталізанти та скінбустери" },
  { id: "filler",     group: "pro",  name: "Філери",           icon: "🧬", desc: "Філери на основі гіалуронової кислоти" },
  { id: "toxin",      group: "pro",  name: "Ботулотоксин",     icon: "⚡", desc: "Корейські препарати ботулотоксину типу A" },
  { id: "collagen",   group: "pro",  name: "Колагеностимулятори", icon: "🔬", desc: "PCL, PLLA, PN — стимуляція власного колагену" },
  { id: "threads",    group: "pro",  name: "Нитки (мезонитки)", icon: "🪡", desc: "PDO/PLLA нитки для армування та ліфтингу" },
  { id: "peel",       group: "pro",  name: "Пілінги",          icon: "🧪", desc: "Хімічні пілінги: AHA/BHA, TCA, ретиноєві" },
  { id: "device",     group: "pro",  name: "Апаратна косметологія", icon: "📟", desc: "Розхідники та засоби для апаратних процедур" },
];

const PRODUCTS = [
  /* ===================== КРЕМИ ===================== */
  { id:1,  name:"Advanced Snail 92 All In One Cream", brand:"COSRX", group:"care", cat:"cream", vol:"100 мл", price:520, old:640, badge:"hit",
    desc:"Крем з 92% муцину равлика. Відновлює бар'єр, зволожує, прискорює регенерацію.", tags:["муцин","зволоження","відновлення"] },
  { id:2,  name:"Dynasty Cream", brand:"Beauty of Joseon", group:"care", cat:"cream", vol:"50 мл", price:480, badge:"new",
    desc:"Поживний антивіковий крем з женьшенем і ніацинамідом. Розкішна текстура.", tags:["антиейдж","женьшень","ніацинамід"] },
  { id:3,  name:"Cica Balium Cream", brand:"SKIN1004 Madagascar Centella", group:"care", cat:"cream", vol:"75 мл", price:560,
    desc:"Заспокійливий крем з центелою для чутливої та реактивної шкіри.", tags:["центела","заспокоєння","чутлива шкіра"] },
  { id:4,  name:"Water Bank Blue Hyaluronic Cream", brand:"Laneige", group:"care", cat:"cream", vol:"50 мл", price:790,
    desc:"Глибоке зволоження блакитною гіалуроновою кислотою для нормальної/сухої шкіри.", tags:["гіалуронка","зволоження"] },
  { id:5,  name:"Dr.Different Ceramidin Cream", brand:"Dr.Jart+", group:"care", cat:"cream", vol:"50 мл", price:850, badge:"hit",
    desc:"Інтенсивний бар'єрний крем з 5 церамідами. Для сухої та зневодненої шкіри.", tags:["цераміди","бар'єр","сухість"] },

  /* ===================== СИРОВАТКИ ===================== */
  { id:10, name:"The Niacinamide 10%", brand:"Numbuzin No.5", group:"care", cat:"serum", vol:"30 мл", price:430, badge:"hit",
    desc:"Освітлювальна сироватка з ніацинамідом. Вирівнює тон, зменшує пігментацію.", tags:["ніацинамід","тон","пігментація"] },
  { id:11, name:"Glow Deep Serum Rice + Alpha Arbutin", brand:"Beauty of Joseon", group:"care", cat:"serum", vol:"30 мл", price:390, badge:"new",
    desc:"Сяйво та рівний тон завдяки рисовій воді й альфа-арбутину.", tags:["сяйво","арбутин","рис"] },
  { id:12, name:"The Vitamin C 23 Serum", brand:"COSRX", group:"care", cat:"serum", vol:"20 мл", price:610,
    desc:"Висококонцентрована (23%) сироватка з вітаміном C. Антиоксидант, сяйво.", tags:["вітамін C","антиоксидант","сяйво"] },
  { id:13, name:"Retinal Reti-Aldehyde", brand:"Torriden", group:"care", cat:"serum", vol:"30 мл", price:680, badge:"new",
    desc:"М'який ретиналь для розгладження зморшок без подразнення.", tags:["ретиналь","антиейдж","зморшки"] },
  { id:14, name:"Birch Juice Hydro Serum", brand:"Round Lab", group:"care", cat:"serum", vol:"50 мл", price:520,
    desc:"Зволожувальна есенція-сироватка з берестовим соком. Легка, швидко вбирається.", tags:["зволоження","береза"] },

  /* ===================== ОЧИЩЕННЯ ===================== */
  { id:20, name:"Heartleaf 77 Cleansing Oil", brand:"Anua", group:"care", cat:"cleanser", vol:"200 мл", price:560, badge:"hit",
    desc:"Гідрофільна олія з хауттюйнією. М'яко розчиняє макіяж і SPF.", tags:["гідрофільна олія","демакіяж"] },
  { id:21, name:"Low pH Good Morning Gel Cleanser", brand:"COSRX", group:"care", cat:"cleanser", vol:"150 мл", price:330,
    desc:"М'який гель з низьким pH і BHA. Не пересушує шкіру.", tags:["низький pH","гель","BHA"] },
  { id:22, name:"Madagascar Centella Cleansing Foam", brand:"SKIN1004", group:"care", cat:"cleanser", vol:"150 мл", price:340,
    desc:"Кремова пінка з центелою для чутливої шкіри.", tags:["пінка","центела","чутлива"] },

  /* ===================== ТОНЕРИ ===================== */
  { id:30, name:"Heartleaf Quercetinol Pore Deep Cleansing Toner", brand:"Anua", group:"care", cat:"toner", vol:"250 мл", price:480, badge:"hit",
    desc:"Тонер-есенція для очищення пор та заспокоєння шкіри.", tags:["пори","заспокоєння"] },
  { id:31, name:"Dive-In Low Molecular Hyaluronic Acid Toner", brand:"Torriden", group:"care", cat:"toner", vol:"300 мл", price:450,
    desc:"Зволожувальний тонер з низькомолекулярною гіалуроновою кислотою.", tags:["гіалуронка","зволоження"] },
  { id:32, name:"Galactomyces Pure Vitamin C Essence", brand:"SKINFOOD", group:"care", cat:"toner", vol:"50 мл", price:520,
    desc:"Есенція з галактоміцесом і вітаміном C для сяйва та текстури.", tags:["галактоміцес","сяйво"] },

  /* ===================== МАСКИ ===================== */
  { id:40, name:"N.M.F Intensive Hydrating Mask", brand:"Mediheal", group:"care", cat:"mask", vol:"10 шт", price:420, badge:"hit",
    desc:"Набір тканинних масок для інтенсивного зволоження. Бестселер K-beauty.", tags:["тканинна","зволоження","набір"] },
  { id:41, name:"Water Sleeping Mask", brand:"Laneige", group:"care", cat:"mask", vol:"70 мл", price:690,
    desc:"Нічна зволожувальна маска. Шкіра свіжа й сяйна зранку.", tags:["нічна","зволоження"] },
  { id:42, name:"Vital Hydra Solution Sheet Mask", brand:"Some By Mi", group:"care", cat:"mask", vol:"10 шт", price:380, badge:"new",
    desc:"Тканинні маски з гіалуроновою кислотою для зволоження та живлення.", tags:["тканинна","набір"] },

  /* ===================== СОНЦЕЗАХИСТ ===================== */
  { id:50, name:"Relief Sun Rice + Probiotics SPF50+", brand:"Beauty of Joseon", group:"care", cat:"sun", vol:"50 мл", price:430, badge:"hit",
    desc:"Легкий хімічний SPF без білих слідів. Культовий K-beauty санскрін.", tags:["SPF50","флюїд","рис"] },
  { id:51, name:"Birch Juice Moisturizing Sun Cream SPF50+", brand:"Round Lab", group:"care", cat:"sun", vol:"50 мл", price:460,
    desc:"Зволожувальний сонцезахист для щоденного використання.", tags:["SPF50","зволоження"] },
  { id:52, name:"Aqua Sun Gel SPF50+ PA++++", brand:"Isntree", group:"care", cat:"sun", vol:"50 мл", price:440, badge:"new",
    desc:"Гелевий санскрін з гіалуроновою кислотою, без липкості.", tags:["SPF50","гель"] },

  /* ===================== ОЧІ ===================== */
  { id:60, name:"Ginseng Eye Cream", brand:"Sulwhasoo", group:"care", cat:"eye", vol:"20 мл", price:1450, badge:"pro",
    desc:"Преміальний антивіковий крем для зони очей з женьшенем.", tags:["антиейдж","женьшень","преміум"] },
  { id:61, name:"Collagen Hydrogel Eye Patch", brand:"Medi-Peel", group:"care", cat:"eye", vol:"60 шт", price:520,
    desc:"Гідрогелеві патчі з колагеном і пептидами проти набряків.", tags:["патчі","колаген","набряки"] },

  /* ===================== ДОГЛЯД ЗА ТІЛОМ ===================== */
  { id:200, name:"Ceramide Ato Concentrate Cream", brand:"Illiyoon", group:"care", cat:"body", vol:"200 мл", price:520, badge:"hit",
    desc:"Поживний крем для обличчя й тіла з 3 церамідами. 100 годин зволоження, відновлює бар'єр.", tags:["цераміди","тіло","зволоження"] },
  { id:201, name:"1025 Dokdo Lotion", brand:"Round Lab", group:"care", cat:"body", vol:"200 мл", price:560, badge:"new",
    desc:"Легкий лосьйон для тіла з морською водою та потрійною гіалуроновою кислотою. Заспокоює та зволожує.", tags:["морська вода","тіло","гіалуронка"] },

  /* ===================== ДОГЛЯД ЗА ВОЛОССЯМ ===================== */
  { id:210, name:"Perfect Serum Original", brand:"Mise en Scène", group:"care", cat:"hair", vol:"80 мл", price:430, badge:"hit",
    desc:"Культова сироватка-олія для волосся з 7 оліями (аргана, камелія). Гладкість, блиск, термозахист.", tags:["сироватка","аргана","блиск"] },
  { id:211, name:"Rosemary Scalp Scaling Shampoo", brand:"Aromatica", group:"care", cat:"hair", vol:"400 мл", price:590, badge:"new",
    desc:"Шампунь з розмарином для шкіри голови: скейлінг, зміцнення коренів, проти випадіння.", tags:["розмарин","шкіра голови","скейлінг"] },

  /* ===================== ДОГЛЯД ЗА НОГАМИ ===================== */
  { id:220, name:"Shiny Foot Super Peeling Liquid", brand:"TONYMOLY", group:"care", cat:"foot", vol:"1 пара", price:320, badge:"hit",
    desc:"Пілінг-шкарпетки з AHA/BHA: за 4–6 днів відлущують огрубілу шкіру, ступні стають гладкими.", tags:["пілінг","ноги","шкарпетки"] },
  { id:221, name:"Dry Essence Foot Pack", brand:"Petitfee", group:"care", cat:"foot", vol:"1 пара", price:180, badge:"new",
    desc:"Зволожувальна маска-шкарпетки з алое, ши та сечовиною. М'якість і живлення для ступень.", tags:["маска","ноги","зволоження"] },

  /* ===================== МЕЗОТЕРАПІЯ ===================== */
  { id:100, name:"Rejuran Healer (PN)", brand:"Pharma Research", group:"pro", cat:"meso", vol:"2×1 мл", price:5200, badge:"hit",
    desc:"Полінуклеотиди лосося для відновлення шкіри, еластичності та зволоження. Тільки для лікарів.", tags:["PDRN","полінуклеотиди","регенерація"], pro:true },
  { id:101, name:"Rejuran S (для рубців)", brand:"Pharma Research", group:"pro", cat:"meso", vol:"1 мл", price:4800, badge:"new",
    desc:"Густіший PN-гель для роботи з рубцями та локальними дефектами.", tags:["PDRN","рубці"], pro:true },
  { id:102, name:"BCN Multivitamins Mesococktail", brand:"Institute BCN", group:"pro", cat:"meso", vol:"5×5 мл", price:1900,
    desc:"Вітамінний мезококтейль для біостимуляції та сяйва шкіри.", tags:["вітаміни","мезококтейль"], pro:true },
  { id:103, name:"Cytocare 532", brand:"Revitacare", group:"pro", cat:"meso", vol:"5×5 мл", price:3600,
    desc:"Реструктуруючий комплекс ГК + 50 інгредієнтів (RescueComplex).", tags:["ГК","ревіталізація"], pro:true },

  /* ===================== БІОРЕВІТАЛІЗАЦІЯ ===================== */
  { id:110, name:"Juvelook Volume (PDLLA)", brand:"VAIM", group:"pro", cat:"biorevi", vol:"флакон", price:5400, badge:"hit",
    desc:"Біостимулятор PDLLA + ГК: зволоження + стимуляція колагену.", tags:["PDLLA","скінбустер","колаген"], pro:true },
  { id:111, name:"Lenisna", brand:"HuonsBio", group:"pro", cat:"biorevi", vol:"флакон", price:5100, badge:"new",
    desc:"Корейський біоревіталізант для глибокого зволоження та якості шкіри.", tags:["скінбустер","зволоження"], pro:true },
  { id:112, name:"Chaeum No.0 Skinbooster", brand:"Hugel", group:"pro", cat:"biorevi", vol:"1.1 мл", price:2800,
    desc:"Скінбустер на основі ГК для зволоження та пружності.", tags:["ГК","скінбустер"], pro:true },

  /* ===================== ФІЛЕРИ ===================== */
  { id:120, name:"Neuramis Deep Lidocaine", brand:"Medytox", group:"pro", cat:"filler", vol:"1 мл", price:2400, badge:"hit",
    desc:"Філер ГК середньої щільності для корекції носогубних складок і губ.", tags:["ГК","лідокаїн","губи"], pro:true },
  { id:121, name:"Cleviel Prime", brand:"Aestura", group:"pro", cat:"filler", vol:"1.1 мл", price:3100, badge:"new",
    desc:"Високощільний філер з рекордною концентрацією ГК для об'єму.", tags:["ГК","об'єм","щільний"], pro:true },
  { id:122, name:"Chaeum Premium No.3", brand:"Hugel", group:"pro", cat:"filler", vol:"1.1 мл", price:2600,
    desc:"Універсальний філер для корекції зморшок середньої глибини.", tags:["ГК","зморшки"], pro:true },
  { id:123, name:"e.p.t.q. S300", brand:"Jetema", group:"pro", cat:"filler", vol:"1 мл", price:2300,
    desc:"Монофазний філер преміальної очистки для контурної пластики.", tags:["ГК","монофазний"], pro:true },

  /* ===================== БОТУЛОТОКСИН ===================== */
  { id:130, name:"Botulax 100U", brand:"Hugel", group:"pro", cat:"toxin", vol:"100 од", price:1700, badge:"hit",
    desc:"Корейський ботулотоксин типу A. Корекція мімічних зморшок. Рецептурний препарат.", tags:["ботокс","100U"], pro:true },
  { id:131, name:"Nabota 100U (Jeuveau)", brand:"Daewoong", group:"pro", cat:"toxin", vol:"100 од", price:1850,
    desc:"Очищений ботулотоксин типу A з підтвердженою стабільністю.", tags:["ботокс","100U"], pro:true },
  { id:132, name:"Innotox 50U (рідкий)", brand:"Medytox", group:"pro", cat:"toxin", vol:"50 од", price:2200, badge:"new",
    desc:"Готовий рідкий токсин — не потребує розведення, точне дозування.", tags:["ботокс","рідкий","50U"], pro:true },
  { id:133, name:"Coretox 100U", brand:"Medytox", group:"pro", cat:"toxin", vol:"100 од", price:2000,
    desc:"Токсин без комплексуючих білків — нижчий ризик резистентності.", tags:["ботокс","без білків"], pro:true },

  /* ===================== КОЛАГЕНОСТИМУЛЯТОРИ ===================== */
  { id:140, name:"Olidia (PCL)", brand:"Regen Biotech", group:"pro", cat:"collagen", vol:"флакон", price:4600, badge:"new",
    desc:"Полікапролактон (PCL) — пролонгована стимуляція колагену, ліфтинг.", tags:["PCL","колаген","ліфтинг"], pro:true },
  { id:141, name:"AestheFill (PDLLA)", brand:"REGEN", group:"pro", cat:"collagen", vol:"флакон", price:4900, badge:"hit",
    desc:"PDLLA-стимулятор для природного відновлення об'єму обличчя.", tags:["PDLLA","колаген","об'єм"], pro:true },
  { id:142, name:"Gana V (PLLA)", brand:"Genoss", group:"pro", cat:"collagen", vol:"флакон", price:4300,
    desc:"Полі-L-молочна кислота для поступового ліфтингу та якості шкіри.", tags:["PLLA","колаген"], pro:true },

  /* ===================== НИТКИ ===================== */
  { id:150, name:"PDO Mono нитки (комплект)", brand:"N-Finders", group:"pro", cat:"threads", vol:"20 шт", price:1400,
    desc:"Моно-нитки PDO для біоревіталізації та зміцнення дерми.", tags:["PDO","моно","біоармування"], pro:true },
  { id:151, name:"PDO Cog 4D нитки", brand:"MINT", group:"pro", cat:"threads", vol:"10 шт", price:3800, badge:"hit",
    desc:"Зазубрені нитки PDO для ліфтингу овалу обличчя.", tags:["PDO","cog","ліфтинг"], pro:true },
  { id:152, name:"PLLA Screw нитки", brand:"Ultra V Lift", group:"pro", cat:"threads", vol:"10 шт", price:4200, badge:"new",
    desc:"Спіральні PLLA-нитки для об'єму та довготривалого ефекту.", tags:["PLLA","screw","об'єм"], pro:true },

  /* ===================== ПІЛІНГИ ===================== */
  { id:160, name:"BioRePeel TCA", brand:"BioRePeelCl3", group:"pro", cat:"peel", vol:"набір", price:2900, badge:"hit",
    desc:"Двофазний пілінг TCA без фростингу. Біостимуляція + відлущення.", tags:["TCA","пілінг","біостимуляція"], pro:true },
  { id:161, name:"Cosmo Peel Forte (TCA 33%)", brand:"Mesoestetic", group:"pro", cat:"peel", vol:"3×4 мл", price:2200,
    desc:"Серединний TCA-пілінг для пігментації, постакне, зморшок.", tags:["TCA","серединний"], pro:true },
  { id:162, name:"Jessner Peeling Solution", brand:"Medix", group:"pro", cat:"peel", vol:"30 мл", price:1100,
    desc:"Класичний пілінг Джесснера: саліцилова + молочна + резорцин.", tags:["джесснер","поверхневий"], pro:true },
  { id:163, name:"PRX-T33", brand:"WiQo", group:"pro", cat:"peel", vol:"4 мл", price:1900, badge:"new",
    desc:"Біоревіталізуючий пілінг без даунтайму (TCA + H2O2 + койова).", tags:["PRX","без даунтайму"], pro:true },

  /* ===================== АПАРАТНА ===================== */
  { id:170, name:"Гель для УЗ/RF-процедур", brand:"Universal", group:"pro", cat:"device", vol:"5 л", price:680,
    desc:"Контактний гель для ультразвукових та RF-апаратів.", tags:["гель","УЗ","RF"], pro:true },
  { id:171, name:"Розхідники для гідропілінгу (картриджі)", brand:"HydraPro", group:"pro", cat:"device", vol:"набір", price:1200,
    desc:"Сироватки та насадки для процедури гідродермабразії.", tags:["гідропілінг","розхідники"], pro:true },
  { id:172, name:"Сироватка для мікронідлінгу (PN+HA)", brand:"DermaLab", group:"pro", cat:"device", vol:"10×5 мл", price:1600, badge:"new",
    desc:"Стерильна сироватка для фракційного мікронідлінгу та дермапену.", tags:["мікронідлінг","дермапен"], pro:true },

  /* =====================================================================
     СВІТОВІ ТОП-БРЕНДИ (Європа / преміум-дерматокосметика).
     origin:"eu" — для фільтра «Бренди»; top:true — топ-10 світових брендів.
     ===================================================================== */

  /* 1. La Roche-Posay (Франція) */
  { id:300, name:"Hyalu B5 Anti-Wrinkle Serum", brand:"La Roche-Posay", group:"care", cat:"serum", vol:"30 мл", price:1190, badge:"hit", origin:"eu", top:true,
    desc:"Сироватка з двома типами гіалуронової кислоти та вітаміном B5 — зволоження, пружність, відновлення.", tags:["гіалуронка","B5","антиейдж"] },
  { id:301, name:"Anthelios UVMune 400 SPF50+", brand:"La Roche-Posay", group:"care", cat:"sun", vol:"50 мл", price:790, origin:"eu", top:true,
    desc:"Сонцезахист нового покоління проти ультрадовгих UVA. Невагома текстура, без білих слідів.", tags:["SPF50","UVA","флюїд"] },
  { id:302, name:"Effaclar Duo+ M", brand:"La Roche-Posay", group:"care", cat:"cream", vol:"40 мл", price:640, origin:"eu", top:true,
    desc:"Корегувальний догляд проти недосконалостей і постакне для жирної шкіри.", tags:["акне","себорегуляція"] },

  /* 2. Vichy (Франція) */
  { id:310, name:"Minéral 89 Hyaluronic Booster", brand:"Vichy", group:"care", cat:"serum", vol:"50 мл", price:790, badge:"hit", origin:"eu", top:true,
    desc:"Зволожувальний бустер з гіалуроновою кислотою та вулканічною водою Vichy. Зміцнює бар'єр.", tags:["гіалуронка","бустер","зволоження"] },
  { id:311, name:"Liftactiv Collagen Specialist", brand:"Vichy", group:"care", cat:"cream", vol:"50 мл", price:1090, origin:"eu", top:true,
    desc:"Антивіковий крем для стимуляції колагену — щільність, пружність, рівний тон.", tags:["колаген","антиейдж"] },

  /* 3. CeraVe (США / L'Oréal) */
  { id:320, name:"Hydrating Cleanser", brand:"CeraVe", group:"care", cat:"cleanser", vol:"236 мл", price:450, badge:"hit", origin:"eu", top:true,
    desc:"М'який очисник з 3 церамідами та гіалуроновою кислотою. Не порушує бар'єр шкіри.", tags:["цераміди","очищення","бар'єр"] },
  { id:321, name:"Moisturising Cream", brand:"CeraVe", group:"care", cat:"cream", vol:"340 мл", price:620, origin:"eu", top:true,
    desc:"Насичений крем для обличчя й тіла з церамідами та технологією MVE. 24 год зволоження.", tags:["цераміди","зволоження"] },
  { id:322, name:"SA Smoothing Cream", brand:"CeraVe", group:"care", cat:"body", vol:"340 мл", price:560, origin:"eu", top:true,
    desc:"Розгладжувальний крем для тіла з саліциловою кислотою проти шорсткості та кератозу.", tags:["BHA","тіло","розгладження"] },

  /* 4. Bioderma (Франція) */
  { id:330, name:"Sensibio H2O Micellar Water", brand:"Bioderma", group:"care", cat:"cleanser", vol:"500 мл", price:520, badge:"hit", origin:"eu", top:true,
    desc:"Культова міцелярна вода для делікатного зняття макіяжу та очищення чутливої шкіри.", tags:["міцелярна","демакіяж","чутлива"] },
  { id:331, name:"Hydrabio Tonique", brand:"Bioderma", group:"care", cat:"toner", vol:"250 мл", price:480, origin:"eu", top:true,
    desc:"Зволожувальний тонік для зневодненої шкіри — комфорт, сяйво, підготовка до догляду.", tags:["зволоження","тонік"] },

  /* 5. Avène (Франція) */
  { id:340, name:"Thermal Spring Water", brand:"Avène", group:"care", cat:"toner", vol:"300 мл", price:420, origin:"eu", top:true,
    desc:"Термальна вода Avène — заспокоює, знімає подразнення та почервоніння чутливої шкіри.", tags:["термальна вода","заспокоєння"] },
  { id:341, name:"Cleanance Sunscreen SPF50+", brand:"Avène", group:"care", cat:"sun", vol:"50 мл", price:620, badge:"new", origin:"eu", top:true,
    desc:"Матувальний сонцезахист для жирної та проблемної шкіри. Некомедогенний.", tags:["SPF50","матовий","акне"] },

  /* 6. SkinCeuticals (США) */
  { id:350, name:"C E Ferulic", brand:"SkinCeuticals", group:"care", cat:"serum", vol:"30 мл", price:4600, badge:"hit", origin:"eu", top:true,
    desc:"Еталонна антиоксидантна сироватка: 15% віт. C + віт. E + ферулова кислота. Захист і сяйво.", tags:["вітамін C","антиоксидант","преміум"] },
  { id:351, name:"Phyto Corrective Mask", brand:"SkinCeuticals", group:"care", cat:"mask", vol:"70 мл", price:1900, origin:"eu", top:true,
    desc:"Заспокійлива гель-маска з рослинними екстрактами для зневодненої та реактивної шкіри.", tags:["маска","заспокоєння"] },

  /* 7. Estée Lauder (США) */
  { id:360, name:"Advanced Night Repair Serum", brand:"Estée Lauder", group:"care", cat:"serum", vol:"50 мл", price:3200, badge:"hit", origin:"eu", top:true,
    desc:"Легендарна нічна сироватка-антиоксидант для відновлення, сяйва та молодості шкіри.", tags:["антиейдж","нічна","сяйво"] },
  { id:361, name:"Advanced Night Repair Eye", brand:"Estée Lauder", group:"care", cat:"eye", vol:"15 мл", price:2600, origin:"eu", top:true,
    desc:"Відновлювальний догляд для зони очей: зменшує ознаки втоми, набряки та зморшки.", tags:["очі","антиейдж"] },

  /* 8. Clarins (Франція) */
  { id:370, name:"Double Serum", brand:"Clarins", group:"care", cat:"serum", vol:"50 мл", price:2900, badge:"hit", origin:"eu", top:true,
    desc:"Подвійна антивікова сироватка (водна + олійна фази) з 21 рослинним екстрактом.", tags:["антиейдж","сироватка","преміум"] },
  { id:371, name:"Total Eye Lift", brand:"Clarins", group:"care", cat:"eye", vol:"15 мл", price:2300, origin:"eu", top:true,
    desc:"Ліфтинг-догляд для очей: розгладжує зморшки, зменшує набряки й темні кола.", tags:["очі","ліфтинг"] },
  { id:372, name:"Tonic Body Treatment Oil", brand:"Clarins", group:"care", cat:"body", vol:"100 мл", price:1500, origin:"eu", top:true,
    desc:"Тонізувальна олія для тіла з розмарином і м'ятою — пружність і еластичність шкіри.", tags:["олія","тіло","пружність"] },

  /* 9. Caudalíe (Франція) */
  { id:380, name:"Vinoperfect Radiance Serum", brand:"Caudalíe", group:"care", cat:"serum", vol:"30 мл", price:1490, badge:"new", origin:"eu", top:true,
    desc:"Сироватка сяйва проти пігментних плям на основі винного ресвератролу та ніацинаміду.", tags:["сяйво","пігментація","ресвератрол"] },
  { id:381, name:"Beauty Elixir", brand:"Caudalíe", group:"care", cat:"toner", vol:"100 мл", price:1100, origin:"eu", top:true,
    desc:"Тонік-еліксир для свіжості, звуження пор і миттєвого сяйва. Освіжає протягом дня.", tags:["тонік","сяйво","пори"] },

  /* 10. Eucerin (Німеччина / Beiersdorf) */
  { id:390, name:"Hyaluron-Filler Day SPF15", brand:"Eucerin", group:"care", cat:"cream", vol:"50 мл", price:820, origin:"eu", top:true,
    desc:"Денний антивіковий крем з гіалуроновою кислотою проти зморшок + захист SPF15.", tags:["гіалуронка","антиейдж","SPF"] },
  { id:391, name:"Anti-Pigment Serum", brand:"Eucerin", group:"care", cat:"serum", vol:"30 мл", price:980, badge:"new", origin:"eu", top:true,
    desc:"Сироватка проти пігментації з Thiamidol® — вирівнює тон і запобігає появі плям.", tags:["пігментація","тон","Thiamidol"] },
];
