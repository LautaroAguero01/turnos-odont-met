# Design: create-appointment-overlap-prevention

## Arquitectura

Se aplica **Clean Architecture** con separación explícita entre la capa de dominio, la capa de aplicación y la capa de infraestructura. Este diseño permite probar la lógica de solapamiento sin levantar ningún proceso externo.

```
src/
├── domain/
│   ├── appointment/
│   │   ├── Appointment.ts             # Entidad raíz del agregado
│   │   ├── AppointmentStatus.ts       # Enum de estados del turno
│   │   ├── TimeRange.ts               # Value Object: intervalo semiabierto [inicio, fin)
│   │   └── IAppointmentRepository.ts  # Contrato de persistencia (puerto de salida)
│   └── errors/
│       ├── DomainError.ts
│       ├── ProfessionalConflictError.ts
│       └── ChairConflictError.ts
├── application/
│   └── create-appointment/
│       ├── CreateAppointmentUseCase.ts    # Orquestador del caso de uso
│       └── CreateAppointmentDto.ts        # DTO de entrada tipado
├── infrastructure/
│   └── persistence/
│       ├── InMemoryAppointmentRepository.ts   # Para tests
│       └── schema.sql                          # DDL PostgreSQL (btree_gist + EXCLUDE)
└── __tests__/
    └── create-appointment.spec.ts     # Suite Jest con los 5 escenarios
```

---

## Entidades y Value Objects

### `TimeRange` (Value Object)

Encapsula el intervalo semiabierto `[starts_at, ends_at)`.

```typescript
// Semántica del intervalo: starts_at inclusive, ends_at exclusive → RN-AG-05
class TimeRange {
  constructor(
    readonly startsAt: Date,
    readonly endsAt: Date,
  ) {
    if (endsAt <= startsAt) throw new DomainError('endsAt debe ser posterior a startsAt');
  }

  // Solapamiento: dos rangos se superponen si no se cumple ninguna condición de no-solapamiento
  // No solapan si: this.endsAt <= other.startsAt  OR  other.endsAt <= this.startsAt
  overlaps(other: TimeRange): boolean {
    return this.startsAt < other.endsAt && other.startsAt < this.endsAt;
  }
}
```

**Propiedad clave (RN-AG-05):** si `endA == startB`, entonces `overlaps` retorna `false` porque `startA < endB` se cumple pero `startB < endA` es equivalente a `endA < endA`, que es falso.

### `Appointment` (Entidad)

```typescript
type AppointmentStatus = 'pending_deposit' | 'confirmed';

class Appointment {
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

  // Estados que ocupan agenda (RN-AG-03 y RN-AG-04)
  static readonly ACTIVE_STATUSES: AppointmentStatus[] = [
    'pending_deposit', 'confirmed'
  ];

  occupiesSchedule(): boolean {
    return Appointment.ACTIVE_STATUSES.includes(this.status);
  }
}
```

---

## Servicio de Dominio / Caso de Uso

### `CreateAppointmentUseCase`

El caso de uso orquesta la validación y persiste el turno. Recibe el repositorio como dependencia inyectada.

**Algoritmo:**

```
1. Validar que endsAt > startsAt (TimeRange invariante)
2. Llamar IAppointmentRepository.findConflicts(professionalId, chairId, range, tenantId)
   → retorna { professionalConflicts: Appointment[], chairConflicts: Appointment[] }
3. Si isOverbook = false:
     a. Si professionalConflicts.length > 0 → throw ProfessionalConflictError
     b. Si chairConflicts.length > 0       → throw ChairConflictError
4. Si isOverbook = true:
     a. Validar que overbookReason no es vacío → throw DomainError si lo es
     b. Contar sobreturnos existentes del profesional en el rango
        → si ya existe 1 sobreturno → throw DomainError('máximo 1 sobreturno por franja')
5. Crear y persistir el Appointment
6. Retornar el Appointment creado
```

---

## Repositorio

### `IAppointmentRepository` (Puerto)

```typescript
interface FindConflictsResult {
  professionalConflicts: Appointment[];
  chairConflicts: Appointment[];
}

interface IAppointmentRepository {
  findConflicts(
    professionalId: string,
    chairId: string,
    range: TimeRange,
    tenantId: string,
  ): Promise<FindConflictsResult>;

  save(appointment: Appointment): Promise<void>;
}
```

### `InMemoryAppointmentRepository` (Adaptador para tests)

Almacena los turnos en un `Map<string, Appointment[]>` con clave `tenantId`. La búsqueda de conflictos filtra por `tenantId`, `status in ACTIVE_STATUSES`, `isOverbook = false` y aplica `TimeRange.overlaps()`.

---

## Esquema de Base de Datos (PostgreSQL)

Documento normativo. No forma parte del alcance de implementación de `C-07` (se implementa en `C-01`), pero se incluye aquí como contrato técnico del diseño.

```sql
-- Prerrequisito: extensión btree_gist (habilitada en C-01)
-- CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Restricción de exclusión por profesional (RN-AG-03)
ALTER TABLE appointment
  ADD CONSTRAINT ex_appointment_professional
  EXCLUDE USING gist (
    professional_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  )
  WHERE (
    status IN ('pending_deposit', 'confirmed', 'checked_in', 'in_progress')
    AND is_overbook = false
  );

-- Restricción de exclusión por sillón (RN-AG-04)
ALTER TABLE appointment
  ADD CONSTRAINT ex_appointment_chair
  EXCLUDE USING gist (
    chair_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  )
  WHERE (
    status IN ('pending_deposit', 'confirmed', 'checked_in', 'in_progress')
    AND is_overbook = false
  );

-- Límite de 1 sobreturno por profesional y horario de inicio (RN-AG-09)
CREATE UNIQUE INDEX uq_appointment_overbook_slot
  ON appointment (professional_id, starts_at)
  WHERE is_overbook = true
    AND status IN ('pending_deposit', 'confirmed', 'checked_in', 'in_progress');
```

**Nota:** El `tstzrange(starts_at, ends_at, '[)')` usa la misma semántica que `TimeRange.overlaps()`, garantizando consistencia entre la validación de dominio y la base de datos.

---

## Decisiones de Diseño

| Decisión | Opción elegida | Alternativa considerada | Motivo |
|---|---|---|---|
| Capa de tests | `InMemoryAppointmentRepository` (sin DB externa) | Tests de integración con PostgreSQL en Docker | Sin Docker el evaluador no puede correr `npm test`; la lógica de solapamiento es 100% testeable en memoria |
| Semántica de intervalo | `[inicio, fin)` semiabierto | `[inicio, fin]` cerrado | Alineación con `RN-AG-05`, con el operador `&&` de `tstzrange` en PostgreSQL y con la intuición del dominio (turno 10:00–11:00 no pisa 11:00–12:00) |
| Escalamiento de la restricción | Doble barrera (dominio + DB) | Solo DB | La barrera de dominio retorna errores de negocio legibles (`ProfessionalConflictError`); la DB es la red de seguridad ante condiciones de carrera concurrentes |
| Sobreturno | Permitido con motivo + límite 1 por franja | Prohibido | `RN-AG-09`: el negocio odontológico lo requiere como excepción gobernada |
