/**
 * Jarvis Dashboard - Main Application Logic
 * Handles clock, tweaks panel, and API data fetching
 */

// ─── Clock & Greeting ──────────────────────────────────
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-US', { hour12: false });
    
    // Update greeting based on time of day
    const hour = now.getHours();
    const greetingEl = document.getElementById('greeting');
    if (hour < 12) {
        greetingEl.innerText = 'Good Morning, Sahil';
    } else if (hour < 17) {
        greetingEl.innerText = 'Good Afternoon, Sahil';
    } else {
        greetingEl.innerText = 'Good Evening, Sahil';
    }
}

setInterval(updateClock, 1000);
updateClock();

// ─── Tweaks Panel ──────────────────────────────────────
function toggleTweaks() {
    document.getElementById('tweaks').classList.toggle('visible');
}

function changeColor(color) {
    document.documentElement.style.setProperty('--accent', color);
    localStorage.setItem('jarvis-accent-color', color);
}

// Load saved accent color on startup
(function loadSavedColor() {
    const saved = localStorage.getItem('jarvis-accent-color');
    if (saved) {
        document.documentElement.style.setProperty('--accent', saved);
        const select = document.querySelector('#tweaks select');
        if (select) select.value = saved;
    }
})();

// ─── Stock Data Fetching & DOM Updates ──────────────────
async function fetchStockData() {
    try {
        const response = await fetch('/api/stocks');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        updateStockCards(data.stocks);
        updateTicker(data.stocks);
    } catch (error) {
        console.error('Failed to fetch stock data:', error);
    }
}

function updateStockCards(stocks) {
    // Map symbols to DOM elements
    const symbolMap = {
        'SPX': { priceEl: 'spx-price', changeEl: 'spx-change' },
        'IXIC': { priceEl: 'nasdaq-price', changeEl: 'nasdaq-change' },
        'BTC': { priceEl: 'btc-price', changeEl: 'btc-change' },
        'ETH': { priceEl: 'eth-price', changeEl: 'eth-change' }
    };

    stocks.forEach(stock => {
        // Find matching symbol in map (case-insensitive)
        const entry = Object.entries(symbolMap).find(([key]) => key.toUpperCase() === stock.symbol);
        if (!entry) return;

        const [symbol, elements] = entry;
        const { priceEl, changeEl } = elements;

        // Update price
        const priceElEl = document.getElementById(priceEl);
        if (priceElEl) {
            const formattedPrice = stock.symbol.startsWith('$') 
                ? `$${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            priceElEl.innerHTML = `${formattedPrice} <span class="stat-change ${stock.percentChange >= 0 ? 'up' : 'down'}">${stock.percentChange >= 0 ? '+' : ''}${stock.percentChange.toFixed(2)}%</span>`;
        }

        // Update sparkline if available
        const sparkEl = document.getElementById(`${symbol.toLowerCase()}-spark`);
        if (sparkEl && stock.sparkline.length > 0) {
            sparkEl.innerHTML = '';
            const maxPrice = Math.max(...stock.sparkline);
            stock.sparkline.forEach(price => {
                const bar = document.createElement('div');
                bar.className = 'spark-bar';
                bar.style.height = `${(price / maxPrice) * 100}%`;
                sparkEl.appendChild(bar);
            });
        }
    });
}

function updateTicker(stocks) {
    const tickerEl = document.getElementById('stock-ticker');
    if (!tickerEl) return;

    tickerEl.innerHTML = stocks.map(stock => {
        const direction = stock.percentChange >= 0 ? '+' : '';
        return `<span class="ticker-item">${stock.symbol} ${direction}${stock.percentChange.toFixed(2)}%</span>`;
    }).join('');
}

// ─── Initialize ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    console.log('Jarvis Dashboard initialized');
    
    // Fetch stock data on page load
    fetchStockData();
    
    // Auto-refresh every 60 seconds (Finnhub free tier limit)
    setInterval(fetchStockData, 60 * 1000);
});
