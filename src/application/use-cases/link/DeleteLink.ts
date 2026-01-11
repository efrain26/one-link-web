import { ILinkRepository } from '@domain/repositories/ILinkRepository';

export class DeleteLink {
  constructor(private linkRepository: ILinkRepository) {}

  async execute(linkId: string): Promise<void> {
    const link = await this.linkRepository.findById(linkId);

    if (!link) {
      throw new Error(`Link with id ${linkId} not found`);
    }

    await this.linkRepository.delete(linkId);
  }
}
