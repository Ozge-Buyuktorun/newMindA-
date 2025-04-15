const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApiRoutes } = require('../src/routes/apiRoutes');
const { handlePageRoutes } = require('../src/routes/pageRoutes');

// HTTP sunucusunu oluştur
const server = http.createServer((req, res) => {
    if (req.url === '/styles.css') {
        const cssPath = path.join(__dirname, 'public/styles.css');
        fs.readFile(cssPath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading CSS');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(content);
            }
        });
        return;
    }

    // API ve Sayfa rotalarını işle
    if (req.url && (req.url.startsWith('/employee') || req.url.startsWith('/average') || req.url.startsWith('/oldest'))) {
        handleApiRoutes(req, res);
    } else {
        handlePageRoutes(req, res);
    }
});

// Sunucuyu başlat
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
