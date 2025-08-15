// js/detail_page.js

import { getPokemonDetails, getPokemonSpecies, getDataFromUrl } from './api/pokemon_service.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const pokemonName = params.get('name');

    if (pokemonName) {
        loadPokemonData(pokemonName);
    } else {
        // Handle case where no Pokémon name is in the URL
    }
});

/**
 * Main orchestrator function.
 * @param {string} name - The name of the Pokémon.
 */
async function loadPokemonData(name) {
    const container = document.getElementById('pokemon-detail-container');
    try {
        const [details, species] = await Promise.all([
            getPokemonDetails(name),
            getPokemonSpecies(name)
        ]);

        const processedData = await processAndTranslateData(details, species);
        
        renderAllPokemonInfo(processedData);
        // --- NEW: Set up interactive elements after rendering ---
        setupEventListeners(processedData);

    } catch (error) {
        // Handle errors
    }
}

/**
 * Processes and translates raw API data.
 * @param {object} details - Raw data from /pokemon/ endpoint.
 * @param {object} species - Raw data from /pokemon-species/ endpoint.
 * @returns {Promise<object>} - A clean, translated data object.
 */
async function processAndTranslateData(details, species) {
    // ... (This entire function is the same as in the previous step, no changes needed here)
    const findSpanishEntry = (entries, key = 'name') => {
        const entry = entries.find(e => e.language.name === 'es');
        return entry ? entry[key] : 'N/A';
    };
    const typesPromises = details.types.map(async (typeInfo) => {
        const typeData = await getDataFromUrl(typeInfo.type.url);
        return findSpanishEntry(typeData.names);
    });
    const abilityPromise = async () => {
        const abilityData = await getDataFromUrl(details.abilities[0].ability.url);
        return findSpanishEntry(abilityData.names);
    };
    const colorPromise = async () => {
        const colorData = await getDataFromUrl(species.color.url);
        return findSpanishEntry(colorData.names);
    };
    const statsPromises = details.stats.map(async (statInfo) => {
        const statData = await getDataFromUrl(statInfo.stat.url);
        return {
            name: findSpanishEntry(statData.names),
            value: statInfo.base_stat
        };
    });
    const [
        translatedTypes,
        translatedAbility,
        translatedColor,
        translatedStats
    ] = await Promise.all([
        Promise.all(typesPromises),
        abilityPromise(),
        colorPromise(),
        Promise.all(statsPromises)
    ]);
    const spanishDescription = findSpanishEntry(species.flavor_text_entries, 'flavor_text')
        .replace(/\n/g, ' ').replace(/\f/g, ' ');
    const allMoves = details.moves.map(moveInfo => moveInfo.move.name);
    const randomMoves = [];
    while (randomMoves.length < 3 && allMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMoves.length);
        randomMoves.push(allMoves.splice(randomIndex, 1)[0]);
    }
    const evolutionChainUrl = species.evolution_chain.url;
    const evolutionData = await getDataFromUrl(evolutionChainUrl);
    const evolutionLine = await parseEvolutionChain(evolutionData.chain);
    return {
        id: details.id,
        name: details.name.toUpperCase(),
        image: details.sprites.other['official-artwork'].front_default,
        shinyImage: details.sprites.other['official-artwork'].front_shiny,
        types: translatedTypes,
        description: spanishDescription,
        height: details.height / 10,
        weight: details.weight / 10,
        ability: translatedAbility,
        color: translatedColor,
        stats: translatedStats,
        moves: randomMoves,
        evolutions: evolutionLine
    };
}

/**
 * Recursively parses the evolution chain.
 * @param {object} chainNode - The current node in the evolution chain.
 * @returns {Promise<Array>} - An array of Pokémon in the evolution line.
 */
async function parseEvolutionChain(chainNode) {
    // ... (This function is the same as in the previous step)
    const evolutions = [];
    let currentNode = chainNode;
    while (currentNode) {
        const speciesName = currentNode.species.name;
        const pokemonDetails = await getPokemonDetails(speciesName);
        evolutions.push({
            name: speciesName,
            image: pokemonDetails.sprites.other['official-artwork'].front_default
        });
        currentNode = currentNode.evolves_to[0];
    }
    return evolutions;
}



// --- NEW RENDERING FUNCTIONS ---

/**
 * Main rendering function that calls all other specific renderers.
 * @param {object} data - The clean, processed Pokémon data object.
 */
function renderAllPokemonInfo(data) {
    // Update the page title
    document.title = data.name;

    // Render each section of the page
    renderMainInfo(data);
    renderDetailedInfo(data);
    renderStats(data);
    renderMoves(data);
    renderEvolutionChain(data);
}

function renderMainInfo(data) {
    document.getElementById('pokemon-image').src = data.image;
    document.getElementById('pokemon-id').textContent = `#${String(data.id).padStart(3, '0')}`;
    document.getElementById('pokemon-name').textContent = data.name;
    document.getElementById('pokemon-description').textContent = data.description;
    
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = ''; // Clear previous types
    data.types.forEach(type => {
        const typeTag = document.createElement('span');
        typeTag.className = 'type-tag'; // Use the same class as the search page for consistency
        typeTag.textContent = type;
        // You could add color styling here if desired
        typesContainer.appendChild(typeTag);
    });
}

function renderDetailedInfo(data) {
    document.getElementById('pokemon-height').textContent = `${data.height} m`;
    document.getElementById('pokemon-weight').textContent = `${data.weight} kg`;
    document.getElementById('pokemon-ability').textContent = data.ability;
    document.getElementById('pokemon-color').textContent = data.color;
}

function renderStats(data) {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = ''; // Clear previous stats
    data.stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'stat-item';
        statElement.innerHTML = `
            <span class="stat-name">${stat.name}</span>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${Math.min(stat.value / 2, 100)}%;"></div>
            </div>
            <span class="stat-value">${stat.value}</span>
        `;
        statsContainer.appendChild(statElement);
    });
}

function renderMoves(data) {
    const movesList = document.getElementById('pokemon-moves');
    movesList.innerHTML = ''; // Clear previous moves
    data.moves.forEach(move => {
        const moveItem = document.createElement('li');
        moveItem.textContent = move;
        movesList.appendChild(moveItem);
    });
}

function renderEvolutionChain(data) {
    const evolutionContainer = document.getElementById('evolution-chain-container');
    evolutionContainer.innerHTML = ''; // Clear previous chain

    // FIX: The logic is simplified. We no longer show a message for single-stage pokémon.
    // The loop will now handle all cases correctly.
    if (!data.evolutions || data.evolutions.length === 0) {
        evolutionContainer.innerHTML = '<p>No se encontró información de la línea evolutiva.</p>';
        return;
    }

    data.evolutions.forEach((pokemon, index) => {
        const evolutionCard = document.createElement('div');
        evolutionCard.className = 'evolution-card';
        // Make the evolution card clickable to navigate to that Pokémon's page
        evolutionCard.addEventListener('click', () => {
            window.location.href = `pokemon.html?name=${pokemon.name}`;
        });
        
        evolutionCard.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <p>${pokemon.name}</p>
        `;
        evolutionContainer.appendChild(evolutionCard);

        // Add an arrow between evolutions
        if (index < data.evolutions.length - 1) {
            const arrow = document.createElement('span');
            arrow.className = 'evolution-arrow';
            arrow.textContent = '→';
            evolutionContainer.appendChild(arrow);
        }
    });
}