import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_amount: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'cancelled', 'refunded'], default: 'pending', nullable: false })
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';

  @Column({ type: 'enum', enum: ['wechat', 'alipay'], nullable: false })
  payment_method: 'wechat' | 'alipay';

  @Column({ type: 'varchar', length: 100, nullable: true })
  payment_transaction_id: string;

  @Column({ type: 'text', nullable: true })
  shipping_address: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updated_at: Date;
}