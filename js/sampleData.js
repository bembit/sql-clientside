document.addEventListener('DOMContentLoaded', () => {
    function populateTableSelect() {
        // Fetch the schema information from the backend
        fetch('/api/schema')
            .then(response => response.json())
            .then(schema => {
                console.log('Database Schema:', schema);
    
                // Get the table select dropdown element
                const tableSelect = document.getElementById('table-select');
                
                // Clear existing options before adding new ones
                tableSelect.innerHTML = '';
    
                // Populate the dropdown with new options
                Object.keys(schema).forEach((table, index) => {
                    const option = document.createElement('option');
                    option.value = table;
                    option.textContent = table;
                    tableSelect.appendChild(option);
    
                    // If this is the first option, select it
                    if (index === 0) {
                        tableSelect.value = table;
                    }
                });
    
                window.schema = schema;
    
                // Display details of the first table immediately
                displayTableDetails();
            })
            .catch(error => console.error('Error fetching schema:', error));
    }

    // Function to fetch and display table details and sample data
    function displayTableDetails() {
        const tableSelect = document.getElementById('table-select');
        const selectedTable = tableSelect.value;

        // Check if the schema is available and the selected table is valid
        if (window.schema && window.schema[selectedTable]) {
            const tableDetails = document.getElementById('table-details');
            tableDetails.innerHTML = ''; // Clear existing details

            const columns = window.schema[selectedTable];

            // Create a table for better presentation
            const tableHtml = `
                <h3>Table: ${selectedTable}</h3>
                <table class="table-details">
                    <thead>
                        <tr>
                            <th>Column Name</th>
                            <th>Data Type</th>
                            <th>Not Null</th>
                            <th>Default</th>
                            <th>Primary Key</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${columns.map(column => `
                            <tr>
                                <td>${column.name}</td>
                                <td>${column.type}</td>
                                <td>${column.notNull ? 'Yes' : 'No'}</td>
                                <td>${column.default || ''}</td>
                                <td>${column.primaryKey ? 'Yes' : 'No'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            tableDetails.innerHTML = tableHtml;

            // Call fetchSampleData to load the sample data for the selected table
            fetchSampleData(selectedTable);
        } else {
            console.error('Schema not available or invalid table selected.');
        }
    }

    // Function to fetch sample data for a selected table
    function fetchSampleData(table) {
        // console.log(table);
        fetch(`/api/schema?table=${encodeURIComponent(table)}`)
            .then(response => response.json(console.log('Sample Data:', response.url)))
            .then(data => {
                console.log(data);
                console.log(data.rows);
                if (data.rows && data.rows.length > 0) {
                    // console.log('Sample Data:', data);
    
                    // Display sample data in a table
                    const columns = window.schema[table];
                    console.log(columns);
                    const columnNames = columns.map(col => col.name);
    
                    const dataHtml = `
                        <h3>Sample Data for Table: ${table}</h3>
                        <table class="">
                            <thead>
                                <tr>
                                    ${columnNames.map(name => `<th>${name}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${data.rows.map(row => `
                                    <tr>
                                        ${columnNames.map(name => `<td>${row[name]}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
                    document.getElementById('table-sample-data').innerHTML = dataHtml;
                } else {
                    document.getElementById('table-sample-data').innerHTML = '<p>No data available for this table.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching sample data:', error);
                document.getElementById('table-sample-data').innerHTML = '<p>Error fetching data.</p>';
            });
    }
    
    // Event listener for table selection change
    document.getElementById('table-select').addEventListener('change', function () {
        const selectedTable = this.value;
        if (selectedTable) {
            displayTableDetails();  // Show table details
            fetchSampleData(selectedTable);  // Fetch and display sample data
        }
    });
    
    // Initial population of table select options
    populateTableSelect();
    

});
