import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Employee } from './Employee.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // IT, HR, Sales, Finance

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string; // DEP001, DEP002

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  managerName: string;

  @Column({ type: 'int', default: 0 })
  employeeCount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  budget: number;

  @OneToMany(() => Employee, employee => employee.department)
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}