import { IProjectRepository } from '@domain/repositories/IProjectRepository';
import { ProjectDTO } from '../../dto/ProjectDTO';
import { ProjectMapper } from '../../mappers/ProjectMapper';

/**
 * ListProjects Use Case
 *
 * Lista todos los proyectos con paginación.
 */
export class ListProjects {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(skip: number = 0, limit: number = 100): Promise<ProjectDTO[]> {
    // Validación de parámetros
    if (skip < 0) {
      throw new Error('Skip must be a non-negative number');
    }
    if (limit <= 0 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const projects = await this.projectRepository.findAll(skip, limit);
    return ProjectMapper.toDTOList(projects);
  }
}
