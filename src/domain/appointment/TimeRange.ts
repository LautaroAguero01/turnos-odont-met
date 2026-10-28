import { DomainError } from '../errors/DomainError';

export class TimeRange {
  constructor(
    readonly startsAt: Date,
    readonly endsAt: Date,
  ) {
    if (endsAt <= startsAt) {
      throw new DomainError('endsAt debe ser posterior a startsAt');
    }
  }

  overlaps(other: TimeRange): boolean {
    return this.startsAt < other.endsAt && other.startsAt < this.endsAt;
  }
}