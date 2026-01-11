# Arquitectura del Proyecto OneLink

## Resumen

**OneLink** es un generador universal de enlaces para App Stores. Detecta automáticamente el dispositivo del usuario (iOS/Android/Desktop) y lo redirige a la tienda de aplicaciones correspondiente.

Este proyecto implementa una arquitectura basada en **Domain-Driven Design (DDD)** y principios de **Clean Code**, organizada en capas con separación clara de responsabilidades.

## ¿Qué hace OneLink?

1. Usuario crea un proyecto con URLs a diferentes stores (App Store, Play Store, sitio web)
2. El sistema genera un link corto único (ej: `onelink.com/xK9mP2`)
3. Cuando alguien visita ese link, el sistema detecta su plataforma y lo redirige automáticamente

**Ejemplo de flujo:**
```
Usuario desde iPhone visita: onelink.com/xK9mP2
  → Sistema detecta iOS
  → Redirige a: https://apps.apple.com/app/id123456789

Usuario desde Android visita: onelink.com/xK9mP2
  → Sistema detecta Android
  → Redirige a: https://play.google.com/store/apps/details?id=com.app
```

## Estructura de Capas

```
┌─────────────────────────────────────────┐
│      Presentation Layer (React UI)     │
│  Components, Hooks, Pages, Context     │
└────────────────┬────────────────────────┘
                 │ ↓ usa
┌────────────────┴────────────────────────┐
│       Application Layer (Use Cases)     │
│    DTOs, Mappers, Use Cases, Ports     │
└────────────────┬────────────────────────┘
                 │ ↓ depende de interfaces
┌────────────────┴────────────────────────┐
│         Domain Layer (Core)             │
│  Entities, Value Objects, Repositories  │
└────────────────┬────────────────────────┘
                 │ ↑ implementa interfaces
┌────────────────┴────────────────────────┐
│  Infrastructure Layer (External)        │
│   HTTP Client, Repositories, APIs      │
└─────────────────────────────────────────┘
```

## Backend API

El proyecto se conecta a una API FastAPI en `http://localhost:8000`

**Endpoints principales:**

- `POST /api/projects/` - Crear nuevo proyecto (genera short_code)
- `GET /api/projects/` - Listar proyectos (paginado)
- `GET /api/projects/{short_code}` - Obtener proyecto por código
- `GET /{short_code}` - Redirigir a la store correcta según dispositivo
- `GET /info/{short_code}` - Ver info de redirección (debugging)

**Schemas:**
```typescript
// Request para crear proyecto
{
  app_name: string;
  ios_url: string;
  android_url: string;
  fallback_url?: string;
}

// Response de proyecto
{
  id: number;
  app_name: string;
  ios_url: string;
  android_url: string;
  fallback_url: string | null;
  short_code: string;
  short_url: string;
  created_at: string; // ISO 8601
}
```

## Directorio y Responsabilidades

### 📁 `src/domain/` - Domain Layer
**Responsabilidad**: Lógica de negocio pura, sin dependencias externas

- **`entities/`**: Objetos con identidad
  - `Project.ts` - Proyecto de app con URLs a diferentes stores
  - Contienen lógica de negocio
  - Métodos de dominio (updateAppName, updateIosUrl, etc.)
  - Factory methods (createForRequest)

- **`value-objects/`**: Objetos inmutables auto-validados
  - `Url.ts` - URL auto-validada
  - `Email.ts` - Email auto-validado
  - `Username.ts` - Username con reglas de validación
  - Validación en el constructor
  - Inmutables
  - Métodos: getValue(), equals(), toString()

- **`repositories/`**: Interfaces (NO implementaciones)
  - `IProjectRepository.ts` - Define contratos para persistencia
  - Infrastructure las implementa

- **`exceptions/`**: Excepciones de dominio
  - DomainException (base)
  - InvalidEmailException, InvalidUrlException

### 📁 `src/application/` - Application Layer
**Responsabilidad**: Orquestación de casos de uso

- **`use-cases/project/`**: Un caso de uso = una clase
  - `CreateProject.ts` - Crear nuevo proyecto
  - `ListProjects.ts` - Listar proyectos con paginación
  - `GetProjectByCode.ts` - Obtener proyecto por short_code
  - Dependency injection via constructor
  - Retorna DTOs, no entidades

- **`dto/`**: Data Transfer Objects
  - `ProjectDTO.ts` - DTOs para transferencia de datos
    - CreateProjectDTO - Para crear proyectos
    - ProjectDTO - Proyecto completo
    - ProjectListDTO - Versión simplificada para listados
  - Objetos planos para transferencia de datos
  - Interfaces TypeScript

- **`mappers/`**: Conversión Entity ↔ DTO
  - `ProjectMapper.ts` - Convierte Project Entity ↔ ProjectDTO
  - ProjectMapper.toDTO(entity)
  - ProjectMapper.toDomain(dto)
  - ProjectMapper.toDomainList(dtos)

### 📁 `src/infrastructure/` - Infrastructure Layer
**Responsabilidad**: Implementaciones técnicas

- **`api/client/`**: HTTP Client
  - `HttpClient.ts` - Cliente HTTP genérico
  - httpClient singleton
  - Métodos: get, post, put, delete
  - Manejo de auth tokens (setAuthToken, removeAuthToken)

- **`repositories/`**: Implementaciones de interfaces del dominio
  - `ProjectRepository.ts` - Implementa IProjectRepository
  - Usa httpClient para comunicarse con API backend
  - Convierte DTOs a Entities con Mappers
  - Maneja errores (404 → null)

- **`config/`**: Configuración
  - `envConfig.ts` - Variables de entorno
    - VITE_API_URL (default: http://localhost:8000)
    - VITE_APP_NAME
    - VITE_APP_VERSION

### 📁 `src/presentation/` - Presentation Layer
**Responsabilidad**: Interfaz de usuario (React)

- **`hooks/`**: Custom React Hooks
  - `useProjects.ts` - Hook que consume use cases de Project
    - Maneja estado local (projects, loading, error)
    - Funciones: createProject, getProjectByCode, fetchProjects, refetch
    - Puente entre UI y Application Layer

- **`components/`**: Componentes React
  - `App.tsx` - Componente principal con formulario y lista de proyectos

- **`pages/`**: Componentes de página completa (futuro)

### 📁 `src/shared/` - Shared Layer
**Responsabilidad**: Código compartido entre capas

- **`types/`**: TypeScript types comunes
  - `common.types.ts` - ID, Pagination, ApiResponse, ApiError
- **`constants/`**: Constantes
  - `routeConstants.ts` - Rutas de la aplicación
- **`utils/`**: Funciones utilitarias

## Flujo de Datos

### Ejemplo: Usuario crea un proyecto

```typescript
// 1. UI (Presentation - App.tsx)
const { createProject } = useProjects();
await createProject({
  app_name: "Mi App",
  ios_url: "https://apps.apple.com/app/id123",
  android_url: "https://play.google.com/store/apps/details?id=com.app",
  fallback_url: "https://www.example.com"
});

// 2. Hook (Presentation - useProjects.ts)
const createProject = async (dto: CreateProjectDTO) => {
  const useCase = new CreateProject(projectRepository);
  const newProject = await useCase.execute(dto);
  setProjects([newProject, ...projects]);
};

// 3. Use Case (Application - CreateProject.ts)
class CreateProject {
  async execute(dto: CreateProjectDTO): Promise<ProjectDTO> {
    // Validar datos usando factory del dominio
    const validatedData = Project.createForRequest(
      dto.app_name, dto.ios_url, dto.android_url, dto.fallback_url
    );

    // Crear proyecto a través del repositorio
    const project = await this.projectRepository.create(validatedData);

    // Retornar DTO
    return ProjectMapper.toDTO(project);
  }
}

// 4. Entity (Domain - Project.ts)
class Project {
  static createForRequest(appName, iosUrl, androidUrl, fallbackUrl?) {
    // Validación automática de URLs
    new Url(iosUrl);
    new Url(androidUrl);
    if (fallbackUrl) new Url(fallbackUrl);

    // Validación de appName
    if (!appName || appName.trim().length === 0) {
      throw new Error('App name is required');
    }

    return { appName, iosUrl, androidUrl, fallbackUrl };
  }
}

// 5. Repository (Infrastructure - ProjectRepository.ts)
class ProjectRepository implements IProjectRepository {
  async create(data): Promise<Project> {
    const createDTO = {
      app_name: data.appName,
      ios_url: data.iosUrl,
      android_url: data.androidUrl,
      ...(data.fallbackUrl && { fallback_url: data.fallbackUrl }),
    };

    // Hacer request al backend
    const responseDTO = await httpClient.post('/api/projects/', createDTO);

    // Convertir DTO a Entity
    return ProjectMapper.toDomain(responseDTO);
  }
}

// 6. HTTP Client (Infrastructure - HttpClient.ts)
class HttpClient {
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
```

**Flujo visual:**
```
UI → Hook → UseCase → Entity (validation) → Repository → HttpClient → API Backend
                                                    ↓
                                            Mapper convierte
                                            Response → Entity → DTO
```

## Principios Aplicados

### SOLID

1. **Single Responsibility Principle (SRP)**
   - Cada clase tiene una única responsabilidad
   - Entities: lógica de dominio
   - Use Cases: orquestación
   - Repositories: persistencia

2. **Open/Closed Principle (OCP)**
   - Abierto para extensión, cerrado para modificación
   - Value Objects inmutables
   - Interfaces permiten extensión

3. **Liskov Substitution Principle (LSP)**
   - Implementaciones de repositorios son intercambiables

4. **Interface Segregation Principle (ISP)**
   - Interfaces pequeñas y específicas
   - IProjectRepository

5. **Dependency Inversion Principle (DIP)**
   - Capas superiores dependen de abstracciones
   - Use Cases dependen de IProjectRepository (interfaz)
   - Infrastructure implementa las interfaces

### Clean Code

- **Nombres descriptivos**: Project, Url, CreateProject
- **Funciones pequeñas**: Una responsabilidad por función
- **Sin código duplicado**: Validación en Value Objects
- **Comentarios solo cuando necesario**: Código auto-documentado

## Patrones de Diseño

1. **Entity Pattern**: Project
2. **Value Object Pattern**: Url, Email, Username
3. **Repository Pattern**: IProjectRepository → ProjectRepository
4. **Use Case Pattern**: CreateProject, ListProjects
5. **Factory Pattern**: Project.createForRequest()
6. **Mapper Pattern**: ProjectMapper.toDTO()
7. **Dependency Injection**: Constructor injection en use cases
8. **Singleton Pattern**: httpClient, projectRepository

## Path Aliases (TypeScript)

```typescript
import { Project } from '@domain/entities/Project';
import { CreateProject } from '@application/use-cases/project/CreateProject';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { useProjects } from '@presentation/hooks/useProjects';
import { ROUTES } from '@shared/constants/routeConstants';
```

Configurados en `tsconfig.json` y `vite.config.ts`.

## Comandos Útiles

```bash
# Desarrollo (Frontend en puerto 3000)
npm run dev

# Type checking
npm run type-check

# Build producción
npm run build

# Lint
npm run lint

# Preview build
npm run preview
```

## Ventajas de Esta Arquitectura

### Testabilidad
- ✅ Cada capa testeable independientemente
- ✅ Mock fácil con interfaces
- ✅ Domain layer sin dependencias externas

### Mantenibilidad
- ✅ Cambios localizados por capa
- ✅ Código organizado y fácil de encontrar
- ✅ Estructura clara para nuevos desarrolladores

### Escalabilidad
- ✅ Fácil agregar features siguiendo patrones
- ✅ Cambiar backend sin tocar dominio
- ✅ Cambiar UI sin tocar lógica de negocio

### Seguridad
- ✅ Validación centralizada en Value Objects
- ✅ Type safety con TypeScript
- ✅ Errores detectados en compilación

## Agregar Nueva Feature

### Ejemplo: Agregar "Analytics"

1. **Domain**: Crear `Analytics.ts` entity en `src/domain/entities/`
2. **Domain**: Crear `IAnalyticsRepository.ts` en `src/domain/repositories/`
3. **Application**: Crear DTOs en `src/application/dto/AnalyticsDTO.ts`
4. **Application**: Crear Mapper en `src/application/mappers/AnalyticsMapper.ts`
5. **Application**: Crear use cases en `src/application/use-cases/analytics/`
6. **Infrastructure**: Implementar `AnalyticsRepository.ts`
7. **Presentation**: Crear `useAnalytics.ts` hook
8. **Presentation**: Crear componentes y página

**Orden**: Domain → Application → Infrastructure → Presentation

## Configuración del Proxy

El frontend (puerto 3000) se conecta al backend (puerto 8000) a través de un proxy configurado en `vite.config.ts`:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

Esto permite hacer requests a `/api/projects/` desde el frontend y Vite los redirige a `http://localhost:8000/api/projects/`.

## Estado Actual del Proyecto

### ✅ Implementado

- ✅ Arquitectura DDD completa
- ✅ TypeScript con strict mode
- ✅ Domain Layer: Project Entity, Url Value Object, IProjectRepository
- ✅ Application Layer: CreateProject, ListProjects, GetProjectByCode Use Cases
- ✅ Infrastructure Layer: ProjectRepository, HttpClient
- ✅ Presentation Layer: useProjects Hook, App component con formulario
- ✅ Integración con API Backend (FastAPI)
- ✅ Formulario funcional para crear proyectos
- ✅ Lista de proyectos existentes
- ✅ Manejo de errores
- ✅ Path aliases configurados

### 🚧 Por Implementar (futuro)

- 🚧 Autenticación de usuarios
- 🚧 React Router para navegación
- 🚧 Componentes reutilizables (Button, Input, Card)
- 🚧 Páginas adicionales (Dashboard, Public Link Page)
- 🚧 Testing (Unit tests, Integration tests)
- 🚧 Analytics y estadísticas de clicks
- 🚧 Edición y eliminación de proyectos
- 🚧 Validación de formularios mejorada
- 🚧 Loading states y skeleton loaders
- 🚧 Toast notifications

## Referencias

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
