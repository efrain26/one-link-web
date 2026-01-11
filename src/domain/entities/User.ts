import { Email } from '../value-objects/Email';
import { Username } from '../value-objects/Username';

export interface UserProps {
  id: string;
  email: Email;
  username: Username;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private readonly id: string;
  private email: Email;
  private username: Username;
  private displayName: string;
  private avatarUrl?: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.username = props.username;
    this.displayName = props.displayName;
    this.avatarUrl = props.avatarUrl;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getId(): string {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getUsername(): Username {
    return this.username;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateProfile(displayName: string, avatarUrl?: string): void {
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.updatedAt = new Date();
  }

  changeEmail(newEmail: Email): void {
    this.email = newEmail;
    this.updatedAt = new Date();
  }

  static create(
    email: string,
    username: string,
    displayName: string
  ): User {
    return new User({
      id: crypto.randomUUID(),
      email: new Email(email),
      username: new Username(username),
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
