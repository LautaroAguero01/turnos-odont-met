import { Invitation } from './Invitation';

export interface IInvitationRepository {
  findById(id: string): Promise<Invitation | null>;
  findByTokenHash(hash: string): Promise<Invitation | null>;
  save(invitation: Invitation): Promise<void>;
}
