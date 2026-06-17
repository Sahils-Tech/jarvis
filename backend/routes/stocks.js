const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Load config
const configPath = path.join(__dirname, '../../config/settings.json');
let config;
try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
    config = {};
}

// Cache for stock data (in-memory, will be replaced with file-based cache later)
const stockCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

/**
 * Fetch stock quote from Finnhub
 */
async function fetchStockQuote(symbol) {
    const apiKey = config.dataSources?.stocks?.apiKey || 'YOUR_FINNHUB_API_KEY';
    const cacheKey = `quote_${symbol}`;
    
    // Check cache first
    if (stockCache.has(cacheKey)) {
        const cached = stockCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }
    }

    try {
        const response = await axios.get('https://finnhub.io/api/v1/quote', {
            params: { symbol, token: apiKey }
        });

        const data = response.data;
        
        // Cache the result
        stockCache.set(cacheKey, {
            data: { symbol, price: data.c, change: data.d, percentChange: data.dp },
            timestamp: Date.now()
        });

        return { symbol, price: data.c, change: data.d, percentChange: data.dp };
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
    }
}

/**
 * Fetch stock history for sparkline (last 6 data points)
 */
async function fetchStockHistory(symbol, days = 1) {
    const apiKey = config.dataSources?.stocks?.apiKey || 'YOUR_FINNHUB_API_KEY';
    const cacheKey = `history_${symbol}`;
    
    if (stockCache.has(cacheKey)) {
        const cached = stockCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }
    }

    try {
        const response = await axios.get('https://finnhub.io/api/v1/stock/candle', {
            params: { symbol, resolution: '5', from: Math.floor(Date.now() / 1000) - (days * 86400), to: Math.floor(Date.now() / 1000), token: apiKey }
        });

        const data = response.data;
        
        // Take last 6 data points for sparkline
        const sparkData = data.c.slice(-6);
        
        stockCache.set(cacheKey, {
            data: sparkData,
            timestamp: Date.now()
        });

        return sparkData;
    } catch (error) {
        console.error(`Error fetching history for ${symbol}:`, error.message);
        return null;
    }
}

/**
 * GET /api/stocks - Fetch all configured stock data
 */
router.get('/', async (req, res) => {
    const symbols = config.dataSources?.stocks?.symbols || ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN'];
    
    try {
        // Fetch quotes for all symbols in parallel
        const quotePromises = symbols.map(symbol => fetchStockQuote(symbol));
        const quotes = await Promise.all(quotePromises);

        // Fetch sparkline data for each symbol
        const historyPromises = symbols.map(symbol => fetchStockHistory(symbol));
        const histories = await Promise.all(historyPromises);

        // Combine data
        const stocks = symbols.map((symbol, index) => ({
            symbol,
            price: quotes[index]?.price || 0,
            change: quotes[index]?.change || 0,
            percentChange: quotes[index]?.percentChange || 0,
            sparkline: histories[index] || []
        }));

        res.json({ stocks, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Error fetching stocks:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

/**
 * GET /api/stocks/:symbol - Fetch single stock data
 */
router.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    
    try {
        const [quote, history] = await Promise.all([
            fetchStockQuote(symbol),
            fetchStockHistory(symbol)
        ]);

        if (!quote) {
            return res.status(404).json({ error: `Stock ${symbol} not found` });
        }

        res.json({
            symbol,
            price: quote.price,
            change: quote.change,
            percentChange: quote.percentChange,
            sparkline: history || [],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        res.status(500).json({ error: `Failed to fetch ${symbol}` });
    }
});

module.exports = router;
