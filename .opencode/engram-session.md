# Engram — respaldo de memoria persistente (Etapa 7)

Fecha: 2026-10-28
Proyecto: turnos-odontologia

## Consulta recuperada de sesión anterior
- Contexto recuperado: regla `prevencion_solapamiento_profesional_sillon` (RN-AG-03, RN-AG-04) definida en `knowledge-base/05_reglas_de_negocio.md` y aplicada en `AGENTS.md`.
- Decisión recuperada: el change `C-07` se eligió porque es el primer imprescindible del MVP (`discovery.md` D.3) y está en el camino crítico (`CHANGES.md` §C-07).

## Decisión guardada en esta sesión
- El archivo `specs/appointment.md` estaba vacío (`0 bytes`) al inicio del ciclo; se completó con los 3 escenarios Gherkin mínimos para cumplir la consigna de `propose` (feliz, error, borde).
- La verificación de fuentes (`discovery.md` G) confirmó que no había afirmaciones falsas en la tabla, pero sí varios datos `claim` sin respaldo; se dejó `No evidenciado` y se documentó la nota metodológica.

## Convenciones del proyecto (memoria persistente)
- Datos de pacientes: siempre ficticios y anonimizados (`AGENTS.md`).
- TypeScript: estricto, sin `any` (`AGENTS.md`).
- Dinero: `numeric(12,2)` o enteros en centavos (`AGENTS.md`, `schema.sql`).
- Especificación aprobada en `propose` es contrato de `apply`; no se inventa código fuera del spec (`AGENTS.md`).
- No se archiva con tests en rojo (`AGENTS.md`).

Referencia: `.opencode/init-log.md`, `.opencode/coherencia.md`, `README.md`.
