/**
 * DTOs para Project - Data Transfer Objects
 *
 * Estos objetos son usados para transferir datos entre capas
 * y para comunicación con la API externa.
 */

/**
 * DTO para crear un proyecto
 * Mapea a ProjectCreate del backend
 */
export interface CreateProjectDTO {
  app_name: string;
  ios_url: string;
  android_url: string;
  fallback_url?: string;
}

/**
 * DTO completo de proyecto
 * Mapea a ProjectResponse del backend
 */
export interface ProjectDTO {
  id: number;
  app_name: string;
  ios_url: string;
  android_url: string;
  fallback_url: string | null;
  short_code: string;
  short_url: string;
  created_at: string; // ISO 8601 date string
}

/**
 * DTO simplificado para listados
 * Mapea a ProjectListResponse del backend
 */
export interface ProjectListDTO {
  id: number;
  app_name: string;
  short_code: string;
  short_url: string;
  created_at: string; // ISO 8601 date string
}

/**
 * DTO para información de redirección (debugging)
 */
export interface RedirectInfoDTO {
  detected_platform: string;
  redirect_url: string;
  project: ProjectDTO;
}
