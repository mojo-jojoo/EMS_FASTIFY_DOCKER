  import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
  import { Employee } from './Employee.entity';

  @Entity('attendances')
  export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time', nullable: true })
    checkIn: string; // HH:MM:SS format

    @Column({ type: 'time', nullable: true })
    checkOut: string;

    @Column({ type: 'varchar', length: 20, default: 'present' })
    status: string; // present, absent, late, half-day

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'int', default: 0 })
    overtimeHours: number;

    // 🔗 Relationship with Employee
    @ManyToOne(() => Employee, employee => employee.attendances)
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column()
    employeeId: number;

    @CreateDateColumn()
    createdAt: Date;
  }