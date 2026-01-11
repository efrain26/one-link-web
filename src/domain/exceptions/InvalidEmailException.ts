import { DomainException } from './DomainException';

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`Invalid email address: ${email}`);
    this.name = 'InvalidEmailException';
  }
}
