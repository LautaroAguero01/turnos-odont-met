import { Appointment } from './Appointment';
import { TimeRange } from './TimeRange';

export interface FindConflictsResult {
  professionalConflicts: Appointment[];
  chairConflicts: Appointment[];
  overbookConflicts: Appointment[];
}

export interface IAppointmentRepository {
  findConflicts(
    professionalId: string,
    chairId: string,
    range: TimeRange,
    tenantId: string,
  ): Promise<FindConflictsResult>;

  save(appointment: Appointment): Promise<void>;
}