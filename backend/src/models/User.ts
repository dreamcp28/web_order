import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './Role';
import { Order } from './Order';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column({ type: 'int', nullable: false, default: 1 })
  role_id: number;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active', nullable: false })
  status: 'active' | 'inactive';

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updated_at: Date;
}