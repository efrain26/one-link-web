import { ILinkRepository } from '@domain/repositories/ILinkRepository';
import { Link } from '@domain/entities/Link';
import { httpClient } from '../api/client/HttpClient';
import { LinkMapper } from '@application/mappers/LinkMapper';
import { LinkDTO } from '@application/dto/LinkDTO';

export class LinkRepository implements ILinkRepository {
  async findById(id: string): Promise<Link | null> {
    try {
      const dto = await httpClient.get<LinkDTO>(`/links/${id}`);
      return LinkMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Link[]> {
    const dtos = await httpClient.get<LinkDTO[]>(`/users/${userId}/links`);
    return dtos.map((dto) => LinkMapper.toDomain(dto));
  }

  async save(link: Link): Promise<Link> {
    const dto = LinkMapper.toDTO(link);
    const savedDto = await httpClient.post<LinkDTO>('/links', dto);
    return LinkMapper.toDomain(savedDto);
  }

  async update(link: Link): Promise<Link> {
    const dto = LinkMapper.toDTO(link);
    const updatedDto = await httpClient.put<LinkDTO>(
      `/links/${link.getId()}`,
      dto
    );
    return LinkMapper.toDomain(updatedDto);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/links/${id}`);
  }

  async reorderLinks(userId: string, linkIds: string[]): Promise<void> {
    await httpClient.post(`/users/${userId}/links/reorder`, { linkIds });
  }
}
