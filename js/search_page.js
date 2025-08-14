import { getPokemons, getPokemonDetails } from './api/pokemon_service.js';

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.getElementById('pokemon-list-container');
    const paginationContainer = document.getElementById('pagination-controls');
    let nextUrl = null;
    let prevUrl = null;

    // Main function to load and display pokemons
    async function loadPokemons(url) {
        // Show a loading state (good practice for UX)
        pokemonContainer.innerHTML = '<p>Cargando Pokémones...</p>';

        try {
            const data = await getPokemons(url);
            nextUrl = data.next;
            prevUrl = data.previous;

            pokemonContainer.innerHTML = ''; // Clear loading message

            // Fetch details for each pokemon in the list
            const pokemonPromises = data.results.map(pokemon => getPokemonDetails(pokemon.name));
            const pokemonsWithDetails = await Promise.all(pokemonPromises);
            
            pokemonsWithDetails.forEach(pokemon => {
                const card = createPokemonCard(pokemon);
                pokemonContainer.appendChild(card);
            });
            
            updatePagination();

        } catch (error) {
            pokemonContainer.innerHTML = '<p>Could not load Pokémon. Please try again later.</p>';
        }
    }

    // Function to create a single pokemon card element
    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        // Add a data attribute to identify the pokemon
        card.dataset.pokemonName = pokemon.name;

        const name = document.createElement('h3');
        name.textContent = pokemon.name;

        const image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        image.alt = `Image of ${pokemon.name}`;

        card.appendChild(image);
        card.appendChild(name);

        // Add click event to navigate to detail page
        card.addEventListener('click', () => {
            window.location.href = `pokemon.html?name=${pokemon.name}`;
        });

        return card;
    }
    
    // Function to update pagination buttons
    function updatePagination() {
        paginationContainer.innerHTML = ''; // Clear old buttons
        
        if (prevUrl) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => loadPokemons(prevUrl));
            paginationContainer.appendChild(prevButton);
        }

        if (nextUrl) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => loadPokemons(nextUrl));
            paginationContainer.appendChild(nextButton);
        }
    }

    // Initial load
    loadPokemons();
});