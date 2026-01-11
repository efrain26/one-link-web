import { IProjectRepository } from '@domain/repositories/IProjectRepository';
import { Project } from '@domain/entities/Project';
import { httpClient } from '../api/client/HttpClient';
import { ProjectMapper } from '@application/mappers/ProjectMapper';
import { ProjectDTO, CreateProjectDTO } from '@application/dto/ProjectDTO';

/**
 * ProjectRepository - Implementación del repositorio de proyectos
 *
 * Implementa IProjectRepository usando HTTP para comunicarse con el backend.
 */
export class ProjectRepository implements IProjectRepository {
  /**
   * Crea un nuevo proyecto
   */
  async create(data: {
    appName: string;
    iosUrl: string;
    androidUrl: string;
    fallbackUrl?: string;
  }): Promise<Project> {
    const createDTO: CreateProjectDTO = {
      app_name: data.appName,
      ios_url: data.iosUrl,
      android_url: data.androidUrl,
      ...(data.fallbackUrl && { fallback_url: data.fallbackUrl }),
    };

    const responseDTO = await httpClient.post<ProjectDTO>('/api/projects/', createDTO);
    return ProjectMapper.toDomain(responseDTO);
  }

  /**
   * Obtiene un proyecto por su código corto
   */
  async findByShortCode(shortCode: string): Promise<Project | null> {
    try {
      const dto = await httpClient.get<ProjectDTO>(`/api/projects/${shortCode}`);
      return ProjectMapper.toDomain(dto);
    } catch (error) {
      // Si es un 404, retornar null
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return null;
      }
      // Otros errores, propagar
      throw error;
    }
  }

  /**
   * Lista todos los proyectos con paginación
   */
  async findAll(skip: number = 0, limit: number = 100): Promise<Project[]> {
    const dtos = await httpClient.get<ProjectDTO[]>(
      `/api/projects/?skip=${skip}&limit=${limit}`
    );
    return ProjectMapper.toDomainList(dtos);
  }
}
