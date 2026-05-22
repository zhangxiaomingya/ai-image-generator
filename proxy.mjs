import http from 'http';
import https from 'https';
import { URL } from 'url';

const PORT = 3456;
const TARGET = 'https://image.pollinations.ai';

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const targetUrl = new URL(TARGET + req.url);
  console.log(`Proxying: ${targetUrl.href}`);

  const options = {
    hostname: targetUrl.hostname,
    port: 443,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; proxy)',
      'Accept': 'image/*,*/*',
    },
    timeout: 120000,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    console.log(`Response: ${proxyRes.statusCode} for ${targetUrl.pathname}`);
    res.writeHead(proxyRes.statusCode || 200, {
      'Content-Type': proxyRes.headers['content-type'] || 'image/jpeg',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end('Proxy error: ' + err.message);
    }
  });

  proxyReq.on('timeout', () => {
    console.error('Proxy timeout');
    proxyReq.destroy();
    if (!res.headersSent) {
      res.writeHead(504);
      res.end('Gateway timeout');
    }
  });

  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
