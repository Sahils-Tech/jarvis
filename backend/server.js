const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend/
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes (placeholder — will be implemented feature by feature)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stock tickers route (coming in next iteration)
app.get('/api/stocks', (req, res) => {
    // TODO: Implement with free API (Alpha Vantage / Finnhub)
    res.json({ message: 'Stock data endpoint — coming soon' });
});

// Weather route (future)
app.get('/api/weather', (req, res) => {
    // TODO: Implement with OpenWeatherMap free tier
    res.json({ message: 'Weather endpoint — coming soon' });
});

// Sports route (future)
app.get('/api/sports', (req, res) => {
    // TODO: Implement with ESPN / TheSportsDB free tier
    res.json({ message: 'Sports endpoint — coming soon' });
});

// Catch-all: serve index.html for any other route (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n  Jarvis Dashboard running at http://localhost:${PORT}\n`);
});
