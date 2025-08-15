const API_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches a list of Pokémon.
 * @param {number} limit - The number of Pokémon to fetch.
 * @param {number} offset - The starting point in the list.
 * @returns {Promise<object>} - The API response data.
 */
export async function getPokemons(limit = 20, offset = 0) {
    const url = `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching Pokémon list: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        throw error;
    }
}

/**
 * Fetches detailed information for a single Pokémon.
 * @param {string} nameOrId - The name or ID of the Pokémon.
 * @returns {Promise<object>} - The detailed Pokémon data.
 */
export async function getPokemonDetails(nameOrId) {
    const url = `${API_BASE_URL}/pokemon/${nameOrId.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching Pokémon details: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        throw error;
    }
}

/**
 * Fetches species-related data for a Pokémon, which includes description, color, and evolution chain URL.
 * @param {string} nameOrId - The name or ID of the Pokémon.
 * @returns {Promise<object>} - The species data.
 */
export async function getPokemonSpecies(nameOrId) {
    const url = `${API_BASE_URL}/pokemon-species/${nameOrId.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching Pokémon species data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokémon species data:', error);
        throw error;
    }
}

/**
 * A generic function to fetch data from any full URL.
 * This is useful for fetching evolution chains or translations that the API provides as separate URLs.
 * @param {string} url - The full URL to fetch data from.
 * @returns {Promise<object>} - The data from the given URL.
 */
export async function getDataFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data from URL ${url}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error;
    }
}