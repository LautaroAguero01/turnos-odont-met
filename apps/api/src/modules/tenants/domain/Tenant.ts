export interface TenantProps {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  createdAt: Date;
}

export class Tenant {
  constructor(private props: TenantProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get slug(): string { return this.props.slug; }
  get timezone(): string { return this.props.timezone; }
  get createdAt(): Date { return this.props.createdAt; }

  static create(props: Omit<TenantProps, 'createdAt'> & { createdAt?: Date }): Tenant {
    if (!props.name || props.name.trim().length === 0) throw new Error('Tenant name is required');
    if (!props.slug || !/^[a-z0-9-]+$/.test(props.slug)) throw new Error('Invalid tenant slug');
    return new Tenant({ ...props, createdAt: props.createdAt ?? new Date() });
  }
}
