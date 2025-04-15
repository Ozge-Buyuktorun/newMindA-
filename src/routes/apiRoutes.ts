import * as url from 'url';
import { ServerResponse, IncomingMessage } from 'http';
import EmployeeController  from '../controllers/employeeController.ts';

const employeeController = new EmployeeController();
/**
 * @summary Handles API routes for employee-related data.
 * This function takes the request and response objects as input, parses the URL to determine the requested API endpoint,
 * and then calls the appropriate function from the employeeController to handle the request.
 * It only processes GET requests. For non-GET requests, it returns a 405 "Method Not Allowed" error.
 * It uses a routing object to map URL paths to their corresponding controller functions.
 * If a matching route is found, the associated controller function is executed.
 * If no matching route is found, it returns a 404 "API Endpoint No"t Found" error.
 * @param req - The incoming HTTP request object.
 * @param res - The HTTP server response object.
 */

export function handleApiRoutes(req: IncomingMessage, res: ServerResponse) {

    const parsedUrl = url.parse(req.url || '', true);
    const { pathname } = parsedUrl;

    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' }); // Method Not Allowed
        return res.end(`405 - Method Not Allowed for ${pathname}`);
    }

    const routes: { [key: string]: (res: ServerResponse) => void } = {
        'api/employeeList': employeeController.getEmployeeList,
        'api/oldestEmployee': employeeController.getOldestEmployee,
        'api/averageSalary': employeeController.getAverageSalary,
    };

    const handler = routes[pathname || ''];
    if (handler) {
        handler(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 - API Endpoint Not Found: ${pathname}`);
    }
}