// FILMS and ERAS come from films.js, which must load first.
(() => {
"use strict";

const ACCENTS = [
  { color: "#F2B632", name: "Marquee gold" },
  { color: "#E2552D", name: "Neon red" },
  { color: "#7FC8C2", name: "Lobby teal" },
  { color: "#F3EADB", name: "Ivory" }
];
const KEY_WATCHED = "100films:watched";
const KEY_ACCENT = "100films:accent";

const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(3, "0");
const dur = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const films = FILMS.map(([title, year, mins], i) => ({
  no: i + 1, title, year, mins,
  era: ERAS.findIndex((e) => year <= e.max),
  key: norm(title) + " " + year
}));
const TOTAL_MINS = films.reduce((s, f) => s + f.mins, 0);

const loadWatched = () => new Set(store.get(KEY_WATCHED, []).filter((n) => Number.isInteger(n) && n >= 1 && n <= films.length));
let watched = loadWatched();
const state = { q: "", status: "all", eras: new Set(), sort: "list" };

const SORTS = {
  list:  (a, b) => a.no - b.no,
  old:   (a, b) => a.year - b.year || a.no - b.no,
  new:   (a, b) => b.year - a.year || a.no - b.no,
  short: (a, b) => a.mins - b.mins || a.no - b.no,
  long:  (a, b) => b.mins - a.mins || a.no - b.no,
  az:    (a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" })
};

/* ---------- Build ---------- */
const grid = $("#grid");
const frag = document.createDocumentFragment();
films.forEach((f) => {
  const li = document.createElement("li");
  li.innerHTML =
    `<button type="button" class="ticket" style="--era:${ERAS[f.era].color}">` +
      `<span class="ticket__body">` +
        `<span class="ticket__band"></span>` +
        `<span class="ticket__head"><span class="ticket__no">№ ${pad(f.no)}</span><span class="ticket__check" aria-hidden="true"></span></span>` +
        `<span class="ticket__title"></span>` +
        `<span class="ticket__meta"><span>${f.year}</span><span>${dur(f.mins)}</span></span>` +
        `<span class="ticket__stamp" aria-hidden="true">WATCHED</span>` +
      `</span>` +
    `</button>`;
  f.li = li;
  f.btn = li.firstElementChild;
  f.btn.querySelector(".ticket__title").textContent = f.title;
  f.btn.setAttribute("aria-label", `${f.no}. ${f.title}, ${f.year}, ${dur(f.mins)}`);
  f.btn.title = f.title;
  f.btn.addEventListener("click", () => toggle(f));
  frag.append(li);
});
grid.append(frag);

const chips = $("#chips");
ERAS.forEach((e, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.style.setProperty("--c", e.color);
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = `<i aria-hidden="true"></i>${e.label}`;
  b.addEventListener("click", () => {
    state.eras.has(i) ? state.eras.delete(i) : state.eras.add(i);
    b.setAttribute("aria-pressed", String(state.eras.has(i)));
    applyFilters();
  });
  chips.append(b);
});

const erasEl = $("#eras");
const eraRows = ERAS.map((e) => {
  const row = document.createElement("div");
  row.className = "era";
  row.style.setProperty("--c", e.color);
  row.innerHTML = `<div class="era__top"><i aria-hidden="true"></i>${e.label}<span></span></div><div class="era__bar"><span></span></div>`;
  erasEl.append(row);
  return { count: row.querySelector(".era__top span"), bar: row.querySelector(".era__bar span") };
});

$("#total").textContent = `${Math.round(TOTAL_MINS / 60)} hours in total · 1950 → 2012`;

/* ---------- Accent ---------- */
const swatches = $("#swatches");
function setAccent(color) {
  document.documentElement.style.setProperty("--accent", color);
  swatches.querySelectorAll(".swatch").forEach((s) => s.setAttribute("aria-pressed", String(s.dataset.color === color)));
}
ACCENTS.forEach((a) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "swatch";
  b.dataset.color = a.color;
  b.style.setProperty("--c", a.color);
  b.setAttribute("aria-label", a.name);
  b.title = a.name;
  b.addEventListener("click", () => { setAccent(a.color); store.set(KEY_ACCENT, a.color); });
  swatches.append(b);
});
const savedAccent = store.get(KEY_ACCENT, ACCENTS[0].color);
setAccent(ACCENTS.some((a) => a.color === savedAccent) ? savedAccent : ACCENTS[0].color);

/* ---------- Render ---------- */
function paint(f) { f.btn.setAttribute("aria-pressed", String(watched.has(f.no))); }

function updateStats() {
  let n = 0, mins = 0;
  const per = ERAS.map(() => ({ n: 0, t: 0 }));
  films.forEach((f) => {
    per[f.era].t++;
    if (watched.has(f.no)) { n++; mins += f.mins; per[f.era].n++; }
  });
  $("#count").textContent = n;
  const bar = $("#bar");
  bar.setAttribute("aria-valuenow", n);
  bar.firstElementChild.style.width = `${n}%`;
  $("#hoursWatched").textContent = `${Math.round(mins / 60)}h watched`;
  $("#hoursLeft").textContent = n === films.length ? "all done" : `${Math.round((TOTAL_MINS - mins) / 60)}h to go`;
  per.forEach((p, i) => {
    eraRows[i].count.textContent = `${p.n}/${p.t}`;
    eraRows[i].bar.style.width = `${(p.n / p.t) * 100}%`;
  });
  const pick = $("#pick");
  pick.disabled = n === films.length;
  pick.textContent = n === films.length ? "🏆 All 100 watched" : "🎲 Pick tonight's film";
}

function isFiltered() { return state.q.trim() !== "" || state.status !== "all" || state.eras.size > 0; }

let lastSort = "list";
function applyFilters() {
  if (state.sort !== lastSort) {
    const frag = document.createDocumentFragment();
    [...films].sort(SORTS[state.sort]).forEach((f) => frag.append(f.li));
    grid.append(frag);
    lastSort = state.sort;
  }
  const q = norm(state.q.trim());
  let shown = 0;
  films.forEach((f) => {
    const w = watched.has(f.no);
    const ok = (!q || f.key.includes(q))
      && (state.status === "all" || (state.status === "watched") === w)
      && (state.eras.size === 0 || state.eras.has(f.era));
    f.li.hidden = !ok;
    if (ok) shown++;
  });
  $("#resultCount").textContent = shown === films.length ? `Showing all ${films.length} films` : `Showing ${shown} of ${films.length} films`;
  $("#empty").hidden = shown > 0;
  $("#clear").hidden = !isFiltered();
}

function clearFilters() {
  state.q = ""; state.status = "all"; state.eras.clear();
  $("#q").value = "";
  document.querySelectorAll("#status button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.status === "all")));
  chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", "false"));
  applyFilters();
}

function save() { store.set(KEY_WATCHED, [...watched].sort((a, b) => a - b)); }

function toggle(f) {
  watched.has(f.no) ? watched.delete(f.no) : watched.add(f.no);
  save();
  paint(f);
  updateStats();
}

/* ---------- Controls ---------- */
const q = $("#q");
q.addEventListener("input", () => { state.q = q.value; applyFilters(); });
q.addEventListener("keydown", (e) => { if (e.key === "Escape" && q.value) { e.stopPropagation(); q.value = ""; state.q = ""; applyFilters(); } });

document.addEventListener("keydown", (e) => {
  if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target;
  if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement || t.isContentEditable) return;
  e.preventDefault();
  q.focus();
});

$("#status").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-status]");
  if (!b) return;
  state.status = b.dataset.status;
  document.querySelectorAll("#status button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  applyFilters();
});

$("#sort").addEventListener("change", (e) => { state.sort = e.target.value; applyFilters(); });
$("#clear").addEventListener("click", clearFilters);
$("#clear2").addEventListener("click", clearFilters);

let lastPick = null, pickTimer = 0, spotTimer = 0;
$("#pick").addEventListener("click", () => {
  const unwatched = (f) => !watched.has(f.no);
  let pool = films.filter((f) => unwatched(f) && !f.li.hidden);
  if (!pool.length) {
    pool = films.filter(unwatched);
    if (!pool.length) return;
    clearFilters();
  }
  if (pool.length > 1) pool = pool.filter((f) => f !== lastPick);
  const f = pool[Math.floor(Math.random() * pool.length)];
  lastPick = f;
  const r = f.btn.getBoundingClientRect();
  const inView = r.top >= 0 && r.bottom <= innerHeight;
  f.btn.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
  f.btn.focus({ preventScroll: true });
  // Light the ticket up once the smooth scroll has (roughly) brought it into view.
  clearTimeout(pickTimer);
  clearTimeout(spotTimer);
  grid.classList.remove("spotlight");
  document.querySelectorAll(".ticket.is-picked").forEach((t) => t.classList.remove("is-picked"));
  pickTimer = setTimeout(() => {
    grid.classList.add("spotlight");
    f.btn.classList.add("is-picked");
    spotTimer = setTimeout(() => grid.classList.remove("spotlight"), 2300);
    pickTimer = setTimeout(() => f.btn.classList.remove("is-picked"), 3100);
  }, inView || reduceMotion.matches ? 0 : 550);
  const out = $("#pickOut");
  out.textContent = "Tonight: ";
  const b = document.createElement("b");
  b.textContent = f.title;
  out.append(b, ` · ${f.year} · ${dur(f.mins)}`);
});

const reset = $("#reset");
let resetTimer = 0;
reset.addEventListener("click", () => {
  if (!reset.classList.contains("btn--danger")) {
    if (!watched.size) return;
    reset.classList.add("btn--danger");
    reset.textContent = "Click again to clear all";
    resetTimer = setTimeout(disarm, 3500);
    return;
  }
  disarm();
  watched.clear();
  save();
  films.forEach(paint);
  updateStats();
  applyFilters();
  $("#pickOut").textContent = "";
});
function disarm() {
  clearTimeout(resetTimer);
  reset.classList.remove("btn--danger");
  reset.textContent = "Reset progress";
}

// Keep several open tabs in sync.
window.addEventListener("storage", (e) => {
  if (e.key === KEY_WATCHED) { watched = loadWatched(); films.forEach(paint); updateStats(); applyFilters(); }
  if (e.key === KEY_ACCENT) setAccent(store.get(KEY_ACCENT, ACCENTS[0].color));
});

/* ---------- Init ---------- */
films.forEach(paint);
updateStats();
applyFilters();
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("ready")));
})();
