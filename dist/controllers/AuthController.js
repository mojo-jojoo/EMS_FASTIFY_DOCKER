"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    // Register new employee
    static async register(request, reply) {
        try {
            const employeeData = request.body;
            const result = await AuthService_1.AuthService.register(employeeData);
            reply.code(201).send(result);
        }
        catch (error) {
            reply.code(400).send({
                success: false,
                message: error.message || 'Registration failed'
            });
        }
    }
    // Login employee
    static async login(request, reply) {
        try {
            const loginData = request.body;
            const result = await AuthService_1.AuthService.login(loginData);
            reply.code(200).send(result);
        }
        catch (error) {
            const statusCode = error.message === 'Invalid credentials' ? 401 : 400;
            reply.code(statusCode).send({
                success: false,
                message: error.message || 'Login failed'
            });
        }
    }
    // Get current logged in employee profile
    static async getProfile(request, reply) {
        try {
            // User info is attached by auth middleware
            const user = request.user;
            reply.code(200).send({
                success: true,
                data: user
            });
        }
        catch (error) {
            reply.code(500).send({
                success: false,
                message: 'Failed to get profile'
            });
        }
    }
}
exports.AuthController = AuthController;
