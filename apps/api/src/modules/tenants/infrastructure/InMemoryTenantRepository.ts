import { Tenant } from '../domain/Tenant';
import { ITenantRepository } from '../domain/ITenantRepository';

export class InMemoryTenantRepository implements ITenantRepository {
  private store = new Map<string, Tenant>();

  async findById(id: string): Promise<Tenant | null> {
    return this.store.get(id) ?? null;
  }
  async findBySlug(slug: string): Promise<Tenant | null> {
    for (const t of this.store.values()) if (t.slug === slug) return t;
    return null;
  }
  async save(tenant: Tenant): Promise<void> {
    this.store.set(tenant.id, tenant);
  }
}
