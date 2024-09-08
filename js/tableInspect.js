// small right sidebar for quick table details to build queries from
// @populateTableSelect() function to populate the table select dropdown
// @displayTableDetails() function to display table details
// @sampleData() function to display sample data limited to 5 rows

function populateTableSelect() {
    // Fetch the schema information from the backend
    fetch('./tables/schema.json')
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
            sampleData(); // Fetch and display sample data for the first table
        })
        .catch(error => console.error('Error fetching schema:', error));
}

function displayTableDetails() {
    const tableSelect = document.getElementById('table-select');
    const selectedTable = tableSelect.value;
    const tableDetails = document.getElementById('table-details');

    if (window.schema && window.schema[selectedTable]) {
        tableDetails.innerHTML = ''; // Clear existing details
        const columns = window.schema[selectedTable];

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

        // Fetch and display sample data
        sampleData();
    } else {
        console.error('Schema not available or invalid table selected.');
    }
}

function sampleData() {
    const tableSelect = document.getElementById('table-select');
    const selectedTable = tableSelect.value;

    // Fetch sample data for the selected table from local JSON files
    fetch(`../tables/${encodeURIComponent(selectedTable)}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const sampleDataContainer = document.getElementById('sample-data');
            sampleDataContainer.innerHTML = ''; // Clear existing data

            if (data && data.rows && data.rows.length > 0) {
                // Create a table to display the sample data
                const sampleTableHtml = `
                    <h3>Sample Data: ${selectedTable}</h3>
                    <table class="sample-data-table">
                        <thead>
                            <tr>
                                ${Object.keys(data.rows[0]).map(column => `<th>${column}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.rows.slice(0, 5).map(row => `
                                <tr>
                                    ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                sampleDataContainer.innerHTML = sampleTableHtml;
            } else {
                sampleDataContainer.innerHTML = '<p>No sample data available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching sample data:', error);
            document.getElementById('sample-data').innerHTML = '<p>Error loading sample data.</p>';
        });
}


document.addEventListener('DOMContentLoaded', () => {
    populateTableSelect();
    // Event listener to update details and sample data when table is changed
    document.getElementById('table-select').addEventListener('change', () => {
        displayTableDetails();
        sampleData();
    });
});
