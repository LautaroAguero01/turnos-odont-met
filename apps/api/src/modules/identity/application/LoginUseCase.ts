import { IUserRepository } from '../domain/IUserRepository';
import { IMembershipRepository } from '../domain/IMembershipRepository';
import { ISessionRepository } from '../domain/ISessionRepository';
import { Session } from '../domain/Session';
import { JwtService } from '../../../shared/auth/JwtService';
import { InvalidCredentialsError } from '../domain/IdentityErrors';

export interface LoginInput {
  email: string;
  passwordHash: string; // caller verifies password and passes hash match
  tenantId: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}

export class LoginUseCase {
  constructor(
    private users: IUserRepository,
    private memberships: IMembershipRepository,
    private sessions: ISessionRepository,
    private jwt: JwtService,
    private idGen: () => string,
    private now: () => Date = () => new Date(),
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.users.findByEmail(input.email);
    if (!user || user.passwordHash !== input.passwordHash) throw new InvalidCredentialsError();

    const membership = await this.memberships.findByUserAndTenant(user.id, input.tenantId);
    if (!membership) throw new InvalidCredentialsError();

    const sessionId = this.idGen();
    const refreshToken = this.idGen(); // in real impl, random bytes
    const session = Session.create({
      id: sessionId,
      userId: user.id,
      tenantId: input.tenantId,
      refreshTokenHash: refreshToken,
      expiresAt: new Date(this.now().getTime() + 30 * 24 * 60 * 60 * 1000),
    });
    await this.sessions.save(session);

    const accessToken = this.jwt.sign(
      { sub: user.id, tenantId: input.tenantId, role: membership.role },
      15 * 60,
    );

    return { accessToken, refreshToken, sessionId };
  }
}
