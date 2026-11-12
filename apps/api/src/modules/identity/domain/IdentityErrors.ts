export class IdentityError extends Error {
  constructor(message: string) { super(message); this.name = 'IdentityError'; }
}
export class InvalidCredentialsError extends IdentityError {
  constructor() { super('Invalid credentials'); this.name = 'InvalidCredentialsError'; }
}
export class DuplicateEmailError extends IdentityError {
  constructor() { super('Email already registered'); this.name = 'DuplicateEmailError'; }
}
export class TenantNotFoundError extends IdentityError {
  constructor() { super('Tenant not found'); this.name = 'TenantNotFoundError'; }
}
export class SessionExpiredError extends IdentityError {
  constructor() { super('Session expired or revoked'); this.name = 'SessionExpiredError'; }
}
export class InvalidInvitationError extends IdentityError {
  constructor() { super('Invalid or expired invitation'); this.name = 'InvalidInvitationError'; }
}
