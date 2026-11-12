export interface SessionProps {
  id: string;
  userId: string;
  tenantId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

export class Session {
  constructor(private props: SessionProps) {}

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get tenantId(): string { return this.props.tenantId; }
  get refreshTokenHash(): string { return this.props.refreshTokenHash; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get revoked(): boolean { return this.props.revoked; }
  get createdAt(): Date { return this.props.createdAt; }

  isExpired(now: Date = new Date()): boolean {
    return this.props.revoked || this.props.expiresAt.getTime() <= now.getTime();
  }

  revoke(): Session {
    return new Session({ ...this.props, revoked: true });
  }

  static create(props: Omit<SessionProps, 'createdAt' | 'revoked'> & { createdAt?: Date; revoked?: boolean }): Session {
    return new Session({ ...props, revoked: props.revoked ?? false, createdAt: props.createdAt ?? new Date() });
  }
}
