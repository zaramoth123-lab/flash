const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');

// Load fund configuration
function loadFundConfig() {
    const configPath = path.join(__dirname, '..', 'config', 'funds.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
}

// Fetch fund data from MarketWatch
async function fetchMarketWatchData(ticker) {
    if (!ticker) return null;
    
    try {
        const url = `https://www.marketwatch.com/investing/fund/${ticker.toLowerCase()}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        
        // Extract price and change data
        const price = $('.intraday__price .value').first().text().trim();
        const change = $('.change--point--q .value').first().text().trim();
        const changePercent = $('.change--percent--q .value').first().text().trim();
        
        return {
            price: price || 'N/A',
            change: change || 'N/A',
            changePercent: changePercent || 'N/A'
        };
    } catch (error) {
        console.log(`Error fetching data for ${ticker}:`, error.message);
        return null;
    }
}

// Generate market analysis and recommendations
function generateAnalysis(fundData) {
    const analysis = [];
    
    for (const fund of fundData) {
        let recommendation = 'HOLD';
        let reasoning = 'Maintain current allocation';
        
        if (fund.changePercent && fund.changePercent !== 'N/A') {
            const percentValue = parseFloat(fund.changePercent.replace('%', '').replace(/[()]/g, ''));
            
            if (!isNaN(percentValue)) {
                if (percentValue > 5) {
                    recommendation = 'CONSIDER TAKING PROFITS';
                    reasoning = 'Strong gains - consider rebalancing to maintain target allocation';
                } else if (percentValue > 2) {
                    recommendation = 'HOLD';
                    reasoning = 'Performing well - monitor for continued strength';
                } else if (percentValue < -5) {
                    recommendation = 'CONSIDER BUYING';
                    reasoning = 'Significant decline - potential buying opportunity if fundamentals remain strong';
                } else if (percentValue < -2) {
                    recommendation = 'MONITOR CLOSELY';
                    reasoning = 'Underperforming - watch for further weakness or reversal signals';
                }
            }
        }
        
        analysis.push({
            fundName: fund.name,
            recommendation,
            reasoning
        });
    }
    
    return analysis;
}

// Generate market factors commentary
function generateMarketFactors() {
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    return {
        date: today,
        economicFactors: [
            'Monitor Federal Reserve policy and interest rate decisions',
            'Watch inflation data and CPI reports',
            'Track employment data and economic growth indicators',
            'Consider geopolitical events impacting international holdings'
        ],
        portfolioHealth: 'Diversified across asset classes with 70% equity / 30% fixed income/stable value split',
        rebalancingNote: 'Review quarterly to maintain target allocations as market movements create drift'
    };
}

// Function to fetch fund performance data
async function fetchFundData(fundConfig) {
    const performanceData = [];
    const timestamp = new Date().toISOString();
    
    console.log('Fetching fund data...');
    
    for (const fund of fundConfig.funds) {
        console.log(`Processing: ${fund.name}`);
        
        const marketData = await fetchMarketWatchData(fund.ticker);
        
        const fundData = {
            date: new Date().toLocaleDateString('en-US'),
            name: fund.name,
            ticker: fund.ticker || 'N/A',
            allocation: `${fund.allocation}%`,
            strategicRole: fund.strategicRole,
            currentPrice: marketData?.price || 'N/A',
            dayChange: marketData?.change || 'N/A',
            dayChangePercent: marketData?.changePercent || 'N/A',
            url: fund.url || 'N/A'
        };
        
        performanceData.push(fundData);
        
        // Be respectful with requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return performanceData;
}

// Function to generate comprehensive CSV file
function generateCSV(performanceData, analysis, marketFactors) {
    const timestamp = new Date().toLocaleDateString('en-US');
    
    // Main performance data
    const performanceFields = [
        'date',
        'name',
        'ticker',
        'allocation',
        'strategicRole',
        'currentPrice',
        'dayChange',
        'dayChangePercent',
        'url'
    ];
    
    const performanceParser = new Parser({ fields: performanceFields });
    const performanceCsv = performanceParser.parse(performanceData);
    
    // Analysis and recommendations
    const analysisFields = ['fundName', 'recommendation', 'reasoning'];
    const analysisParser = new Parser({ fields: analysisFields });
    const analysisCsv = analysisParser.parse(analysis);
    
    // Combine into a single report
    let fullReport = `Fund Performance Report - ${timestamp}\n\n`;
    fullReport += `=== DAILY FUND PERFORMANCE ===\n`;
    fullReport += performanceCsv + '\n\n';
    fullReport += `=== RECOMMENDATIONS ===\n`;
    fullReport += analysisCsv + '\n\n';
    fullReport += `=== MARKET FACTORS ===\n`;
    fullReport += `Date: ${marketFactors.date}\n\n`;
    fullReport += `Economic Factors to Consider:\n`;
    marketFactors.economicFactors.forEach((factor, i) => {
        fullReport += `${i + 1}. ${factor}\n`;
    });
    fullReport += `\nPortfolio Health: ${marketFactors.portfolioHealth}\n`;
    fullReport += `Rebalancing Note: ${marketFactors.rebalancingNote}\n`;
    
    return fullReport;
}

// Main function
async function main() {
    try {
        console.log('Starting fund tracker...\n');
        
        // Load configuration
        const fundConfig = loadFundConfig();
        console.log(`Loaded ${fundConfig.funds.length} funds from configuration\n`);
        
        // Fetch performance data
        const performanceData = await fetchFundData(fundConfig);
        
        // Generate analysis
        console.log('\nGenerating analysis and recommendations...');
        const analysis = generateAnalysis(performanceData);
        const marketFactors = generateMarketFactors();
        
        // Generate CSV report
        const csv = generateCSV(performanceData, analysis, marketFactors);
        
        // Save CSV to reports directory
        fs.mkdirSync('reports', { recursive: true });
        const reportPath = 'reports/fund_performance_daily.csv';
        fs.writeFileSync(reportPath, csv);
        
        console.log(`\n✓ Report generated successfully at ${reportPath}`);
        console.log('✓ This file can be opened in Apple Numbers on your Mac');
        console.log('✓ To automate daily updates, see README.md for launchd setup instructions\n');
        
        // Also save a JSON version for programmatic access
        const jsonReport = {
            generated: new Date().toISOString(),
            performanceData,
            analysis,
            marketFactors
        };
        fs.writeFileSync('reports/fund_performance_daily.json', JSON.stringify(jsonReport, null, 2));
        
    } catch (error) {
        console.error('Error in main function:', error);
        throw error;
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
