const API_URL = "https://rickandmortyapi.com/api/character?page=1";
const FAVORITES_KEY = "rick-explorer-favorites";
const THEME_KEY = "rick-explorer-theme";

const elements = {
  grid: document.querySelector("#characterGrid"),
  favoritesGrid: document.querySelector("#favoritesGrid"),
  statusMessage: document.querySelector("#statusMessage"),
  searchInput: document.querySelector("#searchInput"),
  statusFilter: document.querySelector("#statusFilter"),
  speciesFilter: document.querySelector("#speciesFilter"),
  sortFilter: document.querySelector("#sortFilter"),
  clearFilters: document.querySelector("#clearFilters"),
  visibleCount: document.querySelector("#visibleCount"),
  favoriteCount: document.querySelector("#favoriteCount"),
  speciesCount: document.querySelector("#speciesCount"),
  themeToggle: document.querySelector("#themeToggle")
};

let characters = [];
let favorites = readFavorites();

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function setMessage(message, type) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = "status-message" + (type ? " " + type : "");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createCard(character) {
  const isFavorite = favorites.some(function (item) {
    return item.id === character.id;
  });
  const status = character.status.toLowerCase();
  const description = character.origin.name === "unknown"
    ? "Origen desconocido"
    : "Originario de " + character.origin.name;

  return '<article class="character-card">' +
    '<img class="card-image" src="' + escapeHTML(character.image) + '" alt="Imagen de ' + escapeHTML(character.name) + '" loading="lazy">' +
    '<button class="favorite-button ' + (isFavorite ? "is-favorite" : "") + '" data-id="' + character.id + '" aria-label="' + (isFavorite ? "Quitar a " : "Agregar a ") + escapeHTML(character.name) + ' de favoritos" aria-pressed="' + isFavorite + '">★</button>' +
    '<div class="card-body">' +
      '<h3 class="card-title">' + escapeHTML(character.name) + '</h3>' +
      '<div class="card-meta"><span class="status-dot ' + status + '"></span><span>' + escapeHTML(character.status) + " · " + escapeHTML(character.species) + '</span></div>' +
      '<p class="card-description">' + escapeHTML(description) + '</p>' +
    '</div>' +
  '</article>';
}

function renderCards(list, target, emptyMessage) {
  if (!list.length) {
    target.innerHTML = '<div class="empty-state">' + emptyMessage + "</div>";
    return;
  }
  target.innerHTML = list.map(createCard).join("");
}

function updateStats(filtered) {
  elements.visibleCount.textContent = filtered.length;
  elements.favoriteCount.textContent = favorites.length;
  elements.speciesCount.textContent = new Set(filtered.map(function (item) {
    return item.species;
  })).size;
}

function applyFilters() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const selectedStatus = elements.statusFilter.value;
  const selectedSpecies = elements.speciesFilter.value;
  const sortValue = elements.sortFilter.value;

  let filtered = characters.filter(function (character) {
    const matchesName = character.name.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === "all" || character.status.toLowerCase() === selectedStatus;
    const matchesSpecies = selectedSpecies === "all" || character.species === selectedSpecies;
    return matchesName && matchesStatus && matchesSpecies;
  });

  if (sortValue === "az") {
    filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else if (sortValue === "za") {
    filtered.sort(function (a, b) { return b.name.localeCompare(a.name); });
  }

  renderCards(filtered, elements.grid, "No encontramos personajes con esos filtros.");
  updateStats(filtered);
}

function populateSpecies() {
  const species = Array.from(new Set(characters.map(function (character) {
    return character.species;
  }))).sort();

  elements.speciesFilter.innerHTML = '<option value="all">Todas</option>' +
    species.map(function (item) {
      return '<option value="' + escapeHTML(item) + '">' + escapeHTML(item) + "</option>";
    }).join("");
}

function renderFavorites() {
  renderCards(favorites, elements.favoritesGrid, "Todavía no tienes favoritos. Presiona la estrella en una tarjeta para guardarla.");
  elements.favoriteCount.textContent = favorites.length;
}

function toggleFavorite(id) {
  const selected = characters.find(function (character) {
    return character.id === id;
  });
  const savedIndex = favorites.findIndex(function (character) {
    return character.id === id;
  });

  if (savedIndex >= 0) {
    favorites.splice(savedIndex, 1);
  } else if (selected) {
    favorites.push(selected);
  }

  saveFavorites();
  applyFilters();
  renderFavorites();
}

async function loadCharacters() {
  setMessage("Cargando personajes desde la API...", "loading");
  elements.grid.innerHTML = "";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("La API respondió con un error.");
    }
    const data = await response.json();
    characters = data.results;
    populateSpecies();
    applyFilters();
    renderFavorites();
    setMessage("Consulta completada: " + characters.length + " personajes recibidos.");
  } catch (error) {
    elements.grid.innerHTML = '<div class="empty-state">No pudimos cargar los personajes. Revisa tu conexión e inténtalo de nuevo.</div>';
    setMessage("Ocurrió un problema al consultar la API.", "error");
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const darkMode = theme === "dark";
  elements.themeToggle.textContent = darkMode ? "☀️" : "🌙";
  elements.themeToggle.setAttribute("aria-label", darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  elements.themeToggle.setAttribute("aria-pressed", darkMode);
  localStorage.setItem(THEME_KEY, theme);
}

elements.searchInput.addEventListener("input", applyFilters);
elements.statusFilter.addEventListener("change", applyFilters);
elements.speciesFilter.addEventListener("change", applyFilters);
elements.sortFilter.addEventListener("change", applyFilters);

elements.clearFilters.addEventListener("click", function () {
  elements.searchInput.value = "";
  elements.statusFilter.value = "all";
  elements.speciesFilter.value = "all";
  elements.sortFilter.value = "default";
  applyFilters();
});

document.addEventListener("click", function (event) {
  const button = event.target.closest(".favorite-button");
  if (button) {
    toggleFavorite(Number(button.dataset.id));
  }
});

elements.themeToggle.addEventListener("click", function () {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

setTheme(localStorage.getItem(THEME_KEY) || "light");
loadCharacters();
