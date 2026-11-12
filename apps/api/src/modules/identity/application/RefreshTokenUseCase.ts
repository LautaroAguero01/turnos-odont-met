import { ISessionRepository } from '../domain/ISessionRepository';
import { Session } from '../domain/Session';
import { JwtService } from '../../../shared/auth/JwtService';
import { IMembershipRepository } from '../domain/IMembershipRepository';
import { SessionExpiredError } from '../domain/IdentityErrors';

export interface RefreshInput {
  refreshToken: string;
}

export interface RefreshOutput {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private sessions: ISessionRepository,
    private memberships: IMembershipRepository,
    private jwt: JwtService,
    private idGen: () => string,
    private now: () => Date = () => new Date(),
  ) {}

  async execute(input: RefreshInput): Promise<RefreshOutput> {
    const session = await this.sessions.findByRefreshTokenHash(input.refreshToken);
    if (!session || session.isExpired(this.now())) throw new SessionExpiredError();

    // rotate
    const newRefresh = this.idGen();
    const rotated = Session.create({
      id: session.id,
      userId: session.userId,
      tenantId: session.tenantId,
      refreshTokenHash: newRefresh,
      expiresAt: new Date(this.now().getTime() + 30 * 24 * 60 * 60 * 1000),
    });
    // revoke old
    await this.sessions.save(session.revoke());
    await this.sessions.save(rotated);

    const membership = await this.memberships.findByUserAndTenant(session.userId, session.tenantId);
    const role = membership?.role ?? 'patient';

    const accessToken = this.jwt.sign(
      { sub: session.userId, tenantId: session.tenantId, role },
      15 * 60,
    );

    return { accessToken, refreshToken: newRefresh };
  }
}
