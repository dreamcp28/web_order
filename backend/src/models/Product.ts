import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductCategory } from './ProductCategory';
import { OrderItem } from './OrderItem';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category: ProductCategory;

  @Column({ type: 'int', nullable: false })
  category_id: number;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active', nullable: false })
  status: 'active' | 'inactive';

  @Column({ type: 'text', nullable: true })
  virtual_account_template: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updated_at: Date;
}