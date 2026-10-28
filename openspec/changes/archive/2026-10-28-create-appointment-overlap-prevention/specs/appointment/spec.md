# Spec: Crear turno con prevención de solapamiento

> Spec delta para el change `C-07: create-appointment-overlap-prevention`.
> Fuente de verdad: `knowledge-base/05_reglas_de_negocio.md §RN-AG-03 a RN-AG-05, RN-AG-09` y `knowledge-base/07_flujos_principales.md §Flujo 3`.

---

## Sistema objetivo

`CreateAppointmentUseCase` en la capa de aplicación, con validación de conflictos delegada a `IAppointmentRepository`.

---

## Escenario 1 — Camino feliz: turno en franja libre (RN-AG-03, RN-AG-04)

```gherkin
Dado   que no existen turnos activos para el profesional "P1" en el rango 10:00–11:00
  Y   que no existen turnos activos para el sillón "S1" en ese mismo rango
  Y   que el tenant es "T1"
Cuando se solicita crear un turno de duración 60 min para P1 en S1 comenzando a las 10:00
Entonces el sistema crea el turno con estado "confirmed"
  Y   retorna el turno con su identificador único
  Y   el turno queda almacenado en el repositorio
```

**Reglas verificadas:** `RN-AG-03` (profesional libre), `RN-AG-04` (sillón libre).

---

## Escenario 2 — Error de negocio: profesional ocupado (RN-AG-03)

```gherkin
Dado   que el profesional "P1" tiene un turno activo (estado "confirmed") de 09:30 a 10:30
  Y   el tenant es "T1"
Cuando se solicita crear un turno para P1 comenzando a las 10:00 (duración 60 min)
Entonces el sistema rechaza la solicitud con el error "ProfessionalConflictError"
  Y   no se crea ningún turno en el repositorio
  Y   el error identifica al profesional en conflicto
```

**Reglas verificadas:** `RN-AG-03`.

---

## Escenario 3 — Error de negocio: sillón ocupado por otro profesional (RN-AG-04)

```gherkin
Dado   que el sillón "S1" tiene un turno activo del profesional "P2" (estado "confirmed") de 09:00 a 10:30
  Y   el profesional "P1" está libre en ese rango
  Y   el tenant es "T1"
Cuando se solicita crear un turno para P1 en el sillón "S1" comenzando a las 10:00 (duración 60 min)
Entonces el sistema rechaza la solicitud con el error "ChairConflictError"
  Y   no se crea ningún turno en el repositorio
  Y   el error identifica al sillón en conflicto
```

**Reglas verificadas:** `RN-AG-04`.

---

## Escenario 4 — Caso de borde: adyacencia exacta es permitida (RN-AG-05)

```gherkin
Dado   que el profesional "P1" tiene un turno activo que termina exactamente a las 11:00
  Y   que el sillón "S1" queda libre a partir de las 11:00
  Y   el tenant es "T1"
Cuando se solicita crear un turno para P1 en "S1" comenzando a las 11:00 (duración 60 min)
Entonces el sistema crea el turno exitosamente con estado "confirmed"
```

**Reglas verificadas:** `RN-AG-05` (semántica `[inicio, fin)` — adyacencia no es solapamiento).

---

## Escenario 5 — Sobreturno gobernado: excepción permitida con motivo (RN-AG-09)

```gherkin
Dado   que el profesional "P1" tiene un turno activo (estado "confirmed") de 10:00 a 11:00
  Y   que no existe aún ningún sobreturno para P1 en esa franja
  Y   el tenant es "T1"
Cuando se solicita crear un sobreturno para P1 en el sillón "S2" de 10:00 a 11:00
  Y   se proporciona el motivo "Urgencia odontológica paciente derivado"
Entonces el sistema crea el turno con estado "confirmed" y marcador isOverbook = true
  Y   el motivo queda registrado en el turno
```

**Reglas verificadas:** `RN-AG-09` (sobreturno con motivo; máximo 1 por franja).

---

## Contratos técnicos

| Elemento | Contrato |
|---|---|
| Estado de salida (sin seña) | `confirmed` |
| Estado de salida (con seña requerida) | `pending_deposit` |
| Error: profesional ocupado | `ProfessionalConflictError` (no expone datos del otro paciente) |
| Error: sillón ocupado | `ChairConflictError` |
| Error: sobreturno sin motivo | `DomainError('overbookReason es obligatorio')` |
| Aislamiento multi-tenant | `tenantId` obligatorio en todas las consultas de conflicto |
| Inmutabilidad del historial | La creación registra entrada en `appointment_status_history` |
