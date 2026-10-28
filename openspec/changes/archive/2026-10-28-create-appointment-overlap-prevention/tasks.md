# Tasks: create-appointment-overlap-prevention

> Implementación del change `C-07`. El criterio de completitud es: **`npm test` reporta 5/5 en verde**.
> Seguir estrictamente el orden de las tareas. No avanzar a la siguiente sin completar la anterior.

---

## TASK-01: Scaffolding del proyecto TypeScript + Jest

**Objetivo:** configurar el entorno mínimo para que `npm test` funcione desde cero en cualquier máquina sin dependencias externas.

**Archivos a crear:**

- `package.json` — con `scripts.test: "jest"` y dependencias de desarrollo: `typescript`, `ts-jest`, `jest`, `@types/jest`.
- `tsconfig.json` — `strict: true`, `target: ES2022`, `module: CommonJS`, `outDir: dist`.
- `jest.config.ts` — preset `ts-jest`, `testMatch: ["**/__tests__/**/*.spec.ts"]`.

**Criterio de aceptación:**
- `npm install` finaliza sin errores.
- `npm test` ejecuta sin archivos de test y reporta `"No tests found"` (no un error fatal).

---

## TASK-02: Value Object `TimeRange`

**Objetivo:** encapsular el intervalo temporal semiabierto `[inicio, fin)`.

**Archivo:** `src/domain/appointment/TimeRange.ts`

**Comportamiento:**
- Constructor valida que `endsAt > startsAt`; lanza `DomainError` si no se cumple.
- Método `overlaps(other: TimeRange): boolean` implementado con semántica `[inicio, fin)`.
- Propiedad de borde: `new TimeRange(10:00, 11:00).overlaps(new TimeRange(11:00, 12:00))` retorna `false`.

**Criterio de aceptación:** la lógica de solapamiento se verifica directamente desde el test del Escenario 4 (TASK-05).

---

## TASK-03: Entidad `Appointment` y errores de dominio

**Objetivo:** definir la entidad raíz del agregado y los errores específicos del dominio.

**Archivos:**
- `src/domain/appointment/AppointmentStatus.ts` — enum de estados.
- `src/domain/appointment/Appointment.ts` — entidad con `id`, `tenantId`, `professionalId`, `chairId`, `patientId`, `serviceId`, `range`, `status`, `isOverbook`, `overbookReason`.
- `src/domain/appointment/IAppointmentRepository.ts` — interfaz del repositorio con método `findConflicts` y `save`.
- `src/domain/errors/DomainError.ts` — error base.
- `src/domain/errors/ProfessionalConflictError.ts` — error específico de conflicto de profesional.
- `src/domain/errors/ChairConflictError.ts` — error específico de conflicto de sillón.

**Criterio de aceptación:** todos los tipos compilan sin errores con `tsc --noEmit`.

---

## TASK-04: `CreateAppointmentUseCase` y `CreateAppointmentDto`

**Objetivo:** implementar el caso de uso que orquesta la validación y persistencia.

**Archivos:**
- `src/application/create-appointment/CreateAppointmentDto.ts`
- `src/application/create-appointment/CreateAppointmentUseCase.ts`

**Algoritmo** (ver `design.md §Servicio de Dominio`):
1. Construir `TimeRange` desde el DTO → propaga error si `endsAt <= startsAt`.
2. Llamar `repository.findConflicts(...)`.
3. Si `isOverbook = false`: lanzar `ProfessionalConflictError` o `ChairConflictError` si hay conflictos.
4. Si `isOverbook = true`: validar motivo no vacío y que no exista ya un sobreturno del profesional en esa franja.
5. Crear `Appointment` y llamar `repository.save(appointment)`.
6. Retornar el `Appointment` creado.

**Criterio de aceptación:** compilación limpia; los 5 escenarios de TASK-05 pasan en verde.

---

## TASK-05: `InMemoryAppointmentRepository` y suite de tests Jest

**Objetivo:** implementar el adaptador en memoria y los 5 tests que verifican la especificación.

**Archivos:**
- `src/infrastructure/persistence/InMemoryAppointmentRepository.ts`
- `src/__tests__/create-appointment.spec.ts`

**Tests a implementar** (derivados directamente de `specs/appointment/spec.md`):

| Test | Escenario | Regla |
|---|---|---|
| `it('crea turno en franja libre')` | Escenario 1 | RN-AG-03, RN-AG-04 |
| `it('rechaza si profesional está ocupado')` | Escenario 2 | RN-AG-03 |
| `it('rechaza si sillón está ocupado por otro profesional')` | Escenario 3 | RN-AG-04 |
| `it('permite turno adyacente exacto')` | Escenario 4 | RN-AG-05 |
| `it('crea sobreturno con motivo explícito')` | Escenario 5 | RN-AG-09 |

**Criterio de aceptación final:** `npm test` reporta `5 passed, 5 total` en verde.

---

## TASK-06: Documentación del esquema de base de datos

**Objetivo:** registrar el DDL de las restricciones de exclusión GiST como artefacto de diseño técnico (no se ejecuta en este change — se ejecutará en C-01).

**Archivo:** `src/infrastructure/persistence/schema.sql`

**Contenido:** el DDL definido en `design.md §Esquema de Base de Datos`, incluyendo la extensión `btree_gist`, las dos restricciones `EXCLUDE USING gist` y el índice único de sobreturno.

**Criterio de aceptación:** el archivo existe, está bien formado y los comentarios explican la relación con `RN-AG-03`, `RN-AG-04` y `RN-AG-09`.

---

## TASK-07: Verificación final y cierre

**Objetivo:** confirmar que el change está listo para archivar.

**Checklist obligatorio:**
- [ ] `npm test` → 5 passed, 0 failed, 0 skipped.
- [ ] `tsc --noEmit` → 0 errores de tipado.
- [ ] Ningún `any` en el código de producción (revisión manual o con `grep -r "any" src/`).
- [ ] `schema.sql` presente en `src/infrastructure/persistence/`.
- [ ] Los 4 artefactos OpenSpec (`proposal.md`, `design.md`, `specs/appointment/spec.md`, `tasks.md`) están completos.
- [ ] El checkbox `C-07` en `CHANGES.md` está marcado como `[x]`.
- [ ] El change está archivado en `openspec/changes/archive/`.
