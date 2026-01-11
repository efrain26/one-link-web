import { DomainException } from '../exceptions/DomainException';

export class Username {
  private readonly value: string;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 30;
  private static readonly VALID_PATTERN = /^[a-zA-Z0-9_-]+$/;

  constructor(username: string) {
    this.validate(username);
    this.value = username.toLowerCase().trim();
  }

  private validate(username: string): void {
    const trimmed = username.trim();

    if (trimmed.length < Username.MIN_LENGTH) {
      throw new DomainException(
        `Username must be at least ${Username.MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > Username.MAX_LENGTH) {
      throw new DomainException(
        `Username must not exceed ${Username.MAX_LENGTH} characters`
      );
    }

    if (!Username.VALID_PATTERN.test(trimmed)) {
      throw new DomainException(
        'Username can only contain letters, numbers, hyphens, and underscores'
      );
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
