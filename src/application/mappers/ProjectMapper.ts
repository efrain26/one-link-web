import { Project } from '@domain/entities/Project';
import { Url } from '@domain/value-objects/Url';
import { ProjectDTO, ProjectListDTO } from '../dto/ProjectDTO';

/**
 * ProjectMapper - Convierte entre Entities y DTOs
 *
 * Mapper Pattern: Centraliza la conversión de datos entre capas
 */
export class ProjectMapper {
  /**
   * Convierte un Project Entity a ProjectDTO
   */
  static toDTO(project: Project): ProjectDTO {
    return {
      id: project.getId(),
      app_name: project.getAppName(),
      ios_url: project.getIosUrl().getValue(),
      android_url: project.getAndroidUrl().getValue(),
      fallback_url: project.getFallbackUrl()?.getValue() || null,
      short_code: project.getShortCode(),
      short_url: project.getShortUrl(),
      created_at: project.getCreatedAt().toISOString(),
    };
  }

  /**
   * Convierte un ProjectDTO a Project Entity
   */
  static toDomain(dto: ProjectDTO): Project {
    // Helper para validar URLs
    const isValidUrlString = (url: string | null | undefined): boolean => {
      return (
        url !== null &&
        url !== undefined &&
        typeof url === 'string' &&
        url.trim() !== '' &&
        url !== 'undefined' &&
        url !== 'null'
      );
    };

    // Validar iOS URL (requerida)
    if (!isValidUrlString(dto.ios_url)) {
      throw new Error(`Project ${dto.id} has invalid ios_url: ${dto.ios_url}`);
    }

    // Validar Android URL (requerida)
    if (!isValidUrlString(dto.android_url)) {
      throw new Error(`Project ${dto.id} has invalid android_url: ${dto.android_url}`);
    }

    // Validar fallback_url (opcional)
    let fallbackUrl: Url | null = null;
    if (isValidUrlString(dto.fallback_url)) {
      try {
        fallbackUrl = new Url(dto.fallback_url!);
      } catch (error) {
        console.warn(`Invalid fallback_url for project ${dto.id}: ${dto.fallback_url}`, error);
      }
    }

    return new Project({
      id: dto.id,
      appName: dto.app_name,
      iosUrl: new Url(dto.ios_url),
      androidUrl: new Url(dto.android_url),
      fallbackUrl,
      shortCode: dto.short_code,
      shortUrl: dto.short_url,
      createdAt: new Date(dto.created_at),
    });
  }

  /**
   * Convierte un ProjectListDTO a Project Entity (con datos limitados)
   */
  static fromListDTO(dto: ProjectListDTO): Partial<Project> {
    // Para listados, no tenemos todas las URLs, así que retornamos un objeto parcial
    return {
      getId: () => dto.id,
      getAppName: () => dto.app_name,
      getShortCode: () => dto.short_code,
      getShortUrl: () => dto.short_url,
      getCreatedAt: () => new Date(dto.created_at),
    } as unknown as Partial<Project>;
  }

  /**
   * Convierte una lista de DTOs a una lista de Entities
   */
  static toDomainList(dtos: ProjectDTO[]): Project[] {
    return dtos.map((dto) => this.toDomain(dto));
  }

  /**
   * Convierte una lista de Entities a una lista de DTOs
   */
  static toDTOList(projects: Project[]): ProjectDTO[] {
    return projects.map((project) => this.toDTO(project));
  }
}
