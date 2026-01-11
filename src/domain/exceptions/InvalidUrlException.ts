import { DomainException } from './DomainException';

export class InvalidUrlException extends DomainException {
  constructor(url: string) {
    super(`Invalid URL: ${url}`);
    this.name = 'InvalidUrlException';
  }
}
