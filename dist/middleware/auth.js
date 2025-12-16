"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const database_1 = require("../config/database");
const Employee_entity_1 = require("../entities/Employee.entity");
const employeeRepository = database_1.AppDataSource.getRepository(Employee_entity_1.Employee);
const authMiddleware = async (request, reply) => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
        request.user = {
            id: employee.id,
            email: employee.email,
            username: employee.username,
            role: employee.role,
            fullName: employee.fullName
        };
        // Don't call done(), just return
        return;
    }
    catch (error) {
        return reply.code(401).send({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
exports.authMiddleware = authMiddleware;
// Admin only middleware - FIXED signature
const adminMiddleware = async (request, reply) => {
    const user = request.user;
    if (!user || user.role !== 'admin') {
        return reply.code(403).send({
            success: false,
            message: 'Admin access required'
        });
    }
    return;
};
exports.adminMiddleware = adminMiddleware;
