import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { EmployeeDate } from '../types/type.ts';

export const apiController = (req: IncomingMessage, res: ServerResponse): boolean => {
    // some process for CSS file.
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
        return true;
    }
    // Function that repeats the process of reading employee data
    const readEmployeeDate = (callback: (employees: EmployeeDate[]) => void): void => {
        const dataPath: string = path.join(__dirname, 'data/employeeList.json');
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
    const endpoints: Record<string, () => boolean> = {
        // List of all employees without salary information
        '/employeeList': () => {
            readEmployeeDate((employees:EmployeeDate[]) => {
                // Remove salary field
                const sanitized = employees.map(({ salary, ...rest }) => rest);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(sanitized));
            });
            return true;
        },

        // Find the oldest employee from the data
        '/oldestEmployee': () => {
            readEmployeeDate((employees:EmployeeDate[]) => {
                const oldest = employees.reduce((prev, curr) => (curr.start_date > prev.start_date ? curr : prev));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(oldest));
            });
            return true;
        },

        // Calculate Average Salary
        '/averageSalary': () => {
            readEmployeeDate((employees:EmployeeDate[]) => {
                const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
                const average = total / employees.length;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ averageSalary: average }));
            });
            return true;
        }
    };

    // Check the URL and run the appropriate endpoint
    if (req.url && endpoints[req.url]) {
        return endpoints[req.url]();
    }

    // No matching endpoint found
    return false;
};