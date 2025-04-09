const fs = require('fs');
const path = require('path');

/**
 * @summary Handles requests for static HTML pages.
 * This asynchronous function determines the file path of the requested HTML page based on the URL.
 * It reads the content of the file and sends it as the response with the 'text/html' content type.
 * If the URL doesn't match any defined routes, it sends a 404 "Page Not Found" response.
 * If there's an error reading the file, it sends a 500 "Internal Server Error" response.
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The HTTP server response object.
 */
module.exports = function handlePageRoutes(req, res) {
    let filePath = '';
    const { url } = req;

    // Define routes mapping URL paths to HTML file paths.
    const routes = {
        '/': path.join(__dirname, '../pages/index.html'),
        '/': path.join(__dirname, '../pages/index.html'), // Handling both '/' and '' for homepage
        '/products': path.join(__dirname, '../pages/products.html'),
        '/contact': path.join(__dirname, '../pages/contact.html'),
    };

    filePath = routes[url];

    if (!filePath) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 - Page Not Found');
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
