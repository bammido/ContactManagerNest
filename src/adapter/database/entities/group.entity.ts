import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('Groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'group_name' })
  name: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}