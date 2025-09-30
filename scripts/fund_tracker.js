const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');

// Define the fund portfolio with allocations and strategic roles
const FUND_PORTFOLIO = [
    {
        name: 'Day One 2050 Fund',
        allocation: 12,
        strategic_role: 'Diversified glide path anchor; trimmed for flexibility',
        ticker: '',
        url: ''
    },
    {
        name: 'Vanguard Russell 3000 Index I',
        allocation: 30,
        strategic_role: 'Core U.S. equity; includes mega-cap tech',
        ticker: 'VRTTX',
        url: 'https://www.marketwatch.com/investing/fund/vrttx'
    },
    {
        name: 'Large Cap Growth / JP Morgan Invst Mgmt K',
        allocation: 5,
        strategic_role: 'Active large-cap growth; tech tilt',
        ticker: '',
        url: ''
    },
    {
        name: 'iShares MSCI Total International Index K',
        allocation: 14,
        strategic_role: 'Global diversification; EM tech hubs',
        ticker: '',
        url: ''
    },
    {
        name: 'iShares Russell Mid-Cap Index K',
        allocation: 6,
        strategic_role: 'Mid-cap exposure; rising tech disruptors',
        ticker: '',
        url: ''
    },
    {
        name: 'JPMorgan Small Cap Value R6',
        allocation: 8,
        strategic_role: 'Value tilt; balances growth-heavy small caps',
        ticker: 'JSVUX',
        url: 'https://www.marketwatch.com/investing/fund/jgsmx'
    },
    {
        name: 'PGIM Jennison Small Company R6',
        allocation: 12,
        strategic_role: 'Small-cap growth; strong AI/cloud exposure',
        ticker: '',
        url: ''
    },
    {
        name: 'PIMCO Total Return Instl',
        allocation: 10,
        strategic_role: 'Active bond sleeve; flexible duration and credit',
        ticker: '',
        url: ''
    },
    {
        name: 'Prudential Stable Value Fund',
        allocation: 3,
        strategic_role: 'Liquidity buffer; volatility hedge',
        ticker: '',
        url: ''
    }
];

// Function to fetch fund performance data
async function fetchFundData(fund) {
    try {
        const result = {
            fund_name: fund.name,
            allocation_percent: fund.allocation,
            strategic_role: fund.strategic_role,
            ticker: fund.ticker || 'N/A',
            date: new Date().toISOString().split('T')[0],
            current_price: 'N/A',
            price_change: 'N/A',
            percent_change: 'N/A',
            ytd_return: 'N/A',
            recommendation: 'Hold - Monitor performance',
            data_source: fund.url || 'Manual tracking required'
        };

        // If we have a URL, attempt to fetch data
        if (fund.url && fund.url.includes('marketwatch.com')) {
            try {
                const response = await axios.get(fund.url, {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    }
                });
                
                const $ = cheerio.load(response.data);
                
                // Try to extract basic price information
                const price = $('.intraday__price .value')?.text()?.trim();
                const change = $('.intraday__change .change--point--q')?.text()?.trim();
                const percentChange = $('.intraday__change .change--percent--q')?.text()?.trim();
                
                if (price) result.current_price = price;
                if (change) result.price_change = change;
                if (percentChange) result.percent_change = percentChange;
                
            } catch (fetchError) {
                console.log(`Could not fetch live data for ${fund.name}: ${fetchError.message}`);
            }
        }

        // Generate basic recommendation
        result.recommendation = generateRecommendation(fund, result);

        return result;
    } catch (error) {
        console.error(`Error processing ${fund.name}:`, error.message);
        return {
            fund_name: fund.name,
            allocation_percent: fund.allocation,
            strategic_role: fund.strategic_role,
            ticker: fund.ticker || 'N/A',
            date: new Date().toISOString().split('T')[0],
            current_price: 'Error',
            price_change: 'Error',
            percent_change: 'Error',
            ytd_return: 'N/A',
            recommendation: 'Error fetching data',
            data_source: 'Error'
        };
    }
}

// Function to generate recommendations based on fund performance
function generateRecommendation(fund, data) {
    // Basic recommendation logic - can be enhanced with more sophisticated analysis
    const percentChange = parseFloat(data.percent_change);
    
    if (isNaN(percentChange)) {
        return 'Hold - Monitor performance regularly';
    }
    
    if (percentChange > 5) {
        return 'Hold - Strong performance, consider rebalancing if over-allocated';
    } else if (percentChange > 0) {
        return 'Hold - Positive performance, continue monitoring';
    } else if (percentChange > -3) {
        return 'Hold - Minor decline, normal market fluctuation';
    } else if (percentChange > -5) {
        return 'Review - Notable decline, assess market conditions';
    } else {
        return 'Review - Significant decline, consider rebalancing options';
    }
}

// Function to generate CSV file compatible with Apple Numbers
function generateCSV(data) {
    const fields = [
        { label: 'Date', value: 'date' },
        { label: 'Fund Name', value: 'fund_name' },
        { label: 'Allocation %', value: 'allocation_percent' },
        { label: 'Strategic Role', value: 'strategic_role' },
        { label: 'Ticker', value: 'ticker' },
        { label: 'Current Price', value: 'current_price' },
        { label: 'Price Change', value: 'price_change' },
        { label: 'Percent Change', value: 'percent_change' },
        { label: 'YTD Return', value: 'ytd_return' },
        { label: 'Recommendation', value: 'recommendation' },
        { label: 'Data Source', value: 'data_source' }
    ];
    
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(data);
}

// Function to generate summary analysis
function generateSummary(performanceData) {
    const summary = {
        total_funds: performanceData.length,
        date: new Date().toISOString().split('T')[0],
        total_allocation: performanceData.reduce((sum, fund) => sum + fund.allocation_percent, 0),
        funds_with_data: performanceData.filter(f => f.current_price !== 'N/A' && f.current_price !== 'Error').length,
        action_items: []
    };

    // Identify funds that need review
    const needsReview = performanceData.filter(f => f.recommendation.includes('Review'));
    if (needsReview.length > 0) {
        summary.action_items.push(`${needsReview.length} fund(s) need review: ${needsReview.map(f => f.fund_name).join(', ')}`);
    }

    // Check for missing data
    const missingData = performanceData.filter(f => f.current_price === 'N/A' || f.current_price === 'Error');
    if (missingData.length > 0) {
        summary.action_items.push(`${missingData.length} fund(s) require manual data entry or URL configuration`);
    }

    return summary;
}

// Main function
async function main() {
    console.log('Starting fund performance analysis...\n');
    console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
    console.log(`Tracking ${FUND_PORTFOLIO.length} funds\n`);

    const performanceData = [];

    // Fetch data for each fund
    for (const fund of FUND_PORTFOLIO) {
        console.log(`Fetching data for: ${fund.name}...`);
        const data = await fetchFundData(fund);
        performanceData.push(data);
        
        // Small delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Generate CSV
    const csv = generateCSV(performanceData);

    // Save CSV to reports directory
    fs.mkdirSync('reports', { recursive: true });
    const filename = `reports/fund_performance_${new Date().toISOString().split('T')[0]}.csv`;
    fs.writeFileSync(filename, csv);
    console.log(`\nCSV file generated at ${filename}`);
    console.log('This file can be opened directly in Apple Numbers\n');

    // Generate and display summary
    const summary = generateSummary(performanceData);
    console.log('=== Summary ===');
    console.log(`Total Funds: ${summary.total_funds}`);
    console.log(`Total Allocation: ${summary.total_allocation}%`);
    console.log(`Funds with Live Data: ${summary.funds_with_data}`);
    
    if (summary.action_items.length > 0) {
        console.log('\n=== Action Items ===');
        summary.action_items.forEach((item, index) => {
            console.log(`${index + 1}. ${item}`);
        });
    }

    console.log('\n=== Next Steps ===');
    console.log('1. Open the CSV file in Apple Numbers');
    console.log('2. Review recommendations for each fund');
    console.log('3. Configure URLs for funds missing live data');
    console.log('4. Set up GitHub Actions for daily automated runs');
}

main().catch(error => console.error('Error:', error));
