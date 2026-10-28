import { AppointmentStatus, ACTIVE_APPOINTMENT_STATUSES } from './AppointmentStatus';
import { TimeRange } from './TimeRange';

export interface AppointmentProps {
  id: string;
  tenantId: string;
  professionalId: string;
  chairId: string;
  patientId: string;
  serviceId: string;
  range: TimeRange;
  status: AppointmentStatus;
  isOverbook?: boolean;
  overbookReason?: string | null;
}

export class Appointment {
  readonly id: string;
  readonly tenantId: string;
  readonly professionalId: string;
  readonly chairId: string;
  readonly patientId: string;
  readonly serviceId: string;
  readonly range: TimeRange;
  readonly status: AppointmentStatus;
  readonly isOverbook: boolean;
  readonly overbookReason: string | null;

  constructor(props: AppointmentProps) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.professionalId = props.professionalId;
    this.chairId = props.chairId;
    this.patientId = props.patientId;
    this.serviceId = props.serviceId;
    this.range = props.range;
    this.status = props.status;
    this.isOverbook = props.isOverbook ?? false;
    this.overbookReason = props.overbookReason ?? null;
  }

  occupiesSchedule(): boolean {
    return ACTIVE_APPOINTMENT_STATUSES.includes(this.status);
  }
}