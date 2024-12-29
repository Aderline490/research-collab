import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ResearchDocument } from './research-document.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  teacher: User;

  @ManyToOne(() => ResearchDocument, (document) => document.feedback, {
    nullable: true,
  })
  document: ResearchDocument;

  @Column()
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
