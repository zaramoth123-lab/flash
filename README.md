# Flash Fund Tracker

A daily fund performance tracking system that generates Apple Numbers-compatible reports for your investment portfolio.

## Overview

This system automatically tracks the performance of 9 investment funds and generates daily reports with recommendations based on market performance.

## Portfolio Funds

| Fund Name | Allocation % | Strategic Role |
|-----------|--------------|----------------|
| Day One 2050 Fund | 12% | Diversified glide path anchor; trimmed for flexibility |
| Vanguard Russell 3000 Index I | 30% | Core U.S. equity; includes mega-cap tech |
| Large Cap Growth / JP Morgan Invst Mgmt K | 5% | Active large-cap growth; tech tilt |
| iShares MSCI Total International Index K | 14% | Global diversification; EM tech hubs |
| iShares Russell Mid-Cap Index K | 6% | Mid-cap exposure; rising tech disruptors |
| JPMorgan Small Cap Value R6 | 8% | Value tilt; balances growth-heavy small caps |
| PGIM Jennison Small Company R6 | 12% | Small-cap growth; strong AI/cloud exposure |
| PIMCO Total Return Instl | 10% | Active bond sleeve; flexible duration and credit |
| Prudential Stable Value Fund | 3% | Liquidity buffer; volatility hedge |

**Total Allocation:** 100%

## Features

- ✅ Daily automated fund performance tracking
- ✅ Apple Numbers compatible CSV reports
- ✅ Recommendations based on performance trends
- ✅ Market data integration (when available)
- ✅ Historical report archiving

## Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zaramoth123-lab/flash.git
cd flash
```

2. Install dependencies:
```bash
npm install
```

3. Run the tracker:
```bash
npm start
```

## Usage

### Manual Run

To generate a report manually:

```bash
npm start
```

The report will be saved in the `reports/` directory with the date in the filename (e.g., `fund_performance_2025-09-30.csv`).

### Opening in Apple Numbers

1. Locate the CSV file in the `reports/` directory
2. Double-click the file (macOS will open it in Numbers by default)
3. Or right-click → Open With → Numbers

### Automated Daily Reports

The system is configured to run automatically every day at 8 AM EST via GitHub Actions:

1. Navigate to the "Actions" tab in your GitHub repository
2. Click on "Daily Fund Performance Report" workflow
3. Reports are automatically generated daily and stored in the `reports/` directory
4. You can also manually trigger the workflow using the "Run workflow" button

### Viewing Historical Reports

All daily reports are stored in the `reports/` directory with filenames like:
- `fund_performance_2025-09-30.csv`
- `fund_performance_2025-09-29.csv`
- etc.

## Report Contents

Each daily report includes:

- **Date**: Report generation date
- **Fund Name**: Full fund name
- **Allocation %**: Percentage of your portfolio
- **Strategic Role**: Investment purpose in portfolio
- **Ticker**: Fund ticker symbol (when available)
- **Current Price**: Latest fund price
- **Price Change**: Daily price change
- **Percent Change**: Daily percentage change
- **YTD Return**: Year-to-date return
- **Recommendation**: Action recommendation based on performance
- **Data Source**: Source of the data

## Recommendations Guide

The system provides the following recommendations:

- **Hold - Strong performance**: Fund is performing well (>5% gain)
- **Hold - Positive performance**: Fund is up but not dramatically
- **Hold - Minor decline**: Small decline (<3%), normal fluctuation
- **Review - Notable decline**: Decline of 3-5%, worth checking
- **Review - Significant decline**: Decline >5%, consider action
- **Hold - Monitor performance**: Default when data is unavailable

## Customization

### Adding More Funds

Edit `scripts/fund_tracker.js` and add to the `FUND_PORTFOLIO` array:

```javascript
{
    name: 'Your Fund Name',
    allocation: 15,  // Percentage
    strategic_role: 'Your investment strategy',
    ticker: 'TICKER',
    url: 'https://www.marketwatch.com/investing/fund/ticker'
}
```

### Changing Schedule

Edit `.github/workflows/daily-fund-report.yml` and modify the cron schedule:

```yaml
schedule:
  - cron: '0 13 * * *'  # Change time here (UTC)
```

### Adding Data Sources

The system currently supports:
- MarketWatch URLs
- Manual data entry (when URLs unavailable)

To add more data sources, modify the `fetchFundData()` function in `scripts/fund_tracker.js`.

## Troubleshooting

### No Live Data for Some Funds

Some funds may not have publicly available data sources. You can:
1. Manually update the CSV after generation
2. Add fund-specific URLs in the `FUND_PORTFOLIO` configuration
3. Contact fund providers for API access

### GitHub Actions Not Running

1. Ensure GitHub Actions are enabled for your repository
2. Check the Actions tab for any error messages
3. Verify the workflow file syntax is correct

## Project Structure

```
flash/
├── .github/
│   └── workflows/
│       └── daily-fund-report.yml    # GitHub Actions workflow
├── scripts/
│   └── fund_tracker.js              # Main tracking script
├── reports/                          # Generated reports directory
├── package.json                      # Node.js dependencies
└── README.md                         # This file
```

## Dependencies

- **axios**: HTTP client for fetching data
- **cheerio**: HTML parsing for web scraping
- **json2csv**: CSV generation from JSON data

## License

ISC

## Support

For issues or questions, please open an issue in the GitHub repository.

---

**Note**: This tool is for informational purposes only and should not be considered financial advice. Always consult with a financial advisor before making investment decisions.
