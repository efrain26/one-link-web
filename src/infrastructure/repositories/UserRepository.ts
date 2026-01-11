import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';
import { Username } from '@domain/value-objects/Username';
import { httpClient } from '../api/client/HttpClient';
import { UserMapper } from '@application/mappers/UserMapper';
import { UserDTO } from '@application/dto/UserDTO';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const dto = await httpClient.get<UserDTO>(`/users/${id}`);
      return UserMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const dto = await httpClient.get<UserDTO>(`/users/email/${email.getValue()}`);
      return UserMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async findByUsername(username: Username): Promise<User | null> {
    try {
      const dto = await httpClient.get<UserDTO>(`/users/username/${username.getValue()}`);
      return UserMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async save(user: User): Promise<User> {
    const dto = UserMapper.toDTO(user);
    const savedDto = await httpClient.post<UserDTO>('/users', dto);
    return UserMapper.toDomain(savedDto);
  }

  async update(user: User): Promise<User> {
    const dto = UserMapper.toDTO(user);
    const updatedDto = await httpClient.put<UserDTO>(
      `/users/${user.getId()}`,
      dto
    );
    return UserMapper.toDomain(updatedDto);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  }
}
