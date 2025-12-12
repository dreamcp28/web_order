import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Order } from './Order';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;

  @Column({ type: 'int', nullable: false })
  order_id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  transaction_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: ['wechat', 'alipay'], nullable: false })
  method: 'wechat' | 'alipay';

  @Column({ type: 'enum', enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending', nullable: false })
  status: 'pending' | 'success' | 'failed' | 'refunded';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
  refund_amount: number;

  @Column({ type: 'text', nullable: true })
  refund_reason: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updated_at: Date;
}