export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  createdAt: Date;
}

export class User {
  constructor(private props: UserProps) {}

  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get fullName(): string { return this.props.fullName; }
  get createdAt(): Date { return this.props.createdAt; }

  static create(props: Omit<UserProps, 'createdAt'> & { createdAt?: Date }): User {
    if (!props.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) throw new Error('Invalid email');
    if (!props.passwordHash) throw new Error('Password hash is required');
    if (!props.fullName || props.fullName.trim().length === 0) throw new Error('Full name is required');
    return new User({ ...props, createdAt: props.createdAt ?? new Date() });
  }
}
