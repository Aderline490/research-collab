import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResearchDocument } from '../entities/research-document.entity';
import { CreateResearchDocumentDto } from '../dtos/create-research-document.dto';

@Injectable()
export class ResearchDocumentRepository{
  constructor(
    @InjectRepository(ResearchDocument)
    private readonly researchDocumentRepository: Repository<ResearchDocument>,
  ) {}

  save(document: ResearchDocument): Promise<ResearchDocument> {
    return this.researchDocumentRepository.save(document);
  }

  create(createResearchDocumentDto: CreateResearchDocumentDto) {
    const { title, content, studentId, teacherId } = createResearchDocumentDto;
    const document = this.researchDocumentRepository.create({
      title,
      student: { id: studentId },
      teacher: { id: teacherId },
    });
    
    return this.researchDocumentRepository.save(document);;
  }

  findAll() {
    return this.researchDocumentRepository.find();
  }

  async findOneBy(criteria: Partial<ResearchDocument>): Promise<ResearchDocument | null> {
    return this.researchDocumentRepository.findOneBy(criteria);
  }

  async findOne(id: string): Promise<ResearchDocument | null> {
    return this.researchDocumentRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });
  }

  async findOneWithRelations(id: string): Promise<ResearchDocument | null> {
    console.log('Searching for document with ID:', id, 'Type:', typeof id);
    return this.researchDocumentRepository.findOne({
      where: { id },
      relations: ['teacher', 'student', 'feedback', 'feedback.teacher'],
    });
  }

  async getAllStudentDocuments(studentId: string): Promise<ResearchDocument[]> {
    return this.researchDocumentRepository.find({
      where: { student: { id: studentId } },
      relations: ['teacher', 'feedback'],
    });
  }

  async getAllTeacherDocuments(teacherId: string): Promise<ResearchDocument[]> {
    return this.researchDocumentRepository.find({
      where: { teacher: { id: teacherId } },
      relations: ['student', 'feedback'],
    });
  }
}
