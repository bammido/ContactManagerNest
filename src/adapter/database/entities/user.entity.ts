import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'password' })
  password: string;
}
