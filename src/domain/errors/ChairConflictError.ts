import { DomainError } from './DomainError';

export class ChairConflictError extends DomainError {
  constructor(readonly chairId: string) {
    super(`El sillón ${chairId} no está disponible en la franja horaria solicitada.`);
    this.name = 'ChairConflictError';
  }
}