import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'otp' })
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  otp: number;

  @Column({ type: 'timestamp', nullable: false })
  expire_at: Date;
}
