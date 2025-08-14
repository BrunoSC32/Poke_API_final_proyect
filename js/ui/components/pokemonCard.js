
import { typeBackgroundColors, typeTagColors } from '../../utils/typeColors.js';

/**
 * Creates and returns a card element for a single Pokémon.
 * @param {object} pokemon - The detailed Pokémon data object from the API.
 * @returns {HTMLElement} - The fully constructed card element.
 */
export function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    // Set Card Background Color
    const primaryType = pokemon.types[0].type.name;
    const backgroundColor = typeBackgroundColors[primaryType] || '#E0E0E0';
    card.style.backgroundColor = backgroundColor;

    // Format Pokémon ID
    const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

    // Generate Type Tags
    const typesHtml = pokemon.types.map(typeInfo => {
        const typeName = typeInfo.type.name;
        const tagColor = typeTagColors[typeName] || '#A8A77A';
        return `<span class="type-tag" style="background-color: ${tagColor}">${typeName}</span>`;
    }).join('');

    // Assemble the Card's HTML Structure
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="Image of ${pokemon.name}">
        </div>
        <div class="card-info">
            <span class="pokemon-id">${formattedId}</span>
            <h3 class="pokemon-name">${pokemon.name}</h3>
            <div class="pokemon-types">
                ${typesHtml}
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        window.location.href = `pokemon.html?name=${pokemon.name}`;
    });

    return card;
}