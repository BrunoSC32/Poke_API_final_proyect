// js/search_page.js

import { getPokemons, getPokemonDetails, getAllPokemonList } from './api/pokemon_service.js';
import { createPokemonCard } from './ui/components/pokemonCard.js';
import { renderPaginationControls } from './ui/components/pagination.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM References
    const pokemonContainer = document.getElementById('pokemon-list-container');
    const paginationContainer = document.getElementById('pagination-controls');
    const searchInput = document.getElementById('pokemon-search-input');
    const suggestionsContainer = document.getElementById('autocomplete-suggestions');

    // State for the full pokemon list for autocomplete
    let allPokemons = [];

    // Application state for pagination
    let state = {
        currentPage: 1,
        limit: 10,
        totalPokemons: 0,
    };

    /**
     * Initializes the page.
     */
    async function initializePage() {
        // ... (This function remains the same)
        try {
            const allPokemonPromise = getAllPokemonList().then(list => {
                allPokemons = list.map((p, index) => ({ name: p.name, id: index + 1 }));
            });
            const paginatedPokemonPromise = loadPokemonsForPage(1);
            await Promise.all([allPokemonPromise, paginatedPokemonPromise]);
        } catch (error) {
            console.error("Initialization failed:", error);
            pokemonContainer.innerHTML = '<p>Could not initialize the Pokédex.</p>';
        }
    }

    /**
     * Loads and displays a specific page of Pokémon.
     */
    async function loadPokemonsForPage(page) {
        // ... (This function remains the same)
        state.currentPage = page;
        pokemonContainer.innerHTML = '<p class="loading-message">Cargando Pokémon...</p>';
        try {
            const offset = (state.currentPage - 1) * state.limit;
            const data = await getPokemons(state.limit, offset);
            if (state.totalPokemons === 0) state.totalPokemons = data.count;
            const pokemonPromises = data.results.map(p => getPokemonDetails(p.name));
            const pokemonsWithDetails = await Promise.all(pokemonPromises);
            pokemonContainer.innerHTML = '';
            pokemonsWithDetails.forEach(pokemon => {
                const card = createPokemonCard(pokemon);
                pokemonContainer.appendChild(card);
            });
            renderPaginationControls(paginationContainer, state, loadPokemonsForPage);
        } catch (error) {
            pokemonContainer.innerHTML = '<p>No se pudieron cargar los Pokémon.</p>';
        }
    }

    /**
     * Handles the 'input' event on the search bar.
     */
    function handleSearchInput(event) {
        // ... (This function is almost the same)
        const searchTerm = event.target.value.toLowerCase().trim();
        suggestionsContainer.innerHTML = '';

        if (searchTerm.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const filteredPokemons = allPokemons.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) ||
            String(pokemon.id).startsWith(searchTerm)
        );

        const suggestions = filteredPokemons.slice(0, 7);

        if (suggestions.length > 0) {
            suggestions.forEach(pokemon => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = `#${String(pokemon.id).padStart(3, '0')} - ${pokemon.name}`;
                suggestionItem.addEventListener('click', () => {
                    // This now calls the simplified function
                    selectPokemonFromSuggestion(pokemon.name);
                });
                suggestionsContainer.appendChild(suggestionItem);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // --- UPDATED: This function is now much simpler ---
    /**
     * Redirects the user to the detail page for the selected Pokémon.
     * @param {string} pokemonName - The name of the selected Pokémon.
     */
    function selectPokemonFromSuggestion(pokemonName) {
        // Simply navigate to the detail page
        window.location.href = `pokemon.html?name=${pokemonName}`;
    }

    // Attach the event listener to the search input
    searchInput.addEventListener('input', handleSearchInput);

    // Initial Load
    initializePage();
});