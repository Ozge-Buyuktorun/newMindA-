import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @summary Handles requests for static HTML pages.
 * This asynchronous function determines the file path of the requested HTML page based on the URL.
 * It reads the content of the file and sends it as the response with the 'text/html' content type.
 * If the URL doesn't match any defined routes, it sends a 404 "Page Not Found" response.
 * If there's an error reading the file, it sends a 500 "Internal Server Error" response.
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The HTTP server response object.
 */
export function handlePageRoutes(req: any, res: any) {
    let filePath = '';
    const url = req.url || '';

    const routes: Record<string, string> = {
        '/': path.join(__dirname, '../pages/index.html'),
        '/products': path.join(__dirname, '../pages/products.html'),
        '/contact': path.join(__dirname, '../pages/contact.html'),
    };

    filePath = routes[url];

    if (!filePath) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 - Page Not Found. Please check your URL.');
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
};
