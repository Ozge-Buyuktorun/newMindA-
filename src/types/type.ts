import http from 'http';

export type EmployeeDate = {
  name: string;
  surname: string;
  email: string;
  position: string;
  start_date: string;
  salary: number;
}

export type ApiResponse<T> = {
  success: boolean;
  error?: string;
  data?: T;
};

export type HttpRes = http.ServerResponse;

export type AverageSalaryResponse = {
  averageSalary: number;
}

export type ErrorResponse = {
  error: string;
}

export type EmployeePublicData = {
  name: string;
  surname: string;
  email: string;
  position: string;
  start_date: string;
}