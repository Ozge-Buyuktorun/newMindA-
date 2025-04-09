const http = require('http');
const url = require('url');

const employeeController = require('../controllers/employeeController.js');

/**
 * @summary Handles API routes for employee-related data.
 * This function takes the request and response objects as input, parses the URL to determine the requested API endpoint,
 * and then calls the appropriate function from the employeeController to handle the request.
 * It only processes GET requests. For non-GET requests, it returns a 405 "Method Not Allowed" error.
 * It uses a routing object to map URL paths to their corresponding controller functions.
 * If a matching route is found, the associated controller function is executed.
 * If no matching route is found, it returns a 404 "API Endpoint Not Found" error.
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The HTTP server response object.
 */

module.exports = function handleApiRoutes(req,res){
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' }); // Method Not Allowed
        return res.end(`405 - Method Not Allowed for ${pathname}`);
    }
    const routes = {
        '/employeeList': employeeController.getEmployeeList,
        '/oldestEmployee': employeeController.getOldestEmployee,
        '/averageSalary': employeeController.getAverageSalary,
    };

    const handler = routes[pathname];
    if (handler) {
        handler(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 - API Endpoint Not Found: ${pathname}`);
    }
}