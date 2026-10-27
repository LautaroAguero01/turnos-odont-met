# turnos-odontologia — Instrucciones para Agentes

> Este archivo (y su copia idéntica `CLAUDE.md`) es lo PRIMERO que todo agente lee al ingresar al repositorio.
> Generado a partir de `knowledge-base/`, `CHANGES.md` y `.atl/skill-registry.md`. No editar uno sin re-sincronizar el otro.

---

## Stack Tecnológico

| Capa | Tecnología | Detalle |
|---|---|---|
| **Lenguaje** | TypeScript 5.6+ | Node.js 22 LTS, tipado estricto, sin `any` |
| **Backend** | NestJS / Modular Monolith | Arquitectura modular con separación de dominios |
| **Persistencia** | PostgreSQL 16 + Prisma ORM | Extensión `btree_gist`, rangos temporales `tstzrange`, RLS multi-tenant |
| **Testing** | Jest | Tests unitarios, de integración y de reglas de exclusión |
| **Mensajería** | Redis + BullMQ | Workers asíncronos con patrón Outbox |
| **Integraciones** | WhatsApp Cloud API, Mercado Pago, ARCA | Módulos desacoplados |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar cualquier change.**

| Archivo | Cuándo leerlo |
|---|---|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Propósito, brechas de mercado y objetivos del MVP |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Arquitectura y stack propuesto |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Matriz RBAC, roles administrativos vs. clínicos |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, restricciones de solapamiento e índices |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | 111 reglas codificadas (RN-AG, RN-TU, RN-SE, RN-CL) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica con criterios de aceptación |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Secuencias E2E (alta de turno, cancelación, lista de espera) |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, árbol de carpetas y políticas de testing |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones de arquitectura y alcance confirmadas (DD-01 a DD-17) |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | Incertidumbres resueltas y pendientes |
| [11_integraciones_locales_ar.md](knowledge-base/11_integraciones_locales_ar.md) | Regulaciones argentinas, ARCA, WhatsApp oficial y Mercado Pago |

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|---|---|---|
| **Backend Core** | Agenda, solapamientos, modelo de datos y reglas | `openspec-apply-change`, `openspec-propose` |
| **Backend Aux** | Integraciones (Mercado Pago, WhatsApp, ARCA) | `openspec-apply-change`, `openspec-propose` |
| **Clínica / Operación** | Historia clínica, odontograma FDI, consentimientos | `openspec-apply-change`, `openspec-propose` |
| **Orquestación** | SDD, OpenSpec, gobierno del roadmap | `active-orchestrator`, `roadmap-generator`, `openspec-archive-change` |

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md`. Esta tabla mapea la asignación de roles.

---

## Roadmap de Changes

El plan completo de implementación está definido en [CHANGES.md](CHANGES.md):
- **Total**: 21 changes en 8 fases semánticas.
- **Camino crítico**: `C-01` → `C-02` → `C-03`/`C-04`/`C-06` → `C-07` → `C-08`.
- **Change prioritario para el ciclo OPSX**: `C-07: create-appointment-overlap-prevention`.

**Antes de cualquier `/opsx:propose`**: consultar las dependencias y los archivos indicados en `Leer antes` dentro de [CHANGES.md](CHANGES.md).

---

## Reglas Duras (Específicas del Proyecto)

Son contratos innegociables. Romper cualquiera de estas reglas es considerado un defecto crítico:

### Dominio de Salud y Privacidad (Ley 25.326 y Ley 26.529)
1. **NUNCA almacenar datos reales de pacientes** en el repositorio, base de datos de prueba, fixtures, seeds ni ejemplos → usar exclusivamente datos ficticios y anonimizados.
2. **NUNCA transmitir datos clínicos de salud por WhatsApp** → la comunicación por WhatsApp se limita estrictamente a la gestión de turnos (fecha, hora, sillón/profesional).
3. **NUNCA mutar o eliminar registros clínicos ni consentimientos firmados** → toda modificación posterior debe realizarse mediante addendums inmutables con sello de tiempo y autoría.

### Agenda y Concurrencia
4. **NUNCA permitir superposición de turnos ordinarios** para un mismo profesional o un mismo sillón/box → validar en capa de dominio y garantizar a nivel de base de datos con rangos temporales (`tstzrange`).
5. **NUNCA crear sobreturnos sin motivo explícito ni advertencia previa** → el sobreturno es una excepción gobernada y se limita a un máximo de uno por franja y profesional.

### Estándares de Código y Stack
6. **NUNCA utilizar `any` en TypeScript** → emplear tipado estricto en todas las capas.
7. **NUNCA usar tipos de coma flotante (`float`) para importes de dinero o señas** → utilizar siempre `numeric(12,2)` o enteros en centavos en moneda ARS.

### Metodología SDD / OpenSpec
8. **NUNCA codificar sin una especificación aprobada en `propose`** → la especificación es el contrato de implementación. Si surge una nueva necesidad técnica o de negocio, regresar a `propose`.
9. **NUNCA archivar un change con tests en rojo** → el paso a `archive` exige que el 100% de la suite de pruebas automatizadas esté pasando en verde.

---

## Flujo de Trabajo

```text
1. Leer la KB relevante (knowledge-base/)        → Comprender el dominio
2. Identificar el change en CHANGES.md           → Respetar dependencias y camino crítico
3. /opsx:propose C-NN-nombre                     → Crear proposal, design, specs y tasks
4. Implementar tasks (TDD)                       → Escribir tests y código contra la spec
5. /opsx:archive C-NN-nombre + marcar [x]        → Archivar change y actualizar estado
```
