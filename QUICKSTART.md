# Quick Start Guide

Get your fund tracker up and running in minutes!

## 1. Install Node.js (if not already installed)

Download and install Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended)

## 2. Install Dependencies

```bash
cd /path/to/flash
npm install
```

## 3. Run Your First Report

```bash
npm start
```

Your report will be generated at `reports/fund_performance_daily.csv`

## 4. Open in Apple Numbers

1. Open **Apple Numbers** on your Mac
2. Go to **File → Open**
3. Navigate to `reports/fund_performance_daily.csv`
4. Numbers will automatically import the data

## 5. Set Up Daily Automation (Optional)

### Quick Setup:

1. Find your Node.js path:
   ```bash
   which node
   ```

2. Find your project path:
   ```bash
   pwd
   ```

3. Edit the example plist file:
   ```bash
   cp examples/com.user.fundtracker.plist ~/Library/LaunchAgents/
   nano ~/Library/LaunchAgents/com.user.fundtracker.plist
   ```

4. Replace these placeholders in the file:
   - `/usr/local/bin/node` → your Node.js path from step 1
   - `/FULL/PATH/TO/flash` → your project path from step 2 (appears 3 times)

5. Create logs directory:
   ```bash
   mkdir -p logs
   ```

6. Load the automation:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.user.fundtracker.plist
   ```

7. Verify it's running:
   ```bash
   launchctl list | grep fundtracker
   ```

### Test the Automation:

```bash
launchctl start com.user.fundtracker
```

Check the logs:
```bash
cat logs/fundtracker.log
```

## Customizing Your Funds

Edit `config/funds.json` to update fund information:

```json
{
  "funds": [
    {
      "name": "Your Fund Name",
      "ticker": "TICKER",
      "allocation": 10,
      "strategicRole": "Description of role in portfolio",
      "url": "https://www.marketwatch.com/investing/fund/ticker"
    }
  ]
}
```

## Troubleshooting

**Error: Cannot find module**
```bash
npm install
```

**Permission denied**
```bash
chmod +x scripts/fund_tracker.js
```

**Automation not running**
```bash
# Check if loaded
launchctl list | grep fundtracker

# View error logs
cat logs/fundtracker.error.log

# Reload
launchctl unload ~/Library/LaunchAgents/com.user.fundtracker.plist
launchctl load ~/Library/LaunchAgents/com.user.fundtracker.plist
```

## Need Help?

See the full [README.md](README.md) for detailed documentation.
