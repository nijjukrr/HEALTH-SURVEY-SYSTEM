const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Allow requests from all domains containing localhost, Expo development URLs, or Vercel/Render frontend origins.
app.use(cors());
app.use(express.json());

// Basic In-Memory Cache to prevent rate limiting issues and improve UX
const cache = new Map();
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 Minutes

app.get('/api/who/:indicator', async (req, res) => {
    try {
        const { indicator } = req.params;

        // Reconstruct query parameters
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(req.query)) {
            urlParams.append(key, String(value));
        }

        const queryString = urlParams.toString() ? `?${urlParams.toString()}` : '';
        const targetUrl = `https://ghoapi.azureedge.net/api/${indicator}${queryString}`;

        // Check Cache
        if (cache.has(targetUrl)) {
            const cachedData = cache.get(targetUrl);
            if (Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
                console.log(`[Cache Hit] ${targetUrl}`);
                return res.json(cachedData.data);
            }
        }

        console.log(`[Proxy] Fetching: ${targetUrl}`);

        // Fetch from WHO API with a timeout
        const response = await axios.get(targetUrl, {
            timeout: 10000 // 10 second timeout protection
        });

        // Store in cache
        cache.set(targetUrl, {
            data: response.data,
            timestamp: Date.now()
        });

        // Return to client
        res.json(response.data);

    } catch (error) {
        console.error(`[Proxy Error] Forwarding failed:`, error.message);
        res.status(500).json({
            error: 'Failed to fetch data from WHO GHO API',
            details: error.response?.data || error.message
        });
    }
});

// Simple Health Check Endpoint
app.get('/', (req, res) => {
    res.json({ status: 'active', service: 'WHO GHO Proxy Server' });
});

app.listen(PORT, () => {
    console.log(`WHO API Proxy Server running on port ${PORT}`);
});
