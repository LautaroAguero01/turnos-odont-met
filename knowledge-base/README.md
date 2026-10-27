# Turnos Odontológicos MET — Base de Conocimiento

Base de conocimiento del proyecto **turnos-odont-met**, un SaaS de gestión de turnos y agenda odontológica para el mercado argentino. Se generó a partir de la investigación de mercado (`discovery/discovery.md`), del enunciado de la cátedra (`discovery/consigna.md`) y del estado estructurado de discovery (`.active-orchestrator-state.json`).

> **Estado del proyecto.** Repositorio greenfield: no hay código, stack elegido ni aplicación. La arquitectura, el modelo de datos y el stack son **propuestas explícitas**, no decisiones tomadas. Las decisiones pendientes están en `10_preguntas_abiertas.md`.

## Índice de archivos

| Archivo | Contenido |
|---|---|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, contexto competitivo, objetivos por actor, alcance y fuera de alcance, métricas de éxito. |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack propuesto, arquitectura general, módulos, integraciones externas, API REST y requisitos no funcionales. |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores, matriz RBAC, separación entre acceso administrativo y clínico, rutas públicas. |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Dominios, ERD, entidades, restricciones de solapamiento, índices y datos de ejemplo ficticios. |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas codificadas por dominio (agenda, turnos, señas, lista de espera, clínica, ARCA, WhatsApp, privacidad). |
| [06_funcionalidades.md](06_funcionalidades.md) | 32 historias de usuario por épica, con criterios de aceptación, prioridad y reglas asociadas. |
| [07_flujos_principales.md](07_flujos_principales.md) | Nueve flujos extremo a extremo: alta, login, agenda, reserva con seña, WhatsApp, lista de espera, clínica, ARCA y exportación. |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura de directorios, seguridad, variables de entorno, despliegue, pruebas y observabilidad. |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | 17 decisiones documentadas y 14 supuestos con origen, riesgo y forma de validación. |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Inconsistencias del discovery, 5 preguntas P0, 12 P1 y 8 P2, más huecos previos al roadmap. |
| [11_integraciones_locales_ar.md](11_integraciones_locales_ar.md) | WhatsApp Cloud API, Mercado Pago, ARCA, obras sociales, Google Calendar y matriz normativa argentina. |

## Quick Start para desarrolladores

1. **Entender el dominio y el problema** → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md).
2. **Entender los datos y la agenda** → [04](04_modelo_de_datos.md); prestar atención a las restricciones de solapamiento por profesional y por sillón.
3. **Entender las reglas que no se negocian** → [05](05_reglas_de_negocio.md), en especial `RN-AG-03`, `RN-AG-04`, `RN-AG-09` y `RN-LE-*`.
4. **Entender la arquitectura propuesta** → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md).
5. **Implementar un flujo** → [07](07_flujos_principales.md) y [06](06_funcionalidades.md).
6. **Integrar WhatsApp, pagos o ARCA** → [11](11_integraciones_locales_ar.md).
7. **Antes de codificar** → [10](10_preguntas_abiertas.md); las preguntas P0 bloquean el roadmap.

## Resumen ejecutivo

El mercado argentino no compite por agenda: la agenda multi-profesional, la historia clínica con odontograma y el recordatorio por WhatsApp son la tabla de entrada. La competencia real está en la automatización de punta a punta por WhatsApp, las obras sociales, la facturación ARCA y el precio transparente. Ningún producto relevado combina agenda multi-sillón, reserva online, recordatorios, obras sociales y ARCA a precio PyME con precio público en pesos.

El producto propuesto ataca esa brecha con un MVP de ocho imprescindibles y dos diferenciadores: **lista de espera inteligente** y **facturación ARCA nativa**. La arquitectura propuesta es un monolito modular multi-tenant con PostgreSQL, WhatsApp Cloud API oficial, Mercado Pago por consultorio y un adaptador ARCA. Todo el diseño técnico es una propuesta sujeta a las decisiones P0 registradas en `10_preguntas_abiertas.md`.

## Convenciones de evidencia

- `[verified]`: documentado públicamente en la fuente citada por el discovery.
- `[claim]`: afirmación comercial del proveedor, no auditada.
- `[no evid.]`: no evidenciado públicamente; no implica que no exista.
- **Suposición:** inferencia de la base de conocimiento, con riesgo y validación en `09_decisiones_y_supuestos.md`.
- **Propuesta (no decidido):** decisión técnica o de alcance pendiente de confirmación.

## Fuentes

- `discovery/discovery.md` — investigación de mercado, 22/10/2026, 21 sistemas relevados.
- `discovery/consigna.md` — enunciado de la cátedra y trazabilidad de requisitos.
- `.active-orchestrator-state.json` — sección `discovery` con el checklist estructurado.
- `desarrollo-active-stack.pdf` — marco del trabajo de integración (contexto académico, no fuente de mercado).

## Advertencia

Este documento no contiene datos reales de pacientes. Todos los ejemplos, nombres, documentos y teléfonos son ficticios. Las fuentes de mercado deben reverificarse antes de usarse en una decisión comercial: los precios, las funcionalidades y las políticas de los proveedores cambian.
