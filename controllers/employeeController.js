const fs = require('fs');
const path = require('path');

//Common Variable
let employees;
const dataPath = path.join(__dirname, '../data/employeeList.json');

// Secure JSON parse
function readEmployeeData(callback) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }

        try {
            const employees = JSON.parse(data);
            callback(null, employees);
        } catch (parseErr) {
            callback(parseErr);
        }
    });
}

exports.getEmployeeList = (res) => {
    readEmployeeData((err, employees) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error reading employee data');
        }

        const sanitized = employees.map(({ salary, ...rest }) => rest);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(sanitized));
    });
};

exports.getOldestEmployee = (res) => {
    readEmployeeData((err, employees) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error reading employee data');
        }

        if (!Array.isArray(employees) || employees.length === 0) {
            res.writeHead(404);
            return res.end('No employee data found');
        }

        // Find the earliest start ( oldest start_date)
        const oldest = employees.reduce((prev, curr) => {
            return new Date(curr.start_date) < new Date(prev.start_date) ? curr : prev;
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(oldest));
    });
};

exports.getAverageSalary = (res) => {
    readEmployeeData((err, employees) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error reading employee data');
        }

        if (!Array.isArray(employees) || employees.length === 0) {
            res.writeHead(404);
            return res.end('No employee data found');
        }

        const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
        const average = total / employees.length;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ averageSalary: average }));
    });
};
