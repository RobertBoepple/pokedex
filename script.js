let pokemonData = [];

async function init() {
    await getDataPokemon();
    renderPokemon();
}

// Daten werden von der Pokemon API geholt
async function getDataPokemon() {
    for (let i = 1; i < 17; i++) {
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            if (!response.ok) throw new Error('Network response was not ok');
            let responseAsJson = await response.json();
            pokemonData.push(responseAsJson);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}


function renderPokemon() {
    let content = document.getElementById('content');
    let button = document.getElementById('loadButton');

    let htmlContent = '';

    for (let i = 0; i < pokemonData.length; i++) {
        let pokemon = pokemonData[i];
        let id = pokemon.id;
        let pokemonName = upperCase(pokemon.name);
        let pokemonImg = pokemon.sprites.other["official-artwork"].front_default;
        let types = pokemon.types;
        let type1Class = types[0].type.name.toLowerCase();
        let type1 = upperCase(types[0].type.name);
        let { type2Class, type2Div } = getType2Info(types);

        htmlContent += renderPokemonHtml(id, type1Class, pokemonName, type2Div, pokemonImg, type1, type2Class);
    }

    content.innerHTML = htmlContent;
    button.innerHTML = `<button onclick="loadMore()">More Pokemon</button>`;
}

async function loadMore() {
    let start = pokemonData.length + 1;
    let end = start + 20;

    let newHtmlContent = '';

    for (let i = start; i < end; i++) {
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            if (!response.ok) throw new Error('Network response was not ok');
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
            console.error('Fetch error:', error);
        }
    }

    let content = document.getElementById('content');
    content.innerHTML += newHtmlContent;

    
}

function getType2Info(types) {
    let type2 = types.length > 1 ? types[1].type.name.toLowerCase() : null;
    let type2Class = type2 ? type2 : '';
    let type2Div = type2 ? upperCase(type2) : '';
    return { type2Class, type2Div };
}


function upperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemonHtml(id, type1Class, pokemonName, type2Div, pokemonImg, type1, type2Class) {
    let type2ClassHtml = type2Class ? `class="type ${type2Class}"` : "";
    let type2DivHtml = type2Div ? `<div ${type2ClassHtml}>${type2Div}</div>` : "";
    
    return /*html*/`
        <div class="pokecard ${type1Class}">
            <div class="pokecard-top">
                <div class="pokecard-head">
                    <div>#${id}</div><div>${pokemonName}</div>
                </div>
                <img class="poke-img" src="${pokemonImg}" alt="${pokemonName}">
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


