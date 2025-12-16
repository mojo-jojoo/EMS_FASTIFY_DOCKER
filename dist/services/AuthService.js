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
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const database_1 = require("../config/database");
const Employee_entity_1 = require("../entities/Employee.entity");
const employeeRepository = database_1.AppDataSource.getRepository(Employee_entity_1.Employee);
class AuthService {
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    static generateToken(payload) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }
        return jwt.sign(payload, secret, {
            expiresIn: (process.env.JWT_EXPIRES_IN || '7d')
        });
    }
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static async register(data) {
        // Validation
        if (!data.email || !data.password || !data.fullName) {
            throw new Error('Missing required fields: email, password, and fullName are mandatory');
        }
        if (!this.validateEmail(data.email)) {
            throw new Error('Invalid email format');
        }
        if (data.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        const existing = await employeeRepository.findOne({
            where: { email: data.email }
        });
        if (existing) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await this.hashPassword(data.password);
        const employee = employeeRepository.create({
            ...data,
            password: hashedPassword,
            role: data.role || 'employee',
            isActive: true
        });
        const savedEmployee = await employeeRepository.save(employee);
        // Create response without password
        const { password, ...employeeWithoutPassword } = savedEmployee;
        const token = this.generateToken({
            id: savedEmployee.id,
            email: savedEmployee.email,
            role: savedEmployee.role
        });
        return {
            success: true,
            message: 'Registration successful',
            data: employeeWithoutPassword,
            token
        };
    }
    static async login(data) {
        if (!data.email || !data.password) {
            throw new Error('Email and password are required');
        }
        const employee = await employeeRepository.findOne({ where: { email: data.email } });
        if (!employee) {
            throw new Error('Invalid credentials');
        }
        const isValid = await this.comparePassword(data.password, employee.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        if (!employee.isActive) {
            throw new Error('Account deactivated');
        }
        // Create response without password
        const { password, ...employeeWithoutPassword } = employee;
        const token = this.generateToken({
            id: employee.id,
            email: employee.email,
            role: employee.role
        });
        return {
            success: true,
            message: 'Login successful',
            data: employeeWithoutPassword,
            token
        };
    }
}
exports.AuthService = AuthService;
