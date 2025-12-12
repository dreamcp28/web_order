import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from './Product';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active', nullable: false })
  status: 'active' | 'inactive';

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updated_at: Date;
}