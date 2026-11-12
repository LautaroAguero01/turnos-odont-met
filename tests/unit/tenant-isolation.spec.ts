import { InMemoryTenantRepository } from '../../apps/api/src/modules/tenants/infrastructure/InMemoryTenantRepository';
import { InMemoryUserRepository } from '../../apps/api/src/modules/identity/infrastructure/InMemoryUserRepository';
import { InMemoryMembershipRepository } from '../../apps/api/src/modules/identity/infrastructure/InMemoryMembershipRepository';
import { RegisterTenantUseCase } from '../../apps/api/src/modules/tenants/application/RegisterTenantUseCase';
import { Role } from '../../apps/api/src/modules/identity/domain/Role';

describe('Aislamiento multi-tenant (C-02)', () => {
  it('registra dos tenants y no comparten memberships', async () => {
    const tenants = new InMemoryTenantRepository();
    const users = new InMemoryUserRepository();
    const memberships = new InMemoryMembershipRepository();
    let n = 0;
    const idGen = () => `id-${++n}`;

    const register = new RegisterTenantUseCase(tenants, users, memberships, idGen);
    const a = await register.execute({
      tenantName: 'Clinica A', tenantSlug: 'clinica-a',
      ownerEmail: 'owner@a.com', ownerFullName: 'Owner A', ownerPasswordHash: 'hashA',
    });
    const b = await register.execute({
      tenantName: 'Clinica B', tenantSlug: 'clinica-b',
      ownerEmail: 'owner@b.com', ownerFullName: 'Owner B', ownerPasswordHash: 'hashB',
    });

    expect(a.tenantId).not.toBe(b.tenantId);

    const mA = await memberships.findByTenant(a.tenantId);
    const mB = await memberships.findByTenant(b.tenantId);
    expect(mA).toHaveLength(1);
    expect(mB).toHaveLength(1);
    expect(mA[0].userId).not.toBe(mB[0].userId);
  });

  it('un usuario de tenant A no tiene membership en tenant B', async () => {
    const tenants = new InMemoryTenantRepository();
    const users = new InMemoryUserRepository();
    const memberships = new InMemoryMembershipRepository();
    let n = 0;
    const idGen = () => `id-${++n}`;

    const register = new RegisterTenantUseCase(tenants, users, memberships, idGen);
    const a = await register.execute({
      tenantName: 'Clinica A', tenantSlug: 'clinica-a',
      ownerEmail: 'owner@a.com', ownerFullName: 'Owner A', ownerPasswordHash: 'hashA',
    });
    const b = await register.execute({
      tenantName: 'Clinica B', tenantSlug: 'clinica-b',
      ownerEmail: 'owner@b.com', ownerFullName: 'Owner B', ownerPasswordHash: 'hashB',
    });

    const cross = await memberships.findByUserAndTenant(a.userId, b.tenantId);
    expect(cross).toBeNull();
  });
});
