import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { Employee } from '../entities/Employee.entity';
import { RegisterDto, LoginDto } from '../dto/Auth.dto';

const employeeRepository = AppDataSource.getRepository(Employee);

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: object): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(payload, secret, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
    });
  }

  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async register(data: RegisterDto) {
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

  static async login(data: LoginDto) {
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