import { IProjectRepository } from '@domain/repositories/IProjectRepository';
import { Project } from '@domain/entities/Project';
import { CreateProjectDTO, ProjectDTO } from '../../dto/ProjectDTO';
import { ProjectMapper } from '../../mappers/ProjectMapper';

/**
 * CreateProject Use Case
 *
 * Orquesta la creación de un nuevo proyecto.
 * Valida los datos y delega la persistencia al repositorio.
 */
export class CreateProject {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(dto: CreateProjectDTO): Promise<ProjectDTO> {
    // Validar datos usando el factory method del dominio
    const validatedData = Project.createForRequest(
      dto.app_name,
      dto.ios_url,
      dto.android_url,
      dto.fallback_url
    );

    // Crear proyecto a través del repositorio
    const project = await this.projectRepository.create(validatedData);

    // Retornar DTO
    return ProjectMapper.toDTO(project);
  }
}
