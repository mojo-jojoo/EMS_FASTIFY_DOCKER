import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Employee } from '../entities/Employee.entity';
import { Department } from '../entities/Department.entity';
import { Attendance } from '../entities/Attendance.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Auto create tables (ONLY for development!)
  synchronize: true,
  
  // Log SQL queries in terminal
  logging: true,
  
  // Our database models
  entities: [Employee, Department, Attendance],
  
  // For future updates
  migrations: ['src/migrations/*.ts'],//manual tables update better for production
  
  subscribers: [], // aur yh database k events k lye hoty hn listen krta ha  for eg employee create hone pr koi action lena ho to yh use hota ha jaise welcome email bhejna waghera
  // For future updates
});