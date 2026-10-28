# Especificación del change C-07 — create-appointment-overlap-prevention

## Escenarios verificables (Gherkin)

### Escenario 1 — Camino feliz
- **Dado** que el profesional `P1` y el sillón `S1` están libres en la franja `2026-11-01 10:00 - 11:00` (tenant `T1`).
- **Y** que el turno solicitado tiene `startsAt` igual a ese inicio y `endsAt` igual a ese fin.
- **Cuando** se ejecuta `CreateAppointmentUseCase.execute(...)` con esos datos.
- **Entonces** el turno se crea con `status = 'confirmed'` y `id` definido, sin lanzar ninguna excepción de dominio.

### Escenario 2 — Error de negocio: conflicto por profesional
- **Dado** que existe un turno confirmado para `P1` en la franja `09:30 - 10:30` (`S1`).
- **Cuando** se intenta crear otro turno para `P1` que se solapa (`10:00 - 11:00`, sillón `S2`).
- **Entonces** la ejecución lanza `ProfessionalConflictError` y no se crea ningún turno nuevo.

### Escenario 3 — Borde: turno contiguo (adyacencia exacta, sin solapamiento)
- **Dado** que hay un turno `A` que termina exactamente a las `11:00` para `P1` / `S1`.
- **Y** que el rango `[11:00, 12:00)` está libre.
- **Cuando** se crea un turno `B` que inicia exactamente a las `11:00` para `P1` / `S1`.
- **Entonces** el turno `B` se confirma (`status = 'confirmed'`) porque `[inicio_B, fin_B)` no se solapa con `A` (`fin_A == inicio_B` es permitido por `RN-AG-05`).

### Escenario 4 — Borde: sobreturno sin motivo obligatorio
- **Dado** que hay un turno confirmado para `P1` en `S1` (`10:00 - 11:00`).
- **Cuando** se intenta crear un sobreturno (`isOverbook: true`) con `overbookReason: ''` (vacío) para `P2` en `S2` en la misma franja.
- **Entonces** la ejecución lanza `DomainError` porque el motivo obligatorio no se incluyó (`RN-AG-09`).

## Referencias al código
- Implementación: `src/application/create-appointment/CreateAppointmentUseCase.ts`
- Dominio: `src/domain/appointment/Appointment.ts`, `TimeRange.ts`
- Errores: `src/domain/errors/ProfessionalConflictError.ts`, `ChairConflictError.ts`, `DomainError.ts`
- Tests: `src/__tests__/create-appointment.spec.ts` (7 tests verdes)
