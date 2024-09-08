document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('query-input');
    const updateOutput = document.getElementById('update-output');
    const convertButton = document.getElementById('convert-query');
    const queryForm = document.getElementById('query-form');
    const generatedQuery = document.getElementById('generated-query');

    convertButton.addEventListener('click', () => {
        const selectQuery = queryInput.value.trim();

        if (!selectQuery.toLowerCase().startsWith('select')) {
            updateOutput.textContent = 'Please enter a valid SELECT query.';
            return;
        }

        const tableMatch = selectQuery.match(/from\s+(\w+)\s+as\s+(\w+)/i);
        if (!tableMatch) {
            updateOutput.textContent = 'Unable to determine table and alias from query.';
            return;
        }

        const tableName = tableMatch[1];
        const tableAlias = tableMatch[2];

        // Extract the WHERE clause
        const whereMatch = selectQuery.match(/where\s+(.+)/i);
        if (!whereMatch) {
            updateOutput.textContent = 'Unable to find WHERE clause in the query.';
            return;
        }

        const whereClause = whereMatch[1];

        // Split conditions between the main table and the joined table
        const subqueryConditions = [];
        const mainTableConditions = [];

        whereClause.split('AND').forEach(condition => {
            condition = condition.trim();

            // Check if condition refers to the departments table or main table
            if (condition.includes(`${tableAlias}.department_id =`) || condition.includes('d.department_name')) {
                subqueryConditions.push(
                    condition.replace(new RegExp(`\\b${tableAlias}\\b\\.`, 'g'), '') // Replace alias with nothing
                );
            } else {
                mainTableConditions.push(
                    condition.replace(new RegExp(`\\b${tableAlias}\\b\\.`, 'g'), '') // Replace alias with nothing
                );
            }
        });

        // Populate form fields
        document.getElementById('table-name').value = tableName;
        document.getElementById('set-fields').value = ''; // Prompt user to enter SET fields
        document.getElementById('subquery-conditions').value = subqueryConditions.join(', ');
        document.getElementById('main-table-conditions').value = mainTableConditions.join(', ');

        // Show form
        queryForm.style.display = 'block';
    });

    // Handle form submission
    queryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const tableName = document.getElementById('table-name').value.trim();
        const setFields = document.getElementById('set-fields').value.trim();
        const subqueryConditions = document.getElementById('subquery-conditions').value.trim().split(',').map(c => c.trim());
        const mainTableConditions = document.getElementById('main-table-conditions').value.trim().split(',').map(c => c.trim());

        // Build the final update query
        const updateQuery = `
            UPDATE ${tableName}
            SET ${setFields}
            WHERE department_id IN (
                SELECT d.department_id
                FROM departments AS d
                WHERE ${subqueryConditions.join(' AND ')}
            )
            ${mainTableConditions.length > 0 ? 'AND ' + mainTableConditions.join(' AND ') : ''};
        `.trim();

        generatedQuery.textContent = updateQuery;
    });
});

