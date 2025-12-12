import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column({ type: 'varchar', length: 20, nullable: false })
  order_id: string;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @Column({ type: 'int', nullable: false })
  product_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  product_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  product_price: number;

  @Column({ type: 'int', nullable: false, default: 1 })
  quantity: number;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;
}