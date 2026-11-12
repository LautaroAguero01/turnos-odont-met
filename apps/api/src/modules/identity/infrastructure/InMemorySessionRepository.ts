import { Session } from '../domain/Session';
import { ISessionRepository } from '../domain/ISessionRepository';

export class InMemorySessionRepository implements ISessionRepository {
  private store = new Map<string, Session>();

  async findById(id: string): Promise<Session | null> { return this.store.get(id) ?? null; }
  async findByRefreshTokenHash(hash: string): Promise<Session | null> {
    for (const s of this.store.values()) if (s.refreshTokenHash === hash) return s;
    return null;
  }
  async save(s: Session): Promise<void> { this.store.set(s.id, s); }
}
