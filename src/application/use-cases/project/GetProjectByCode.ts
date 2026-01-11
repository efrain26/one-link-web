import { IProjectRepository } from '@domain/repositories/IProjectRepository';
import { ProjectDTO } from '../../dto/ProjectDTO';
import { ProjectMapper } from '../../mappers/ProjectMapper';

/**
 * GetProjectByCode Use Case
 *
 * Obtiene un proyecto por su código corto.
 * Útil para verificar que un link existe.
 */
export class GetProjectByCode {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(shortCode: string): Promise<ProjectDTO | null> {
    if (!shortCode || shortCode.trim().length === 0) {
      throw new Error('Short code is required');
    }

    const project = await this.projectRepository.findByShortCode(shortCode.trim());

    if (!project) {
      return null;
    }

    return ProjectMapper.toDTO(project);
  }
}
