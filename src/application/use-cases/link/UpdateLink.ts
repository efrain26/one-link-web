import { ILinkRepository } from '@domain/repositories/ILinkRepository';
import { Url } from '@domain/value-objects/Url';
import { UpdateLinkDTO, LinkDTO } from '../../dto/LinkDTO';
import { LinkMapper } from '../../mappers/LinkMapper';

export class UpdateLink {
  constructor(private linkRepository: ILinkRepository) {}

  async execute(linkId: string, dto: UpdateLinkDTO): Promise<LinkDTO> {
    const link = await this.linkRepository.findById(linkId);

    if (!link) {
      throw new Error(`Link with id ${linkId} not found`);
    }

    if (dto.title !== undefined && dto.url !== undefined) {
      const url = new Url(dto.url);
      link.update(dto.title, url, dto.description);
    }

    if (dto.isActive !== undefined) {
      dto.isActive ? link.activate() : link.deactivate();
    }

    const updatedLink = await this.linkRepository.update(link);

    return LinkMapper.toDTO(updatedLink);
  }
}
