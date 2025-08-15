// js/dataMapper.js

// This module needs access to the API service functions
import { getPokemonDetails, getPokemonSpecies, getDataFromUrl } from './api/pokemon_service.js';

/**
 * Recursively parses the evolution chain.
 * @param {object} chainNode - The current node in the evolution chain.
 * @returns {Promise<Array>} - An array of Pokémon in the evolution line.
 */
async function parseEvolutionChain(chainNode) {
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

/**
 * Processes and translates raw API data.
 * @param {object} details - Raw data from /pokemon/ endpoint.
 * @param {object} species - Raw data from /pokemon-species/ endpoint.
 * @returns {Promise<object>} - A clean, translated data object.
 */
export async function processAndTranslateData(details, species) {
    const findSpanishEntry = (entries, key = 'name') => {
        const entry = entries.find(e => e.language.name === 'es');
        return entry ? entry[key] : 'N/A';
    };
    const typesPromises = details.types.map(async (typeInfo) => {
        const typeData = await getDataFromUrl(typeInfo.type.url);
        return {
            name: findSpanishEntry(typeData.names), // El nombre traducido al español
            originalName: typeInfo.type.name       // El nombre original en inglés
        };
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