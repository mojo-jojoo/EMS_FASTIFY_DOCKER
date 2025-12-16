"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRoutes = employeeRoutes;
const EmployeeController_1 = require("../controllers/EmployeeController");
const auth_1 = require("../middleware/auth");
async function employeeRoutes(fastify) {
    // All employee routes require authentication
    fastify.addHook('preHandler', auth_1.authMiddleware);
    // Get all employees (Admin only)
    fastify.get('/', {
        preHandler: [auth_1.authMiddleware, auth_1.adminMiddleware]
    }, EmployeeController_1.EmployeeController.getAllEmployees);
    // Get single employee
    fastify.get('/:id', EmployeeController_1.EmployeeController.getEmployeeById);
    // Create employee (Admin only)
    fastify.post('/', {
        preHandler: [auth_1.authMiddleware, auth_1.adminMiddleware]
    }, EmployeeController_1.EmployeeController.createEmployee);
    // Update employee
    fastify.put('/:id', EmployeeController_1.EmployeeController.updateEmployee);
    // Delete employee (Admin only)
    fastify.delete('/:id', {
        preHandler: [auth_1.authMiddleware, auth_1.adminMiddleware]
    }, EmployeeController_1.EmployeeController.deleteEmployee);
}
