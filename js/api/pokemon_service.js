const API_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches a list of Pokémon.
 * @param {number} limit - The number of Pokémon to fetch.
 * @param {number} offset - The starting point.
 * @returns {Promise<object>} - The API response data.
 */
export async function getPokemonList(limit = 20, offset = 0) {
    const url = `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    try{
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Error fetching Pokémon list: ${response.statusText}`);
        }
        return await response.json();
    }catch (error) {
        console.error('Error fetching Pokémon list:', error);
        throw error;
    }
}

/**
 * Fetches detailed information for a single Pokémon.
 * @param {string} nameOrId - The name or ID of the Pokémon.
 * @returns {Promise<object>} - The detailed Pokémon data.
 */
export async function getPokemonList(nameOrId) {
    const url = `${API_BASE_URL}/pokemon/${nameOrId}`;
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