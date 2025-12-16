"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
async function authRoutes(fastify) {
    // Public routes (no auth required)
    fastify.post('/register', AuthController_1.AuthController.register);
    fastify.post('/login', AuthController_1.AuthController.login);
    // Protected routes (auth required)
    fastify.get('/profile', { preHandler: auth_1.authMiddleware }, AuthController_1.AuthController.getProfile);
}
