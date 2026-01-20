/**
 * Fetches CSV data from a published Google Sheet tab.
 * @param {string} sheetId - The ID of the Google Sheet.
 * @param {string} gid - The GID of the specific tab.
 * @returns {Promise<Array>} - A promise that resolves to an array of objects.
 */
async function fetchSheetData(sheetId, gid) {
    // Changed to /export endpoint to support standard Sheet IDs (1JJ...)
    // Make sure the sheet is shared as "Anyone with the link"
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error("Error loading sheet data:", error);
        return [];
    }
}

/**
 * Simple CSV parser
 * Assumes the first row is the header.
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '')); // Remove quotes
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        // Handle comma inside quotes (simple regex approach)
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

        // Fallback for simple split if regex fails or simple CSV
        const values = row ? row : lines[i].split(',');

        if (values.length === headers.length) {
            const obj = {};
            headers.forEach((header, index) => {
                let value = values[index] ? values[index].trim() : '';
                // Remove quotes from values if present
                value = value.replace(/^"|"$/g, '').replace(/""/g, '"');
                obj[header] = value;
            });
            result.push(obj);
        }
    }
    return result;
}
