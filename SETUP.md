# Jarvis Dashboard - Setup Guide

## Getting Your Free API Keys

### 1. Finnhub (Stock Data) — REQUIRED FOR STOCK TICKERS
1. Go to https://finnhub.io/register
2. Sign up with your email (free tier: 60 API calls/min, no credit card)
3. After logging in, go to https://finnhub.io/dashboard
4. Copy your API key from the dashboard
5. Paste it into `config/settings.json`:
   ```json
   "apiKey": "YOUR_API_KEY_HERE"
   ```

### 2. OpenWeatherMap (Weather) — COMING SOON
1. Go to https://openweathermap.org/api
2. Sign up for free (60 calls/min)
3. Copy your API key and add to `config/settings.json`

### 3. TheSportsDB (Sports) — COMING SOON
1. Go to https://www.thesportsdb.com/
2. Sign up for free (unofficial API, no key required for basic use)

---

## Running the Dashboard

### Start the server:
```bash
cd ~/Hermes Projects/Jarvis
npm install  # First time only
npm start    # Start the server
```

### Open in browser:
Navigate to http://localhost:3000

---

## Troubleshooting

### "Stock data endpoint — coming soon" message
This means the API key isn't configured yet. Follow steps above to get your Finnhub key.

### Rate limit errors
Finnhub free tier allows 60 calls/min. The dashboard caches data for 60 seconds to stay within limits.

### Dashboard not loading
Make sure the server is running (`npm start`) and you're accessing http://localhost:3000
