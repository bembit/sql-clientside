document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('query-input');
    const updateOutput = document.getElementById('update-output');
    const convertButton = document.getElementById('convert-query');

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

        // Get dynamic SET clauses from user input (add additional fields as needed)
        const setFields = prompt('Enter column=value pairs, separated by commas (e.g., salary=60000, department_id=2):');
        if (!setFields) {
            updateOutput.textContent = 'SET fields are required.';
            return;
        }

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

        updateOutput.textContent = updateQuery;
    });
});
