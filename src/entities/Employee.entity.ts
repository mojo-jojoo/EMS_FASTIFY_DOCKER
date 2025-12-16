import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Department } from './Department.entity';
import { Attendance } from './Attendance.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 50 })
  position: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // 🔐 Make sure password is defined
  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 255 }) // Add this line
  password: string; // This is important!

  @Column({ type: 'varchar', length: 20, default: 'employee' })
  role: string;

  // 🔗 Relationships
  @ManyToOne(() => Department, department => department.employees)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  departmentId: number;

  @OneToMany(() => Attendance, attendance => attendance.employee)
  attendances: Attendance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}