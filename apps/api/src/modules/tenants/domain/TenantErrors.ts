export class TenantError extends Error {
  constructor(message: string) { super(message); this.name = 'TenantError'; }
}
export class DuplicateSlugError extends TenantError {
  constructor() { super('Tenant slug already taken'); this.name = 'DuplicateSlugError'; }
}
export class InvalidSlugError extends TenantError {
  constructor() { super('Invalid tenant slug'); this.name = 'InvalidSlugError'; }
}
