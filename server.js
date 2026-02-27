const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

http
  .createServer((req, res) => {
    const urlPath = (req.url || '/').split('?')[0];
    const safePath = path
      .normalize(urlPath)
      .replace(/^\.\.(\/|\\|$)/, '')
      .replace(/^\/+/, '');
    let filePath = path.join(ROOT, safePath);

    if (urlPath === '/' || urlPath.startsWith('/team/') || urlPath.startsWith('/player/')) {
      filePath = path.join(ROOT, 'index.html');
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    });
  })
  .listen(PORT, () => {
    console.log(`TGMR webapp listening on http://localhost:${PORT}`);
  });
