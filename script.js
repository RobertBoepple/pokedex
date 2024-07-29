let pokemonData = [];

async function init() {
  await getDataPokemon();
  renderPokemon(pokemonData);
}

// Daten werden von der Pokemon API geholt
async function getDataPokemon() {
  for (let i = 1; i < 17; i++) {
    try {
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (!response.ok) throw new Error("Network response was not ok");
      let responseAsJson = await response.json();
      pokemonData.push(responseAsJson);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
}

function renderPokemon(data) {
  let content = document.getElementById("content");
  let button = document.getElementById("loadButton");

  let htmlContent = "";

  for (let i = 0; i < data.length; i++) {
    let pokemon = data[i];
    let id = pokemon.id;
    let pokemonName = upperCase(pokemon.name);
    let pokemonImg = pokemon.sprites.other["official-artwork"].front_default;
    let types = pokemon.types;
    let type1Class = types[0].type.name.toLowerCase();
    let type1 = upperCase(types[0].type.name);
    let { type2Class, type2Div } = getType2Info(types);

    htmlContent += renderPokemonHtml(
      id,
      type1Class,
      pokemonName,
      type2Div,
      pokemonImg,
      type1,
      type2Class
    );
  }

  content.innerHTML = htmlContent;
  button.innerHTML = `<button onclick="loadMore()">More Pokemon</button>`;
}

async function loadMore() {
  let start = pokemonData.length + 1;
  let end = start + 20;

  let newHtmlContent = "";

  for (let i = start; i < end; i++) {
    try {
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (!response.ok) throw new Error("Network response was not ok");
      let responseAsJson = await response.json();
      pokemonData.push(responseAsJson);
      let types = responseAsJson.types;
      let type1Class = types[0].type.name.toLowerCase();
      let type1 = upperCase(types[0].type.name);
      let { type2Class, type2Div } = getType2Info(types);
      newHtmlContent += renderPokemonHtml(
        responseAsJson.id,
        type1Class,
        upperCase(responseAsJson.name),
        type2Div,
        responseAsJson.sprites.other["official-artwork"].front_default,
        type1,
        type2Class
      );
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  let content = document.getElementById("content");
  content.innerHTML += newHtmlContent;
}

function getType2Info(types) {
  let type2 = types.length > 1 ? types[1].type.name.toLowerCase() : null;
  let type2Class = type2 ? type2 : "";
  let type2Div = type2 ? upperCase(type2) : "";
  return { type2Class, type2Div };
}

function upperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemonHtml(
  id,
  type1Class,
  pokemonName,
  type2Div,
  pokemonImg,
  type1,
  type2Class
) {
  let type2ClassHtml = type2Class ? `class="type ${type2Class}"` : "";
  let type2DivHtml = type2Div ? `<div ${type2ClassHtml}>${type2Div}</div>` : "";

  return /*html*/ `
        <div class="pokecard ${type1Class}">
            <div class="pokecard-top">
                <div class="pokecard-head">
                    <div>#${id}</div><div>${pokemonName}</div>
                </div>
                <img onclick="showPokebox(${id})" class="poke-img" src="${pokemonImg}" alt="${pokemonName}">
            </div>
            <div class="pokecard-bottom">
                <div class="types">
                    <div class="type ${type1Class}">${type1}</div>
                    ${type2DivHtml}
                </div>
            </div>
        </div>
    `;
}

// Suchfunktion für die Pokemon
function searchPokemon() {
  let searchInput = document.getElementById("search").value.toLowerCase();
  if (searchInput.length >= 3) {
    let filteredPokemon = pokemonData.filter((pokemon) =>
      pokemon.name.includes(searchInput)
    );
    renderPokemon(filteredPokemon);
  } else {
    renderPokemon(pokemonData);
  }
}

/// Pokebox mit Infos zu den Pokemon
function showPokebox(id) {
    let pokemon = pokemonData.find((pokemon) => pokemon.id === id);
    let pokebox = document.getElementById("pokebox");
    let pokeboxContainer = document.querySelector(".pokebox-container");
    let types = pokemon.types;
    let type1 = upperCase(types[0].type.name);
    let { type2Div } = getType2Info(types);
    let type2 = type2Div ? upperCase(type2Div) : "";
    let arrows = generateArrows(id);

    pokeboxContainer.innerHTML = /*html*/ `
    <div class="pokebox-headline"><div>#${pokemon.id}</div><div>${upperCase(pokemon.name)}</div></div>
        
        <div class="pokebox-top">
            <div class="pokebox-head">
            </div>
            <img onclick="hidePokebox()" class="poke-img" src="${
                pokemon.sprites.other["official-artwork"].front_default
            }" alt="${upperCase(pokemon.name)}">
        </div>
        <div class="arrow-container">
        <div class="pokebox-arrow left">
            ${arrows.leftArrow}
        </div>
        <div class="types">
                <div class="type ${types[0].type.name.toLowerCase()}">${type1}</div>
                <div class="type ${type2.toLowerCase()}">${type2}</div>
            </div>
        <div class="pokebox-arrow right">
            ${arrows.rightArrow}
        </div>
        </div>
        <div class="pokebox-bottom">
            
            <div class="pokebox-stats">
    <div class="stats-table">
        <div>Height:</div><div> ${pokemon.height / 10} m</div>
    </div>
    <div class="stats-table">
        <div>Weight:</div><div> ${pokemon.weight / 10} kg</div>
    </div>
    <div class="stats-table">
        <div>HP:</div><div> ${pokemon.stats[0].base_stat}</div>
    </div>
    <div class="stats-table">
        <div>Attack:</div><div> ${pokemon.stats[1].base_stat}</div>
    </div>
    <div class="stats-table">
        <div>Defence:</div><div> ${pokemon.stats[2].base_stat}</div>
    </div>
    <div class="stats-table">
        <div>Special Attack:</div><div> ${pokemon.stats[3].base_stat}</div>
    </div>
    <div class="stats-table">
        <div>Special Defence:</div><div> ${pokemon.stats[4].base_stat}</div>
    </div>
    <divstats-table class="stats-table">
        <div>Speed:</div><div> ${pokemon.stats[5].base_stat}</div>
    </divstats-table
        </div>
        
    </div>
    `;
    pokebox.classList.remove("d-none");
}
generateArrows()
// Funktion zum Verbergen des Overlays
function hidePokebox() {
    let pokebox = document.getElementById("pokebox");
    pokebox.classList.add("d-none");
}

// Funktion für die Pfeile in der Pokebox
function generateArrows(id) {
    let leftArrow;
    if (id > 1) {
      leftArrow = `<img onclick="showPokebox(${
        id - 1
      })" src="icon/arrow_left.png" class="arrows left">`;
    } else {
      leftArrow = "";
    }
  
    let rightArrow;
  
    if (id < pokemonData.length) {
      rightArrow = `<img onclick="showPokebox(${
        id + 1
      })" src="icon/arrow_right.png" class="arrows right">`;
    } else {
      rightArrow = "";
    }
  
    return { leftArrow, rightArrow };
}
