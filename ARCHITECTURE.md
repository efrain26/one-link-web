# Arquitectura del Proyecto OneLink

## Resumen

Este proyecto implementa una arquitectura basada en **Domain-Driven Design (DDD)** y principios de **Clean Code**, organizada en capas con separación clara de responsabilidades.

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

## Directorio y Responsabilidades

### 📁 `src/domain/` - Domain Layer
**Responsabilidad**: Lógica de negocio pura, sin dependencias externas

- **`entities/`**: Objetos con identidad (User, Link, LinkPage)
  - Contienen lógica de negocio
  - Métodos de dominio (activate, publish, etc.)
  - Factory methods (create)

- **`value-objects/`**: Objetos inmutables auto-validados (Email, Url, Username)
  - Validación en el constructor
  - Inmutables
  - Métodos: getValue(), equals(), toString()

- **`repositories/`**: Interfaces (NO implementaciones)
  - Define contratos para persistencia
  - Infrastructure las implementa

- **`exceptions/`**: Excepciones de dominio
  - DomainException (base)
  - InvalidEmailException, InvalidUrlException

### 📁 `src/application/` - Application Layer
**Responsabilidad**: Orquestación de casos de uso

- **`use-cases/`**: Un caso de uso = una clase
  - Ejemplo: CreateLink, GetUserLinks, UpdateLink
  - Dependency injection via constructor
  - Retorna DTOs, no entidades

- **`dto/`**: Data Transfer Objects
  - Objetos planos para transferencia de datos
  - Interfaces TypeScript
  - Separados por entidad (LinkDTO, UserDTO)

- **`mappers/`**: Conversión Entity ↔ DTO
  - LinkMapper.toDTO(entity)
  - LinkMapper.toDomain(dto)

### 📁 `src/infrastructure/` - Infrastructure Layer
**Responsabilidad**: Implementaciones técnicas

- **`api/client/`**: HTTP Client
  - httpClient singleton
  - Métodos: get, post, put, delete
  - Manejo de auth tokens

- **`repositories/`**: Implementaciones de interfaces del dominio
  - LinkRepository implements ILinkRepository
  - Usa httpClient para comunicarse con API
  - Convierte DTOs a Entities con Mappers

- **`config/`**: Configuración
  - envConfig (variables de entorno)

### 📁 `src/presentation/` - Presentation Layer
**Responsabilidad**: Interfaz de usuario (React)

- **`components/`**: Componentes React
  - `common/`: Reutilizables (Button, Input, Card)
  - `link/`: Específicos de enlaces
  - `user/`: Específicos de usuario

- **`hooks/`**: Custom React Hooks
  - useLinks: Hook que consume use cases
  - Puente entre UI y Application Layer

- **`pages/`**: Componentes de página completa

### 📁 `src/shared/` - Shared Layer
**Responsabilidad**: Código compartido entre capas

- **`types/`**: TypeScript types comunes
- **`constants/`**: Constantes (rutas, validaciones)
- **`utils/`**: Funciones utilitarias

## Flujo de Datos

### Ejemplo: Usuario crea un enlace

```typescript
// 1. UI (Presentation)
const { createLink } = useLinks(userId);
await createLink({ title: "Blog", url: "https://blog.com", position: 1 });

// 2. Hook (Presentation)
const useLinks = (userId: string) => {
  const createLink = async (dto: CreateLinkDTO) => {
    const useCase = new CreateLink(linkRepository);
    const newLink = await useCase.execute(userId, dto);
    setLinks([...links, newLink]);
  };
};

// 3. Use Case (Application)
class CreateLink {
  async execute(userId: string, dto: CreateLinkDTO): Promise<LinkDTO> {
    const link = Link.create(userId, dto.title, dto.url, dto.position);
    const saved = await this.linkRepository.save(link);
    return LinkMapper.toDTO(saved);
  }
}

// 4. Entity (Domain)
class Link {
  static create(userId, title, url, position) {
    return new Link({
      id: crypto.randomUUID(),
      url: new Url(url), // ← Validación automática
      // ...
    });
  }
}

// 5. Repository (Infrastructure)
class LinkRepository implements ILinkRepository {
  async save(link: Link): Promise<Link> {
    const dto = LinkMapper.toDTO(link);
    const response = await httpClient.post('/links', dto);
    return LinkMapper.toDomain(response);
  }
}
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
   - ILinkRepository, IUserRepository

5. **Dependency Inversion Principle (DIP)**
   - Capas superiores dependen de abstracciones
   - Use Cases dependen de IRepository (interfaz)
   - Infrastructure implementa las interfaces

### Clean Code

- **Nombres descriptivos**: Email, Username, CreateLink
- **Funciones pequeñas**: Una responsabilidad por función
- **Sin código duplicado**: Validación en Value Objects
- **Comentarios solo cuando necesario**: Código auto-documentado

## Patrones de Diseño

1. **Entity Pattern**: User, Link, LinkPage
2. **Value Object Pattern**: Email, Url, Username
3. **Repository Pattern**: ILinkRepository → LinkRepository
4. **Use Case Pattern**: CreateLink, GetUserLinks
5. **Factory Pattern**: Link.create()
6. **Mapper Pattern**: LinkMapper.toDTO()
7. **Dependency Injection**: Constructor injection en use cases

## Path Aliases (TypeScript)

```typescript
import { Link } from '@domain/entities/Link';
import { CreateLink } from '@application/use-cases/link/CreateLink';
import { LinkRepository } from '@infrastructure/repositories/LinkRepository';
import { useLinks } from '@presentation/hooks/useLinks';
import { ROUTES } from '@shared/constants/routeConstants';
```

Configurados en `tsconfig.json` y `vite.config.ts`.

## Comandos Útiles

```bash
# Desarrollo
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

## Referencias

- Plan completo: `~/.claude/plans/glistening-hopping-dragon.md`
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
