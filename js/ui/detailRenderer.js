import { typeTagColors } from '../../utils/typeColors.js';

function renderMainInfo(data) {
    document.getElementById('pokemon-image').src = data.image;
    document.getElementById('pokemon-id').textContent = `#${String(data.id).padStart(3, '0')}`;
    document.getElementById('pokemon-name').textContent = data.name;
    document.getElementById('pokemon-description').textContent = data.description;
    
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = '';
    data.types.forEach(typeObject => {
        const typeTag = document.createElement('span');
        typeTag.className = 'type-tag';
        typeTag.textContent = typeObject.name; 


        const tagColor = typeTagColors[typeObject.originalName] || '#A8A77A'; 
        typeTag.style.backgroundColor = tagColor;
        
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
    statsContainer.innerHTML = '';
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
    movesList.innerHTML = '';
    data.moves.forEach(move => {
        const moveItem = document.createElement('li');
        moveItem.textContent = move;
        movesList.appendChild(moveItem);
    });
}

function renderEvolutionChain(data) {
    const evolutionContainer = document.getElementById('evolution-chain-container');
    evolutionContainer.innerHTML = '';

    if (!data.evolutions || data.evolutions.length === 0) {
        evolutionContainer.innerHTML = '<p>No se encontró información de la línea evolutiva.</p>';
        return;
    }

    data.evolutions.forEach((pokemon, index) => {
        const evolutionCard = document.createElement('div');
        evolutionCard.className = 'evolution-card';
        evolutionCard.addEventListener('click', () => {
            window.location.href = `pokemon.html?name=${pokemon.name}`;
        });
        
        evolutionCard.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <p>${pokemon.name}</p>
        `;
        evolutionContainer.appendChild(evolutionCard);

        if (index < data.evolutions.length - 1) {
            const arrow = document.createElement('span');
            arrow.className = 'evolution-arrow';
            arrow.textContent = '→';
            evolutionContainer.appendChild(arrow);
        }
    });
}

/**
 * Main rendering function that calls all other specific renderers.
 * @param {object} data - The clean, processed Pokémon data object.
 */
export function renderAllPokemonInfo(data) {
    document.title = data.name;
    renderMainInfo(data);
    renderDetailedInfo(data);
    renderStats(data);
    renderMoves(data);
    renderEvolutionChain(data);
}