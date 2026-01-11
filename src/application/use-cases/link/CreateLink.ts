import { ILinkRepository } from '@domain/repositories/ILinkRepository';
import { Link } from '@domain/entities/Link';
import { CreateLinkDTO, LinkDTO } from '../../dto/LinkDTO';
import { LinkMapper } from '../../mappers/LinkMapper';

export class CreateLink {
  constructor(private linkRepository: ILinkRepository) {}

  async execute(userId: string, dto: CreateLinkDTO): Promise<LinkDTO> {
    const link = Link.create(
      userId,
      dto.title,
      dto.url,
      dto.position,
      dto.description
    );

    const savedLink = await this.linkRepository.save(link);

    return LinkMapper.toDTO(savedLink);
  }
}
