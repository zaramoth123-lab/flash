# Flash Fund Tracker

Automated fund performance tracking system that provides daily updates on your investment portfolio with market analysis and recommendations.

## Features

- ✅ Daily fund performance tracking
- ✅ Market data fetching from public sources
- ✅ Automated recommendations based on performance
- ✅ Market factors and economic considerations
- ✅ Numbers-compatible CSV output (Mac)
- ✅ Easy automation with macOS launchd

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Funds

Edit `config/funds.json` to add or update your fund information. The configuration includes:
- Fund name
- Ticker symbol (if available)
- Target allocation percentage
- Strategic role in your portfolio
- MarketWatch URL (optional)

### 3. Run Manually

```bash
npm start
```

This will generate a report in `reports/fund_performance_daily.csv` that can be opened in Apple Numbers.

## Automate Daily Updates on Mac

To receive automatic daily updates, set up a launchd agent that runs the script every day.

### Step 1: Create launchd plist file

Create a file at `~/Library/LaunchAgents/com.user.fundtracker.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.fundtracker</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/FULL/PATH/TO/flash/scripts/fund_tracker.js</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>/FULL/PATH/TO/flash</string>
    
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>8</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    
    <key>StandardOutPath</key>
    <string>/FULL/PATH/TO/flash/logs/fundtracker.log</string>
    
    <key>StandardErrorPath</key>
    <string>/FULL/PATH/TO/flash/logs/fundtracker.error.log</string>
    
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
```

**Important:** Replace `/FULL/PATH/TO/flash` with the actual path to this repository on your system.

### Step 2: Find your Node.js path

```bash
which node
```

Update the `ProgramArguments` section with your actual Node.js path if it's different from `/usr/local/bin/node`.

### Step 3: Create logs directory

```bash
mkdir -p logs
```

### Step 4: Load the launchd agent

```bash
launchctl load ~/Library/LaunchAgents/com.user.fundtracker.plist
```

### Step 5: Verify it's loaded

```bash
launchctl list | grep fundtracker
```

### Managing the Automation

**Stop the automation:**
```bash
launchctl unload ~/Library/LaunchAgents/com.user.fundtracker.plist
```

**Start the automation:**
```bash
launchctl load ~/Library/LaunchAgents/com.user.fundtracker.plist
```

**Test it manually:**
```bash
launchctl start com.user.fundtracker
```

**View logs:**
```bash
tail -f logs/fundtracker.log
```

## Changing the Schedule

Edit the `StartCalendarInterval` section in the plist file to change when the script runs:

- **Daily at 8:00 AM** (default):
  ```xml
  <key>StartCalendarInterval</key>
  <dict>
      <key>Hour</key>
      <integer>8</integer>
      <key>Minute</key>
      <integer>0</integer>
  </dict>
  ```

- **Multiple times per day** (e.g., 8 AM and 6 PM):
  ```xml
  <key>StartCalendarInterval</key>
  <array>
      <dict>
          <key>Hour</key>
          <integer>8</integer>
          <key>Minute</key>
          <integer>0</integer>
      </dict>
      <dict>
          <key>Hour</key>
          <integer>18</integer>
          <key>Minute</key>
          <integer>0</integer>
      </dict>
  </array>
  ```

After making changes, reload the agent:
```bash
launchctl unload ~/Library/LaunchAgents/com.user.fundtracker.plist
launchctl load ~/Library/LaunchAgents/com.user.fundtracker.plist
```

## Output Files

The script generates two files in the `reports/` directory:

1. **fund_performance_daily.csv** - Numbers-compatible CSV with:
   - Daily fund performance data
   - Recommendations for each fund
   - Market factors and economic considerations
   - Portfolio health summary

2. **fund_performance_daily.json** - JSON version for programmatic access

## Opening in Numbers

1. Open Apple Numbers
2. Go to File → Open
3. Navigate to `reports/fund_performance_daily.csv`
4. Numbers will automatically import the CSV
5. You can then format and customize the spreadsheet as needed

## Understanding Recommendations

The system provides four types of recommendations:

- **HOLD** - Fund is performing normally, maintain current allocation
- **CONSIDER TAKING PROFITS** - Strong gains (>5%), consider rebalancing
- **MONITOR CLOSELY** - Underperforming (-2% to -5%), watch for trends
- **CONSIDER BUYING** - Significant decline (>5%), potential opportunity

Always consult with a financial advisor before making investment decisions.

## Portfolio Overview

Your current allocation:
- **70% Equities**
  - 30% Large Cap (Vanguard Russell 3000, JP Morgan Large Cap Growth)
  - 14% International (iShares MSCI Total International)
  - 6% Mid Cap (iShares Russell Mid-Cap)
  - 20% Small Cap (JPMorgan Small Cap Value, PGIM Jennison Small Company)
- **13% Fixed Income** (PIMCO Total Return)
- **3% Stable Value** (Prudential Stable Value)
- **12% Target Date** (Day One 2050 Fund)
- **2% Cash/Other**

## Troubleshooting

**Script not running automatically:**
- Check logs in `logs/fundtracker.error.log`
- Verify the plist file paths are correct (use absolute paths)
- Ensure Node.js path is correct: `which node`
- Check launchd status: `launchctl list | grep fundtracker`

**No data for certain funds:**
- Some funds may not have ticker symbols available
- Check if the MarketWatch URL is accessible
- Update `config/funds.json` with correct ticker symbols

**Permission errors:**
- Ensure the script has write permissions to the `reports/` and `logs/` directories
- Check file permissions: `ls -la reports/ logs/`

## Support

For issues or questions, please open an issue in the repository.
