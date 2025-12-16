import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/AuthService';
import { RegisterDto, LoginDto } from '../dto/Auth.dto';

export class AuthController {
  // Register new employee
  static async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const employeeData = request.body as RegisterDto;

      const result = await AuthService.register(employeeData);

      reply.code(201).send(result);
    } catch (error: any) {
      reply.code(400).send({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  // Login employee
  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginData = request.body as LoginDto;

      const result = await AuthService.login(loginData);

      reply.code(200).send(result);
    } catch (error: any) {
      const statusCode = error.message === 'Invalid credentials' ? 401 : 400;
      reply.code(statusCode).send({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  // Get current logged in employee profile
  static async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      // User info is attached by auth middleware
      const user = (request as any).user;

      reply.code(200).send({
        success: true,
        data: user
      });
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }
}