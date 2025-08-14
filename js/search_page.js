import { getPokemons, getPokemonDetails } from '../api/pokemon_service.js';
import { createPokemonCard } from './ui/components/pokemonCard.js';
import { renderPaginationControls } from './ui/components/pagination.js';

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const pokemonContainer = document.getElementById('pokemon-list-container');
    const paginationContainer = document.getElementById('pagination-controls');

    // Estado de la aplicación
    let state = {
        currentPage: 1,
        limit: 10,
        totalPokemons: 0,
    };


    async function loadPokemonsForPage(page) {
        state.currentPage = page;
        pokemonContainer.innerHTML = '<p class="loading-message">Cargando Pokémon...</p>';

        try {
            const offset = (state.currentPage - 1) * state.limit;
            const data = await getPokemons(state.limit, offset);

            if (state.totalPokemons === 0) {
                state.totalPokemons = data.count;
            }

            const pokemonPromises = data.results.map(p => getPokemonDetails(p.name));
            const pokemonsWithDetails = await Promise.all(pokemonPromises);
            
            // Lógica de renderizado
            pokemonContainer.innerHTML = ''; // Limpiar
            pokemonsWithDetails.forEach(pokemon => {
                // Llama a la función importada para crear la tarjeta
                const card = createPokemonCard(pokemon);
                pokemonContainer.appendChild(card);
            });

            // Llama a la función importada para dibujar la paginación
            renderPaginationControls(paginationContainer, state, loadPokemonsForPage);

        } catch (error) {
            pokemonContainer.innerHTML = '<p>No se pudieron cargar los Pokémon. Inténtalo más tarde.</p>';
        }
    }

    // Carga Inicial
    loadPokemonsForPage(1);
});