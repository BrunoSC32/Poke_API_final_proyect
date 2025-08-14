
/**
 * Renders the pagination controls (arrows and page numbers).
 * @param {HTMLElement} container - The container where the pagination will be rendered.
 * @param {object} paginationState - The current state of pagination { currentPage, totalPokemons, limit }.
 * @param {function} onPageClick - The callback function to execute when a page button is clicked.
 */
export function renderPaginationControls(container, paginationState, onPageClick) {
    const { currentPage, totalPokemons, limit } = paginationState;
    container.innerHTML = ''; 
    const totalPages = Math.ceil(totalPokemons / limit);

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => onPageClick(currentPage - 1));
    container.appendChild(prevButton);

    // Page Numbers Logic
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

    // Next Button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => onPageClick(currentPage + 1));
    container.appendChild(nextButton);
}

// --- Helper functions (private to this module) ---

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