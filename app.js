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
    quantity: 1,
    condition: "Near Mint",
    finish: "Holofoil",
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
    quantity: 0,
    condition: "Near Mint",
    finish: "Holofoil",
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
    quantity: 1,
    condition: "Near Mint",
    finish: "Holofoil",
    note: "Holo verzia do albumu.",
  },
  {
    name: "Bulbasaur",
    series: "Scarlet & Violet",
    number: "001/198",
    rarity: "Common",
    status: "binder",
    value: 2,
    psa10: 0,
    quantity: 1,
    condition: "Excellent",
    finish: "Normal",
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
    quantity: 1,
    condition: "Near Mint",
    finish: "Holofoil",
    note: "Oblubeny Pokemon v zbierke.",
  },
];

const rarityOptions = [
  { label: "Zakladne rarity", options: ["Common", "Uncommon", "Rare"] },
  {
    label: "Holo varianty",
    options: [
      "Holo Rare",
      "Reverse Holo",
      "Cosmos Holo",
      "Cracked Ice Holo",
      "Mirror Holo",
      "Confetti Holo",
      "Crosshatch Holo",
      "Galaxy Holo",
      "Stamped Holo",
    ],
  },
  {
    label: "Moderne rarity",
    options: ["Rare Holo", "Double Rare", "Ultra Rare", "Illustration Rare", "Special Illustration Rare", "Hyper Rare", "Ace Spec"],
  },
  {
    label: "Full Art",
    options: ["Full Art Pokemon", "Full Art Trainer", "Alternate Art", "Alt Art Trainer", "Textured Full Art"],
  },
  {
    label: "EX / GX / V ery",
    options: [
      "Pokemon ex (2003 era)",
      "Pokemon EX",
      "Mega EX",
      "BREAK",
      "Prism Star",
      "GX",
      "Tag Team GX",
      "Rainbow Rare",
      "Secret Rare GX",
      "Pokemon V",
      "VMAX",
      "VSTAR",
      "V-UNION",
      "Amazing Rare",
      "Trainer Gallery",
      "Galarian Gallery",
      "Pokemon ex",
    ],
  },
  {
    label: "Shiny kategorie",
    options: ["Shiny Vault", "Shiny Rare", "Radiant Pokemon", "Shining Pokemon"],
  },
  {
    label: "Gallery",
    options: ["Trainer Gallery Rare Holo", "Galarian Gallery Rare Holo"],
  },
  {
    label: "Japanese 151",
    options: ["Poke Ball Reverse Holo", "Master Ball Reverse Holo"],
  },
  {
    label: "Secret rarity",
    options: ["Secret Rare", "Rainbow Secret Rare", "Gold Secret Rare", "Black Gold Rare"],
  },
];

const flatRarityOptions = rarityOptions.flatMap((group) => group.options);

const rarityPalette = {
  Common: ["#f2d14b", "#2c77bf", "C"],
  Uncommon: ["#5fbf75", "#2e7a58", "U"],
  Rare: ["#3b69a8", "#1f3b77", "R"],
  "Holo Rare": ["#6fd3f5", "#7b4eb2", "H"],
  "Reverse Holo": ["#82d7ff", "#7d8ca8", "RH"],
  "Rare Holo": ["#6fd3f5", "#7b4eb2", "H"],
  "Double Rare": ["#c9d4e8", "#4272bd", "DR"],
  "Ultra Rare": ["#f0b22e", "#d93b4a", "UR"],
  "Illustration Rare": ["#f1c542", "#3b8d6f", "IR"],
  "Special Illustration Rare": ["#f0b22e", "#8d4ca5", "SIR"],
  "Master Ball Reverse Holo": ["#d84045", "#172238", "MB"],
  "Poke Ball Reverse Holo": ["#f2d14b", "#d84045", "PB"],
  "Secret Rare": ["#172238", "#f0b22e", "SR"],
  "Gold Secret Rare": ["#f1c542", "#8d6b18", "G"],
};

const statusLabels = {
  owned: "Mam",
  wishlist: "Chcem",
  binder: "Binder",
};

let cards = loadCards();
let activeView = "all";
let editorMarket = null;
let autofillTimer = null;
let lastAutofillKey = "";
let searchTimer = null;
let lastRemoteSearch = "";

const elements = {
  grid: document.querySelector("#cardsGrid"),
  emptyState: document.querySelector("#emptyState"),
  searchResults: document.querySelector("#searchResults"),
  resultGrid: document.querySelector("#resultGrid"),
  clearResultsButton: document.querySelector("#clearResultsButton"),
  binderView: document.querySelector("#binderView"),
  binderGrid: document.querySelector("#binderGrid"),
  binderCount: document.querySelector("#binderCount"),
  binderPages: document.querySelector("#binderPages"),
  search: document.querySelector("#searchInput"),
  rarity: document.querySelector("#rarityFilter"),
  sort: document.querySelector("#sortSelect"),
  dialog: document.querySelector("#cardDialog"),
  form: document.querySelector("#cardForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  cardId: document.querySelector("#cardId"),
  selectedSummary: document.querySelector("#selectedSummary"),
  name: document.querySelector("#nameInput"),
  series: document.querySelector("#seriesInput"),
  number: document.querySelector("#numberInput"),
  lookupCardButton: document.querySelector("#lookupCardButton"),
  rarityInput: document.querySelector("#rarityInput"),
  status: document.querySelector("#statusInput"),
  quantity: document.querySelector("#quantityInput"),
  condition: document.querySelector("#conditionInput"),
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
  portfolioValue: document.querySelector("#portfolioValue"),
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

elements.search.addEventListener("input", () => {
  render();
  scheduleRemoteSearch();
});
elements.clearResultsButton.addEventListener("click", clearRemoteResults);
elements.rarity.addEventListener("change", render);
elements.sort.addEventListener("change", render);
elements.number.addEventListener("input", scheduleCardAutofill);
elements.number.addEventListener("change", () => autofillCardByNumber({ force: true }));
elements.number.addEventListener("blur", () => autofillCardByNumber({ force: true }));
elements.lookupCardButton.addEventListener("click", () => autofillCardByNumber({ force: true, allowPartial: true }));
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

populateRaritySelects();
render();
refreshMarketPrices();

function loadCards() {
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []).map((card) => ({
      ...card,
      status: card.status === "trade" ? "binder" : card.status,
    }));
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function populateRaritySelects() {
  elements.rarity.innerHTML = `<option value="all">Vsetky rarity</option>${rarityOptionMarkup()}`;
  elements.rarityInput.innerHTML = rarityOptionMarkup();
}

function rarityOptionMarkup() {
  return rarityOptions
    .map((group) => `
      <optgroup label="${escapeAttr(group.label)}">
        ${group.options.map((option) => `<option value="${escapeAttr(option)}">${escapeHtml(option)}</option>`).join("")}
      </optgroup>
    `)
    .join("");
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
  elements.deleteButton.classList.toggle("hidden", !card || card.isDraft);
  elements.dialogTitle.textContent = card && !card.isDraft ? "Upravit Pokemon kartu" : "Pridat Pokemon kartu";
  elements.cardId.value = card?.isDraft ? "" : card?.id ?? "";
  elements.name.value = card?.name ?? "";
  elements.series.value = card?.series ?? "";
  elements.selectedSummary.textContent = card?.series
    ? `${card.name || "Karta"} / ${card.series} / ${card.number || "-"}`
    : "Vyber kartu z vysledkov hladania alebo dopln udaje rucne.";
  elements.number.value = card?.number ?? "";
  ensureRarityOption(card?.rarity);
  elements.rarityInput.value = card?.rarity ?? "Common";
  elements.rarityInput.disabled = Boolean(card?.fromApi);
  elements.status.value = card?.status ?? "owned";
  elements.quantity.value = card?.quantity ?? (card?.status === "wishlist" ? 0 : 1);
  elements.condition.value = card?.condition ?? "Near Mint";
  elements.value.value = getCardValue(card ?? {}) || "";
  elements.psa10.value = card?.psa10 || "";
  elements.image.value = card?.image ?? "";
  elements.note.value = card?.note ?? "";
  elements.dialog.showModal();
  elements.name.focus();
}

function closeEditor() {
  elements.rarityInput.disabled = false;
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
    quantity: clampNumber(Number(elements.quantity.value || 0), 0, 999),
    condition: elements.condition.value,
    finish: cardFinishFromRarity(elements.rarityInput.value),
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
  const isBinder = activeView === "binder";
  elements.binderView.classList.toggle("hidden", !isBinder);
  elements.grid.classList.toggle("hidden", isBinder);
  elements.emptyState.classList.toggle("hidden", isBinder || filtered.length > 0);
  elements.grid.innerHTML = isBinder ? "" : filtered.map(cardTemplate).join("");
  renderBinder();

  elements.grid.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", () => {
      const card = cards.find((item) => item.id === button.dataset.id);
      openEditor(card);
    });
  });

  elements.binderGrid.querySelectorAll(".binder-slot").forEach((button) => {
    button.addEventListener("click", () => {
      const card = cards.find((item) => item.id === button.dataset.id);
      openEditor(card);
    });
  });
}

function scheduleRemoteSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(runRemoteSearch, 450);
}

async function runRemoteSearch() {
  const query = elements.search.value.trim();
  if (query.length < 2) {
    clearRemoteResults();
    return;
  }

  if (query === lastRemoteSearch) return;
  lastRemoteSearch = query;

  elements.searchResults.classList.remove("hidden");
  elements.resultGrid.innerHTML = `<p class="result-message">Hladam moznosti...</p>`;

  const results = await searchCards(query);
  if (!results.length) {
    elements.resultGrid.innerHTML = `<p class="result-message">Nenasiel som ziadne karty. Skus nazov, set alebo cele cislo.</p>`;
    return;
  }

  elements.resultGrid.innerHTML = results.map(resultTemplate).join("");
  elements.resultGrid.querySelectorAll(".result-card").forEach((button) => {
    button.addEventListener("click", () => {
      const card = results.find((item) => item.id === button.dataset.id);
      if (card) openEditor(cardFromApi(card));
    });
  });
}

function clearRemoteResults() {
  elements.searchResults.classList.add("hidden");
  elements.resultGrid.innerHTML = "";
  lastRemoteSearch = "";
}

async function searchCards(query) {
  try {
    const queries = buildSearchQueries(query);
    const seen = new Set();
    const found = [];

    for (const apiQuery of queries) {
      const response = await fetch(`${API_BASE}?q=${encodeURIComponent(apiQuery)}&pageSize=12`);
      if (!response.ok) continue;
      const payload = await response.json();
      for (const card of payload.data ?? []) {
        if (seen.has(card.id)) continue;
        seen.add(card.id);
        found.push(card);
      }
      if (found.length >= 12) break;
    }

    return found.slice(0, 12);
  } catch {
    return [];
  }
}

function buildSearchQueries(value) {
  const query = value.trim();
  const parsed = parseCardNumber(query);
  const parts = [];
  const textVariants = searchTextVariants(query);

  if (parsed.number) {
    const numberPart = `number:"${parsed.number}"`;
    if (parsed.total) {
      parts.push(`${numberPart} set.printedTotal:${parsed.total}`);
      parts.push(`${numberPart} set.total:${parsed.total}`);
    }
    parts.push(numberPart);
  }

  textVariants.forEach((variant) => {
    const safe = escapeApiQuery(variant);
    parts.push(`name:"${safe}*"`);
    parts.push(`name:"${safe}"`);
    parts.push(`set.name:"${safe}*"`);
    parts.push(`set.name:"${safe}"`);
  });

  return parts.filter((item, index, list) => item && list.indexOf(item) === index);
}

function searchTextVariants(value) {
  const trimmed = value.trim();
  if (!trimmed) return [];

  const lower = trimmed.toLowerCase();
  const title = lower.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
  const upper = trimmed.toUpperCase();
  return [trimmed, lower, title, upper].filter((item, index, list) => item && list.indexOf(item) === index);
}

function escapeApiQuery(value) {
  return value.replaceAll('"', '\\"');
}

function resultTemplate(card) {
  const prices = card.cardmarket?.prices;
  const img = card.images?.small || "";
  return `
    <button class="result-card" type="button" data-id="${escapeAttr(card.id)}">
      <span class="result-image">${img ? `<img src="${escapeAttr(img)}" alt="${escapeAttr(card.name)}" />` : ""}</span>
      <span class="result-info">
        <strong>${escapeHtml(card.name)}</strong>
        <span>${escapeHtml(card.set?.name || "-")}</span>
        <span>${escapeHtml(card.rarity || "Unknown")} / ${escapeHtml(card.number || "-")}${card.set?.printedTotal ? `/${card.set.printedTotal}` : ""}</span>
        <em>CM low: ${formatPrice(prices?.lowPrice)}</em>
      </span>
    </button>
  `;
}

function cardFromApi(match) {
  const market = marketFromApiCard(match);
  return {
    id: "",
    isDraft: true,
    fromApi: true,
    name: match.name || "",
    series: match.set?.name || "",
    number: match.set?.printedTotal ? `${match.number}/${match.set.printedTotal}` : match.number || "",
    rarity: normalizeRarity(match.rarity),
    status: "owned",
    quantity: 1,
    condition: "Near Mint",
    finish: cardFinishFromRarity(match.rarity),
    value: market?.lowPrice || 0,
    psa10: 0,
    image: match.images?.small || "",
    note: "",
    market,
    createdAt: Date.now(),
  };
}

function ensureRarityOption(rarity) {
  if (!rarity || flatRarityOptions.includes(rarity)) return;
  flatRarityOptions.push(rarity);
  const option = `<option value="${escapeAttr(rarity)}">${escapeHtml(rarity)}</option>`;
  elements.rarityInput.insertAdjacentHTML("beforeend", option);
  elements.rarity.insertAdjacentHTML("beforeend", option);
}

function getVisibleCards() {
  const query = elements.search.value.trim().toLowerCase();
  const rarity = elements.rarity.value;
  const sortBy = elements.sort.value;

  return cards
    .filter((card) => activeView === "all" || card.status === activeView || (activeView === "binder" && isBinderCard(card)))
    .filter((card) => rarity === "all" || card.rarity === rarity)
    .filter((card) => {
      const haystack = `${card.name} ${card.series} ${card.number} ${card.note}`.toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "sk");
      if (sortBy === "value") return getTrendValue(b) - getTrendValue(a);
      return b.createdAt - a.createdAt;
    });
}

function renderStats() {
  const total = cards.length;
  const ownedEntries = cards.filter((card) => card.status === "owned").length;
  const owned = cards
    .filter((card) => card.status === "owned")
    .reduce((sum, card) => sum + getQuantity(card), 0);
  const missing = cards.filter((card) => card.status === "wishlist").length;
  const value = cards.reduce((sum, card) => sum + (isPortfolioCard(card) ? getTrendValue(card) * getQuantity(card) : 0), 0);
  const completion = total ? Math.round((ownedEntries / total) * 100) : 0;

  elements.totalCount.textContent = total;
  elements.ownedCount.textContent = owned;
  elements.missingCount.textContent = missing;
  elements.valueCount.textContent = `${value.toLocaleString("sk-SK")} EUR`;
  elements.portfolioValue.textContent = `${value.toLocaleString("sk-SK")} EUR`;
  elements.completionValue.textContent = `${completion}%`;
  elements.completionBar.style.width = `${completion}%`;
}

function renderBinder() {
  if (activeView !== "binder") return;

  const binderCards = getBinderCards();
  const pageSize = 20;
  elements.binderCount.textContent = binderCards.length;
  elements.binderPages.textContent = Math.max(1, Math.ceil(binderCards.length / pageSize));
  elements.binderGrid.innerHTML = binderCards.length
    ? binderCards.slice(0, pageSize).map(binderCardTemplate).join("")
    : `<p class="result-message">Binder je prazdny. Pri pridavani nastav stav na Binder alebo pridaj karty do zbierky.</p>`;
}

function getBinderCards() {
  return cards.filter(isBinderCard);
}

function isBinderCard(card) {
  return card.status === "binder" || card.status === "owned";
}

function isPortfolioCard(card) {
  return card.status === "owned" || card.status === "binder";
}

function binderCardTemplate(card) {
  const image = card.image
    ? `<img src="${escapeAttr(card.image)}" alt="${escapeAttr(card.name)}" />`
    : `<span>${escapeHtml((card.name || "?").slice(0, 2).toUpperCase())}</span>`;

  return `
    <button class="binder-slot" type="button" data-id="${escapeAttr(card.id)}">
      <span class="binder-card-art">${image}</span>
      <strong>${escapeHtml(card.name)}</strong>
      <small>${escapeHtml(card.number || "-")}</small>
    </button>
  `;
}

function cardTemplate(card) {
  const palette = rarityPalette[card.rarity] ?? rarityPalette.Common;
  const note = card.note || "Bez poznamky.";
  const number = card.number || "-";
  const move = marketMove(card);
  const moveClass = move.value >= 0 ? "positive" : "negative";
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
        <p class="card-set">${escapeHtml(card.series)}</p>
        <p class="card-line">${escapeHtml(card.rarity)} / ${escapeHtml(number)}</p>
        <p class="card-line"><strong>${escapeHtml(card.condition ?? "Near Mint")}</strong> / ${escapeHtml(card.finish ?? cardFinishFromRarity(card.rarity))}</p>
        <p class="note">${escapeHtml(note)}</p>
        <div class="card-footer">
          <div>
            <span class="value">${(getTrendValue(card) * getQuantity(card)).toLocaleString("sk-SK")} EUR</span>
            <span class="market-move ${moveClass}">${move.label}</span>
          </div>
          <button class="edit-button" type="button" data-id="${card.id}" aria-label="Upravit ${escapeAttr(card.name)}">Edit</button>
        </div>
        <p class="qty-line">Qty: ${getQuantity(card)}</p>
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

function getTrendValue(card) {
  return Number(card.market?.trendPrice || card.market?.avg30 || card.market?.lowPrice || card.value || 0);
}

function getQuantity(card) {
  return Math.max(0, Number(card.quantity ?? (card.status === "wishlist" ? 0 : 1)));
}

function cardFinishFromRarity(rarity) {
  if (String(rarity || "").includes("Reverse")) return rarity;
  if (String(rarity || "").includes("Holo") || String(rarity || "").includes("Rare")) return "Holofoil";
  return "Normal";
}

function marketMove(card) {
  const low = Number(card.market?.lowPrice || 0);
  const trend = Number(card.market?.trendPrice || 0);
  if (!low || !trend) return { value: 0, label: "+ 0 EUR (0%)" };

  const diff = trend - low;
  const percent = low ? (diff / low) * 100 : 0;
  const sign = diff >= 0 ? "+" : "-";
  return {
    value: diff,
    label: `${sign} ${Math.abs(diff).toLocaleString("sk-SK", { maximumFractionDigits: 2 })} EUR (${Math.abs(percent).toFixed(2)}%)`,
  };
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

function scheduleCardAutofill() {
  clearTimeout(autofillTimer);
  autofillTimer = setTimeout(() => autofillCardByNumber(), 550);
}

async function autofillCardByNumber({ force = false, allowPartial = false } = {}) {
  const number = elements.number.value.trim();
  if (!number) return;

  const currentId = elements.cardId.value;
  const existing = currentId ? cards.find((card) => card.id === currentId) : null;
  const typedName = elements.name.value.trim();
  const typedSet = elements.series.value.trim();
  const parsedNumber = parseCardNumber(number);
  if (!parsedNumber.number) return;
  if (!allowPartial && !parsedNumber.total) return;

  const autofillKey = `${parsedNumber.number}|${parsedNumber.total}|${typedName}|${typedSet}`;
  if (!force && autofillKey === lastAutofillKey) return;
  lastAutofillKey = autofillKey;

  elements.number.dataset.loading = "true";
  elements.number.title = "Hladam kartu podla cisla...";

  try {
    const match = await findCardMatch(parsedNumber, typedName, typedSet);
    if (!match) {
      elements.priceStatus.textContent = "Toto cislo je nejednoznacne. Dopln aj nazov Pokemona alebo set.";
      return;
    }

    const prices = match.cardmarket?.prices;
    elements.name.value = elements.name.value.trim() || match.name || "";
    elements.series.value = elements.series.value.trim() || match.set?.name || "";
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

async function findCardMatch(parsedNumber, typedName, typedSet) {
  const queries = buildAutofillQueries(parsedNumber, typedName, typedSet);

  for (const query of queries) {
    const response = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}&pageSize=25`);
    if (!response.ok) continue;
    const payload = await response.json();
    const cards = payload.data ?? [];
    if (cards.length) return pickBestCard(cards, parsedNumber, typedName, typedSet);
  }

  return null;
}

function buildAutofillQueries(parsedNumber, typedName, typedSet) {
  const numberPart = `number:"${parsedNumber.number}"`;
  const namePart = typedName ? ` name:"${typedName.replaceAll('"', '\\"')}"` : "";
  const setPart = typedSet ? ` set.name:"${typedSet.replaceAll('"', '\\"')}"` : "";
  const totalPart = parsedNumber.total ? ` set.printedTotal:${parsedNumber.total}` : "";
  const totalFallbackPart = parsedNumber.total ? ` set.total:${parsedNumber.total}` : "";

  return [
    `${numberPart}${namePart}${setPart}${totalPart}`,
    `${numberPart}${namePart}${totalPart}`,
    `${numberPart}${namePart}${setPart}${totalFallbackPart}`,
    `${numberPart}${namePart}${totalFallbackPart}`,
    `${numberPart}${namePart}${setPart}`,
    `${numberPart}${namePart}`,
    numberPart,
  ].filter((query, index, list) => query.trim() && list.indexOf(query) === index);
}

function pickBestCard(results, parsedNumber, typedName, typedSet) {
  if (!typedName && !typedSet && isAmbiguousNumber(results, parsedNumber)) {
    return null;
  }

  const scored = results.map((card) => ({
    card,
    score:
      scoreTotal(card, parsedNumber.total) +
      scoreText(card.name, typedName, 6) +
      scoreText(card.set?.name, typedSet, 8) +
      scoreMarket(card) +
      scoreReleaseDate(card),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.card ?? null;
}

function isAmbiguousNumber(results, parsedNumber) {
  if (results.length <= 1) return false;

  const exactMatches = results.filter((card) => {
    const sameNumber = String(card.number || "").toLowerCase() === parsedNumber.number.toLowerCase();
    const sameTotal = parsedNumber.total
      ? Number(card.set?.printedTotal) === Number(parsedNumber.total) || Number(card.set?.total) === Number(parsedNumber.total)
      : true;
    return sameNumber && sameTotal;
  });

  return exactMatches.length > 1;
}

function scoreTotal(card, total) {
  if (!total) return 0;
  if (Number(card.set?.printedTotal) === Number(total)) return 16;
  if (Number(card.set?.total) === Number(total)) return 10;
  return 0;
}

function scoreText(value, typed, weight) {
  if (!typed) return 0;
  return String(value || "").toLowerCase().includes(typed.toLowerCase()) ? weight : 0;
}

function scoreMarket(card) {
  return card.cardmarket?.prices?.lowPrice ? 2 : 0;
}

function scoreReleaseDate(card) {
  const time = Date.parse((card.set?.releaseDate || "").replaceAll("/", "-"));
  return Number.isFinite(time) ? time / 1000000000000 : 0;
}

function parseCardNumber(value) {
  const [rawNumber = "", rawTotal = ""] = value.split("/");
  return {
    number: normalizeCardNumber(rawNumber),
    total: normalizeSetTotal(rawTotal),
  };
}

function normalizeCardNumber(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^0*(\d+)(.*)$/);
  if (!match) return trimmed;
  return `${match[1] || "0"}${match[2] || ""}`;
}

function normalizeSetTotal(value) {
  const digits = String(value || "").match(/\d+/)?.[0] || "";
  return digits ? String(Number(digits)) : "";
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
  const clean = rarity;
  const exact = flatRarityOptions.find((option) => option.toLowerCase() === clean.toLowerCase());
  if (exact) return exact;
  if (clean.includes("Trainer Gallery")) return "Trainer Gallery Rare Holo";
  if (clean.includes("Galarian Gallery")) return "Galarian Gallery Rare Holo";
  if (clean.includes("Special Illustration")) return "Special Illustration Rare";
  if (clean.includes("Illustration")) return "Illustration Rare";
  if (clean.includes("Hyper")) return "Hyper Rare";
  if (clean.includes("Rainbow")) return "Rainbow Rare";
  if (clean.includes("Secret")) return "Secret Rare";
  if (clean.includes("Ultra")) return "Ultra Rare";
  if (clean.includes("Double")) return "Double Rare";
  if (clean.includes("Holo")) return "Holo Rare";
  if (clean.includes("Uncommon")) return "Uncommon";
  if (clean.includes("Rare")) return "Rare";
  return clean;
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
