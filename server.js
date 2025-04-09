const http = require('http');
const fs = require('fs');
const path = require('path');

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

    // Handle API Endpoints
    //It should return the whole list in JSON format without salary information.
     // Check if the request is for '/employeeList' endpoint
    if (req.url === '/employeeList') {
        // Set the path to the employee data file
        const dataPath = path.join(__dirname, './data/employeeList.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading employee data');
                return;
            }
            const employees = JSON.parse(data);
            // Remove salary field
            const sanitized = employees.map(({ salary, ...rest }) => rest);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sanitized));
        });
        return;
    }

    // Check if the request is for '/oldestEmployee' endpoint
    if (req.url === '/oldestEmployee') {
        // Set the path to the employee data file
        const dataPath = path.join(__dirname, './data/employeeList.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading employee data');
                return;
            }
            const employees = JSON.parse(data);
            const oldest = employees.reduce((prev, curr) => (curr.age > prev.age ? curr : prev));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(oldest));
        });
        return;
    }

    // Check if the request is for '/averageSalary' endpoint
    if (req.url === '/averageSalary') {
        // Set the path to the employee data file
        const dataPath = path.join(__dirname, './data/employeeList.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading employee data');
                return;
            }
            const employees = JSON.parse(data);
            const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
            const average = total / employees.length;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ averageSalary: average }));
        });
        return;
    }


    // Route handling based on request URL
    let filePath = '';
    switch (req.url) {
        case '/':
            filePath = path.join(__dirname, 'pages', 'index.html');
            break;
        case '/products':
            filePath = path.join(__dirname, 'pages', 'products.html');
            break;
        case '/contact':
            filePath = path.join(__dirname, 'pages', 'contact.html');
            break;
        default:
            // Handle 404 Not Found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
            return;
    }

    // Read and serve the HTML file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Internal server error
            res.writeHead(500);
            res.end('Internal Server Error');
        } else {
            // Success - serve HTML content
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
});

// Start the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
