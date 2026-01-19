const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=150&offset=0/";

let allPokemon = [];

async function onloadFunc(){
    showLoader();
    renderSkeletons();
    await pokemonToArray();
    await fetchPokemonDetails();
    renderPokemon(allPokemon);
    disableLoader();
}

async function pokemonToArray(){
    let response = await fetch(BASE_URL);
    let data = await response.json();

    for (let index = 0; index < data.results.length; index++) {
        allPokemon.push({
            name: data.results[index].name,
            url: data.results[index].url
        });
    }
}

async function fetchPokemonDetails() {
    for (let index = 0; index < allPokemon.length; index++) {
        let response = await fetch(allPokemon[index].url);
        let data = await response.json();

        let typeData = await fetchTypeData(data.types[0].type.name);

        let firstWeakness = typeData.damage_relations.double_damage_from[0]?.name || null;
        let firstStrength = typeData.damage_relations.double_damage_to[0]?.name || null;

        allPokemon[index] = {
            id: data.id,
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default,
            type: data.types[0].type.name,
            weakness: firstWeakness,
            strength: firstStrength
        };
    }
}

async function fetchTypeData(typeName) {
    let response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    return await response.json();
}

function renderPokemon(allPokemon){
    let contentBoxRef = document.getElementById('contentbox');
    let html = "";

    for (let index = 0; index < 15; index++) {
        const pokemon = allPokemon[index];
        html += templatePokemon(pokemon);
    }
    
    contentBoxRef.innerHTML = html; 
}

function templatePokemon(pokemon){

    let weaknessIcon = pokemon.weakness ? TYPE_ICONS[pokemon.weakness] : "";
    let strengthIcon = pokemon.strength ? TYPE_ICONS[pokemon.strength] : "";
    
    return `
    <div class="pokemonBox">
        <div class="topBox">
            <p>No. ${pokemon.id}</p>
            <h3>${pokemon.name}</h3>
        </div>
        <div class="middleBox ${pokemon.type}"><img src="${pokemon.image}" alt="${pokemon.name}"></div>
        <div class="lowerBox flexbox-spacebetween">
            <div class="typeContainer">
                ${weaknessIcon ? `<img src="${weaknessIcon}" class="${pokemon.weakness}" alt="Weakness: ${pokemon.weakness}">` : ""}
            </div>
            <div class="strengthContainer">
                ${strengthIcon ? `<img src="${strengthIcon}" class="${pokemon.strength}" alt="Strength: ${pokemon.strength}">` : ""}
            </div>
        </div>
    </div>
    `
}

function showLoader(){
    document.getElementById('loader').classList.remove('d_none');
}

function disableLoader() {
    document.getElementById('loader').classList.add('d_none');
}

function renderSkeletons(amount = 15) {
    let box = document.getElementById('contentbox');
    let html = '';

    for (let index = 0; index < amount; index++) {
        html += `
          <div class="pokemonBox skeleton">
            <div class="topBox"></div>
            <div class="middleBox"></div>
            <div class="lowerBox"></div>
          </div>
        `;
    }
    box.innerHTML = html;
}
