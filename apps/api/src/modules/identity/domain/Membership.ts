import { Role } from './Role';

export interface MembershipProps {
  id: string;
  tenantId: string;
  userId: string;
  role: Role;
  createdAt: Date;
}

export class Membership {
  constructor(private props: MembershipProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get role(): Role { return this.props.role; }
  get createdAt(): Date { return this.props.createdAt; }

  static create(props: Omit<MembershipProps, 'createdAt'> & { createdAt?: Date }): Membership {
    return new Membership({ ...props, createdAt: props.createdAt ?? new Date() });
  }
}
