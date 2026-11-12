import { Role } from './Role';

export interface InvitationProps {
  id: string;
  tenantId: string;
  email: string;
  role: Role;
  tokenHash: string;
  expiresAt: Date;
  accepted: boolean;
  createdAt: Date;
}

export class Invitation {
  constructor(private props: InvitationProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get email(): string { return this.props.email; }
  get role(): Role { return this.props.role; }
  get tokenHash(): string { return this.props.tokenHash; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get accepted(): boolean { return this.props.accepted; }
  get createdAt(): Date { return this.props.createdAt; }

  isExpired(now: Date = new Date()): boolean {
    return this.props.accepted || this.props.expiresAt.getTime() <= now.getTime();
  }

  static create(props: Omit<InvitationProps, 'createdAt' | 'accepted'> & { createdAt?: Date; accepted?: boolean }): Invitation {
    return new Invitation({ ...props, accepted: props.accepted ?? false, createdAt: props.createdAt ?? new Date() });
  }
}
