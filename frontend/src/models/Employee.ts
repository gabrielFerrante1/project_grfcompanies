import { Groups } from "./Group";

export type Employees = {
    id: number;
    name: string;
    email: string;
} 

export type Employee = {
    id: number;
    name: string;
    email: string;
    groups: Groups[]
}

export type ApiGetEmployees = {
    employees: Employees[]
}

export type ApiGetOneEmployee = Employee 