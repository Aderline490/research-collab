import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan } from 'typeorm';
import { Repository } from 'typeorm';
import { DocumentVersion } from '../entities/document-version.entity';
import { UUID } from 'crypto';
import { DocumentVersionDTO } from '../dtos/document-version.dto';

@Injectable()
export class DocumentVersionRepository {
  constructor(
    @InjectRepository(DocumentVersion)
    private readonly documentVersionRepository: Repository<DocumentVersion>,
  ) {}

  save(version: DocumentVersion) {
    return this.documentVersionRepository.save(version);
  }

  create(documentVersion: DocumentVersionDTO) {
    const version = this.documentVersionRepository.create(documentVersion);
    return this.documentVersionRepository.save(version);
  }

  async getLatestVersion(documentId: string) {
    return this.documentVersionRepository
      .createQueryBuilder('documentVersion')
      .where('documentVersion.documentId = :documentId', { documentId })
      .orderBy('documentVersion.version', 'DESC')
      .getOne();
  }

  async getHistory(documentId: string, latestVersionNumber: number): Promise<DocumentVersion[]> {
    return this.documentVersionRepository.find({
      where: { 
        document: { id: documentId }, 
        version: LessThan(latestVersionNumber), 
      },
      order: { version: 'DESC' },
    });
  }
}
