export type AppointmentStatus =
  | 'pending_deposit'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export const ACTIVE_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'pending_deposit',
  'confirmed',
  'checked_in',
  'in_progress',
];