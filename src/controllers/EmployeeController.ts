import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../config/database';
import { Employee } from '../entities/Employee.entity';
import { AuthService } from '../services/AuthService';

const employeeRepository = AppDataSource.getRepository(Employee);  // get repository use ? 

// Type for employee without password
type EmployeeWithoutPassword = Omit<Employee, 'password'>;

export class EmployeeController {
  // Get all employees - FIXED
  static async getAllEmployees(request: FastifyRequest, reply: FastifyReply) {
    try {
      const employees = await employeeRepository.find({
        relations: ['department'],
        order: { id: 'ASC' }
      });

      // Remove passwords from response - FIXED
      const employeesWithoutPasswords = employees.map(employee => {
        const emp: any = { ...employee };
        delete emp.password;
        return emp as EmployeeWithoutPassword;
      });

      reply.code(200).send({
        success: true,
        count: employees.length,
        data: employeesWithoutPasswords
      });
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        message: 'Failed to fetch employees'
      });
    }
  }

  // Get single employee by ID - FIXED
  static async getEmployeeById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
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
      const employeeResponse: any = { ...employee };
      delete employeeResponse.password;

      reply.code(200).send({
        success: true,
        data: employeeResponse
      });
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        message: 'Failed to fetch employee'
      });
    }
  }

  // Create new employee - FIXED
  static async createEmployee(request: FastifyRequest, reply: FastifyReply) {
    try {
      const employeeData = request.body as any;
      
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
      const hashedPassword = await AuthService.hashPassword(employeeData.password);

      // Create employee
      const employee = employeeRepository.create({
        ...employeeData,
        password: hashedPassword
      });

      const savedEmployee = await employeeRepository.save(employee);

      // Remove password - FIXED
      const employeeResponse: any = { ...savedEmployee };
      delete employeeResponse.password;

      reply.code(201).send({
        success: true,
        message: 'Employee created successfully',
        data: employeeResponse
      });
    } catch (error: any) {
      reply.code(400).send({
        success: false,
        message: error.message || 'Failed to create employee'
      });
    }
  }

  // Update employee - FIXED
  static async updateEmployee(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const updateData = request.body as any;

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
        updateData.password = await AuthService.hashPassword(updateData.password);
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
      const employeeResponse: any = { ...updatedEmployee };
      delete employeeResponse.password;

      reply.code(200).send({
        success: true,
        message: 'Employee updated successfully',
        data: employeeResponse
      });
    } catch (error: any) {
      reply.code(400).send({
        success: false,
        message: error.message || 'Failed to update employee'
      });
    }
  }

  // Delete employee - FIXED
  static async deleteEmployee(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

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
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        message: 'Failed to delete employee'
      });
    }
  }
}