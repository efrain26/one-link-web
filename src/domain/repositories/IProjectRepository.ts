import { Project } from '../entities/Project';

/**
 * IProjectRepository - Interfaz para persistencia de proyectos
 *
 * Define el contrato para operaciones de persistencia.
 * La implementación real estará en la capa de Infrastructure.
 */
export interface IProjectRepository {
  /**
   * Crea un nuevo proyecto
   * @param data - Datos del proyecto a crear
   * @returns Proyecto creado con ID, short_code y short_url generados
   */
  create(data: {
    appName: string;
    iosUrl: string;
    androidUrl: string;
    fallbackUrl?: string;
  }): Promise<Project>;

  /**
   * Obtiene un proyecto por su código corto
   * @param shortCode - Código corto único del proyecto
   * @returns Proyecto encontrado o null
   */
  findByShortCode(shortCode: string): Promise<Project | null>;

  /**
   * Lista todos los proyectos con paginación
   * @param skip - Número de proyectos a saltar
   * @param limit - Máximo de proyectos a retornar
   * @returns Array de proyectos
   */
  findAll(skip?: number, limit?: number): Promise<Project[]>;
}
