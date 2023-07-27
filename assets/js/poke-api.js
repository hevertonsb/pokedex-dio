const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 3) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => console.log(error))
}

// open more info pokemon

function openInfo(id) {
    let modal = document.getElementById("info-modal");
    fetchPokemonInfo(id);
    updateCurrentPokemonImage(id);
  
    if (typeof modal == "undefined" || modal === null) return;
  
    modal.style.display = "Block";
}

async function fetchPokemonInfo(id) {
    const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const responsePokemon = await fetch(urlPokemon);
    const responseSpecies = await fetch(urlSpecies);
    const pokemon = await responsePokemon.json();
    const species = await responseSpecies.json();
  
    const reponseEvolutions = await fetch(species.evolution_chain.url);
    const evolution_chain = await reponseEvolutions.json();
    
    setupPokemonAbout(pokemon, species);
    setupPokemonAbilities(pokemon);
}

function closeModal() {
    let modal = document.getElementById("info-modal");
    if (typeof modal == "undefined" || modal === null) return;
    modal.style.display = "none";
    document.getElementById('current-pokemon-id').innerHTML = '';
    document.getElementById('current-pokemon-name').innerHTML = '';
    document.getElementById('current-pokemon-types').innerHTML = '';
    document.getElementById('current-pokemon-height').innerHTML = '';
    document.getElementById('current-pokemon-weight').innerHTML = '';
    document.getElementById('current-pokemon-description').innerHTML = '';
}

function updateCurrentPokemonImage(id) {
    const currentPokemonImage = document.getElementById('current-pokemon-image');
    const img = new Image();
  
    img.onload = function() {
        currentPokemonImage.src = this.src;
        //currentPokemonImage.style.height = this.height * 2 + 'px';
    };
  
    if(id < 650) {
        img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/' + id + '.svg';
    } else {
        img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' + id + '.gif';
    };
};
  
  
/**setup pokemon id, name, types, height, weight and description */
function setupPokemonAbout(pokemon, species) {
    document.getElementById('current-pokemon-id').innerHTML = 'N° ' + pokemon.id;
    document.getElementById('current-pokemon-name').innerHTML = dressUpPayloadValue(pokemon.name);
    document.getElementById('current-pokemon-types').innerHTML = getTypeContainers(pokemon.types);
    document.getElementById('current-pokemon-height').innerHTML = pokemon.height / 10 + 'M';
    document.getElementById('current-pokemon-weight').innerHTML = pokemon.weight / 10 + 'Kg';
  
    for(i = 0; i < species.flavor_text_entries.length; i++) {
        if(species.flavor_text_entries[i].language.name == 'en'){
            document.getElementById('current-pokemon-description').innerHTML = dressUpPayloadValue(species.flavor_text_entries[i].flavor_text.replace('', ' '));
            break;
        };
    };
};
  
/**get type containers for pokemon infos */
function getTypeContainers(typesArray) {
    let htmlToReturn = '<div class="row">';
  
    for (let i = 0; i < typesArray.length; i++) {
      htmlToReturn += `<div class="type-container"> ${dressUpPayloadValue(typesArray[i].type.name)}</div>`;
    }
  
    return htmlToReturn + "</div>";
}
  
/**dress up payload value */
function dressUpPayloadValue(string) {
    let splitStr = string.toLowerCase().split('-');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join('/');
}
  
/**setup pokemon abilities */
function setupPokemonAbilities(pokemon) {
    document.getElementById("current-pokemon-abilitiy-0").innerHTML =
      dressUpPayloadValue(pokemon.abilities[0].ability.name);
    if (pokemon.abilities[1]) {
      document
        .getElementById("current-pokemon-abilitiy-1")
        .classList.remove("hide");
      document.getElementById("current-pokemon-abilitiy-1").innerHTML =
        dressUpPayloadValue(pokemon.abilities[1].ability.name);
    } else {
      document.getElementById("current-pokemon-abilitiy-1").classList.add("hide");
    }
}
