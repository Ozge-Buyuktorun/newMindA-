import * as fs from "fs";
import * as path from 'path';
import { ServerResponse } from 'http';
import { fileURLToPath } from "url";
import { sendJsonResponse } from "../utils/apiResponse.ts";

type EmployeeDate = {
    name: string;
    surname: string;
    email: string;
    position: string;
    start_date: string;
    salary: number;
};
type ApiResponse<T> = {
    success: boolean;
    error?: string;
    data?: T;
};
// Global Variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath: string = path.resolve(__dirname, '../data/employeeList.json');

export default class EmployeeController {
    private employees: EmployeeDate[] = [];

    constructor() {
        try {
            const fileData: string = fs.readFileSync(dataPath, 'utf8');
            this.employees = this.parseEmployeeData(fileData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error loading employee data:', error.message);
            } else {
                console.error('Unknown error loading employee data');
            }
        }
    }

    private parseEmployeeData(data: string): EmployeeDate[] {
        try {
            const parsedData: unknown = JSON.parse(data);

            if (Array.isArray(parsedData)) {
                // Validate that each item has the expected structure
                return parsedData.filter((item): item is EmployeeDate => {
                    return (
                        typeof item === 'object' &&
                        item !== null &&
                        typeof item.name === 'string' &&
                        typeof item.surname === 'string' &&
                        typeof item.email === 'string' &&
                        typeof item.position === 'string' &&
                        typeof item.start_date === 'string' &&
                        typeof item.salary === 'number'
                    );
                });
            } else {
                console.error('Invalid data format, expected an array of employees');
                return [];
            }
        } catch (parseErr: unknown) {
            if (parseErr instanceof Error) {
                console.error('Error parsing employee data:', parseErr.message);
            } else {
                console.error('Unknown error parsing employee data');
            }
            return [];
        }
    }

    public getEmployees(callback: (err: NodeJS.ErrnoException | null, employees?: EmployeeDate[]) => void): void {
        fs.readFile(dataPath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) {
                return callback(err);
            }

            try {
                const employees: EmployeeDate[] = this.parseEmployeeData(data);
                callback(null, employees);
            } catch (parseErr: unknown) {
                if (parseErr instanceof Error) {
                    callback(parseErr as NodeJS.ErrnoException);
                } else {
                    const error: NodeJS.ErrnoException = new Error('Unknown error parsing data');
                    callback(error);
                }
            }
        });
    }
    public getEmployeeList = (res: ServerResponse): void => {
        this.getEmployees((err: NodeJS.ErrnoException | null, employees?: EmployeeDate[]) => {
            if (err || !employees) {
                const response: ApiResponse<undefined> = {
                    success: false,
                    error: 'Error reading employee data',
                    data: undefined
                };
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(response));
            }

            // Remove salary from each employee
            const sanitized = employees.map(({ salary, ...rest }) => rest);
            const response: ApiResponse<typeof sanitized> = {
                success: true,
                data: sanitized
            };
            sendJsonResponse(res, employees, 'Employee list successfully delivered.');
        });
    };

    public getOldestEmployee = (res: ServerResponse): void => {
        this.getEmployees((err: NodeJS.ErrnoException | null, employees?: EmployeeDate[]) => {
            if (err || !employees || employees.length === 0) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'No employee data found',
                    data: null
                };
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(response));
            }

            const oldest: EmployeeDate = employees.reduce((prev: EmployeeDate, curr: EmployeeDate): EmployeeDate => {
                return new Date(curr.start_date) < new Date(prev.start_date) ? curr : prev;
            });

            const response: ApiResponse<EmployeeDate> = {
                success: true,
                data: oldest
            };
            sendJsonResponse(res, employees, "The oldest employee/'s information is delivered succesfully.");
        });
    };

    public getAverageSalary = (res: ServerResponse): void => {
        this.getEmployees((err: NodeJS.ErrnoException | null, employees?: EmployeeDate[]) => {
            if (err || !employees || employees.length === 0) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'No employee data found'
                };
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(response));
            }

            const total: number = employees.reduce((sum: number, emp: EmployeeDate): number => sum + emp.salary, 0);
            const average: number = total / employees.length;

            const response: ApiResponse<{ averageSalary: number }> = {
                success: true,
                data: { averageSalary: average }
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        });
    };
};