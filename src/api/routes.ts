import { IncomingMessage, ServerResponse } from 'http';
import ProductService from '../controllers/productServiceControl.ts';
import EmployeeController from '../controllers/employeeController.ts';
import WeatherService from '../controllers/weatherServiceControl.ts';

// Instantiate the ProductService and EmployeeController classes
const productService = new ProductService();
const employeeController = new EmployeeController();
const weatherService = new WeatherService();

// Define a type for route handler functions
type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

export const apiRoutes: { [path: string]: RouteHandler } = {
  '/api/employeeList': employeeController.getEmployeeList,
  '/api/oldestEmployee': employeeController.getOldestEmployee,
  '/api/averageSalary': employeeController.getAverageSalary,
  '/api/top100products': productService.handleRequest,
  '/api/weather':  weatherService.handleRequest,
  '/api/how-is-your-weather': weatherService.handleRequest,
};
