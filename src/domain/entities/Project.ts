import { Url } from '../value-objects/Url';

/**
 * Project Entity - Representa un proyecto de app con URLs a diferentes stores
 *
 * Un Project contiene las URLs a App Store (iOS), Play Store (Android)
 * y un fallback opcional para desktop/otros dispositivos.
 */

interface ProjectProps {
  id: number;
  appName: string;
  iosUrl: Url;
  androidUrl: Url;
  fallbackUrl: Url | null;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
}

export class Project {
  private readonly id: number;
  private appName: string;
  private iosUrl: Url;
  private androidUrl: Url;
  private fallbackUrl: Url | null;
  private readonly shortCode: string;
  private readonly shortUrl: string;
  private readonly createdAt: Date;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.appName = props.appName;
    this.iosUrl = props.iosUrl;
    this.androidUrl = props.androidUrl;
    this.fallbackUrl = props.fallbackUrl;
    this.shortCode = props.shortCode;
    this.shortUrl = props.shortUrl;
    this.createdAt = props.createdAt;
  }

  // Getters
  getId(): number {
    return this.id;
  }

  getAppName(): string {
    return this.appName;
  }

  getIosUrl(): Url {
    return this.iosUrl;
  }

  getAndroidUrl(): Url {
    return this.androidUrl;
  }

  getFallbackUrl(): Url | null {
    return this.fallbackUrl;
  }

  getShortCode(): string {
    return this.shortCode;
  }

  getShortUrl(): string {
    return this.shortUrl;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  // Business methods
  updateAppName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('App name cannot be empty');
    }
    if (newName.length > 100) {
      throw new Error('App name cannot exceed 100 characters');
    }
    this.appName = newName.trim();
  }

  updateIosUrl(newUrl: string): void {
    this.iosUrl = new Url(newUrl);
  }

  updateAndroidUrl(newUrl: string): void {
    this.androidUrl = new Url(newUrl);
  }

  updateFallbackUrl(newUrl: string | null): void {
    this.fallbackUrl = newUrl ? new Url(newUrl) : null;
  }

  /**
   * Factory method para crear un nuevo proyecto
   * Nota: En el backend, el ID, shortCode y shortUrl son generados por el servidor
   */
  static createForRequest(appName: string, iosUrl: string, androidUrl: string, fallbackUrl?: string): {
    appName: string;
    iosUrl: string;
    androidUrl: string;
    fallbackUrl?: string;
  } {
    // Validación de URLs
    new Url(iosUrl);
    new Url(androidUrl);
    if (fallbackUrl) {
      new Url(fallbackUrl);
    }

    // Validación de appName
    if (!appName || appName.trim().length === 0) {
      throw new Error('App name is required');
    }
    if (appName.length > 100) {
      throw new Error('App name cannot exceed 100 characters');
    }

    return {
      appName: appName.trim(),
      iosUrl,
      androidUrl,
      ...(fallbackUrl && { fallbackUrl }),
    };
  }
}
