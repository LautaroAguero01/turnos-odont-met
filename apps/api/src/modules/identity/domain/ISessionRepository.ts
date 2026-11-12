import { Session } from './Session';

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;
  findByRefreshTokenHash(hash: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
}
