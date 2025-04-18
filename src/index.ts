import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { handlePageRoutes } from '../src/routes/pageRoutes.ts';
import { apiRoutes } from './api/routes.ts';


// Create the HTTP server
const server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
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

    // Handle API and Page routes
    if (req.url && apiRoutes[req.url]) {
        apiRoutes[req.url](req, res);
    } else {
        handlePageRoutes(req, res);
    }

});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});