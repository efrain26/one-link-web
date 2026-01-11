import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';
import { Username } from '@domain/value-objects/Username';
import { UserDTO } from '../dto/UserDTO';

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.getId(),
      email: user.getEmail().getValue(),
      username: user.getUsername().getValue(),
      displayName: user.getDisplayName(),
      avatarUrl: user.getAvatarUrl(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }

  static toDomain(dto: UserDTO): User {
    return new User({
      id: dto.id,
      email: new Email(dto.email),
      username: new Username(dto.username),
      displayName: dto.displayName,
      avatarUrl: dto.avatarUrl,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }
}
