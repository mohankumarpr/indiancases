// Simple CORS proxy for development
// Run with: node proxy-server.js

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy all requests to the API server
app.use('/', createProxyMiddleware({
  target: 'https://prod-apse-la01.whiteband.ai',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
}));

app.listen(PORT, () => {
  console.log(`CORS Proxy running on http://localhost:${PORT}`);
  console.log(`Proxying requests to: https://prod-apse-la01.whiteband.ai`);
  console.log(`Update your API_URL to: http://localhost:${PORT}`);
});

