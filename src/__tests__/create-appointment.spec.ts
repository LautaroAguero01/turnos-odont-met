import { CreateAppointmentUseCase } from '../application/create-appointment/CreateAppointmentUseCase';
import { InMemoryAppointmentRepository } from '../infrastructure/persistence/InMemoryAppointmentRepository';
import { ProfessionalConflictError } from '../domain/errors/ProfessionalConflictError';
import { ChairConflictError } from '../domain/errors/ChairConflictError';
import { DomainError } from '../domain/errors/DomainError';
import { TimeRange } from '../domain/appointment/TimeRange';

describe('CreateAppointmentUseCase — Prevención de Solapamiento', () => {
  let repository: InMemoryAppointmentRepository;
  let useCase: CreateAppointmentUseCase;

  beforeEach(() => {
    repository = new InMemoryAppointmentRepository();
    useCase = new CreateAppointmentUseCase(repository);
  });

  it('Escenario 1: crea turno en franja libre (RN-AG-03, RN-AG-04)', async () => {
    const created = await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S1',
      patientId: 'PAT1',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T10:00:00Z'),
      endsAt: new Date('2026-11-01T11:00:00Z'),
    });

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.status).toBe('confirmed');

    const conflicts = await repository.findConflicts(
      'P1',
      'S1',
      new TimeRange(new Date('2026-11-01T10:00:00Z'), new Date('2026-11-01T11:00:00Z')),
      'T1',
    );
    expect(conflicts.professionalConflicts.length).toBe(1);
  });

  it('Escenario 2: rechaza si profesional está ocupado (RN-AG-03)', async () => {
    await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S1',
      patientId: 'PAT1',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T09:30:00Z'),
      endsAt: new Date('2026-11-01T10:30:00Z'),
    });

    await expect(
      useCase.execute({
        tenantId: 'T1',
        professionalId: 'P1',
        chairId: 'S2',
        patientId: 'PAT2',
        serviceId: 'SERV1',
        startsAt: new Date('2026-11-01T10:00:00Z'),
        endsAt: new Date('2026-11-01T11:00:00Z'),
      }),
    ).rejects.toThrow(ProfessionalConflictError);
  });

  it('Escenario 3: rechaza si sillón está ocupado por otro profesional (RN-AG-04)', async () => {
    await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P2',
      chairId: 'S1',
      patientId: 'PAT1',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T09:00:00Z'),
      endsAt: new Date('2026-11-01T10:30:00Z'),
    });

    await expect(
      useCase.execute({
        tenantId: 'T1',
        professionalId: 'P1',
        chairId: 'S1',
        patientId: 'PAT2',
        serviceId: 'SERV1',
        startsAt: new Date('2026-11-01T10:00:00Z'),
        endsAt: new Date('2026-11-01T11:00:00Z'),
      }),
    ).rejects.toThrow(ChairConflictError);
  });

  it('Escenario 4: permite turno adyacente exacto (RN-AG-05)', async () => {
    await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S1',
      patientId: 'PAT1',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T10:00:00Z'),
      endsAt: new Date('2026-11-01T11:00:00Z'),
    });

    const adjacent = await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S1',
      patientId: 'PAT2',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T11:00:00Z'),
      endsAt: new Date('2026-11-01T12:00:00Z'),
    });

    expect(adjacent.status).toBe('confirmed');
  });

  it('Escenario 5: crea sobreturno con motivo explícito (RN-AG-09)', async () => {
    await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S1',
      patientId: 'PAT1',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T10:00:00Z'),
      endsAt: new Date('2026-11-01T11:00:00Z'),
    });

    const overbook = await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S2',
      patientId: 'PAT2',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T10:00:00Z'),
      endsAt: new Date('2026-11-01T11:00:00Z'),
      isOverbook: true,
      overbookReason: 'Urgencia odontológica paciente derivado',
    });

    expect(overbook.isOverbook).toBe(true);
    expect(overbook.overbookReason).toBe('Urgencia odontológica paciente derivado');
    expect(overbook.status).toBe('confirmed');
  });

  it('Triangulación 1: rechaza sobreturno si no se incluye motivo (RN-AG-09)', async () => {
    await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S1',
      patientId: 'PAT1',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T10:00:00Z'),
      endsAt: new Date('2026-11-01T11:00:00Z'),
    });

    await expect(
      useCase.execute({
        tenantId: 'T1',
        professionalId: 'P1',
        chairId: 'S2',
        patientId: 'PAT2',
        serviceId: 'SERV1',
        startsAt: new Date('2026-11-01T10:00:00Z'),
        endsAt: new Date('2026-11-01T11:00:00Z'),
        isOverbook: true,
        overbookReason: '',
      }),
    ).rejects.toThrow(DomainError);
  });

  it('Triangulación 2: rechaza si se intenta crear un segundo sobreturno en la misma franja (RN-AG-09)', async () => {
    await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S1',
      patientId: 'PAT1',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T10:00:00Z'),
      endsAt: new Date('2026-11-01T11:00:00Z'),
    });

    await useCase.execute({
      tenantId: 'T1',
      professionalId: 'P1',
      chairId: 'S2',
      patientId: 'PAT2',
      serviceId: 'SERV1',
      startsAt: new Date('2026-11-01T10:00:00Z'),
      endsAt: new Date('2026-11-01T11:00:00Z'),
      isOverbook: true,
      overbookReason: 'Primera urgencia',
    });

    await expect(
      useCase.execute({
        tenantId: 'T1',
        professionalId: 'P1',
        chairId: 'S3',
        patientId: 'PAT3',
        serviceId: 'SERV1',
        startsAt: new Date('2026-11-01T10:00:00Z'),
        endsAt: new Date('2026-11-01T11:00:00Z'),
        isOverbook: true,
        overbookReason: 'Segunda urgencia',
      }),
    ).rejects.toThrow('máximo 1 sobreturno por franja');
  });
});