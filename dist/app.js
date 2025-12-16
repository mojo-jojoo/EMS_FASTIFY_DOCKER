"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const database_1 = require("./config/database");
const authRoutes_1 = require("./routes/authRoutes");
const employeeRoutes_1 = require("./routes/employeeRoutes");
// Create Fastify app
const app = (0, fastify_1.default)({
    logger: true
});
// Register plugins
app.register(cors_1.default, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
});
app.register(helmet_1.default);
// Register routes
app.register(authRoutes_1.authRoutes, { prefix: '/api/auth' });
app.register(employeeRoutes_1.employeeRoutes, { prefix: '/api/employees' });
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
        await database_1.AppDataSource.initialize();
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
        console.log('💡 Tip: Use Postman or cURL to test APIs');
        console.log('='.repeat(50));
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
}
// Start the server
startServer();
exports.default = app;
