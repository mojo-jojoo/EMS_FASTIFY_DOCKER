import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';

export async function authRoutes(fastify: FastifyInstance) {
  // Public routes (no auth required)
  fastify.post('/register', AuthController.register);
  fastify.post('/login', AuthController.login);

  // Protected routes (auth required)
  fastify.get('/profile', { preHandler: authMiddleware }, AuthController.getProfile);
}