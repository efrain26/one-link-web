import { Link } from '@domain/entities/Link';
import { Url } from '@domain/value-objects/Url';
import { LinkDTO } from '../dto/LinkDTO';

export class LinkMapper {
  static toDTO(link: Link): LinkDTO {
    return {
      id: link.getId(),
      userId: link.getUserId(),
      title: link.getTitle(),
      url: link.getUrl().getValue(),
      description: link.getDescription(),
      thumbnailUrl: link.getThumbnailUrl(),
      position: link.getPosition(),
      isActive: link.isLinkActive(),
      clicks: link.getClicks(),
      createdAt: link.getCreatedAt().toISOString(),
      updatedAt: link.getUpdatedAt().toISOString(),
    };
  }

  static toDomain(dto: LinkDTO): Link {
    return new Link({
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      url: new Url(dto.url),
      description: dto.description,
      thumbnailUrl: dto.thumbnailUrl,
      position: dto.position,
      isActive: dto.isActive,
      clicks: dto.clicks,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }

  static toDTOList(links: Link[]): LinkDTO[] {
    return links.map((link) => this.toDTO(link));
  }
}
