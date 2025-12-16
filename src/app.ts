import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { AppDataSource } from './config/database';
import { authRoutes } from './routes/authRoutes';
import { employeeRoutes } from './routes/employeeRoutes';

// Create Fastify app
const app = Fastify({
  logger: true
});

// Register plugins
app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

app.register(helmet);

// Register routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(employeeRoutes, { prefix: '/api/employees' });

// Health check route
app.get('/', async (request, reply) => {
  return {
    message: '👨‍💼 Employee Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'Running',
    endpoints: {
      auth: [
        'POST   /api/auth/register',
        'POST   /api/auth/login',
        'GET    /api/auth/profile (protected)'
      ],
      employees: [
        'GET    /api/employees (admin only)',
        'GET    /api/employees/:id',
        'POST   /api/employees (admin only)',
        'PUT    /api/employees/:id',
        'DELETE /api/employees/:id (admin only)'
      ]
    }
  };
});

// Start server function
async function startServer() {
  try {
    // Connect to database
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully! 🗄️');

    // Start server
    const port = parseInt(process.env.PORT || '3000');
    const host = '0.0.0.0';
    
    await app.listen({ port, host });
    
    console.log('='.repeat(50));
    console.log('👨‍💼 EMPLOYEE MANAGEMENT SYSTEM');
    console.log('='.repeat(50));
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log('📚 API Documentation:');
    console.log('👉 GET    http://localhost:3000/');
    console.log('👉 POST   http://localhost:3000/api/auth/register');
    console.log('👉 POST   http://localhost:3000/api/auth/login');
    console.log('👉 GET    http://localhost:3000/api/employees');
    console.log('='.repeat(50));
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;