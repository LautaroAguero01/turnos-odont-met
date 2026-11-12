export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  PROFESSIONAL = 'professional',
  RECEPTIONIST = 'receptionist',
  BILLING = 'billing',
  PATIENT = 'patient',
}

export const CLINICAL_ROLES: readonly Role[] = [Role.OWNER, Role.ADMIN, Role.PROFESSIONAL];
export const ADMIN_ROLES: readonly Role[] = [Role.OWNER, Role.ADMIN];
