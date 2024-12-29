import { IsNotEmpty } from "class-validator";

export class UpdateResearchDocumentDto {
  @IsNotEmpty()
  content: string;
}
