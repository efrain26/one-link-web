import { InvalidUrlException } from '../exceptions/InvalidUrlException';

export class Url {
  private readonly value: string;

  constructor(url: string) {
    this.validate(url);
    this.value = url.trim();
  }

  private validate(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new InvalidUrlException(url);
    }
  }

  getValue(): string {
    return this.value;
  }

  getDomain(): string {
    const urlObj = new URL(this.value);
    return urlObj.hostname;
  }

  equals(other: Url): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
