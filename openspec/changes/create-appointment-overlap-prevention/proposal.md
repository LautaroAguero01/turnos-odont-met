# Proposal: create-appointment-overlap-prevention

## What

Implementar el caso de uso de **alta de turno** con prevención de solapamientos para el proyecto *turnos-odontologia*. El sistema debe rechazar cualquier intento de crear un turno cuando el profesional o el sillón ya estén ocupados en ese rango horario, y admitir como excepción gobernada un único sobreturno por profesional y franja, con motivo obligatorio.

## Why

La regla de negocio que prohíbe dos turnos activos superpuestos para el mismo profesional o el mismo sillón es el diferenciador de ejecución central del MVP. Sin ella, el sillón puede quedar doble-reservado, lo que genera conflictos de atención y pérdida de confianza. Es el ejemplo paradigmático de la consigna (§6.1) y el change `C-07` del camino crítico del roadmap.

## Justificación de elección del change (§6.1)

1. **Pertenece al MVP:** es el primer imprescindible de `discovery/discovery.md §D.3` y está priorizado como `[MVP]` en `knowledge-base/06_funcionalidades.md §US-009`.
2. **Tiene reglas de negocio verificables:** `RN-AG-03`, `RN-AG-04`, `RN-AG-05` y `RN-AG-09` son reglas determinísticas, testeables con `Dado / Cuando / Entonces` sin ambigüedad.
3. **Es lo bastante chico:** cubre exclusivamente la creación del turno y la validación de solapamiento; excluye reprogramación (`C-08`), pagos (`C-10`) y WhatsApp (`C-11`).

## Alcance de este change

### Incluye
- Entidad de dominio `Appointment` con estado (`pending_deposit | confirmed`) y marcador `isOverbook`.
- Objeto de valor `TimeRange` con semántica de intervalo semiabierto `[inicio, fin)`.
- Servicio de dominio `CreateAppointmentUseCase` con doble validación: regla en la capa de aplicación + invariante de la restricción de exclusión GiST.
- Interfaz de repositorio `IAppointmentRepository` con método `findConflicts(professionalId, chairId, range, tenantId)`.
- Implementación en memoria `InMemoryAppointmentRepository` para tests unitarios (sin base de datos externa).
- Esquema de migración de PostgreSQL documentado: extensión `btree_gist` y restricciones de exclusión `ex_appointment_professional` y `ex_appointment_chair`.
- Suite de tests Jest (100% verde) cubriendo los 5 escenarios del §Specs.
- Scaffolding mínimo: `package.json`, `tsconfig.json`, `jest.config.ts` para que `npm test` funcione sin dependencias adicionales.

### Excluye explícitamente
- Autenticación JWT / RBAC (pertenece a `C-02`).
- Sucursales, sillones y horarios de atención (pertenecen a `C-03`).
- Reprogramación y cancelación (pertenecen a `C-08`).
- Pagos, señas y Mercado Pago (pertenecen a `C-10`).
- Notificaciones por WhatsApp (pertenecen a `C-11`).
- Capa HTTP / controladores NestJS.

## Reglas de negocio que implementa este change

| Código | Regla | Tipo |
|---|---|---|
| `RN-AG-01` | La duración se toma de la prestación o del override por profesional; no se admiten turnos sin duración. | derivada |
| `RN-AG-03` | Un profesional no puede tener dos turnos activos superpuestos (estados: `pending_deposit`, `confirmed`). | `[E.7]` |
| `RN-AG-04` | Un sillón no puede tener dos turnos activos superpuestos, aunque sean de profesionales distintos. | `[E.7]` |
| `RN-AG-05` | Un turno que termina exactamente cuando comienza otro **no** es solapamiento. Rango `[inicio, fin)`. | derivada |
| `RN-AG-09` | El sobreturno se admite sólo con motivo escrito; máximo uno por profesional y franja. | `[E.7]` |
| `RN-EX-06` | Toda regla de agenda debe tener al menos una prueba automatizada. | criterio de la cátedra |

## Criterio de éxito

`npm test` ejecuta la suite de Jest y reporta **5/5 tests en verde** sin requerir Docker ni base de datos externa.
