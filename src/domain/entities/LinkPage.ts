import { Username } from '../value-objects/Username';

export interface LinkPageTheme {
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
}

export interface LinkPageProps {
  id: string;
  userId: string;
  username: Username;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  theme: LinkPageTheme;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class LinkPage {
  private readonly id: string;
  private readonly userId: string;
  private username: Username;
  private displayName: string;
  private bio?: string;
  private avatarUrl?: string;
  private theme: LinkPageTheme;
  private isPublished: boolean;
  private viewCount: number;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: LinkPageProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.username = props.username;
    this.displayName = props.displayName;
    this.bio = props.bio;
    this.avatarUrl = props.avatarUrl;
    this.theme = props.theme;
    this.isPublished = props.isPublished;
    this.viewCount = props.viewCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getUsername(): Username {
    return this.username;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getBio(): string | undefined {
    return this.bio;
  }

  getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  getTheme(): LinkPageTheme {
    return { ...this.theme };
  }

  getIsPublished(): boolean {
    return this.isPublished;
  }

  getViewCount(): number {
    return this.viewCount;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateProfile(displayName: string, bio?: string, avatarUrl?: string): void {
    this.displayName = displayName;
    this.bio = bio;
    this.avatarUrl = avatarUrl;
    this.updatedAt = new Date();
  }

  updateTheme(theme: LinkPageTheme): void {
    this.theme = theme;
    this.updatedAt = new Date();
  }

  publish(): void {
    this.isPublished = true;
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.isPublished = false;
    this.updatedAt = new Date();
  }

  incrementViews(): void {
    this.viewCount += 1;
  }

  static create(
    userId: string,
    username: string,
    displayName: string
  ): LinkPage {
    return new LinkPage({
      id: crypto.randomUUID(),
      userId,
      username: new Username(username),
      displayName,
      theme: {
        backgroundColor: '#ffffff',
        buttonColor: '#000000',
        buttonTextColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      },
      isPublished: false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
