import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { ProjectListDTO } from '../../dto/ProjectDTO';

/**
 * ListProjects Use Case
 *
 * Lista todos los proyectos con paginación.
 * Retorna versión simplificada (ProjectListDTO) sin URLs completas.
 */
export class ListProjects {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(skip: number = 0, limit: number = 100): Promise<ProjectListDTO[]> {
    // Validación de parámetros
    if (skip < 0) {
      throw new Error('Skip must be a non-negative number');
    }
    if (limit <= 0 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    // Usar findAllSimplified porque el endpoint solo retorna info básica
    return await this.projectRepository.findAllSimplified(skip, limit);
  }
}
