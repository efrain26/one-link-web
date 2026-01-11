import { ILinkRepository } from '@domain/repositories/ILinkRepository';
import { LinkDTO } from '../../dto/LinkDTO';
import { LinkMapper } from '../../mappers/LinkMapper';

export class GetUserLinks {
  constructor(private linkRepository: ILinkRepository) {}

  async execute(userId: string): Promise<LinkDTO[]> {
    const links = await this.linkRepository.findByUserId(userId);

    const sortedLinks = links.sort(
      (a, b) => a.getPosition() - b.getPosition()
    );

    return LinkMapper.toDTOList(sortedLinks);
  }
}
