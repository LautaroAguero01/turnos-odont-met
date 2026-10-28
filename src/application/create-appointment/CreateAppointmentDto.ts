import { AppointmentStatus } from '../../domain/appointment/AppointmentStatus';

export interface CreateAppointmentDto {
  id?: string;
  tenantId: string;
  professionalId: string;
  chairId: string;
  patientId: string;
  serviceId: string;
  startsAt: Date;
  endsAt: Date;
  status?: AppointmentStatus;
  isOverbook?: boolean;
  overbookReason?: string;
}