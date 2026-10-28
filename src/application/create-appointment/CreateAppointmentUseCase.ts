import { Appointment } from '../../domain/appointment/Appointment';
import { TimeRange } from '../../domain/appointment/TimeRange';
import { IAppointmentRepository } from '../../domain/appointment/IAppointmentRepository';
import { CreateAppointmentDto } from './CreateAppointmentDto';
import { ProfessionalConflictError } from '../../domain/errors/ProfessionalConflictError';
import { ChairConflictError } from '../../domain/errors/ChairConflictError';
import { DomainError } from '../../domain/errors/DomainError';

export class CreateAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(dto: CreateAppointmentDto): Promise<Appointment> {
    const range = new TimeRange(dto.startsAt, dto.endsAt);
    const isOverbook = dto.isOverbook ?? false;

    if (!isOverbook) {
      const { professionalConflicts, chairConflicts } = await this.repository.findConflicts(
        dto.professionalId,
        dto.chairId,
        range,
        dto.tenantId,
      );

      if (professionalConflicts.length > 0) {
        throw new ProfessionalConflictError(dto.professionalId);
      }

      if (chairConflicts.length > 0) {
        throw new ChairConflictError(dto.chairId);
      }
    } else {
      if (!dto.overbookReason || dto.overbookReason.trim() === '') {
        throw new DomainError('overbookReason es obligatorio');
      }

      const { overbookConflicts } = await this.repository.findConflicts(
        dto.professionalId,
        dto.chairId,
        range,
        dto.tenantId,
      );

      if (overbookConflicts.length > 0) {
        throw new DomainError('máximo 1 sobreturno por franja');
      }
    }

    const appointment = new Appointment({
      id: dto.id ?? `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId: dto.tenantId,
      professionalId: dto.professionalId,
      chairId: dto.chairId,
      patientId: dto.patientId,
      serviceId: dto.serviceId,
      range,
      status: dto.status ?? 'confirmed',
      isOverbook,
      overbookReason: dto.overbookReason ?? null,
    });

    await this.repository.save(appointment);
    return appointment;
  }
}