import { useState, useEffect, useCallback } from 'react';
import { ProjectDTO, CreateProjectDTO, ProjectListDTO } from '@application/dto/ProjectDTO';
import { CreateProject } from '@application/use-cases/project/CreateProject';
import { GetProjectByCode } from '@application/use-cases/project/GetProjectByCode';
import { ListProjects } from '@application/use-cases/project/ListProjects';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';

// Singleton del repositorio
const projectRepository = new ProjectRepository();

/**
 * useProjects Hook
 *
 * Hook personalizado que conecta la UI con los casos de uso de Project.
 * Maneja el estado local y proporciona funciones para interactuar con proyectos.
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectListDTO[]>([]);
  const [loading, setLoading] = useState(true); // true por defecto para mostrar loading en carga inicial
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga la lista de proyectos
   */
  const fetchProjects = useCallback(async (skip: number = 0, limit: number = 100) => {
    setLoading(true);
    setError(null);

    try {
      const listProjectsUseCase = new ListProjects(projectRepository);
      const projectList = await listProjectsUseCase.execute(skip, limit);
      setProjects(projectList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar proyectos';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo proyecto
   */
  const createProject = async (dto: CreateProjectDTO): Promise<ProjectDTO | null> => {
    setLoading(true);
    setError(null);

    try {
      const createProjectUseCase = new CreateProject(projectRepository);
      const newProject = await createProjectUseCase.execute(dto);

      // Convertir ProjectDTO a ProjectListDTO y agregarlo a la lista local
      const newProjectListItem: ProjectListDTO = {
        id: newProject.id,
        app_name: newProject.app_name,
        short_code: newProject.short_code,
        short_url: newProject.short_url,
        created_at: newProject.created_at,
      };
      setProjects((prev) => [newProjectListItem, ...prev]);

      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear proyecto';
      setError(errorMessage);
      console.error('Error creating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene un proyecto por su código corto
   */
  const getProjectByCode = async (shortCode: string): Promise<ProjectDTO | null> => {
    setLoading(true);
    setError(null);

    try {
      const getProjectUseCase = new GetProjectByCode(projectRepository);
      return await getProjectUseCase.execute(shortCode);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener proyecto';
      setError(errorMessage);
      console.error('Error getting project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga inicial de proyectos al montar el componente
   */
  useEffect(() => {
    const loadInitialProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const listProjectsUseCase = new ListProjects(projectRepository);
        const projectList = await listProjectsUseCase.execute(0, 100);
        setProjects(projectList);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar proyectos';
        setError(errorMessage);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta al montar el componente

  return {
    projects,
    loading,
    error,
    createProject,
    getProjectByCode,
    refetch: fetchProjects,
  };
};
