const fs = require('fs');
const axios = require('axios');
const { Parser } = require('json2csv');

// Function to fetch fund performance data
async function fetchFundData(fundList) {
    const performanceData = [];

    for (const fund of fundList) {
        // Replace the URL with the actual API endpoint for fetching fund data
        const response = await axios.get(`https://api.example.com/funds/${fund}`);
        performanceData.push(response.data);
    }

    return performanceData;
}

// Function to generate CSV file
function generateCSV(data) {
    const json2csvParser = new Parser();
    return json2csvParser.parse(data);
}

// Main function
async function main() {
    const fundList = ['fund1', 'fund2', 'fund3']; // Replace with user input or other sources
    const performanceData = await fetchFundData(fundList);
    const csv = generateCSV(performanceData);

    // Save CSV to reports directory
    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync('reports/fund_performance.csv', csv);
    console.log('CSV file generated at reports/fund_performance.csv');
}

main().catch(error => console.error(error));
