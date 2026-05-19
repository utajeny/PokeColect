const STORAGE_KEY = "pokemon-card-collector-v1";
const API_BASE = "https://api.pokemontcg.io/v2/cards";

const sampleCards = [
  {
    name: "Pikachu",
    series: "151",
    number: "025/165",
    rarity: "Common",
    status: "owned",
    value: 3.5,
    psa10: 0,
    note: "Elektricky typ, pekny stav.",
  },
  {
    name: "Charizard ex",
    series: "Obsidian Flames",
    number: "125/197",
    rarity: "Ultra Rare",
    status: "wishlist",
    value: 32,
    psa10: 0,
    note: "Hlavna karta, ktoru chcem ziskat.",
  },
  {
    name: "Mewtwo",
    series: "Pokemon GO",
    number: "031/078",
    rarity: "Holo Rare",
    status: "owned",
    value: 9,
    psa10: 0,
    note: "Holo verzia do albumu.",
  },
  {
    name: "Bulbasaur",
    series: "Scarlet & Violet",
    number: "001/198",
    rarity: "Common",
    status: "trade",
    value: 2,
    psa10: 0,
    note: "Druhy kus, vhodny na vymenu.",
  },
  {
    name: "Lucario",
    series: "Crown Zenith",
    number: "GG02/GG70",
    rarity: "Rare",
    status: "owned",
    value: 6,
    psa10: 0,
    note: "Oblubeny Pokemon v zbierke.",
  },
];

const rarityPalette = {
  Common: ["#f2d14b", "#2c77bf", "C"],
  Uncommon: ["#5fbf75", "#2e7a58", "U"],
  Rare: ["#3b69a8", "#1f3b77", "R"],
  "Holo Rare": ["#6fd3f5", "#7b4eb2", "H"],
  "Ultra Rare": ["#f0b22e", "#d93b4a", "UR"],
};

const statusLabels = {
  owned: "Mam",
  wishlist: "Chcem",
  trade: "Vymena",
};

let cards = loadCards();
let activeView = "all";
let editorMarket = null;

const elements = {
  grid: document.querySelector("#cardsGrid"),
  emptyState: document.querySelector("#emptyState"),
  search: document.querySelector("#searchInput"),
  rarity: document.querySelector("#rarityFilter"),
  sort: document.querySelector("#sortSelect"),
  dialog: document.querySelector("#cardDialog"),
  form: document.querySelector("#cardForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  cardId: document.querySelector("#cardId"),
  name: document.querySelector("#nameInput"),
  series: document.querySelector("#seriesInput"),
  number: document.querySelector("#numberInput"),
  rarityInput: document.querySelector("#rarityInput"),
  status: document.querySelector("#statusInput"),
  value: document.querySelector("#valueInput"),
  psa10: document.querySelector("#psa10Input"),
  image: document.querySelector("#imageInput"),
  note: document.querySelector("#noteInput"),
  refreshPricesButton: document.querySelector("#refreshPricesButton"),
  priceStatus: document.querySelector("#priceStatus"),
  deleteButton: document.querySelector("#deleteButton"),
  totalCount: document.querySelector("#totalCount"),
  ownedCount: document.querySelector("#ownedCount"),
  missingCount: document.querySelector("#missingCount"),
  valueCount: document.querySelector("#valueCount"),
  completionValue: document.querySelector("#completionValue"),
  completionBar: document.querySelector("#completionBar"),
};

document.querySelector("#openFormButton").addEventListener("click", () => openEditor());
document.querySelector("#emptyAddButton").addEventListener("click", () => openEditor());
document.querySelector("#closeDialogButton").addEventListener("click", closeEditor);
document.querySelector("#cancelButton").addEventListener("click", closeEditor);
document.querySelector("#seedButton").addEventListener("click", addSamples);
elements.refreshPricesButton.addEventListener("click", () => refreshMarketPrices({ force: true }));

document.querySelectorAll(".nav-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    render();
  });
});

elements.search.addEventListener("input", render);
elements.rarity.addEventListener("change", render);
elements.sort.addEventListener("change", render);
elements.number.addEventListener("change", autofillCardByNumber);
elements.number.addEventListener("blur", autofillCardByNumber);
elements.psa10.addEventListener("input", clampPsaGrade);

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveFromForm();
});

elements.deleteButton.addEventListener("click", () => {
  const id = elements.cardId.value;
  cards = cards.filter((card) => card.id !== id);
  persist();
  closeEditor();
  render();
});

render();
refreshMarketPrices();

function loadCards() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function addSamples() {
  const existingNames = new Set(cards.map((card) => card.name));
  const freshSamples = sampleCards
    .filter((card) => !existingNames.has(card.name))
    .map((card) => ({ ...card, id: crypto.randomUUID(), createdAt: Date.now() + Math.random() }));

  cards = [...freshSamples, ...cards];
  persist();
  render();
}

function openEditor(card = null) {
  elements.form.reset();
  editorMarket = card?.market ?? null;
  elements.deleteButton.classList.toggle("hidden", !card);
  elements.dialogTitle.textContent = card ? "Upravit Pokemon kartu" : "Pridat Pokemon kartu";
  elements.cardId.value = card?.id ?? "";
  elements.name.value = card?.name ?? "";
  elements.series.value = card?.series ?? "";
  elements.number.value = card?.number ?? "";
  elements.rarityInput.value = card?.rarity ?? "Common";
  elements.status.value = card?.status ?? "owned";
  elements.value.value = getCardValue(card ?? {}) || "";
  elements.psa10.value = card?.psa10 || "";
  elements.image.value = card?.image ?? "";
  elements.note.value = card?.note ?? "";
  elements.dialog.showModal();
  elements.name.focus();
}

function closeEditor() {
  elements.dialog.close();
}

function saveFromForm() {
  const id = elements.cardId.value || crypto.randomUUID();
  const existing = cards.find((card) => card.id === id);
  const nextCard = {
    id,
    name: elements.name.value.trim(),
    series: elements.series.value.trim(),
    number: elements.number.value.trim(),
    rarity: elements.rarityInput.value,
    status: elements.status.value,
    value: Number(elements.value.value || existing?.value || 0),
    psa10: clampNumber(Number(elements.psa10.value || 0), 0, 10),
    image: elements.image.value.trim(),
    note: elements.note.value.trim(),
    market: editorMarket ?? existing?.market ?? marketFromFormValue(),
    createdAt: existing?.createdAt ?? Date.now(),
  };

  cards = existing ? cards.map((card) => (card.id === id ? nextCard : card)) : [nextCard, ...cards];
  persist();
  closeEditor();
  render();
  editorMarket = null;
}

function render() {
  const filtered = getVisibleCards();
  renderStats();
  elements.grid.innerHTML = filtered.map(cardTemplate).join("");
  elements.emptyState.classList.toggle("hidden", filtered.length > 0);

  elements.grid.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", () => {
      const card = cards.find((item) => item.id === button.dataset.id);
      openEditor(card);
    });
  });
}

function getVisibleCards() {
  const query = elements.search.value.trim().toLowerCase();
  const rarity = elements.rarity.value;
  const sortBy = elements.sort.value;

  return cards
    .filter((card) => activeView === "all" || card.status === activeView)
    .filter((card) => rarity === "all" || card.rarity === rarity)
    .filter((card) => {
      const haystack = `${card.name} ${card.series} ${card.number} ${card.note}`.toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "sk");
      if (sortBy === "value") return b.value - a.value;
      return b.createdAt - a.createdAt;
    });
}

function renderStats() {
  const total = cards.length;
  const owned = cards.filter((card) => card.status === "owned").length;
  const missing = cards.filter((card) => card.status === "wishlist").length;
  const value = cards.reduce((sum, card) => sum + (card.status === "owned" ? getCardValue(card) : 0), 0);
  const completion = total ? Math.round((owned / total) * 100) : 0;

  elements.totalCount.textContent = total;
  elements.ownedCount.textContent = owned;
  elements.missingCount.textContent = missing;
  elements.valueCount.textContent = `${value.toLocaleString("sk-SK")} EUR`;
  elements.completionValue.textContent = `${completion}%`;
  elements.completionBar.style.width = `${completion}%`;
}

function cardTemplate(card) {
  const palette = rarityPalette[card.rarity] ?? rarityPalette.Common;
  const note = card.note || "Bez poznamky.";
  const number = card.number || "-";
  const image = card.image
    ? `<img src="${escapeAttr(card.image)}" alt="${escapeAttr(card.name)}" onerror="this.remove()" />`
    : `<div class="card-symbol" aria-hidden="true">${palette[2]}</div>`;

  return `
    <article class="card" style="--art-a: ${palette[0]}; --art-b: ${palette[1]}">
      <div class="card-art">
        <span class="status-pill">${statusLabels[card.status]}</span>
        <span class="rarity-pill">${card.rarity}</span>
        ${image}
      </div>
      <div class="card-body">
        <h3>${escapeHtml(card.name)}</h3>
        <div class="meta">
          <span>${escapeHtml(card.series)}</span>
          <span>${escapeHtml(number)}</span>
        </div>
        <p class="note">${escapeHtml(note)}</p>
        <div class="card-footer">
          <span class="value">${getCardValue(card).toLocaleString("sk-SK")} EUR</span>
          <button class="edit-button" type="button" data-id="${card.id}" aria-label="Upravit ${escapeAttr(card.name)}">Edit</button>
        </div>
        <div class="market-row">
          <span>CM low: <strong>${formatPrice(card.market?.lowPrice)}</strong></span>
          <span>Trend: <strong>${formatPrice(card.market?.trendPrice)}</strong></span>
        </div>
        <div class="market-row">
          <span>Avg 30d: <strong>${formatPrice(card.market?.avg30)}</strong></span>
          <span>PSA: <strong>${card.psa10 ? `${card.psa10}/10` : "-"}</strong></span>
        </div>
        <p class="market-date">${marketDate(card)}</p>
      </div>
    </article>
  `;
}

function getCardValue(card) {
  return Number(card.market?.lowPrice || card.value || 0);
}

function marketFromFormValue() {
  const value = Number(elements.value.value || 0);
  if (!value) return null;
  return {
    lowPrice: value,
    trendPrice: 0,
    avg1: 0,
    avg7: 0,
    avg30: 0,
    updatedAt: "manual",
    checkedAt: Date.now(),
  };
}

function formatPrice(value) {
  const number = Number(value || 0);
  return number ? `${number.toLocaleString("sk-SK")} EUR` : "-";
}

function marketDate(card) {
  if (!card.market?.updatedAt) return "Ceny z trhu este neboli nacitane.";
  return `Cardmarket aktualizovane: ${card.market.updatedAt}`;
}

async function refreshMarketPrices({ force = false } = {}) {
  if (!cards.length) return;

  const shouldSkip = !force && cards.every((card) => {
    const checkedAt = card.market?.checkedAt || 0;
    return Date.now() - checkedAt < 1000 * 60 * 60 * 12;
  });

  if (shouldSkip) return;

  elements.priceStatus.textContent = "Nacitavam Cardmarket ceny...";
  elements.refreshPricesButton.disabled = true;

  let updated = 0;
  for (const card of cards) {
    const market = await fetchCardMarket(card);
    if (market) {
      card.market = market;
      updated += 1;
    } else {
      card.market = { ...(card.market || {}), checkedAt: Date.now(), error: true };
    }
  }

  persist();
  render();
  elements.refreshPricesButton.disabled = false;
  elements.priceStatus.textContent = updated
    ? `Aktualizovane Cardmarket ceny pre ${updated} kariet.`
    : "Ceny sa nepodarilo nacitat. Skus neskor alebo upresni nazov/set karty.";
}

async function fetchCardMarket(card) {
  try {
    const query = buildSearchQuery(card);
    const response = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}&pageSize=1`);
    if (!response.ok) return null;
    const payload = await response.json();
    const match = payload.data?.[0];
    const prices = match?.cardmarket?.prices;
    if (!prices) return null;

    return marketFromApiCard(match);
  } catch {
    return null;
  }
}

async function autofillCardByNumber() {
  const number = elements.number.value.trim();
  if (!number) return;

  const currentId = elements.cardId.value;
  const existing = currentId ? cards.find((card) => card.id === currentId) : null;
  const typedName = elements.name.value.trim();
  const query = typedName
    ? `number:"${number.split("/")[0]}" name:"${typedName.replaceAll('"', '\\"')}"`
    : `number:"${number.split("/")[0]}"`;

  elements.number.dataset.loading = "true";
  elements.number.title = "Hladam kartu...";

  try {
    const response = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}&pageSize=1`);
    if (!response.ok) return;
    const payload = await response.json();
    const match = payload.data?.[0];
    if (!match) return;

    const prices = match.cardmarket?.prices;
    elements.name.value = elements.name.value.trim() || match.name || "";
    elements.series.value = match.set?.name || elements.series.value;
    elements.number.value = match.number || number;
    elements.rarityInput.value = normalizeRarity(match.rarity);
    elements.image.value = match.images?.small || elements.image.value;

    if (prices?.lowPrice) {
      elements.value.value = prices.lowPrice;
      editorMarket = marketFromApiCard(match);
    }

    if (existing) {
      existing.market = editorMarket ?? existing.market;
    }
  } finally {
    elements.number.dataset.loading = "false";
    elements.number.title = "";
  }
}

function marketFromApiCard(match) {
  const prices = match.cardmarket?.prices;
  if (!prices) return null;
  return {
    cardId: match.id,
    cardmarketUrl: match.cardmarket.url,
    imageUrl: match.images?.small || "",
    lowPrice: prices.lowPrice || 0,
    trendPrice: prices.trendPrice || 0,
    avg1: prices.avg1 || 0,
    avg7: prices.avg7 || 0,
    avg30: prices.avg30 || 0,
    updatedAt: match.cardmarket.updatedAt,
    checkedAt: Date.now(),
  };
}

function normalizeRarity(rarity) {
  if (!rarity) return "Common";
  if (rarity.includes("Ultra")) return "Ultra Rare";
  if (rarity.includes("Holo")) return "Holo Rare";
  if (rarity.includes("Uncommon")) return "Uncommon";
  if (rarity.includes("Rare")) return "Rare";
  return "Common";
}

function clampPsaGrade() {
  if (!elements.psa10.value) return;
  elements.psa10.value = clampNumber(Number(elements.psa10.value), 1, 10);
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function buildSearchQuery(card) {
  const parts = [`name:"${card.name.replaceAll('"', '\\"')}"`];
  if (card.number) parts.push(`number:"${card.number.split("/")[0]}"`);
  return parts.join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
