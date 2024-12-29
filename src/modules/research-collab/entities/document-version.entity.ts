import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ResearchDocument } from './research-document.entity';

@Entity('document_versions')
export class DocumentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ResearchDocument)
  document: ResearchDocument;

  @Column()
  version: number;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
