import { ConfirmationDialog } from './confirmationDialogue.js';

document.addEventListener('DOMContentLoaded', () => {
    const queryModal = document.getElementById('query-modal');
    const openQueryModalButton = document.getElementById('open-query-modal');
    const closeModalButton = document.querySelector('.modal .close');
    const queryList = document.getElementById('query-list');
    const pageInfo = document.getElementById('page-info');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const queryResults = document.getElementById('query-results');
    const localStorageInfo = document.getElementById('localstorage-info');

    let currentPage = 1;
    const queriesPerPage = 10;

    // Initialize the confirmation dialog component
    const confirmationDialog = new ConfirmationDialog(
        'confirmation-dialog',
        'confirm-delete',
        'cancel-delete',
        '#confirmation-dialog .close'
    );

    // Reference to the constructed query output element
    const queryOutput = document.getElementById('query-output');

    // Open modal
    openQueryModalButton.addEventListener('click', () => {
        queryModal.style.display = 'flex';
        displayQueries(currentPage, queryOutput, ''); // Initialize with empty search term
        checkLocalStorageSize();
    });

    // Close modal
    closeModalButton.addEventListener('click', () => {
        queryModal.style.display = 'none';
    });

    // Close modal when clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target == queryModal) {
            queryModal.style.display = 'none';
        }
    });

    // Pagination: Previous page
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayQueries(currentPage, queryOutput);
        }
    });

    // Pagination: Next page
    nextPageButton.addEventListener('click', () => {
        const savedQueries = JSON.parse(localStorage.getItem('queries')) || [];
        const totalPages = Math.ceil(savedQueries.length / queriesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayQueries(currentPage, queryOutput);
        }
    });

    // Display Queries with Pagination
    function displayQueries(page, queryOutput, searchTerm = '') {
        const savedQueries = JSON.parse(localStorage.getItem('queries')) || [];
        queryList.innerHTML = ''; // Clear the list
    
        // Filter queries based on search term
        const filteredQueries = savedQueries.filter(query =>
            query.text.toLowerCase().includes(searchTerm.toLowerCase()) || query.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        const start = (page - 1) * queriesPerPage;
        const end = start + queriesPerPage;
        const paginatedQueries = filteredQueries.slice(start, end);
    
        paginatedQueries.forEach((query) => {
            const queryItem = document.createElement('div');
            queryItem.classList.add('query-item');

            const checkComment = query.comment ? query.comment : 'No Comment';

            queryItem.innerHTML = `
                <div class="query-comment-container">
                <input type="text" class="query-comment query-comment-edit" data-id="${query.id}" value="${checkComment}">
                <button class="history-btn save-comment" data-id="${query.id}">Save Comment</button>
                </div>
                <div class="query-text">${query.text}</div>
                <div class="query-buttons">
                <button class="history-btn delete-query" data-id="${query.id}">Delete</button>
                </div>
                `;
                // <button disabled class="history-btn load-query" data-id="${query.id}">Load</button>
                // <button class="history-btn run-query" data-id="${query.id}">Run Query</button>
                // <button disabled class="history-btn export-query" data-id="${query.id}">Export Query to CSV</button>



            // Add event listener for saving the comment
            queryItem.querySelector('.save-comment').addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                const newComment = queryItem.querySelector('.query-comment-edit').value;
                saveComment(id, newComment);
            });
    
            // queryItem.querySelector('.load-query').addEventListener('click', (event) => {
            //     const id = event.target.dataset.id;
            //     const queryText = getQueryTextById(id);
            //     queryOutput.textContent = queryText;
            //     queryModal.style.display = 'none'; // Close the modal
            // });
    
            queryItem.querySelector('.delete-query').addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                confirmationDialog.showConfirmationDialog(
                    'Are you sure you want to delete this query?',
                    id,
                    (queryId) => {
                        console.log('Deleting query ID:', queryId); // Debugging
                        deleteQuery(queryId);
                        displayQueries(currentPage, queryOutput); // Refresh the list
                    }
                );
            });
    
            // queryItem.querySelector('.run-query').addEventListener('click', (event) => {
            //     const id = event.target.dataset.id;
            //     const queryText = getQueryTextById(id);
            //     runQueryFromHistory(queryText, queryResults);
            // });
    
            // queryItem.querySelector('.export-query').addEventListener('click', (event) => {
            //     const id = event.target.dataset.id;
            //     const queryText = getQueryTextById(id);
            //     exportToCSV(queryText);
            // });
    
            queryList.appendChild(queryItem);
        });
    
        // Update pagination info
        const totalPages = Math.ceil(filteredQueries.length / queriesPerPage);
        pageInfo.textContent = `Page ${page} of ${totalPages}`;
    
        // Disable/Enable buttons based on page position
        prevPageButton.disabled = page === 1;
        nextPageButton.disabled = page === totalPages;
    }

    function saveComment(id, newComment) {
        let queries = JSON.parse(localStorage.getItem('queries')) || [];
        const queryIndex = queries.findIndex(query => query.id === id);
        if (queryIndex !== -1) {
            queries[queryIndex].comment = newComment;
            localStorage.setItem('queries', JSON.stringify(queries));
            // could add a toast here
            console.log('Comment saved successfully!');
        } else {
            console.error('Error: Query not found.');
        }
    }
    
    // Helper function to get query text by ID
    function getQueryTextById(id) {
        const queries = JSON.parse(localStorage.getItem('queries')) || [];
        const query = queries.find(query => query.id === id);
        return query ? query.text : '';
    }

    function deleteQuery(id) {
        let queries = JSON.parse(localStorage.getItem('queries')) || [];
        
        console.log('Before deletion:', queries); 
        queries = queries.filter(query => query.id !== id);

        console.log('After deletion:', queries);
        localStorage.setItem('queries', JSON.stringify(queries));
    }

    function runQueryFromHistory(queryText, queryResults) {
        fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: queryText })
        })
        .then(response => response.json())
        .then(data => {
            queryResults.textContent = JSON.stringify(data.rows, null, 2);
        })
        .catch(error => console.error('Error running query:', error));
    }

    function exportToCSV(queryText) {
        // Placeholder function for exporting query results to CSV
        console.log('Exporting to CSV:', queryText);
    }

    document.getElementById('search-query').addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        currentPage = 1; // Reset to first page on new search
        displayQueries(currentPage, queryOutput, searchTerm);
    });

    // Check LocalStorage size
    function checkLocalStorageSize() {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += ((localStorage[key].length + key.length) * 2); // Each character is 2 bytes
            }
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        const usedSize = (totalSize / 1024).toFixed(2); // Size in KB
        const remainingSize = ((maxSize - totalSize) / 1024).toFixed(2); // Remaining size in KB

        console.log(`LocalStorage Size: ${usedSize} KB used, ${remainingSize} KB remaining`);
        
        localStorageInfo.innerHTML = `<p>LocalStorage Size: ${usedSize} KB used, ${remainingSize} KB remaining</p>`;

        if (totalSize > (maxSize * 0.9)) {
            alert('Warning: LocalStorage is almost full.');
        }
    }

    // Export saved queries to CSV
    function exportAllQueriesToCSV() {
        const savedQueries = JSON.parse(localStorage.getItem('queries')) || [];
        if (savedQueries.length === 0) {
            alert('No queries available to export.');
            return;
        }

        // need to add comment column
        let csvContent = "data:text/csv;charset=utf-8,";
        // csvContent += "ID,Query Text\n"; // CSV headers

        // savedQueries.forEach(query => {
        //     const row = `${query.id},"${query.text.replace(/"/g, '""')}"\n`;
        //     csvContent += row;
        // });

        csvContent += "ID,Query Text,Comment\n";

        savedQueries.forEach(query => {
            const row = `${query.id},"${query.text.replace(/"/g, '""')}","${query.comment.replace(/"/g, '""')}"\n`;
            csvContent += row;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "saved_queries.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Confirmation before clearing all queries
    document.getElementById('clear-localstorage').addEventListener('click', () => {
        console.log('Clear LocalStorage button clicked');
        confirmationDialog.showConfirmationDialog(
            'Are you sure you want to clear all saved queries? This action cannot be undone.',
            null, // No specific ID needed for clearing all
            () => {
                localStorage.removeItem('queries');
                alert('All saved queries have been cleared.');
                displayQueries(currentPage, queryOutput); 
            }
        );
    });

    // Attach event listeners to new buttons
    document.getElementById('export-all-queries').addEventListener('click', exportAllQueriesToCSV);


    // Reference to import button and file input
    const importButton = document.getElementById('import-queries');
    const fileInput = document.getElementById('csv-file-input');

    // Event listener for the Import button
    importButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file input when button is clicked
    });

    // Event listener for file input change (when a file is selected)
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvContent = e.target.result;
                importQueriesFromCSV(csvContent);
            };
            reader.readAsText(file);
        }
    });

    // Function to parse CSV and import queries into LocalStorage
    function importQueriesFromCSV(csvContent) {
        const rows = csvContent.split('\n').slice(1); // Skip the header row
        const queries = [];

        rows.forEach(row => {
            // Regular expression to parse CSV with three fields: ID, Query Text, Comment
            const match = row.match(/^(?<id>[^,]+),(?<text>".+"|[^,]+),(?<comment>".*"|[^,]*)$/);
            if (match) {
                const { id, text, comment } = match.groups;
                // Remove the quotes from the query text and comment if present
                const cleanedText = text.startsWith('"') ? text.slice(1, -1) : text;
                const cleanedComment = comment.startsWith('"') ? comment.slice(1, -1) : comment;
                queries.push({ id, text: cleanedText, comment: cleanedComment });
            }
        });

        // Add the parsed queries to localStorage
        const existingQueries = JSON.parse(localStorage.getItem('queries')) || [];
        localStorage.setItem('queries', JSON.stringify([...existingQueries, ...queries]));

        alert('Queries and comments imported successfully!');
        displayQueries(currentPage, queryOutput); // Refresh the display
    }
    
});
