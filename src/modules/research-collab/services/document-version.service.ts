import { Injectable } from '@nestjs/common';
import { DocumentVersionRepository } from '../repositories/document-version.repository';
import { ResearchDocumentRepository } from '../repositories/research-document.repository';
import { UUID } from 'crypto';
import { ResearchDocument } from '../entities/research-document.entity';
import { DocumentVersionDTO } from '../dtos/document-version.dto';

@Injectable()
export class DocumentVersionService {
  constructor(
    private readonly documentVersionRepository: DocumentVersionRepository,
    private readonly researchDocumentRepository: ResearchDocumentRepository,
  ) {}

  async createInitialVersion(document: ResearchDocument, content: string) {
    const documentFound =
      await this.researchDocumentRepository.findOneWithRelations(document.id);
    console.log('this is the document for creating a version:', document);
    if (!documentFound) {
      throw new Error('Document not found');
    }

    const documentVersion: DocumentVersionDTO = new DocumentVersionDTO();

    documentVersion.content = content;
    documentVersion.document = document;
    documentVersion.version = 1;

    const initialVersion =
      await this.documentVersionRepository.create(documentVersion);
    return initialVersion;
  }

  async createNewVersion(documentId: string, newContent: string) {
    const latestVersion =
      await this.documentVersionRepository.getLatestVersion(documentId);
    const document =
      await this.researchDocumentRepository.findOneWithRelations(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    const documentVersion: DocumentVersionDTO = new DocumentVersionDTO();
    documentVersion.content = newContent;
    documentVersion.document = document;
    documentVersion.version = latestVersion.version + 1;

    const newVersion =
      await this.documentVersionRepository.create(documentVersion);
    this.documentVersionRepository.save(newVersion);
    return newVersion;
  }
}
