import { Invitation } from '../domain/Invitation';
import { IInvitationRepository } from '../domain/IInvitationRepository';

export class InMemoryInvitationRepository implements IInvitationRepository {
  private store = new Map<string, Invitation>();

  async findById(id: string): Promise<Invitation | null> { return this.store.get(id) ?? null; }
  async findByTokenHash(hash: string): Promise<Invitation | null> {
    for (const i of this.store.values()) if (i.tokenHash === hash) return i;
    return null;
  }
  async save(i: Invitation): Promise<void> { this.store.set(i.id, i); }
}
