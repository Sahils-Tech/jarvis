# Jarvis Dashboard

Personal AI command center — a sleek, dark-themed dashboard inspired by Iron Man's HUD.

## Features (Planned)
- [x] Morning brief (AI, stocks, tech, sports) via daily cron job
- [ ] Live stock tickers (real-time market data)
- [ ] Weather integration
- [ ] Sports scores & World Cup standings
- [ ] Customizable data sources

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js + Express
- **Data Sources:** Free-tier APIs (Alpha Vantage, OpenWeatherMap, ESPN API, etc.)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Project Structure
```
Jarvis/
├── frontend/          # Dashboard UI (HTML/CSS/JS)
│   ├── index.html     # Main dashboard entry point
│   ├── css/           # Stylesheets
│   └── js/            # JavaScript modules
├── backend/           # Express server & API routes
│   ├── server.js      # Main server file
│   └── routes/        # API endpoint handlers
├── data/              # Data sources & caching layer
│   ├── sources/       # API configs & parsers
│   └── cache/         # Cached responses
├── config/            # App configuration (API keys, settings)
└── tests/             # Unit & integration tests
```

## API Keys (Free Tiers)
All data sources use free tiers — no credit card required:
- **Stock Data:** Alpha Vantage (free tier: 25 requests/day) or Finnhub
- **Weather:** OpenWeatherMap (free tier: 60 calls/min)
- **Sports:** ESPN API (unofficial, free) or TheSportsDB

## License
MIT
