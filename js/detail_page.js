// js/detail_page.js

import { getPokemonDetails, getPokemonSpecies } from './api/pokemon_service.js';
import { processAndTranslateData } from './dataMapper.js';
import { renderAllPokemonInfo } from './ui/detailRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const pokemonName = params.get('name');

    if (pokemonName) {
        loadPokemonData(pokemonName);
    } else {
        document.getElementById('pokemon-detail-container').innerHTML = 
            `<p class="error-message">No se ha especificado un Pokémon.</p>`;
    }
});

/**
 * Main orchestrator function.
 * @param {string} name - The name of the Pokémon.
 */
async function loadPokemonData(name) {
    const container = document.getElementById('pokemon-detail-container');
    try {
        // 1. Fetch raw data
        const [details, species] = await Promise.all([
            getPokemonDetails(name),
            getPokemonSpecies(name)
        ]);

        // 2. Process and translate data
        const processedData = await processAndTranslateData(details, species);
        
        // 3. Render the UI
        renderAllPokemonInfo(processedData);
        
        // 4. Set up interactivity (This logic is now inside the renderer)

    } catch (error) {
        console.error('Failed to load Pokémon data:', error);
        container.innerHTML = `<p class="error-message">No se pudo encontrar la información para "${name}".</p>`;
    }
}