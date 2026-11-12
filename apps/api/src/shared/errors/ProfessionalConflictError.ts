import { DomainError } from './DomainError';

export class ProfessionalConflictError extends DomainError {
  constructor(readonly professionalId: string) {
    super(`El profesional ${professionalId} no está disponible en la franja horaria solicitada.`);
    this.name = 'ProfessionalConflictError';
  }
}