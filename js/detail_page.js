
// We wait for the HTML document to be fully loaded before running any script.
document.addEventListener('DOMContentLoaded', () => {
    

    const params = new URLSearchParams(window.location.search);
    // Get the value of the 'name' parameter
    const pokemonName = params.get('name');


    if (pokemonName) {
        // This function will orchestrate all the data fetching and rendering
        loadPokemonData(pokemonName);
    } else {
        // If no name is found, show an error message
        const container = document.getElementById('pokemon-detail-container');
        container.innerHTML = `
            <p class="error-message">
                No se ha especificado un Pokémon. Por favor, vuelve a la lista y selecciona uno.
            </p>
        `;
    }
});

/**
 * Main function to load all data for a specific Pokémon.
 * This will be the orchestrator for all subsequent steps.
 * @param {string} name - The name of the Pokémon to load.
 */
async function loadPokemonData(name) {
    console.log(`Fetching data for: ${name}`);
    // In the next steps, we will add all the API calls and rendering logic here.
    try {
        // Placeholder for future logic
        const pokemonNameElement = document.getElementById('pokemon-name');
        pokemonNameElement.textContent = name.toUpperCase(); // A small initial update

    } catch (error) {
        console.error('Failed to load Pokémon data:', error);
        const container = document.getElementById('pokemon-detail-container');
        container.innerHTML = `
            <p class="error-message">
                No se pudo encontrar la información para "${name}". Es posible que el Pokémon no exista.
            </p>
        `;
    }
}