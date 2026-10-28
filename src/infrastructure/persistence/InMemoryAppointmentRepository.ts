import { Appointment } from '../../domain/appointment/Appointment';
import {
  IAppointmentRepository,
  FindConflictsResult,
} from '../../domain/appointment/IAppointmentRepository';
import { TimeRange } from '../../domain/appointment/TimeRange';

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointmentsByTenant = new Map<string, Appointment[]>();

  async findConflicts(
    professionalId: string,
    chairId: string,
    range: TimeRange,
    tenantId: string,
  ): Promise<FindConflictsResult> {
    const tenantAppointments = this.appointmentsByTenant.get(tenantId) ?? [];

    const activeAppointments = tenantAppointments.filter((app) => app.occupiesSchedule());

    const professionalConflicts = activeAppointments.filter(
      (app) => !app.isOverbook && app.professionalId === professionalId && app.range.overlaps(range),
    );

    const chairConflicts = activeAppointments.filter(
      (app) => !app.isOverbook && app.chairId === chairId && app.range.overlaps(range),
    );

    const overbookConflicts = activeAppointments.filter(
      (app) =>
        app.isOverbook &&
        app.professionalId === professionalId &&
        app.range.startsAt.getTime() === range.startsAt.getTime(),
    );

    return {
      professionalConflicts,
      chairConflicts,
      overbookConflicts,
    };
  }

  async save(appointment: Appointment): Promise<void> {
    const tenantAppointments = this.appointmentsByTenant.get(appointment.tenantId) ?? [];
    tenantAppointments.push(appointment);
    this.appointmentsByTenant.set(appointment.tenantId, tenantAppointments);
  }
}