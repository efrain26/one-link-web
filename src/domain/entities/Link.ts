import { Url } from '../value-objects/Url';

export interface LinkProps {
  id: string;
  userId: string;
  title: string;
  url: Url;
  description?: string;
  thumbnailUrl?: string;
  position: number;
  isActive: boolean;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Link {
  private readonly id: string;
  private readonly userId: string;
  private title: string;
  private url: Url;
  private description?: string;
  private thumbnailUrl?: string;
  private position: number;
  private isActive: boolean;
  private clicks: number;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: LinkProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.title = props.title;
    this.url = props.url;
    this.description = props.description;
    this.thumbnailUrl = props.thumbnailUrl;
    this.position = props.position;
    this.isActive = props.isActive;
    this.clicks = props.clicks;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getTitle(): string {
    return this.title;
  }

  getUrl(): Url {
    return this.url;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getThumbnailUrl(): string | undefined {
    return this.thumbnailUrl;
  }

  getPosition(): number {
    return this.position;
  }

  isLinkActive(): boolean {
    return this.isActive;
  }

  getClicks(): number {
    return this.clicks;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  update(title: string, url: Url, description?: string): void {
    this.title = title;
    this.url = url;
    this.description = description;
    this.updatedAt = new Date();
  }

  reposition(newPosition: number): void {
    this.position = newPosition;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  incrementClicks(): void {
    this.clicks += 1;
  }

  static create(
    userId: string,
    title: string,
    url: string,
    position: number,
    description?: string
  ): Link {
    return new Link({
      id: crypto.randomUUID(),
      userId,
      title,
      url: new Url(url),
      description,
      position,
      isActive: true,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
