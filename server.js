const http = require('http');
const fs = require('fs');
const path = require('path');

const handleApiRoutes = require('./routes/apiRoutes');
const handlePageRoutes = require('./routes/pageRoutes');

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/styles.css') {
        const cssPath = path.join(__dirname, 'public', 'styles.css');
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

    // Handle API and Page routes
    if (req.url.startsWith('/employee') || req.url.startsWith('/average') || req.url.startsWith('/oldest')) {
        handleApiRoutes(req, res);
    } else {
        handlePageRoutes(req, res);
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
