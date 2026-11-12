import { Membership } from './Membership';

export interface IMembershipRepository {
  findByUserAndTenant(userId: string, tenantId: string): Promise<Membership | null>;
  findByTenant(tenantId: string): Promise<Membership[]>;
  save(membership: Membership): Promise<void>;
}
