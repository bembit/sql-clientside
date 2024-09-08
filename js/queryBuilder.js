document.addEventListener('DOMContentLoaded', () => {
    const tableSelect = document.getElementById('select-table');
    const columnSelect = document.getElementById('select-columns');
    const queryOutput = document.getElementById('query-output');
    const queryResults = document.getElementById('query-results');
    const joinInputs = document.getElementById('join-inputs');
    const whereInputs = document.getElementById('where-inputs');
    const conditionInputs = document.getElementById('condition-inputs');
    const queryComment = document.getElementById('query-comment');
    const distinctCheckbox = document.getElementById('select-distinct');

    const countQueryOutput = document.getElementById('count-query-output');

    
    let queryParts = {
        select: '*',
        from: '',
        joins: [],
        where: [],
        conditions: []
    };

    let schema = {};

    // Modify populateTableSelect to load a local JSON file
    function populateTableSelect() {
        fetch('./tables/schema.json')
            .then(response => response.json())
            .then(schemaData => {
                console.log('Loaded Schema:', schemaData);

                tableSelect.innerHTML = '';

                Object.keys(schemaData).forEach(table => {
                    const option = document.createElement('option');
                    option.value = table;
                    option.textContent = table;
                    tableSelect.appendChild(option);
                });

                schema = schemaData;

                const firstTable = tableSelect.options[0]?.value;
                if (firstTable) {
                    tableSelect.value = firstTable;
                    queryParts.from = firstTable;
                    populateColumnSelect(firstTable);
                    updateQuery();
                }
            })
            .catch(error => console.error('Error loading schema:', error));
    }

    function populateColumnSelect(table, selectElement = columnSelect) {
        selectElement.innerHTML = ''; 

        if (table && schema[table]) {
            const columns = schema[table];
            columns.forEach(column => {
                const option = document.createElement('option');
                option.value = column.name;
                option.textContent = column.name;
                selectElement.appendChild(option);
            });
        }
    }

    function updateQuery() {
        const tableAlias = document.getElementById('table-alias').value.trim();
        const selectedTable = queryParts.from;
        
        // Get columns from the main table
        const mainTableColumns = Array.from(columnSelect.selectedOptions).map(option => {
            return tableAlias ? `${tableAlias}.${option.value}` : option.value;
        });

        // Initialize queryParts.select with columns from the main table
        queryParts.select = [...mainTableColumns];

        // Add columns from each join table
        document.querySelectorAll('.join-columns').forEach(select => {
            const joinTableColumns = Array.from(select.selectedOptions).map(option => option.value);
            const joinTableName = select.closest('.query-section').querySelector('input[placeholder="Join Table"]').value;
            const joinTableAlias = select.closest('.query-section').querySelector('input[placeholder="Join Alias"]').value || joinTableName;
            queryParts.select.push(...joinTableColumns.map(column => `${joinTableAlias}.${column}`));
        });

        // Check if DISTINCT checkbox is checked
        const selectClause = distinctCheckbox.checked ? 'SELECT DISTINCT' : 'SELECT';
        
        // Construct the query
        let query = `${selectClause} ${queryParts.select.length > 0 ? queryParts.select.join(', ') : '*'}`;
        query += ` FROM ${selectedTable}`;
        if (tableAlias) {
            query += ` AS ${tableAlias}`;
        }

        // Add JOIN clauses
        if (queryParts.joins.length > 0) {
            query += ' ' + queryParts.joins.join(' ');
        }

        // Add WHERE clauses
        if (queryParts.where.length > 0) {
            query += ' WHERE ' + queryParts.where.join(' AND ');
        }

        // Add additional conditions
        if (queryParts.conditions.length > 0) {
            query += ' ' + queryParts.conditions.join(' AND ');
        }

        // Update the output
        queryOutput.textContent = query;
    }

    function handleInputChange() {
        queryParts.joins = Array.from(joinInputs.querySelectorAll('.query-section')).map(div => {
            const joinType = div.querySelector('select[placeholder="Join Type"]').value;
            const table = div.querySelector('input[placeholder="Join Table"]').value;
            const alias = div.querySelector('input[placeholder="Join Alias"]').value;
            const condition = div.querySelector('input[placeholder="Join Condition"]').value;
            return table && condition ? `${joinType} ${table} AS ${alias} ON ${condition}` : '';
        }).filter(join => join.trim() !== '');

        queryParts.where = Array.from(whereInputs.querySelectorAll('.query-section')).map(div => {
            const condition = div.querySelector('input[placeholder="WHERE Condition"]').value;
            return condition ? condition : '';
        }).filter(condition => condition.trim() !== '');

        queryParts.conditions = Array.from(conditionInputs.querySelectorAll('.query-section')).map(div => {
            const condition = div.querySelector('input[placeholder="Additional Condition"]').value;
            return condition ? condition : '';
        }).filter(condition => condition.trim() !== '');

        updateQuery();
    }

    function addJoin() {
        const joinDiv = document.createElement('div');
        joinDiv.className = 'query-section';
        joinDiv.innerHTML = `
            <select placeholder="Join Type">
                <option value="INNER JOIN">INNER JOIN</option>
                <option value="LEFT JOIN">LEFT JOIN</option>
                <option value="RIGHT JOIN">RIGHT JOIN</option>
                <option value="FULL JOIN">FULL JOIN</option>
            </select>
            <input type="text" placeholder="Join Table">
            <input type="text" placeholder="Join Alias">
            <input type="text" placeholder="Join Condition">
            <button class="remove-button">Remove Join</button>
            <div class="join-columns-container">
                <label for="join-columns">Select Columns to Join:</label>
                <select class="join-columns" multiple>
                </select>
            </div>
        `;
        joinInputs.appendChild(joinDiv);

        joinDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', handleInputChange);
        });
        joinDiv.querySelector('select').addEventListener('change', handleInputChange);
        joinDiv.querySelector('.remove-button').addEventListener('click', () => {
            joinInputs.removeChild(joinDiv);
            handleInputChange();
        });

        // Populate columns for the new join table
        const joinTableSelect = joinDiv.querySelector('input[placeholder="Join Table"]');
        joinTableSelect.addEventListener('change', (event) => {
            const table = event.target.value;
            const joinColumnSelect = joinDiv.querySelector('.join-columns');
            populateColumnSelect(table, joinColumnSelect);
        });

        updateQuery();
    }

    function addWhere() {
        const whereDiv = document.createElement('div');
        whereDiv.className = 'query-section';
        whereDiv.innerHTML = `
            <input type="text" placeholder="WHERE Condition">
            <button class="remove-button">Remove WHERE</button>
        `;
        whereInputs.appendChild(whereDiv);

        whereDiv.querySelector('input').addEventListener('input', handleInputChange);
        whereDiv.querySelector('.remove-button').addEventListener('click', () => {
            whereInputs.removeChild(whereDiv);
            handleInputChange();
        });

        updateQuery();
    }

    function addCondition() {
        const conditionDiv = document.createElement('div');
        conditionDiv.className = 'query-section';
        conditionDiv.innerHTML = `
            <input type="text" placeholder="Additional Condition">
            <button class="remove-button">Remove Condition</button>
        `;
        conditionInputs.appendChild(conditionDiv);

        conditionDiv.querySelector('input').addEventListener('input', handleInputChange);
        conditionDiv.querySelector('.remove-button').addEventListener('click', () => {
            conditionInputs.removeChild(conditionDiv);
            handleInputChange();
        });

        updateQuery();
    }

    // Function to generate a unique ID
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save query to localStorage with unique ID
    function saveQueryToLocalStorage() {
        const queryText = queryOutput.textContent;
        const queryId = generateUniqueId();
        const commentText = queryComment.value.trim(); // Get the comment text

        // Retrieve the existing queries from localStorage
        let queries = JSON.parse(localStorage.getItem('queries')) || [];

        // Add the new query as an object with ID and text
        const queryObject = {
            id: queryId,
            text: queryText,
            comment: commentText
        };
        queries.unshift(queryObject);

        // If there are more than 1000 queries, remove the oldest one
        if (queries.length > 1000) {
            queries.pop();
        }

        // Save the updated array back to localStorage
        localStorage.setItem('queries', JSON.stringify(queries));
    }

    function generateCountQuery() {
        const selectClause = 'SELECT COUNT(*) AS total_count';
        const fromClause = `FROM ${queryParts.from}`;
        const joinsClause = queryParts.joins.length > 0 ? ' ' + queryParts.joins.join(' ') : '';
        const whereClause = queryParts.where.length > 0 ? ' WHERE ' + queryParts.where.join(' AND ') : '';
        const conditionsClause = queryParts.conditions.length > 0 ? ' AND ' + queryParts.conditions.join(' AND ') : '';

        const countQuery = `${selectClause} ${fromClause}${joinsClause}${whereClause}${conditionsClause}`;

        countQueryOutput.textContent = countQuery;
    }

    // Event listener for generating count query
    document.getElementById('generate-count-query').addEventListener('click', generateCountQuery);


    // Add event listener for the distinct checkbox
    distinctCheckbox.addEventListener('change', updateQuery);
    // Add event listener for the table select
    tableSelect.addEventListener('change', (event) => {
        const table = event.target.value;
        queryParts.from = table;
        document.getElementById('table-alias').value = ''; // Reset alias input on table change
        populateColumnSelect(table);
        updateQuery();
    });

    columnSelect.addEventListener('change', updateQuery);
    
    document.getElementById('table-alias').addEventListener('input', updateQuery);
    document.getElementById('add-join').addEventListener('click', addJoin);
    document.getElementById('add-where').addEventListener('click', addWhere);
    document.getElementById('add-condition').addEventListener('click', addCondition);
    // document.getElementById('run-query').addEventListener('click', runQuery);
    document.getElementById('save-query').addEventListener('click', saveQueryToLocalStorage);

    populateTableSelect();

    function exportResultsToCSV() {
        const resultsText = queryResults.textContent;
        const results = JSON.parse(resultsText);
        
        if (!Array.isArray(results)) {
            console.error('Query results are not in the expected format.');
            return;
        }
    
        // Extract headers
        const headers = Object.keys(results[0]);
        
        // Convert JSON to CSV format
        const csvContent = [
            headers.join(','), // CSV header row
            ...results.map(row => headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(',')) // CSV data rows
        ].join('\n');
        
        // Create a Blob with CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create a link element and trigger the download
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'query_results.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    // document.getElementById('export-results').addEventListener('click', exportResultsToCSV);

    // Enable query editing on double click
    queryOutput.addEventListener('dblclick', () => {
        const currentQuery = queryOutput.textContent;
        const input = document.createElement('textarea');
        input.value = currentQuery;
        input.style.width = '100%';
        input.style.height = '100px';
        
        queryOutput.innerHTML = '';
        queryOutput.appendChild(input);
        input.focus();

        const saveEditedQuery = () => {
            queryOutput.textContent = input.value;
            // handleInputChange();
        };

        input.addEventListener('blur', saveEditedQuery);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                saveEditedQuery();
            }
        });
    });

});
