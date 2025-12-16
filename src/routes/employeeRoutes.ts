import { FastifyInstance } from 'fastify';
import { EmployeeController } from '../controllers/EmployeeController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

export async function employeeRoutes(fastify: FastifyInstance) {
  // All employee routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  // Get all employees (Admin only)
  fastify.get('/', {
    preHandler: [authMiddleware, adminMiddleware]
  }, EmployeeController.getAllEmployees);

  // Get single employee
  fastify.get('/:id', EmployeeController.getEmployeeById);

  // Create employee (Admin only)
  fastify.post('/', {
    preHandler: [authMiddleware, adminMiddleware]
  }, EmployeeController.createEmployee);

  // Update employee
  fastify.put('/:id', EmployeeController.updateEmployee);

  // Delete employee (Admin only)
  fastify.delete('/:id', {
    preHandler: [authMiddleware, adminMiddleware]
  }, EmployeeController.deleteEmployee);
}