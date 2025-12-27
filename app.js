// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Language Toggle =====
const btnEN = document.getElementById("btnEN");
const btnZH = document.getElementById("btnZH");

function setLang(lang){
  document.body.classList.toggle("lang-en", lang === "en");
  document.body.classList.toggle("lang-zh", lang === "zh");
  btnEN.classList.toggle("active", lang === "en");
  btnZH.classList.toggle("active", lang === "zh");
  localStorage.setItem("site_lang", lang);
  // refresh map labels/panel text
  updateJumpVisibility();
renderPins();
  clearPanel(false);
}

btnEN.addEventListener("click", () => setLang("en"));
btnZH.addEventListener("click", () => setLang("zh"));

const saved = localStorage.getItem("site_lang");
if(saved === "zh") setLang("zh");

// ===== Work Tabs =====
const tabs = Array.from(document.querySelectorAll(".tab"));
const workCards = Array.from(document.querySelectorAll(".work-card"));

function setWorkTab(cat){
  tabs.forEach(t => t.classList.toggle("active", t.dataset.cat === cat));
  workCards.forEach(c => {
    c.style.display = (c.dataset.cat === cat) ? "" : "none";
  });
}

tabs.forEach(t => t.addEventListener("click", () => setWorkTab(t.dataset.cat)));
setWorkTab("dashboards");

// ===== Map Data =====
let currentTrack = "career";
let activePointId = null;
const segBtns = Array.from(document.querySelectorAll(".seg-btn"));
const pinsEl = document.getElementById("pins");

// NOTE: Coordinates are in percentage relative to the SVG viewBox area.
// These are stylized placements that still read correctly.
const points = [
  // ===== Career Track (work locations) =====
  {
    id: "career_shanghai",
    track: "career",
    lon: 121.47, lat: 31.23,
    title: { en: "Shanghai, China", zh: "中国 · 上海" },
    subtitle: { en: "JLL (2024) · Pacific Securities (2023)", zh: "JLL（2024）· Pacific Securities（2023）" },
    body: {
      en: "Shanghai is both my hometown and where I built real analyst habits — first in macro research, then in valuation & due diligence. This is where my “fast but organized” style became a habit.",
      zh: "上海既是我长大的地方，也是我把“分析”做成真本事的地方：先做宏观研究，再做估值/尽调。也正是在这里，我形成了“快但不乱、有序推进”的习惯。"
    },
    jump: "#exp-shanghai"
  },
  {
    id: "career_nyc",
    track: "career",
    lon: -74.01, lat: 40.71,
    title: { en: "New York, USA", zh: "美国 · 纽约" },
    subtitle: { en: "World Salon (2025)", zh: "World Salon（2025）" },
    body: {
      en: "After graduating from Madison, I went to New York for my internship. In a fast, cross‑industry environment, I standardized inputs and kept weekly delivery on track so others could use the output right away.",
      zh: "我从 Madison 毕业后去了纽约实习。在高节奏、多行业语境里，我把输入标准化并推动周度交付，让成果“别人拿到就能用”。"
    },
    jump: "#exp-nyc"
  },

  // ===== Life & Perspective (storytelling) =====
  {
    id: "life_shanghai",
    track: "life",
    lon: 121.47, lat: 31.23,
    title: { en: "Shanghai (hometown)", zh: "上海（家乡）" },
    subtitle: { en: "Speed, standards, responsibility", zh: "快节奏 · 高标准 · 责任感" },
    body: {
      en: "I grew up in Shanghai, so speed and standards feel normal. What really stayed with me is ownership: if you say you’ll deliver, you deliver — clearly and on time.",
      zh: "我在上海长大，所以快节奏和高标准是常态。更重要的是结果意识：说了要交付，就交付——而且要交得清楚、交得按时。"
    },
    jump: "#experience"
  },
  {
    id: "life_redlands",
    track: "life",
    lon: -117.18, lat: 34.06,
    title: { en: "Redlands / San Bernardino", zh: "Redlands / San Bernardino" },
    subtitle: { en: "High school chapter · adaptability", zh: "高中来美 · 适应力" },
    body: {
      en: "High school in California taught me independence fast. When everything is new, I organize first: what matters, what’s next, and what “done” looks like.",
      zh: "高中在加州让我很快学会独立。在全新的环境里，我会先把事情理清楚：重点是什么、下一步是什么、做到什么算完成。"
    },
    jump: "#experience"
  },
  {
    id: "life_madison",
    track: "life",
    lon: -89.40, lat: 43.07,
    title: { en: "Madison, WI", zh: "Madison（威斯康星）" },
    subtitle: { en: "Economics foundation · team leadership", zh: "经济学底座 · 小组带队" },
    body: {
      en: "Madison gave me economics frameworks and trained my team‑lead muscle: set the structure, assign owners, keep cadence, and make sure the project ships.",
      zh: "Madison 给了我经济学框架，也练出了小组带队能力：定结构、分工到人、盯节奏，把项目带到完成。"
    },
    jump: "#about"
  },
  {
    id: "life_nyc",
    track: "life",
    lon: -74.01, lat: 40.71,
    title: { en: "New York (post‑grad)", zh: "纽约（毕业后）" },
    subtitle: { en: "Execution, clarity, usable output", zh: "执行力 · 清晰沟通 · 输出好用" },
    body: {
      en: "New York raised my bar: move fast, keep things tidy, and make outputs easy for others to use — not just technically correct.",
      zh: "纽约把我对“执行”的要求拉得更高：快、有序、输出要好用——不只是做对，还要别人用得顺。"
    },
    jump: "#exp-nyc"
  },
  {
    id: "life_dc",
    track: "life",
    lon: -77.04, lat: 38.91,
    title: { en: "Washington, DC", zh: "华盛顿特区" },
    subtitle: { en: "BAAI · analytics + ML foundations", zh: "BAAI · 分析能力+ML基础" },
    body: {
      en: "BAAI is my next layer. AI/ML for me isn’t a label — it’s a toolbox that helps analysts be more systematic, scalable, and future‑ready.",
      zh: "BAAI 是我的“下一层”。AI/ML 对我来说不是标签，而是一套工具：让分析更系统、更可扩展、更适应未来。"
    },
    jump: "#about"
  }
];

// ===== Map Panel =====
const panelTitle = document.getElementById("panelTitle");
const panelSubtitle = document.getElementById("panelSubtitle");
const panelBody = document.getElementById("panelBody");
const panelJump = document.getElementById("panelJump");
const panelClose = document.getElementById("panelClose");

function updateJumpVisibility(){
  // Hide "Go to related work" when browsing Life & Perspective
  const hide = (currentTrack === "life");
  panelJump.classList.toggle("hidden", hide);
}

function getLang(){
  return document.body.classList.contains("lang-zh") ? "zh" : "en";
}

function projectLonLat(lon, lat){
  // Equirectangular projection to the SVG viewBox (0..1000, 0..520)
  const xPct = ((lon + 180) / 360) * 100;
  const yPct = ((90 - lat) / 180) * 100;
  return { xPct, yPct };
}

function showPoint(p){
  const lang = getLang();
  activePointId = p.id;
  panelTitle.textContent = p.title[lang];
  panelSubtitle.textContent = p.subtitle[lang];
  panelBody.textContent = p.body[lang];
  panelJump.href = p.jump || "#work";
  updateJumpVisibility();
  renderPins();
}

function clearPanel(resetText=true){
  activePointId = null;
  if(!resetText) return;
  const lang = getLang();
  panelTitle.textContent = (lang === "zh") ? "请选择一个地点" : "Select a location";
  panelSubtitle.textContent = (lang === "zh") ? "点击地点可看简要介绍" : "Click a place for a quick summary";
  panelBody.textContent = (lang === "zh")
    ? "提示：先切换轨道，再点地点看右侧卡片；下方时间线有更详细的工作内容。"
    : "Tip: switch tracks, click a pin for a quick summary, then scroll for the detailed timeline.";
  panelJump.href = "#work";
  updateJumpVisibility();
  renderPins();
}

panelClose.addEventListener("click", () => clearPanel(true));

// ===== Track Toggle =====
segBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentTrack = btn.dataset.track;
    segBtns.forEach(b => b.classList.toggle("active", b.dataset.track === currentTrack));
    updateJumpVisibility();
    renderPins();
    clearPanel(true);
  });
});

// ===== Render Pins =====
function renderPins(){
  pinsEl.innerHTML = "";
  const lang = getLang();
  points
    .filter(p => p.track === currentTrack)
    .forEach(p => {
      const pin = document.createElement("button");
      pin.className = "pin" + (p.id === activePointId ? " active" : "");
      pin.type = "button";
      const pos = (typeof p.lon === "number" && typeof p.lat === "number") ? projectLonLat(p.lon, p.lat) : { xPct: p.x, yPct: p.y };
      pin.style.left = pos.xPct + "%";
      pin.style.top = pos.yPct + "%";
      pin.setAttribute("aria-label", p.title[lang]);
      pin.addEventListener("click", () => showPoint(p));

      const label = document.createElement("div");
      label.className = "pin-label";
      label.style.left = pos.xPct + "%";
      label.style.top = pos.yPct + "%";
      label.textContent = p.title[lang];

      pinsEl.appendChild(pin);
      pinsEl.appendChild(label);
    });
}

renderPins();

// ===== Smooth scroll for in-page anchors (optional) =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if(!href || href === "#") return;
    const el = document.querySelector(href);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:"smooth", block:"start"});
    history.replaceState(null, "", href);
  });
});


// ===== Gallery Lightbox =====
(function initGalleryLightbox(){
  const imgs = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (!imgs.length) return;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Image preview">
      <img alt="" />
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(box);

  const inner = box.querySelector(".lightbox-inner");
  const imgEl = box.querySelector("img");
  const capEl = box.querySelector(".lightbox-caption");

  function open(src, alt){
    imgEl.src = src;
    imgEl.alt = alt || "Image";
    capEl.textContent = alt || "";
    box.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close(){
    box.classList.remove("open");
    document.body.style.overflow = "";
    imgEl.src = "";
  }

  imgs.forEach(img => {
    img.addEventListener("click", () => open(img.src, img.alt));
  });

  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && box.classList.contains("open")) close();
  });
})();


// ===== Gallery Carousels (scroll buttons) =====
(function initCarousels(){
  const carousels = Array.from(document.querySelectorAll(".carousel"));
  if(!carousels.length) return;

  carousels.forEach(car => {
    const track = car.querySelector(".car-track");
    const leftBtn = car.querySelector(".car-btn.left");
    const rightBtn = car.querySelector(".car-btn.right");
    if(!track || !leftBtn || !rightBtn) return;

    const step = () => Math.max(260, Math.floor(track.clientWidth * 0.85));

    leftBtn.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    rightBtn.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
  });
})();
