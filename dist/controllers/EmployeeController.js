"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const database_1 = require("../config/database");
const Employee_entity_1 = require("../entities/Employee.entity");
const AuthService_1 = require("../services/AuthService");
const employeeRepository = database_1.AppDataSource.getRepository(Employee_entity_1.Employee);
class EmployeeController {
    // Get all employees - FIXED
    static async getAllEmployees(request, reply) {
        try {
            const employees = await employeeRepository.find({
                relations: ['department'],
                order: { id: 'ASC' }
            });
            // Remove passwords from response - FIXED
            const employeesWithoutPasswords = employees.map(employee => {
                const emp = { ...employee };
                delete emp.password;
                return emp;
            });
            reply.code(200).send({
                success: true,
                count: employees.length,
                data: employeesWithoutPasswords
            });
        }
        catch (error) {
            reply.code(500).send({
                success: false,
                message: 'Failed to fetch employees'
            });
        }
    }
    // Get single employee by ID - FIXED
    static async getEmployeeById(request, reply) {
        try {
            const { id } = request.params;
            const employee = await employeeRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['department']
            });
            if (!employee) {
                return reply.code(404).send({
                    success: false,
                    message: 'Employee not found'
                });
            }
            // Remove password - FIXED
            const employeeResponse = { ...employee };
            delete employeeResponse.password;
            reply.code(200).send({
                success: true,
                data: employeeResponse
            });
        }
        catch (error) {
            reply.code(500).send({
                success: false,
                message: 'Failed to fetch employee'
            });
        }
    }
    // Create new employee - FIXED
    static async createEmployee(request, reply) {
        try {
            const employeeData = request.body;
            // Check if email exists
            const existingEmployee = await employeeRepository.findOne({
                where: { email: employeeData.email }
            });
            if (existingEmployee) {
                return reply.code(400).send({
                    success: false,
                    message: 'Email already exists'
                });
            }
            // Hash password
            const hashedPassword = await AuthService_1.AuthService.hashPassword(employeeData.password);
            // Create employee
            const employee = employeeRepository.create({
                ...employeeData,
                password: hashedPassword
            });
            const savedEmployee = await employeeRepository.save(employee);
            // Remove password - FIXED
            const employeeResponse = { ...savedEmployee };
            delete employeeResponse.password;
            reply.code(201).send({
                success: true,
                message: 'Employee created successfully',
                data: employeeResponse
            });
        }
        catch (error) {
            reply.code(400).send({
                success: false,
                message: error.message || 'Failed to create employee'
            });
        }
    }
    // Update employee - FIXED
    static async updateEmployee(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            // Check if employee exists
            const employee = await employeeRepository.findOne({ where: { id: parseInt(id) } });
            if (!employee) {
                return reply.code(404).send({
                    success: false,
                    message: 'Employee not found'
                });
            }
            // If password is being updated, hash it
            if (updateData.password) {
                updateData.password = await AuthService_1.AuthService.hashPassword(updateData.password);
            }
            // Update employee
            await employeeRepository.update(id, updateData);
            // Get updated employee
            const updatedEmployee = await employeeRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['department']
            });
            if (!updatedEmployee) {
                return reply.code(404).send({
                    success: false,
                    message: 'Employee not found after update'
                });
            }
            // Remove password - FIXED
            const employeeResponse = { ...updatedEmployee };
            delete employeeResponse.password;
            reply.code(200).send({
                success: true,
                message: 'Employee updated successfully',
                data: employeeResponse
            });
        }
        catch (error) {
            reply.code(400).send({
                success: false,
                message: error.message || 'Failed to update employee'
            });
        }
    }
    // Delete employee - FIXED
    static async deleteEmployee(request, reply) {
        try {
            const { id } = request.params;
            const employee = await employeeRepository.findOne({ where: { id: parseInt(id) } });
            if (!employee) {
                return reply.code(404).send({
                    success: false,
                    message: 'Employee not found'
                });
            }
            // Soft delete
            await employeeRepository.update(id, { isActive: false });
            reply.code(200).send({
                success: true,
                message: 'Employee deactivated successfully'
            });
        }
        catch (error) {
            reply.code(500).send({
                success: false,
                message: 'Failed to delete employee'
            });
        }
    }
}
exports.EmployeeController = EmployeeController;
