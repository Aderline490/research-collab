import { ResearchDocument } from '../entities/research-document.entity';

export class DocumentVersionDTO {
  document: ResearchDocument;
  version: number;
  content: string;
}
