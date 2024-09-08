document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.wrapper');
    const containerParent = document.querySelector('main');
    let draggedElement = null;

    // Load saved order from localStorage
    const savedOrder = JSON.parse(localStorage.getItem('divOrder'));
    if (savedOrder) {
        savedOrder.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                containerParent.appendChild(element);
            }
        });
    }

    containers.forEach(container => {
        // Handle drag start event
        container.addEventListener('dragstart', (event) => {
            draggedElement = event.target;
            event.target.classList.add('dragging');
        });

        // Handle drag end event
        container.addEventListener('dragend', (event) => {
            event.target.classList.remove('dragging');
        });

        // Allow the drag over event
        container.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        // Handle drop event
        container.addEventListener('drop', (event) => {
            event.preventDefault();
            if (draggedElement !== event.target) {
                const draggedIndex = Array.from(containerParent.children).indexOf(draggedElement);
                const targetIndex = Array.from(containerParent.children).indexOf(event.target);

                if (draggedIndex > targetIndex) {
                    containerParent.insertBefore(draggedElement, event.target);
                } else {
                    containerParent.insertBefore(draggedElement, event.target.nextSibling);
                }
                saveOrder();
            }
        });
    });

    function saveOrder() {
        const order = Array.from(containerParent.children).map(child => child.id);
        localStorage.setItem('divOrder', JSON.stringify(order));
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Restore visibility states from local storage
    const queryBuilder = document.getElementById('query-builder');
    const tableContainer = document.getElementById('table-container');

    if (localStorage.getItem('queryBuilderVisible') === 'false') {
        queryBuilder.style.display = 'none';
    }

    if (localStorage.getItem('tableContainerVisible') === 'false') {
        tableContainer.style.display = 'none';
    }

    updateLayout();
});

function closeElement(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';

    // Save the state to local storage
    if (elementId === 'query-builder') {
        localStorage.setItem('queryBuilderVisible', 'false');
    } else if (elementId === 'table-container') {
        localStorage.setItem('tableContainerVisible', 'false');
    }

    updateLayout();
}

function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    const isHidden = element.style.display === 'none';
    element.style.display = isHidden ? 'block' : 'none';

    // Save the state to local storage
    if (elementId === 'query-builder') {
        localStorage.setItem('queryBuilderVisible', isHidden ? 'true' : 'false');
    } else if (elementId === 'table-container') {
        localStorage.setItem('tableContainerVisible', isHidden ? 'true' : 'false');
    }

    updateLayout();
}

function updateLayout() {
    const queryBuilder = document.getElementById('query-builder');
    const tableContainer = document.getElementById('table-container');
    const main = document.querySelector('main');
    
    // Select the first and last .wrapper elements
    const firstWrapper = document.querySelector('main#query-builder-main .wrapper:first-child');
    const lastWrapper = document.querySelector('main#query-builder-main .wrapper:last-child');

    if (queryBuilder.style.display === 'none' && tableContainer.style.display !== 'none') {
        lastWrapper.style.flexBasis = '75%';
        main.style.justifyContent = 'center';
    } else if (tableContainer.style.display === 'none' && queryBuilder.style.display !== 'none') {
        firstWrapper.style.flexBasis = '75%';
        main.style.justifyContent = 'center';
    } else {
        firstWrapper.style.flexBasis = '50%';
        lastWrapper.style.flexBasis = '50%';
    }

    updateNavButtons();
}

function updateNavButtons() {
    const queryBuilder = document.getElementById('query-builder');
    const tableContainer = document.getElementById('table-container');

    document.getElementById('toggle-query-builder').style.display = queryBuilder.style.display === 'none' ? 'inline-block' : 'none';
    document.getElementById('toggle-table-container').style.display = tableContainer.style.display === 'none' ? 'inline-block' : 'none';
}

// Function to adjust font size for an element and all its children
function adjustFontSize(elementId, increment) {
    const element = document.getElementById(elementId);
    adjustFontSizeRecursively(element, increment);
}

// kinda wonky now probably because of the CSS
function adjustFontSizeRecursively(element, increment) {
    // Adjust the font size of the current element
    const currentFontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
    const newFontSize = parseFloat(currentFontSize) + increment;
    element.style.fontSize = newFontSize + 'px';

    // Recursively adjust font size for all child elements
    Array.from(element.children).forEach(child => {
        adjustFontSizeRecursively(child, increment);
    });
}

// Function to toggle full-width of a visible wrapper
function toggleFullWidth(elementId) {
    const element = document.getElementById(elementId);
    const isFullWidth = element.classList.contains('full-width');

    if (isFullWidth) {
        element.style.flexBasis = '75%';
        element.classList.remove('full-width');
    } else {
        element.style.flexBasis = '100%';
        element.classList.add('full-width');
    }
}
