/**
 * Jarvis Dashboard - Main Application Logic
 * Handles clock, tweaks panel, and API data fetching
 */

// ─── Clock ──────────────────────────────────────────────
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

// ─── API Data Fetching (Placeholder — will be implemented) ──
async function fetchStockData() {
    try {
        const response = await fetch('/api/stocks');
        const data = await response.json();
        // TODO: Update DOM with real stock data
        console.log('Stock data:', data);
    } catch (error) {
        console.error('Failed to fetch stock data:', error);
    }
}

// Fetch data on page load (will be replaced with real API calls)
document.addEventListener('DOMContentLoaded', () => {
    console.log('Jarvis Dashboard initialized');
    
    // Placeholder: fetch stock data every 60 seconds
    setInterval(fetchStockData, 60000);
    
    // Initial fetch
    fetchStockData();
});
