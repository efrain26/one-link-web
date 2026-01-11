import { LinkPage, LinkPageTheme } from '@domain/entities/LinkPage';
import { Username } from '@domain/value-objects/Username';
import { LinkPageDTO } from '../dto/LinkPageDTO';

export class LinkPageMapper {
  static toDTO(linkPage: LinkPage): LinkPageDTO {
    return {
      id: linkPage.getId(),
      userId: linkPage.getUserId(),
      username: linkPage.getUsername().getValue(),
      displayName: linkPage.getDisplayName(),
      bio: linkPage.getBio(),
      avatarUrl: linkPage.getAvatarUrl(),
      theme: linkPage.getTheme(),
      isPublished: linkPage.getIsPublished(),
      viewCount: linkPage.getViewCount(),
      createdAt: linkPage.getCreatedAt().toISOString(),
      updatedAt: linkPage.getUpdatedAt().toISOString(),
    };
  }

  static toDomain(dto: LinkPageDTO): LinkPage {
    return new LinkPage({
      id: dto.id,
      userId: dto.userId,
      username: new Username(dto.username),
      displayName: dto.displayName,
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      theme: dto.theme as LinkPageTheme,
      isPublished: dto.isPublished,
      viewCount: dto.viewCount,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }
}
