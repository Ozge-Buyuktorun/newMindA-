const fs = require('fs');
const path = require('path');

const apiController = (req, res) => {
    // some process for CSS file.
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
        return true;
    }
    // Function that repeats the process of reading employee data
    const readEmployeeData = (callback) => {
        const dataPath = path.join(__dirname, './data/employeeList.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading employee data');
                return;
            }
            const employees = JSON.parse(data);
            callback(employees);
        });
    };

    // API Endpoints
    const endpoints = {
        // List of all employees without salary information
        '/employeeList': () => {
            readEmployeeData((employees) => {
                // Remove salary field
                const sanitized = employees.map(({ salary, ...rest }) => rest);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(sanitized));
            });
            return true;
        },

        // Find the oldest employee from the dataß
        '/oldestEmployee': () => {
            readEmployeeData((employees) => {
                const oldest = employees.reduce((prev, curr) => (curr.age > prev.age ? curr : prev));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(oldest));
            });
            return true;
        },

        // Calculate Average Salary
        '/averageSalary': () => {
            readEmployeeData((employees) => {
                const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
                const average = total / employees.length;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ averageSalary: average }));
            });
            return true;
        }
    };

    // Check the URL and run the appropriate endpoint
    if (endpoints[req.url]) {
        return endpoints[req.url]();
    }

    // No matching endpoint found
    return false;
};

module.exports = { apiController };