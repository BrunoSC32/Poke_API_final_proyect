

export function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.dataset.pokemonName = pokemon.name;

    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="Imagen de ${pokemon.name}">
        <h3>${pokemon.name}</h3>
    `;

    card.addEventListener('click', () => {
        window.location.href = `pokemon.html?name=${pokemon.name}`;
    });

    return card;
}


export function renderPaginationControls(container, paginationState, onPageClick) {
    const { currentPage, totalPokemons, limit } = paginationState;
    container.innerHTML = ''; // Limpiar controles antiguos.
    const totalPages = Math.ceil(totalPokemons / limit);

    // Botón "Anterior"
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => onPageClick(currentPage - 1));
    container.appendChild(prevButton);

    // Números de Página
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        container.appendChild(createPageButton(1, currentPage, onPageClick));
        if (startPage > 2) container.appendChild(createEllipsis());
    }

    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createPageButton(i, currentPage, onPageClick));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) container.appendChild(createEllipsis());
        container.appendChild(createPageButton(totalPages, currentPage, onPageClick));
    }

    // Botón "Siguiente"
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => onPageClick(currentPage + 1));
    container.appendChild(nextButton);
}


function createPageButton(pageNumber, currentPage, onPageClick) {
    const button = document.createElement('button');
    button.textContent = pageNumber;
    if (pageNumber === currentPage) {
        button.classList.add('active');
    }
    button.addEventListener('click', () => onPageClick(pageNumber));
    return button;
}

function createEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    return ellipsis;
}