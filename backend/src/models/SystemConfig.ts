import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_config')
export class SystemConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  key: string;

  @Column({ type: 'text', nullable: false })
  value: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updated_at: Date;
}