export interface UserDTO {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

export interface UpdateUserDTO {
  displayName?: string;
  avatarUrl?: string;
}
