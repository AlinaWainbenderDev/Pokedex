const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=150&offset=0/";

let allPokemon = [];

async function onloadFunc(){
    await pokemonToArray();
    await generatePokemon()
    renderPokemon(allPokemon)
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

async function generatePokemon(){

    for (let index = 0; index < 15; index++) {
        let response = await fetch(allPokemon[index].url);
        let data = await response.json()
        console.log(data);

         allPokemon[index] = {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            types: data.types,
            height: data.height,
            weight: data.weight
        };
    }
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
    return `
    <div class="pokemonBox">
        <h3>${pokemon.name}</h3>
        <img src="${pokemon.image}">
    </div>
    `
}

