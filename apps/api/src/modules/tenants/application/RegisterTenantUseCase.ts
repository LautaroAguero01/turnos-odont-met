import { Tenant } from '../domain/Tenant';
import { ITenantRepository } from '../domain/ITenantRepository';
import { IUserRepository } from '../../identity/domain/IUserRepository';
import { IMembershipRepository } from '../../identity/domain/IMembershipRepository';
import { User } from '../../identity/domain/User';
import { Membership } from '../../identity/domain/Membership';
import { Role } from '../../identity/domain/Role';
import { DuplicateSlugError } from '../domain/TenantErrors';
import { DuplicateEmailError } from '../../identity/domain/IdentityErrors';

export interface RegisterTenantInput {
  tenantName: string;
  tenantSlug: string;
  timezone?: string;
  ownerEmail: string;
  ownerFullName: string;
  ownerPasswordHash: string;
}

export interface RegisterTenantOutput {
  tenantId: string;
  userId: string;
}

export class RegisterTenantUseCase {
  constructor(
    private tenants: ITenantRepository,
    private users: IUserRepository,
    private memberships: IMembershipRepository,
    private idGen: () => string,
  ) {}

  async execute(input: RegisterTenantInput): Promise<RegisterTenantOutput> {
    const existingTenant = await this.tenants.findBySlug(input.tenantSlug);
    if (existingTenant) throw new DuplicateSlugError();

    const existingUser = await this.users.findByEmail(input.ownerEmail);
    if (existingUser) throw new DuplicateEmailError();

    const tenant = Tenant.create({
      id: this.idGen(),
      name: input.tenantName,
      slug: input.tenantSlug,
      timezone: input.timezone ?? 'America/Argentina/Buenos_Aires',
    });

    const user = User.create({
      id: this.idGen(),
      email: input.ownerEmail,
      fullName: input.ownerFullName,
      passwordHash: input.ownerPasswordHash,
    });

    const membership = Membership.create({
      id: this.idGen(),
      tenantId: tenant.id,
      userId: user.id,
      role: Role.OWNER,
    });

    await this.tenants.save(tenant);
    await this.users.save(user);
    await this.memberships.save(membership);

    return { tenantId: tenant.id, userId: user.id };
  }
}
