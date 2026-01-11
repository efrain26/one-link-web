import { ILinkPageRepository } from '@domain/repositories/ILinkPageRepository';
import { LinkPage } from '@domain/entities/LinkPage';
import { Username } from '@domain/value-objects/Username';
import { httpClient } from '../api/client/HttpClient';
import { LinkPageMapper } from '@application/mappers/LinkPageMapper';
import { LinkPageDTO } from '@application/dto/LinkPageDTO';

export class LinkPageRepository implements ILinkPageRepository {
  async findById(id: string): Promise<LinkPage | null> {
    try {
      const dto = await httpClient.get<LinkPageDTO>(`/link-pages/${id}`);
      return LinkPageMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async findByUserId(userId: string): Promise<LinkPage | null> {
    try {
      const dto = await httpClient.get<LinkPageDTO>(`/users/${userId}/link-page`);
      return LinkPageMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async findByUsername(username: Username): Promise<LinkPage | null> {
    try {
      const dto = await httpClient.get<LinkPageDTO>(`/link-pages/username/${username.getValue()}`);
      return LinkPageMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async save(linkPage: LinkPage): Promise<LinkPage> {
    const dto = LinkPageMapper.toDTO(linkPage);
    const savedDto = await httpClient.post<LinkPageDTO>('/link-pages', dto);
    return LinkPageMapper.toDomain(savedDto);
  }

  async update(linkPage: LinkPage): Promise<LinkPage> {
    const dto = LinkPageMapper.toDTO(linkPage);
    const updatedDto = await httpClient.put<LinkPageDTO>(
      `/link-pages/${linkPage.getId()}`,
      dto
    );
    return LinkPageMapper.toDomain(updatedDto);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/link-pages/${id}`);
  }
}
