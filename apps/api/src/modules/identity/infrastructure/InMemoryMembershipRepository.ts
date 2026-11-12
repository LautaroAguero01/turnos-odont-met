import { Membership } from '../domain/Membership';
import { IMembershipRepository } from '../domain/IMembershipRepository';

export class InMemoryMembershipRepository implements IMembershipRepository {
  private store = new Map<string, Membership>();

  async findByUserAndTenant(userId: string, tenantId: string): Promise<Membership | null> {
    for (const m of this.store.values()) if (m.userId === userId && m.tenantId === tenantId) return m;
    return null;
  }
  async findByTenant(tenantId: string): Promise<Membership[]> {
    return [...this.store.values()].filter((m) => m.tenantId === tenantId);
  }
  async save(m: Membership): Promise<void> { this.store.set(m.id, m); }
}
