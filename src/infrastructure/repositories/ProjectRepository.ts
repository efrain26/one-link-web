import { IProjectRepository } from '@domain/repositories/IProjectRepository';
import { Project } from '@domain/entities/Project';
import { httpClient } from '../api/client/HttpClient';
import { ProjectMapper } from '@application/mappers/ProjectMapper';
import { ProjectDTO, CreateProjectDTO, ProjectListDTO } from '@application/dto/ProjectDTO';

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
   * Nota: El endpoint de listado solo retorna información básica sin URLs completas
   */
  async findAll(_skip: number = 0, _limit: number = 100): Promise<Project[]> {
    // El endpoint GET /api/projects/ retorna ProjectListDTO (sin URLs completas)
    // No podemos convertir a Project porque faltan ios_url, android_url
    // Por ahora retornamos un array vacío - este método no debe usarse
    // En su lugar, usar findAllSimplified() para obtener ProjectListDTO
    throw new Error('findAll() no está disponible. El endpoint de listado no retorna URLs completas. Use un método alternativo o obtenga proyectos individuales por código.');
  }

  /**
   * Lista todos los proyectos (versión simplificada)
   * Retorna ProjectListDTO sin las URLs completas
   */
  async findAllSimplified(skip: number = 0, limit: number = 100): Promise<ProjectListDTO[]> {
    const dtos = await httpClient.get<ProjectListDTO[]>(
      `/api/projects/?skip=${skip}&limit=${limit}`
    );
    return dtos;
  }
}
