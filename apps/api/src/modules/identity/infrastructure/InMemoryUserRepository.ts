import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private store = new Map<string, User>();

  async findById(id: string): Promise<User | null> { return this.store.get(id) ?? null; }
  async findByEmail(email: string): Promise<User | null> {
    for (const u of this.store.values()) if (u.email === email) return u;
    return null;
  }
  async save(user: User): Promise<void> { this.store.set(user.id, user); }
}
