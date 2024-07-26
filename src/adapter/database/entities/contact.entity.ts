import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './group.entity';

@Entity('Contacts')
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Group, (group) => group.contacts, { cascade: true })
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
