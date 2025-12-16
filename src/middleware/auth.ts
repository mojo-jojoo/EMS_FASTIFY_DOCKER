import { FastifyRequest, FastifyReply } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { Employee } from '../entities/Employee.entity';

const employeeRepository = AppDataSource.getRepository(Employee);

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get token from header
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Get employee from database
    const employee = await employeeRepository.findOne({
      where: { id: decoded.id, isActive: true }
    });

    if (!employee) {
      return reply.code(401).send({
        success: false,
        message: 'Employee not found or account deactivated'
      });
    }

    // Attach employee to request
    (request as any).user = {
      id: employee.id,
      email: employee.email,
      username: employee.username,
      role: employee.role,
      fullName: employee.fullName
    };

    // Don't call done(), just return
    return;

  } catch (error) {
    return reply.code(401).send({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Admin only middleware - FIXED signature
export const adminMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = (request as any).user;
  
  if (!user || user.role !== 'admin') {
    return reply.code(403).send({
      success: false,
      message: 'Admin access required'
    });
  }
  

  return;
};