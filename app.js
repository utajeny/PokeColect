const STORAGE_KEY = "pokemon-card-collector-v1";
const BINDER_KEY = "pokemon-card-binder-marks-v1";
const BINDER_IMPORTS_KEY = "pokemon-card-binder-imports-v1";
const BINDER_EXTRAS_KEY = "pokemon-card-binder-extras-v1";
const API_BASE = "https://api.pokemontcg.io/v2/cards";
const SETS_API_BASE = "https://api.tcgdex.net/v2/en/sets";
const TCGDEX_CARD_API = "https://api.tcgdex.net/v2/en/cards";
const CLOUD_TABLE = "poke_profiles";
const SUPABASE_CONFIG = window.POKECOLECT_SUPABASE || {};

const grandmasterVariantPresets = {
  me02: [
    { number: "P01", name: "Oddish", variant: { key: "cosmosHolo", label: "Cosmos Holo", short: "Cosmos" } },
    { number: "P02", name: "Gloom", variant: { key: "cosmosHolo", label: "Cosmos Holo", short: "Cosmos" } },
    { number: "P03", name: "Whimsicott", variant: { key: "cosmosHolo", label: "Cosmos Holo", short: "Cosmos" } },
    { number: "P04", name: "Ceruledge", stamp: "Prerelease" },
    { number: "P05", name: "Cottonee", variant: { key: "cosmosHolo", label: "Cosmos Holo", short: "Cosmos" } },
    { number: "P06", name: "Vileplume", variant: { key: "cosmosHolo", label: "Cosmos Holo", short: "Cosmos" } },
    { number: "P07", name: "Weavile", variant: { key: "cosmosHolo", label: "Cosmos Holo", short: "Cosmos" } },
    { number: "P08", name: "Mega Charizard X ex", stamp: "Promo" },
    { number: "P09", name: "Oricorio ex", stamp: "Promo" },
    { number: "P10", name: "Zacian", stamp: "Prerelease" },
    { number: "P11", name: "Flygon", stamp: "Prerelease" },
    { number: "P12", name: "Toxtricity", stamp: "Prerelease" },
    { number: "P13", name: "Sneasel", variant: { key: "cosmosHolo", label: "Cosmos Holo", short: "Cosmos" } },
    { number: "P14", name: "Charcadet", stamp: "Promo" },
    { number: "P15", name: "Genesect", stamp: "Best Buy Exclusive" },
    { number: "P16", name: "Moltres", stamp: "Deck Exclusive" },
    { number: "P17", name: "Reshiram", stamp: "Stamped" },
    { number: "P18", name: "Charcadet", stamp: "Pokemon Center" },
    { number: "P19", name: "Suicune", stamp: "EB Games Exclusive" },
    { number: "P20", name: "Suicune", stamp: "Gamestop Exclusive" },
    { number: "P21", name: "Zacian", stamp: "Deck Exclusive" },
    { number: "P22", name: "Flygon", stamp: "Deck Exclusive" },
    { number: "P23", name: "Toxtricity", stamp: "Deck Exclusive" },
    { number: "P24", name: "Ceruledge", stamp: "Prerelease Staff" },
    { number: "P25", name: "Zacian", stamp: "Prerelease Staff" },
    { number: "P26", name: "Flygon", stamp: "Prerelease Staff" },
    { number: "P27", name: "Toxtricity", stamp: "Prerelease Staff" },
  ],
};

const binderForgeVariantOverrides = {
  me02: {
    omitVariants: {
      "014": ["holofoil"],
      "045": ["holofoil"],
      "053": ["holofoil"],
      "068": ["holofoil"],
    },
  },
};

const defaultBinderSets = [
  { id: "me03", name: "Perfect Order", apiId: "me3" },
  { id: "me02.5", name: "Ascended Heroes", apiId: "me2pt5" },
  { id: "me02", name: "Phantasmal Flames", apiId: "me2" },
  { id: "me01", name: "Mega Evolution", apiId: "me1" },
  { id: "sv10.5w", name: "White Flare", apiId: "rsv10pt5" },
  { id: "sv10.5b", name: "Black Bolt", apiId: "zsv10pt5" },
  { id: "sv10", name: "Destined Rivals" },
  { id: "sv09", name: "Journey Together", apiId: "sv9" },
  { id: "sv08.5", name: "Prismatic Evolutions", apiId: "sv8pt5" },
  { id: "sv08", name: "Surging Sparks", apiId: "sv8" },
  { id: "sv07", name: "Stellar Crown", apiId: "sv7" },
  { id: "sv06.5", name: "Shrouded Fable", apiId: "sv6pt5" },
  { id: "sv06", name: "Twilight Masquerade", apiId: "sv6" },
  { id: "sv05", name: "Temporal Forces", apiId: "sv5" },
  { id: "sv04.5", name: "Paldean Fates", apiId: "sv4pt5" },
  { id: "sv04", name: "Paradox Rift", apiId: "sv4" },
  { id: "sv03.5", name: "151", apiId: "sv3pt5" },
  { id: "sv03", name: "Obsidian Flames", apiId: "sv3" },
  { id: "sv02", name: "Paldea Evolved", apiId: "sv2" },
  { id: "sv01", name: "Scarlet & Violet", apiId: "sv1" },
  { id: "swsh12", name: "Silver Tempest" },
  { id: "swsh11", name: "Lost Origin" },
  { id: "swsh10", name: "Astral Radiance" },
  { id: "swsh9", name: "Brilliant Stars" },
];

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

let cards = [];
let binderMarks = {};
let binderImports = [];
let binderExtras = {};
let activeView = "all";
let editorMarket = null;
let autofillTimer = null;
let lastAutofillKey = "";
let searchTimer = null;
let lastRemoteSearch = "";
let binderCards = [];
let binderSets = [...defaultBinderSets];
let binderPage = 1;
let binderSetId = defaultBinderSets[0].id;
let supabaseClient = null;
let currentUser = null;
let cloudSaveTimer = null;
let isLoadingCloud = false;

const elements = {
  grid: document.querySelector("#cardsGrid"),
  emptyState: document.querySelector("#emptyState"),
  searchResults: document.querySelector("#searchResults"),
  resultGrid: document.querySelector("#resultGrid"),
  clearResultsButton: document.querySelector("#clearResultsButton"),
  binderView: document.querySelector("#binderView"),
  binderGrid: document.querySelector("#binderGrid"),
  binderSetSelect: document.querySelector("#binderSetSelect"),
  binderCount: document.querySelector("#binderCount"),
  binderOwnedCount: document.querySelector("#binderOwnedCount"),
  binderProgress: document.querySelector("#binderProgress"),
  binderSource: document.querySelector("#binderSource"),
  binderPages: document.querySelector("#binderPages"),
  binderPrevButton: document.querySelector("#binderPrevButton"),
  binderNextButton: document.querySelector("#binderNextButton"),
  binderPageLabel: document.querySelector("#binderPageLabel"),
  binderBreakdown: document.querySelector("#binderBreakdown"),
  binderImportName: document.querySelector("#binderImportName"),
  binderImportInput: document.querySelector("#binderImportInput"),
  binderImportButton: document.querySelector("#binderImportButton"),
  binderImportStatus: document.querySelector("#binderImportStatus"),
  binderTargetCount: document.querySelector("#binderTargetCount"),
  binderTargetButton: document.querySelector("#binderTargetButton"),
  binderStampedPresetButton: document.querySelector("#binderStampedPresetButton"),
  binderTargetStatus: document.querySelector("#binderTargetStatus"),
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
  marketMovers: document.querySelector("#marketMovers"),
  completionValue: document.querySelector("#completionValue"),
  completionBar: document.querySelector("#completionBar"),
  authForm: document.querySelector("#authForm"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  authStatus: document.querySelector("#authStatus"),
  signupButton: document.querySelector("#signupButton"),
  logoutButton: document.querySelector("#logoutButton"),
  authLock: document.querySelector("#authLock"),
  authRequired: [...document.querySelectorAll("[data-auth-required]")],
  privateSections: [...document.querySelectorAll(".private-section")],
};

document.querySelector("#openFormButton").addEventListener("click", () => openEditor());
document.querySelector("#emptyAddButton").addEventListener("click", () => openEditor());
document.querySelector("#closeDialogButton").addEventListener("click", closeEditor);
document.querySelector("#cancelButton").addEventListener("click", closeEditor);
document.querySelector("#seedButton").addEventListener("click", addSamples);
elements.refreshPricesButton.addEventListener("click", () => refreshMarketPrices({ force: true }));
elements.authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signIn();
});
elements.signupButton.addEventListener("click", signUp);
elements.logoutButton.addEventListener("click", signOut);

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
elements.binderSetSelect.addEventListener("change", () => {
  binderSetId = elements.binderSetSelect.value;
  binderPage = 1;
  loadBinderSet();
});
elements.binderPrevButton.addEventListener("click", () => {
  binderPage = Math.max(1, binderPage - 1);
  renderBinder();
});
elements.binderNextButton.addEventListener("click", () => {
  const pages = getBinderPageCount();
  binderPage = Math.min(pages, binderPage + 1);
  renderBinder();
});
elements.binderImportButton.addEventListener("click", importBinderList);
elements.binderStampedPresetButton.addEventListener("click", applyStampedGrandmasterPreset);
elements.binderTargetButton.addEventListener("click", applyBinderTargetCount);

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
populateBinderSets();
updateAuthUi();
initAuth();

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
  writeUserStorage(STORAGE_KEY, cards);
  queueCloudSave();
}

function loadBinderMarks() {
  try {
    return JSON.parse(localStorage.getItem(BINDER_KEY)) ?? {};
  } catch {
    return {};
  }
}

function persistBinderMarks() {
  writeUserStorage(BINDER_KEY, binderMarks);
  queueCloudSave();
}

function loadBinderImports() {
  try {
    return JSON.parse(localStorage.getItem(BINDER_IMPORTS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function persistBinderImports() {
  writeUserStorage(BINDER_IMPORTS_KEY, binderImports);
  queueCloudSave();
}

function loadBinderExtras() {
  try {
    return JSON.parse(localStorage.getItem(BINDER_EXTRAS_KEY)) ?? {};
  } catch {
    return {};
  }
}

function persistBinderExtras() {
  writeUserStorage(BINDER_EXTRAS_KEY, binderExtras);
  queueCloudSave();
}

async function initAuth() {
  if (!isSupabaseConfigured()) {
    elements.authStatus.textContent = "Cloud login este nie je nastaveny";
    updateAuthUi();
    render();
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthUi();
  if (currentUser) {
    await loadCloudProfile();
    refreshMarketPrices();
  } else {
    render();
  }

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    updateAuthUi();
    if (currentUser) {
      await loadCloudProfile();
      refreshMarketPrices();
    } else {
      clearPrivateState();
      render();
    }
  });
}

function isSupabaseConfigured() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && window.supabase);
}

async function signIn() {
  if (!isSupabaseConfigured()) {
    elements.authStatus.textContent = "Najprv nastav Supabase v auth-config.js";
    return;
  }
  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;
  if (!email || !password) {
    elements.authStatus.textContent = "Zadaj email aj heslo";
    return;
  }
  elements.authStatus.textContent = "Prihlasujem...";
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) elements.authStatus.textContent = error.message;
}

async function signUp() {
  if (!isSupabaseConfigured()) {
    elements.authStatus.textContent = "Najprv nastav Supabase v auth-config.js";
    return;
  }
  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;
  if (!email || password.length < 6) {
    elements.authStatus.textContent = "Heslo musi mat aspon 6 znakov";
    return;
  }
  elements.authStatus.textContent = "Vytvaram ucet...";
  const { error } = await supabaseClient.auth.signUp({ email, password });
  elements.authStatus.textContent = error ? error.message : "Ucet vytvoreny. Ak pride email, potvrd ho a potom sa prihlas.";
}

async function signOut() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
}

function updateAuthUi() {
  const signedIn = Boolean(currentUser);
  const configured = isSupabaseConfigured();
  elements.authRequired.forEach((element) => {
    element.disabled = !signedIn;
    element.classList.toggle("hidden", !signedIn);
  });
  elements.privateSections.forEach((section) => {
    section.classList.toggle("hidden", !signedIn);
  });
  elements.authLock.classList.toggle("hidden", signedIn);
  elements.authEmail.classList.toggle("hidden", signedIn);
  elements.authPassword.classList.toggle("hidden", signedIn);
  elements.signupButton.classList.toggle("hidden", signedIn);
  elements.authForm.querySelector("#loginButton").classList.toggle("hidden", signedIn);
  elements.logoutButton.classList.toggle("hidden", !signedIn);
  if (signedIn) {
    elements.authStatus.textContent = currentUser.email || "Prihlaseny";
  } else if (!configured) {
    elements.authStatus.textContent = "Cloud login este nie je nastaveny";
  } else {
    elements.authStatus.textContent = "Neprihlaseny";
  }
}

async function loadCloudProfile() {
  if (!supabaseClient || !currentUser) return;
  isLoadingCloud = true;
  elements.authStatus.textContent = "Nacitavam zbierku...";
  const { data, error } = await supabaseClient
    .from(CLOUD_TABLE)
    .select("data")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error) {
    elements.authStatus.textContent = `Cloud chyba: ${error.message}`;
    isLoadingCloud = false;
    render();
    return;
  }

  applyProfileData(data?.data || loadUserProfileCache());
  writeProfileCache();
  if (!data?.data) await saveCloudProfile();
  isLoadingCloud = false;
  elements.authStatus.textContent = currentUser.email || "Prihlaseny";
  populateBinderSets();
  render();
}

function loadUserProfileCache() {
  return {
    cards: readUserStorage(STORAGE_KEY, []),
    binderMarks: readUserStorage(BINDER_KEY, {}),
    binderImports: readUserStorage(BINDER_IMPORTS_KEY, []),
    binderExtras: readUserStorage(BINDER_EXTRAS_KEY, {}),
  };
}

function applyProfileData(data) {
  cards = Array.isArray(data.cards) ? data.cards : [];
  binderMarks = data.binderMarks || {};
  binderImports = Array.isArray(data.binderImports) ? data.binderImports : [];
  binderExtras = data.binderExtras || {};
}

function clearPrivateState() {
  cards = [];
  binderMarks = {};
  binderImports = [];
  binderExtras = {};
  binderCards = [];
}

function profileSnapshot() {
  return { cards, binderMarks, binderImports, binderExtras };
}

function userStorageKey(key) {
  return currentUser ? `${key}:${currentUser.id}` : key;
}

function readUserStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(userStorageKey(key))) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeUserStorage(key, value) {
  if (!currentUser) return;
  localStorage.setItem(userStorageKey(key), JSON.stringify(value));
}

function writeProfileCache() {
  writeUserStorage(STORAGE_KEY, cards);
  writeUserStorage(BINDER_KEY, binderMarks);
  writeUserStorage(BINDER_IMPORTS_KEY, binderImports);
  writeUserStorage(BINDER_EXTRAS_KEY, binderExtras);
}

function queueCloudSave() {
  if (isLoadingCloud || !supabaseClient || !currentUser) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(saveCloudProfile, 500);
}

async function saveCloudProfile() {
  if (!supabaseClient || !currentUser) return;
  writeProfileCache();
  const { error } = await supabaseClient.from(CLOUD_TABLE).upsert({
    user_id: currentUser.id,
    data: profileSnapshot(),
    updated_at: new Date().toISOString(),
  });
  if (error) {
    elements.authStatus.textContent = `Ukladanie zlyhalo: ${error.message}`;
  }
}

async function populateBinderSets() {
  const importedSets = binderImports.map((set) => ({ ...set, imported: true }));
  const merged = mergeBinderSets(importedSets, defaultBinderSets, cardsToBinderSets(cards));
  renderBinderSetOptions(merged);

  try {
    const response = await fetch(SETS_API_BASE);
    const payload = response.ok ? await response.json() : { data: [] };
    const allSets = Array.isArray(payload) ? payload : payload.data ?? [];
    const remoteSets = allSets
      .filter((set) => !String(set.id || "").startsWith("A") && !String(set.id || "").startsWith("B"))
      .slice(-120)
      .reverse()
      .map((set) => ({
        id: set.id,
        name: set.name,
        apiId: tcgdexToPokemonApiSetId(set.id),
        cardCount: set.cardCount,
      }));
    renderBinderSetOptions(mergeBinderSets(importedSets, remoteSets, merged));
  } catch {
    renderBinderSetOptions(merged);
  }
}

function cardsToBinderSets(collectionCards) {
  return collectionCards
    .map((card) => {
      const apiId = getCardSetId(card);
      return { id: pokemonApiToTcgdexSetId(apiId), name: card.series || apiId, apiId };
    })
    .filter((set) => set.id);
}

function mergeBinderSets(...setGroups) {
  const seen = new Set();
  return setGroups.flat().filter((set) => {
    if (!set.id || seen.has(set.id)) return false;
    seen.add(set.id);
    return true;
  });
}

function renderBinderSetOptions(sets) {
  binderSets = sets;
  if (!sets.some((set) => set.id === binderSetId)) binderSetId = sets[0]?.id || defaultBinderSets[0].id;
  cards.forEach((card) => {
    const apiId = getCardSetId(card);
    const setId = pokemonApiToTcgdexSetId(apiId);
    if (!setId || binderSets.some((set) => set.id === setId)) return;
    binderSets.push({ id: setId, name: card.series || setId, apiId });
  });
  elements.binderSetSelect.innerHTML = binderSets
    .map((set) => `<option value="${escapeAttr(set.id)}">${escapeHtml(set.name)}</option>`)
    .join("");
  elements.binderSetSelect.value = binderSetId;
}

function importBinderList() {
  if (!requireLogin()) return;
  const raw = elements.binderImportInput.value.trim();
  if (!raw) {
    elements.binderImportStatus.textContent = "Najprv vloz skopirovany zoznam.";
    return;
  }

  const entries = parseBinderImport(raw);
  if (!entries.length) {
    elements.binderImportStatus.textContent = "Nenasiel som karty. Skus format: 001 Bulbasaur normal.";
    return;
  }

  const id = `import-${Date.now()}`;
  const name = elements.binderImportName.value.trim() || `Imported binder ${new Date().toLocaleDateString("sk-SK")}`;
  binderImports = [{ id, name, imported: true, entries }, ...binderImports.filter((set) => set.name !== name)].slice(0, 12);
  persistBinderImports();
  binderSetId = id;
  binderPage = 1;
  elements.binderImportStatus.textContent = `Importovane: ${entries.length} slotov.`;
  populateBinderSets();
  loadBinderSet();
}

function applyBinderTargetCount() {
  if (!requireLogin()) return;
  const target = Number(elements.binderTargetCount.value || 0);
  if (!target || target <= binderCards.length) {
    elements.binderTargetStatus.textContent = `Zadaj cislo vacsie ako aktualnych ${binderCards.length} slotov.`;
    return;
  }

  const selectedSet = binderSets.find((set) => set.id === binderSetId);
  const count = target - binderCards.length;
  binderExtras[binderSetId] = Array.from({ length: count }, (_, index) => ({
    id: `${binderSetId}-extra-${index + 1}`,
    number: `EX${String(index + 1).padStart(2, "0")}`,
    name: `${selectedSet?.name || "Set"} extra ${index + 1}`,
    variant: { key: "grandmasterExtra", label: "Grandmaster Extra", short: "Extra" },
  }));
  persistBinderExtras();
  elements.binderTargetStatus.textContent = `Doplnene na ${target} slotov.`;
  loadBinderSet();
}

function applyStampedGrandmasterPreset() {
  if (!requireLogin()) return;
  const preset = grandmasterVariantPresets[binderSetId] || [];
  if (!preset.length) {
    elements.binderTargetStatus.textContent = "Pre tento set este nemam stamped/cosmos preset.";
    return;
  }

  const presetEntries = preset.map((entry) => grandmasterPresetEntry(entry));
  const nextExtras =
    binderSetId === "me02"
      ? presetEntries
      : [
          ...(binderExtras[binderSetId] || []).filter((extra) => extra.variant?.key !== "grandmasterExtra"),
          ...presetEntries,
        ];

  binderExtras[binderSetId] = nextExtras;
  persistBinderExtras();
  elements.binderTargetStatus.textContent = `Nastavene stamped/cosmos sloty: ${nextExtras.length}.`;
  loadBinderSet();
}

function grandmasterPresetEntry(entry) {
  const variant = entry.variant || { key: "stamped", label: entry.stamp, short: "Stamp" };
  return {
    id: `${binderSetId}-${entry.number}-${variant.label}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    number: entry.number,
    name: entry.name,
    image: entry.image || "",
    variant,
  };
}

function parseBinderImport(raw) {
  const byKey = new Map();
  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => parseBinderImportLine(line).forEach((entry) => byKey.set(`${entry.number}-${entry.variant.key}-${entry.name}`, entry)));
  return [...byKey.values()].sort((a, b) => normalizeCardNumber(a.number).localeCompare(normalizeCardNumber(b.number), undefined, { numeric: true }));
}

function parseBinderImportLine(line) {
  const entries = [];
  const idMatches = [...line.matchAll(/([a-z0-9.]+)-(\d{1,4}[a-z]?)-(normal|reverse|holo|holofoil|masterball|master-ball|pokeball|poke-ball)/gi)];
  idMatches.forEach((match) => {
    entries.push({
      id: match[0],
      number: match[2],
      name: compactCardName(line.replace(match[0], "")) || `Card ${match[2]}`,
      variant: importVariantFromText(match[3]),
    });
  });
  if (entries.length) return entries;

  const textMatch = line.match(/#?\s*(\d{1,4}[a-z]?)\s+(.+?)(?:\s+[-/]\s+|\s+)(normal|holofoil|holo|reverse holo|reverse|master ball|poke ball|pokeball|masterball|mb|pb)$/i);
  if (!textMatch) return [];
  return [
    {
      id: `${textMatch[1]}-${textMatch[3]}`,
      number: textMatch[1],
      name: compactCardName(textMatch[2]),
      variant: importVariantFromText(textMatch[3]),
    },
  ];
}

function compactCardName(value) {
  return String(value || "")
    .replace(/\b(normal|holofoil|holo|reverse holo|reverse|master ball|poke ball|pokeball|masterball|mb|pb)\b/gi, "")
    .replace(/[^\w .:'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function importVariantFromText(value) {
  const text = String(value || "").toLowerCase().replace(/[\s-]+/g, "");
  if (text === "mb" || text.includes("masterball")) return { key: "masterBallReverseHolo", label: "Master Ball Reverse Holo", short: "MB" };
  if (text === "pb" || text.includes("pokeball")) return { key: "pokeBallReverseHolo", label: "Poke Ball Reverse Holo", short: "PB" };
  if (text.includes("reverse")) return { key: "reverseHolofoil", label: "Reverse Holofoil", short: "RH" };
  if (text.includes("holo")) return { key: "holofoil", label: "Holofoil", short: "Holo" };
  return { key: "normal", label: "Normal", short: "Normal" };
}

function pokemonApiToTcgdexSetId(setId) {
  if (!setId) return "";
  const known = {
    me3: "me03",
    me2pt5: "me02.5",
    me2: "me02",
    me1: "me01",
    rsv10pt5: "sv10.5w",
    zsv10pt5: "sv10.5b",
    sv8pt5: "sv08.5",
    sv6pt5: "sv06.5",
    sv4pt5: "sv04.5",
    sv3pt5: "sv03.5",
    sv1: "sv01",
    sv2: "sv02",
    sv3: "sv03",
    sv4: "sv04",
    sv5: "sv05",
    sv6: "sv06",
    sv7: "sv07",
    sv8: "sv08",
    sv9: "sv09",
    swsh12tg: "swsh12",
    swsh11tg: "swsh11",
    swsh10tg: "swsh10",
    swsh9tg: "swsh9",
  };
  return known[setId] || setId;
}

function tcgdexToPokemonApiSetId(setId) {
  if (!setId) return "";
  const known = {
    "me03": "me3",
    "me02.5": "me2pt5",
    "me02": "me2",
    "me01": "me1",
    "sv10.5w": "rsv10pt5",
    "sv10.5b": "zsv10pt5",
    "sv08.5": "sv8pt5",
    "sv06.5": "sv6pt5",
    "sv04.5": "sv4pt5",
    "sv03.5": "sv3pt5",
    "sv01": "sv1",
    "sv02": "sv2",
    "sv03": "sv3",
    "sv04": "sv4",
    "sv05": "sv5",
    "sv06": "sv6",
    "sv07": "sv7",
    "sv08": "sv8",
    "sv09": "sv9",
  };
  return known[setId] || setId;
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
  if (!requireLogin()) return;
  const existingNames = new Set(cards.map((card) => card.name));
  const freshSamples = sampleCards
    .filter((card) => !existingNames.has(card.name))
    .map((card) => ({ ...card, id: crypto.randomUUID(), createdAt: Date.now() + Math.random() }));

  cards = [...freshSamples, ...cards];
  persist();
  render();
}

function openEditor(card = null) {
  if (!requireLogin()) return;
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
  if (!currentUser) {
    renderStats();
    elements.binderView.classList.add("hidden");
    elements.grid.classList.add("hidden");
    elements.emptyState.classList.add("hidden");
    elements.searchResults.classList.add("hidden");
    return;
  }

  const filtered = getVisibleCards();
  renderStats();
  const isBinder = activeView === "binder";
  elements.binderView.classList.toggle("hidden", !isBinder);
  elements.grid.classList.toggle("hidden", isBinder);
  elements.emptyState.classList.toggle("hidden", isBinder || filtered.length > 0);
  elements.grid.innerHTML = isBinder ? "" : filtered.map(cardTemplate).join("");
  if (isBinder) loadBinderSet();

  elements.grid.querySelectorAll(".edit-button").forEach((button) => {
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
  renderMarketMovers();
}

function renderMarketMovers() {
  const movers = cards
    .filter(isPortfolioCard)
    .map((card) => ({ card, move: marketMove(card) }))
    .filter((item) => item.move.value !== 0)
    .sort((a, b) => Math.abs(b.move.value) - Math.abs(a.move.value))
    .slice(0, 4);

  elements.marketMovers.innerHTML = movers.length
    ? movers.map(({ card, move }) => marketMoverTemplate(card, move)).join("")
    : `<p class="result-message">Zatial nemam dost trend dat. Klikni na Ceny alebo pridaj kartu z vyhladavania.</p>`;
}

function marketMoverTemplate(card, move) {
  const moveClass = move.value >= 0 ? "positive" : "negative";
  return `
    <article class="mover-row">
      <div>
        <strong>${escapeHtml(card.name)}</strong>
        <span>${escapeHtml(card.series || "-")} / ${escapeHtml(card.number || "-")}</span>
      </div>
      <p class="${moveClass}">${escapeHtml(move.label)}</p>
    </article>
  `;
}

function renderBinder() {
  if (activeView !== "binder") return;

  const pageSize = 20;
  const pages = getBinderPageCount();
  const owned = binderCards.filter(isBinderCardOwned).length;
  const start = (binderPage - 1) * pageSize;
  const visibleCards = binderCards.slice(start, start + pageSize);

  elements.binderCount.textContent = binderCards.length;
  elements.binderOwnedCount.textContent = owned;
  elements.binderProgress.textContent = `${binderCards.length ? Math.round((owned / binderCards.length) * 100) : 0}%`;
  elements.binderSource.textContent = binderDataSourceLabel();
  elements.binderPages.textContent = pages;
  elements.binderPageLabel.textContent = `${binderPage} / ${pages}`;
  elements.binderPrevButton.disabled = binderPage <= 1;
  elements.binderNextButton.disabled = binderPage >= pages;
  elements.binderBreakdown.innerHTML = binderBreakdownTemplate();
  elements.binderGrid.innerHTML = visibleCards.length
    ? visibleCards.map(binderCardTemplate).join("")
    : `<p class="result-message">Nacitavam set do binderu...</p>`;

  elements.binderGrid.querySelectorAll(".binder-slot").forEach((button) => {
    button.addEventListener("click", () => toggleBinderCard(button.dataset.cardId));
  });
}

function binderDataSourceLabel() {
  if (binderImports.some((set) => set.id === binderSetId)) return "imported list";
  if ((binderExtras[binderSetId] || []).length) return "TCGdex + stamped/cosmos extras";
  return "TCGdex variants";
}

async function loadBinderSet() {
  if (activeView !== "binder") return;
  binderCards = [];
  elements.binderBreakdown.innerHTML = "";
  const importedSet = binderImports.find((set) => set.id === binderSetId);
  if (importedSet) {
    binderCards = buildImportedBinderEntries(importedSet);
    renderBinder();
    return;
  }

  elements.binderGrid.innerHTML = `<p class="result-message">Nacitavam master set z TCGdex...</p>`;
  try {
    const apiCards = await fetchBinderCards(binderSetId);
    binderCards = withBinderExtras(buildMasterBinderEntries(apiCards));
  } catch {
    try {
      const fallbackCards = await fetchPokemonApiBinderCards(tcgdexToPokemonApiSetId(binderSetId));
      binderCards = withBinderExtras(buildMasterBinderEntries(fallbackCards));
    } catch {
      binderCards = [];
    }
  }
  renderBinder();
}

function withBinderExtras(entries) {
  const extras = binderExtras[binderSetId] || [];
  if (!extras.length) return entries;
  const selectedSet = binderSets.find((set) => set.id === binderSetId);
  const imagesByName = entries.reduce((map, entry) => {
    const nameKey = normalizedBinderName(entry.card?.name);
    if (nameKey && entry.card?.images?.small && !map.has(nameKey)) {
      map.set(nameKey, entry.card.images);
    }
    return map;
  }, new Map());
  return [
    ...entries,
    ...extras.map((extra, index) => {
      const matchedImages = extra.image
        ? { small: extra.image, large: extra.image }
        : imagesByName.get(normalizedBinderName(extra.name)) || {};
      return {
        id: `${binderSetId}::extra::${index}`,
        apiId: extra.id,
        markKey: `${extra.number}::${extra.variant.key}`,
        legacyKey: extra.number,
        variantIndex: index,
        variant: extra.variant,
        card: {
          id: extra.id,
          name: extra.name,
          number: extra.number,
          rarity: "Grandmaster",
          set: { id: binderSetId, name: selectedSet?.name || binderSetId },
          images: matchedImages,
          source: "extra",
        },
      };
    }),
  ];
}

function normalizedBinderName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildImportedBinderEntries(importedSet) {
  return importedSet.entries.map((entry, index) => {
    const number = entry.number || String(index + 1);
    return {
      id: `${importedSet.id}::${number}::${entry.variant.key}::${index}`,
      apiId: entry.id,
      markKey: `${number}::${entry.variant.key}`,
      legacyKey: number,
      variantIndex: index,
      variant: entry.variant,
      card: {
        id: entry.id,
        name: entry.name || `Card ${number}`,
        number,
        rarity: "Imported",
        set: { id: importedSet.id, name: importedSet.name },
        images: entry.image ? { small: entry.image, large: entry.image } : {},
        source: "import",
      },
    };
  });
}

async function fetchBinderCards(setId) {
  const response = await fetch(`${SETS_API_BASE}/${setId}`);
  if (!response.ok) throw new Error("TCGdex set not found");
  const set = await response.json();
  const summaries = set.cards ?? [];
  const fullCards = await Promise.all(
    summaries.map(async (summary) => {
      const cardResponse = await fetch(`${TCGDEX_CARD_API}/${summary.id}`);
      if (!cardResponse.ok) return normalizeTcgdexBinderCard(summary, set);
      return normalizeTcgdexBinderCard(await cardResponse.json(), set);
    })
  );
  return fullCards;
}

async function fetchPokemonApiBinderCards(setId) {
  const cardsFromSet = [];
  let page = 1;
  let totalCount = 0;
  do {
    const params = new URLSearchParams({
      q: `set.id:${setId}`,
      page: String(page),
      pageSize: "250",
      orderBy: "number",
    });
    const response = await fetch(`${API_BASE}?${params.toString()}`);
    const payload = response.ok ? await response.json() : { data: [], totalCount: 0 };
    cardsFromSet.push(...(payload.data ?? []));
    totalCount = payload.totalCount ?? cardsFromSet.length;
    page += 1;
  } while (cardsFromSet.length < totalCount && page < 6);
  return cardsFromSet;
}

function normalizeTcgdexBinderCard(card, set) {
  return {
    id: card.id,
    name: card.name,
    number: card.localId,
    rarity: card.rarity || "Unknown",
    set: { id: set.id, name: set.name },
    images: { small: `${card.image}/low.webp`, large: `${card.image}/high.webp` },
    variants: card.variants || {},
    source: "tcgdex",
  };
}

function buildMasterBinderEntries(apiCards) {
  return apiCards.flatMap((card) =>
    masterVariantsForCard(card).map((variant, index) => ({
      id: `${card.id}::${variant.key}`,
      apiId: card.id,
      markKey: `${card.number || card.id}::${variant.key}`,
      legacyKey: card.number,
      variantIndex: index,
      variant,
      card,
    }))
  );
}

function getBinderPageCount() {
  return Math.max(1, Math.ceil(binderCards.length / 20));
}

function isBinderCard(card) {
  return card.status === "binder" || card.status === "owned";
}

function isPortfolioCard(card) {
  return card.status === "owned" || card.status === "binder";
}

function binderCardTemplate(entry) {
  const card = entry.card;
  const owned = isBinderCardOwned(entry);
  const image = card.images?.small
    ? `<img src="${escapeAttr(card.images.small)}" alt="${escapeAttr(card.name)}" />`
    : `<span>${escapeHtml((card.name || "?").slice(0, 2).toUpperCase())}</span>`;

  return `
    <button class="binder-slot ${owned ? "owned" : "wanted"}" type="button" data-card-id="${escapeAttr(entry.id)}">
      <span class="binder-card-art">${image}</span>
      <span class="binder-print">${escapeHtml(entry.variant.short)}</span>
      <strong>${escapeHtml(card.name)}</strong>
      <small>${escapeHtml(card.number || "-")} / ${escapeHtml(entry.variant.label)}</small>
      <em>${owned ? "Owned" : "Wanted"}</em>
    </button>
  `;
}

function toggleBinderCard(entryId) {
  if (!requireLogin()) return;
  const entry = binderCards.find((item) => item.id === entryId);
  if (!entry) return;
  binderMarks[binderSetId] = binderMarks[binderSetId] || {};
  binderMarks[binderSetId][entry.markKey] = !isBinderCardOwned(entry);
  persistBinderMarks();
  renderBinder();
}

function requireLogin() {
  if (currentUser) return true;
  elements.authStatus.textContent = isSupabaseConfigured() ? "Najprv sa prihlas" : "Najprv nastav Supabase v auth-config.js";
  return false;
}

function isBinderCardOwned(entry) {
  const marks = binderMarks[binderSetId] ?? {};
  if (marks[entry.markKey]) return true;
  if (entry.variantIndex === 0 && marks[entry.legacyKey]) return true;
  return cards.some((card) => {
    const sameSet = pokemonApiToTcgdexSetId(getCardSetId(card)) === binderSetId || card.series === entry.card.set?.name;
    const sameNumber = normalizeCardNumber(String(card.number || "").split("/")[0]) === normalizeCardNumber(entry.card.number);
    return isBinderCard(card) && sameSet && sameNumber && collectionFinishMatchesVariant(card, entry.variant);
  });
}

function masterVariantsForCard(card) {
  if (card.source === "tcgdex") return variantsFromTcgdex(card);

  const priceVariants = variantsFromMarketPrices(card);
  if (priceVariants.length) return addSpecialReverseVariants(card, priceVariants);

  const rarity = String(card.rarity || "").toLowerCase();
  const variants = [];
  if (rarity.includes("holo")) {
    variants.push({ key: "holofoil", label: "Holofoil", short: "Holo" });
  } else {
    variants.push({ key: "normal", label: "Normal", short: "Normal" });
  }

  if (shouldHaveReverseSlot(card)) {
    variants.push({ key: "reverseHolofoil", label: "Reverse Holofoil", short: "RH" });
  }

  return addSpecialReverseVariants(card, variants);
}

function variantsFromTcgdex(card) {
  const flags = card.variants || {};
  const variants = [];
  if (flags.firstEdition) variants.push({ key: "firstEdition", label: "1st Edition", short: "1st" });
  if (flags.normal) variants.push({ key: "normal", label: "Normal", short: "Normal" });
  if (flags.holo) variants.push({ key: "holofoil", label: "Holofoil", short: "Holo" });
  if (flags.reverse) variants.push({ key: "reverseHolofoil", label: "Reverse Holofoil", short: "RH" });
  if (flags.wPromo) variants.push({ key: "wPromo", label: "W Promo", short: "W" });
  return applyBinderForgeVariantOverrides(
    card,
    addSpecialReverseVariants(card, variants.length ? variants : [{ key: "card", label: card.rarity || "Card", short: "Card" }])
  );
}

function applyBinderForgeVariantOverrides(card, variants) {
  const omitted = binderForgeVariantOverrides[card.set?.id]?.omitVariants?.[card.number];
  if (!omitted?.length) return variants;
  return variants.filter((variant) => !omitted.includes(variant.key));
}

function variantsFromMarketPrices(card) {
  const prices = card.tcgplayer?.prices || card.cardmarket?.prices || {};
  const variants = [];
  if (prices.normal) variants.push({ key: "normal", label: "Normal", short: "Normal" });
  if (prices.holofoil) variants.push({ key: "holofoil", label: "Holofoil", short: "Holo" });
  if (prices.reverseHolofoil) variants.push({ key: "reverseHolofoil", label: "Reverse Holofoil", short: "RH" });
  return variants;
}

function addSpecialReverseVariants(card, variants) {
  if (!setHasBallReverseVariants(card.set?.id)) return variants;
  if (!shouldHaveReverseSlot(card)) return variants;
  const withoutPlainReverse = variants.filter((variant) => variant.key !== "reverseHolofoil");
  return [
    ...withoutPlainReverse,
    { key: "pokeBallReverseHolo", label: "Poke Ball Reverse Holo", short: "PB" },
    { key: "masterBallReverseHolo", label: "Master Ball Reverse Holo", short: "MB" },
  ];
}

function shouldHaveReverseSlot(card) {
  const rarity = String(card.rarity || "").toLowerCase();
  if (!rarity) return true;
  if (rarity.includes("illustration") || rarity.includes("secret") || rarity.includes("hyper")) return false;
  if (rarity.includes("ultra") || rarity.includes("double rare") || rarity.includes("ace spec")) return false;
  return true;
}

function setHasBallReverseVariants(setId) {
  return ["sv08.5", "sv10.5w", "sv10.5b", "sv8pt5", "rsv10pt5", "zsv10pt5"].includes(setId);
}

function collectionFinishMatchesVariant(card, variant) {
  const finish = String(card.finish || cardFinishFromRarity(card.rarity) || "").toLowerCase();
  const label = variant.label.toLowerCase();
  if (label.includes("master ball")) return finish.includes("master");
  if (label.includes("poke ball")) return finish.includes("poke") || finish.includes("pokeball");
  if (label.includes("reverse")) return finish.includes("reverse");
  if (label.includes("holo")) return finish.includes("holo");
  return finish.includes("normal") || (!finish.includes("holo") && !finish.includes("reverse"));
}

function binderBreakdownTemplate() {
  if (!binderCards.length) return "";
  return `
    <div>
      <strong>Printy</strong>
      ${breakdownPills(groupBinderEntries((entry) => entry.variant.label))}
    </div>
    <div>
      <strong>Rarity</strong>
      ${breakdownPills(groupBinderEntries((entry) => entry.card.rarity || "Unknown"))}
    </div>
  `;
}

function groupBinderEntries(getKey) {
  return binderCards.reduce((groups, entry) => {
    const key = getKey(entry);
    groups[key] = groups[key] || { owned: 0, total: 0 };
    groups[key].total += 1;
    if (isBinderCardOwned(entry)) groups[key].owned += 1;
    return groups;
  }, {});
}

function breakdownPills(groups) {
  return Object.entries(groups)
    .slice(0, 8)
    .map(([label, stats]) => `<span>${escapeHtml(label)} ${stats.owned}/${stats.total}</span>`)
    .join("");
}

function getCardSetId(card) {
  return card.market?.cardId?.split("-").slice(0, -1).join("-") || "";
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
