# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **turnos-odontologia**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. **Identificar el change a trabajar**: Elegir el siguiente change disponible según el árbol de dependencias y los gates de paralelismo. En este trabajo de integración, el change a implementar para el ciclo OPSX es `C-07: create-appointment-overlap-prevention`.
2. **Leer la Knowledge Base indicada**: Antes de redactar cualquier propuesta o código, consultar obligatoriamente los archivos y secciones indicados en el campo `Leer antes` de la ficha del change.
3. **Iniciar el ciclo OPSX (`/opsx:propose`)**: Ejecutar la propuesta de especificación en OpenSpec (`proposal.md`, `design.md`, `specs/`, `tasks.md`). Verificar que contenga al menos tres escenarios verificables en formato Gherkin (camino feliz, error de negocio y caso de borde).
4. **Implementar y verificar (`/opsx:apply` & verify)**: Escribir el código estrictamente contra la especificación aprobada y correr la suite de pruebas unitarias/integración hasta lograr el 100% de tests en verde.
5. **Archivar (`/opsx:archive`) y marcar checkbox**: Archivar el change en `openspec/changes/archive/` y marcar el checkbox `[x]` correspondiente en este documento.

---

## Árbol de dependencias

```text
C-01: foundation-setup
├── C-02: tenants-identity-rbac
│   ├── C-03: branches-chairs-schedule
│   │   └── C-07: create-appointment-overlap-prevention (CAMINO CRÍTICO)
│   │       ├── C-08: appointment-reschedule-cancel
│   │       │   ├── C-11: whatsapp-cloud-notifications
│   │       │   │   └── C-12: smart-waitlist-engine
│   │       │   └── C-21: data-export-total-takeout [si C-13, C-17, C-20 ✓]
│   │       └── C-09: public-booking-flow [si C-05 ✓]
│   │           └── C-10: mercadopago-deposit-integration
│   ├── C-04: services-catalog-pricing
│   │   └── C-07: create-appointment-overlap-prevention (vía dependencias compartidas)
│   ├── C-05: insurances-basic-catalog
│   │   ├── C-09: public-booking-flow (vía reglas de cobertura por profesional)
│   │   └── C-19: insurance-draft-settlement [si C-17 ✓]
│   ├── C-06: patients-directory
│   │   ├── C-07: create-appointment-overlap-prevention (CAMINO CRÍTICO)
│   │   └── C-13: clinical-record-anamnesis
│   │       ├── C-14: odontogram-fdi
│   │       │   └── C-16: treatment-plans-quotes
│   │       │       └── C-17: cash-session-payments [si C-10 ✓]
│   │       │           └── C-18: arca-electronic-invoicing
│   │       └── C-15: digital-informed-consent
│   └── C-20: audit-trail-access-log
```

---

### Paralelismo por fase

```text
GATE 0: Inicialización
  → C-01 foundation-setup                          [Agente A]

GATE 1: C-01 ✓
  → C-02 tenants-identity-rbac                     [Agente A]

GATE 2: C-02 ✓                                     ← PRIMER FORK
  → C-03 branches-chairs-schedule                  [Agente A]
  → C-04 services-catalog-pricing                  [Agente B]
  → C-05 insurances-basic-catalog                  [Agente B]
  → C-06 patients-directory                        [Agente C]
  → C-20 audit-trail-access-log                    [Agente C]

GATE 3: C-03, C-04, C-06 ✓ (Camino Crítico desbloqueado)
  → C-07 create-appointment-overlap-prevention     [Agente A — CAMINO CRÍTICO]
  → C-13 clinical-record-anamnesis                 [Agente B — si C-06 ✓]
  → C-05 insurances-basic-catalog                  [Agente C — si pendiente]

GATE 4: C-07 ✓                                     ← SEGUNDO FORK
  → C-08 appointment-reschedule-cancel             [Agente A]
  → C-09 public-booking-flow                       [Agente B — si C-05 ✓]
  → C-14 odontogram-fdi                            [Agente C — si C-13 ✓]
  → C-15 digital-informed-consent                  [Agente C — si C-13 ✓]

GATE 5: C-08, C-09 ✓
  → C-10 mercadopago-deposit-integration           [Agente B — si C-09 ✓]
  → C-11 whatsapp-cloud-notifications              [Agente A — si C-08 ✓]
  → C-16 treatment-plans-quotes                    [Agente C — si C-14 ✓]

GATE 6: C-10, C-11, C-16 ✓
  → C-12 smart-waitlist-engine                     [Agente A — si C-11 ✓]
  → C-17 cash-session-payments                     [Agente B — si C-10, C-16 ✓]

GATE 7: C-17 ✓
  → C-18 arca-electronic-invoicing                 [Agente A — si C-17 ✓]
  → C-19 insurance-draft-settlement                [Agente B — si C-05, C-17 ✓]

GATE 8: C-08, C-13, C-17, C-20 ✓
  → C-21 data-export-total-takeout                 [Agente C — Cierre MVP]
```

---

### Camino crítico (5 changes — mínimo irreducible al núcleo de agenda)

`C-01` → `C-02` → `C-03` / `C-04` / `C-06` → `C-07` → `C-08`

> El camino crítico hasta la prevención verificable de solapamientos por profesional y sillón (`C-07`) requiere únicamente 4 pasos previos (`C-01`, `C-02`, `C-03`, `C-06` junto con `C-04`), permitiendo validar el contrato de negocio principal en etapas tempranas.

---

### Plan óptimo con 3 agentes

| Paso | Agente A (Backend Core / Agenda) | Agente B (Backend Aux / Integraciones) | Agente C (Clínica / Operación) |
|---|---|---|---|
| **1** | `C-01: foundation-setup` | — | — |
| **2** | `C-02: tenants-identity-rbac` | — | — |
| **3** | `C-03: branches-chairs-schedule` | `C-04: services-catalog-pricing` | `C-06: patients-directory` |
| **4** | `C-07: create-appointment-overlap-prevention` | `C-05: insurances-basic-catalog` | `C-20: audit-trail-access-log` |
| **5** | `C-08: appointment-reschedule-cancel` | `C-09: public-booking-flow` | `C-13: clinical-record-anamnesis` |
| **6** | `C-11: whatsapp-cloud-notifications` | `C-10: mercadopago-deposit-integration` | `C-14: odontogram-fdi` |
| **7** | `C-12: smart-waitlist-engine` | `C-16: treatment-plans-quotes` | `C-15: digital-informed-consent` |
| **8** | `C-18: arca-electronic-invoicing` | `C-17: cash-session-payments` | `C-19: insurance-draft-settlement` |
| **9** | — | — | `C-21: data-export-total-takeout` |

---

## FASE 1 — Infraestructura y Core Foundation

### [C-01] `foundation-setup`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Scaffolding de monolito modular con TypeScript y Node.js.
  - Configuración de entorno base (`.env.example`, variables obligatorias de base y redis).
  - Configuración de base de datos PostgreSQL con extensión `btree_gist` habilitada.
  - Configuración inicial de Prisma ORM con migración inicial (`001_init`).
  - Pipeline de tests automatizados (Jest / test runner) y scripts de verificación de entorno.
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/02_descripcion_general.md` §Arquitectura propuesta y componentes
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones de arquitectura y árbol de directorios
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-08 y §DD-09

### [C-02] `tenants-identity-rbac`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `tenant`, `user`, `membership`, `session`, `invitation`.
  - Mecanismo de multi-tenancy con discriminador `tenant_id` y políticas Row Level Security (RLS).
  - Autenticación JWT con tokens de acceso (15 min) y refresh tokens rotativos.
  - Matriz RBAC (`owner`, `admin`, `professional`, `receptionist`, `billing`, `patient`).
  - Endpoint de registro inicial autoservicio (`POST /api/auth/register-tenant`).
  - Tests unitarios y de integración de aislamiento estricto multi-tenant.
- **Dependencias**: `C-01`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §Matriz RBAC y permisos
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Plataforma e Identidad
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AU (Autenticación) y §RN-TE (Tenancy)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-05 y §DD-16

---

## FASE 2 — Recursos Físicos y Catálogos Operativos

### [C-03] `branches-chairs-schedule`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `branch`, `chair`, `working_hours`, `block`.
  - Alta, edición y baja lógica de sillones por sucursal con validación de nombre único.
  - Definición de horarios de atención semanales por profesional y por sillón.
  - Gestión de bloqueos por ausencia, mantenimiento o feriados.
  - Prevención de desactivación de sucursales o sillones con turnos futuros asignados.
  - Tests de configuración de capacidad física de atención.
- **Dependencias**: `C-02`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Organización
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-06, §RN-AG-08, §RN-AG-15
  - `knowledge-base/06_funcionalidades.md` §US-004 y §US-006
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-06

### [C-04] `services-catalog-pricing`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `service`, `professional_service`.
  - CRUD de prestaciones odontológicas con duración en minutos (5 a 480 min).
  - Definición de precios en ARS y política de seña (sin seña, fija o porcentual ≤ precio).
  - Override de duración y honorario por profesional sin alterar el catálogo maestro.
  - Tests de validación de duración y coherencia de importes de seña.
- **Dependencias**: `C-02`
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Catálogo
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-01, §RN-AG-02, §RN-SE-01, §RN-SE-02
  - `knowledge-base/06_funcionalidades.md` §US-005

### [C-05] `insurances-basic-catalog`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `insurance`, `professional_insurance`, `patient_insurance`.
  - Catálogo manual de obras sociales y prepagas editables por el consultorio.
  - Asociación de obras sociales aceptadas por cada profesional (regla clave de Argentina).
  - Registro de copago estimado y número de credencial del paciente.
  - Tests de asociación y exclusión de profesionales según obra social del paciente.
- **Dependencias**: `C-02`
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Catálogo y Pacientes
  - `knowledge-base/05_reglas_de_negocio.md` §RN-OS-01 a §RN-OS-07
  - `knowledge-base/06_funcionalidades.md` §US-007 y §US-032
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-04

---

## FASE 3 — Pacientes y Agenda Core (Change Seleccionado)

### [C-06] `patients-directory`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tabla `patient` con DNI único por tenant, nombre, fecha de nacimiento, teléfono y email.
  - Soporte de vínculo de tutor para pacientes menores de edad.
  - Registro de coberturas médicas del paciente vinculadas al catálogo de obras sociales.
  - Búsqueda indexada por DNI, apellido y teléfono.
  - Tests de unicidad por tenant y vinculación familiar.
- **Dependencias**: `C-02`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Pacientes
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CL-10 y §RN-PR-02
  - `knowledge-base/06_funcionalidades.md` §US-009 y §US-021

### [C-07] `create-appointment-overlap-prevention`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `appointment` y `appointment_status_history`.
  - Validación de rango temporal de la prestación (`tstzrange` en UTC) contra agenda del profesional y ocupación del sillón.
  - Doble barrera de solapamiento: regla de dominio en servicio de aplicación + restricción de exclusión GiST en PostgreSQL.
  - Estados iniciales del turno: `confirmed` (sin seña requerida) o `pending_deposit` (seña pendiente).
  - Regla de adyacencia exacta: turnos contiguos (donde `inicio_B == fin_A`) son válidos y permitidos.
  - Excepción gobernada de sobreturno (`is_overbook = true`, máximo 1 por franja y profesional con motivo obligatorio).
  - Tests automatizados exhaustivos: camino feliz, conflicto por profesional, conflicto por sillón, adyacencia de borde y sobreturno.
- **Dependencias**: `C-03`, `C-04`, `C-06`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Agenda y restricciones de solapamiento
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-01 a §RN-AG-09, §RN-TU-03 a §RN-TU-05
  - `knowledge-base/06_funcionalidades.md` §US-009 y §US-012
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (Alta de turno en recepción con validación de solapamiento)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-06 y §DD-07

### [C-08] `appointment-reschedule-cancel`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Endpoints de reprogramación y cancelación con registro inmutable en `appointment_status_history`.
  - Liberación inmediata del slot en la agenda al cancelar.
  - Validación de ausencia de solapamiento al reprogramar el nuevo horario.
  - Aplicación de política de seña según ventana de anticipación configurada.
  - Emisión de evento de dominio `appointment.cancelled` para suscripción de lista de espera.
  - Tests de transición de estados y liberación de horarios.
- **Dependencias**: `C-07`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §appointment_status_history
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-10, §RN-AG-11, §RN-SE-04
  - `knowledge-base/06_funcionalidades.md` §US-010 y §US-011
  - `knowledge-base/07_flujos_principales.md` §Flujo 3 y Flujo 4

---

## FASE 4 — Reserva Online y WhatsApp

### [C-09] `public-booking-flow`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Endpoint público `GET /api/public/{slug}/availability` con cálculo de franjas libres respetando bloqueos, feriados y cupos.
  - Endpoint de creación de turno público con token seguro de autogestión para el paciente.
  - Restricción de anticipación mínima (N horas) y máxima de reserva.
  - Filtrado de profesionales según obra social declarada por el paciente.
  - Tests de cálculo de disponibilidad sin fuga de datos entre tenants ni exposición de datos clínicos.
- **Dependencias**: `C-05`, `C-07`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §RN-TU-01 a §RN-TU-11
  - `knowledge-base/06_funcionalidades.md` §US-013 y §US-015
  - `knowledge-base/07_flujos_principales.md` §Flujo 2 (Reserva online desde link público con seña)

### [C-10] `mercadopago-deposit-integration`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `deposit`, `payment`.
  - Integración con Checkout Pro / Link de Mercado Pago para cobro de seña.
  - Bloqueo temporal del slot de turno por 10 minutos mientras se completa el pago.
  - Webhook receptor idempotente (`x-signature` validada): confirmación de turno o liberación automática por timeout.
  - Tests de pago simulado, reintentos de webhook y expiración de seña no pagada.
- **Dependencias**: `C-07`, `C-09`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Cobros
  - `knowledge-base/05_reglas_de_negocio.md` §RN-SE-02, §RN-SE-03, §RN-EX-02
  - `knowledge-base/06_funcionalidades.md` §US-014
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-11
  - `knowledge-base/11_integraciones_locales_ar.md` §Mercado Pago

### [C-11] `whatsapp-cloud-notifications`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `message_template`, `opt_in`, `message_log`.
  - Worker asíncrono con Outbox pattern para despacho confiable de mensajes.
  - Templates aprobados `utility` (recordatorio 48h y 24h) con botones interactivos "Confirmar" y "Cancelar".
  - Recepción de webhook de WhatsApp con actualización automática de estado del turno.
  - Minimización estricta: prohibición de nombres de tratamientos o datos de salud en el mensaje.
  - Tests de despacho, opt-in previo obligatorio y tratamiento de fallo de entrega.
- **Dependencias**: `C-07`, `C-08`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Comunicación
  - `knowledge-base/05_reglas_de_negocio.md` §RN-WA-01 a §RN-WA-07, §RN-CL-08
  - `knowledge-base/06_funcionalidades.md` §US-016 a §US-018
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-10
  - `knowledge-base/11_integraciones_locales_ar.md` §WhatsApp Cloud API

---

## FASE 5 — Diferenciador 1: Lista de Espera Inteligente

### [C-12] `smart-waitlist-engine`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `waitlist_entry`, `waitlist_offer`.
  - Inscripción de pacientes en espera por prestación, profesional y rango horario preferido.
  - Detección reactiva de huecos liberados tras cancelación (`appointment.cancelled`).
  - Envío automático de oferta interactiva por WhatsApp al primer candidato elegible por orden FIFO.
  - Ventana de aceptación configurable (15 min); expiración automática y cascada al siguiente de la lista.
  - Creación automática de turno al aceptar y bloqueo de asignación externa durante la vigencia de la oferta.
  - Tests de orden de prioridad, timeout de ofertas y reasignación automática de turnos.
- **Dependencias**: `C-08`, `C-11`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Lista de espera
  - `knowledge-base/05_reglas_de_negocio.md` §RN-LE-01 a §RN-LE-08
  - `knowledge-base/06_funcionalidades.md` §US-019 y §US-020
  - `knowledge-base/07_flujos_principales.md` §Flujo 4 (Liberación de turno y oferta automática a lista de espera)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-03

---

## FASE 6 — Ficha Clínica y Presupuestos (Ley 26.529)

### [C-13] `clinical-record-anamnesis`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `clinical_record`, `clinical_note`.
  - Creación de ficha clínica única por paciente y tenant.
  - Anamnesis: registro estructurado de antecedentes médicos, factores de riesgo y alergias.
  - Notas de evolución inmutables firmadas por el profesional tratante con fecha cierta; addendums para correcciones.
  - Acceso restringido a profesionales de la salud; bloqueo de lectura a rol administrativo.
  - Tests de inmutabilidad y control de acceso RBAC clínico.
- **Dependencias**: `C-06`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Clínica
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CL-01 a §RN-CL-03, §RN-PR-04
  - `knowledge-base/06_funcionalidades.md` §US-021
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-16

### [C-14] `odontogram-fdi`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `odontogram`, `tooth_finding`.
  - Representación de piezas dentales permanente (11-48) y temporaria (51-85) bajo sistema FDI.
  - Registro de patologías y tratamientos por cara/superficie (mesial, distal, oclusal, vestibular, lingual).
  - Versionado histórico del odontograma tras cada sesión cerrada de atención.
  - Tests de numeración FDI válida y persistencia de hallazgos por superficie.
- **Dependencias**: `C-13`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §odontogram y tooth_finding
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CL-04, §RN-CL-07
  - `knowledge-base/06_funcionalidades.md` §US-022

### [C-15] `digital-informed-consent`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `consent`, `consent_template`.
  - Generación de documento de consentimiento informado previo al tratamiento.
  - Registro de firma electrónica simple con captura de IP, User-Agent, sello temporal y hash SHA-256.
  - Descarga de copia en PDF para el paciente en cumplimiento de la Ley 26.529.
  - Tests de integridad del hash de consentimiento y firma de tutor para menores.
- **Dependencias**: `C-13`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Consentimientos
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CO-01 a §RN-CO-04, §RN-CL-09
  - `knowledge-base/06_funcionalidades.md` §US-023 y §US-024
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-17

### [C-16] `treatment-plans-quotes`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `treatment_plan`, `treatment_item`.
  - Agrupación de prestaciones planificadas con piezas dentarias asociadas y precios vigentes.
  - Cálculo de totales, anticipos y saldos pendientes en moneda ARS.
  - Registro de aceptación formal del presupuesto por parte del paciente.
  - Tests de cálculo aritmético y transición a estado presupuestado/aceptado.
- **Dependencias**: `C-14`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Clínica (Planes de tratamiento)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-SE-01, §RN-CL-03, §RN-FA-01
  - `knowledge-base/06_funcionalidades.md` §US-025

---

## FASE 7 — Caja, Liquidación y Diferenciador 2 (ARCA)

### [C-17] `cash-session-payments`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `cash_session`, `payment`, `refund`.
  - Apertura, control de cobros multicanal (efectivo, transferencia, Mercado Pago) y cierre de caja diaria con arqueo.
  - Asociación de pagos a turnos o ítems de plan de tratamiento.
  - Emisión de reembolsos trazables sin eliminación física de registros.
  - Tests de arqueo y balance de sesión de caja.
- **Dependencias**: `C-10`, `C-16`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Cobros
  - `knowledge-base/05_reglas_de_negocio.md` §RN-SE-06 a §RN-SE-09
  - `knowledge-base/06_funcionalidades.md` §US-026 y §US-027
  - `knowledge-base/07_flujos_principales.md` §Flujo 5 (Cobro en recepción y arqueo de caja)

### [C-18] `arca-electronic-invoicing`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `invoice`, `invoice_line`.
  - Servicio de autenticación WSAA con AFIP/ARCA (obtención y almacenamiento seguro de Ticket de Acceso por 12 h).
  - Emisión de comprobantes Factura B y Factura C a través de WSFEv1.
  - Almacenamiento de CAE, fecha de vencimiento de CAE y generación de código QR fiscal oficial.
  - Mecanismo de reintentos por contingencia sin duplicación de número de comprobante.
  - Tests de formateo de payloads fiscales y validación de QR según RG 5866.
- **Dependencias**: `C-17`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Facturación
  - `knowledge-base/05_reglas_de_negocio.md` §RN-FA-01 a §RN-FA-08
  - `knowledge-base/06_funcionalidades.md` §US-028
  - `knowledge-base/07_flujos_principales.md` §Flujo 6 (Emisión de factura electrónica ARCA)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-03
  - `knowledge-base/11_integraciones_locales_ar.md` §ARCA (Facturación electrónica nacional)

### [C-19] `insurance-draft-settlement`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Generación de reporte consolidado de prestaciones atendidas por obra social, profesional y rango de fechas.
  - Discriminación de copagos cobrados a pacientes vs. importes a liquidar con la entidad.
  - Exportación en formato CSV y PDF con marca de agua "Borrador de liquidación para presentación".
  - Tests de agregación de importes y congelamiento de cobertura histórica del turno.
- **Dependencias**: `C-05`, `C-17`
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §RN-OS-02 a §RN-OS-07
  - `knowledge-base/06_funcionalidades.md` §US-032
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-04

---

## FASE 8 — Auditoría, Portabilidad y Cierre

### [C-20] `audit-trail-access-log`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tabla `audit_event` con inserciones inmutables (append-only).
  - Interceptor global que registra lecturas y modificaciones de historias clínicas, turnos y comprobantes fiscales.
  - Registro de usuario, rol, IP, recurso accedido, timestamp y etiqueta `break_glass` para accesos de soporte.
  - Endpoint de consulta con filtros temporales para el rol `owner`.
  - Tests de inmutabilidad del registro de auditoría.
- **Dependencias**: `C-02`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Auditoría
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PR-05, §RN-TE-05, §RN-EX-01
  - `knowledge-base/06_funcionalidades.md` §US-029

### [C-21] `data-export-total-takeout`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Tablas `export_request`.
  - Generador de paquete de exportación total en formato ZIP con manifiesto JSON y sumas de verificación SHA-256.
  - Exportación de pacientes, turnos, ficha clínica completa, pagos y registro de auditoría.
  - Disponibilidad de descarga aun para cuentas con suscripción suspendida (anti lock-in).
  - Vencimiento automático del enlace firmado a los 7 días.
  - Tests de integridad del archivo generado y verificación del checksum SHA-256.
- **Dependencias**: `C-08`, `C-13`, `C-17`, `C-20`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Dominio Exportación
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PR-11, §RN-TE-06, §RN-EX-04
  - `knowledge-base/06_funcionalidades.md` §US-030
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-12

---

## Resumen del Roadmap

| Código | Nombre | Fase | Governance | Dependencias |
|---|---|---|---|---|
| **C-01** | `foundation-setup` | Fase 1: Infra | BAJO | Ninguna |
| **C-02** | `tenants-identity-rbac` | Fase 1: Infra | CRITICO | C-01 |
| **C-03** | `branches-chairs-schedule` | Fase 2: Config | MEDIO | C-02 |
| **C-04** | `services-catalog-pricing` | Fase 2: Config | BAJO | C-02 |
| **C-05** | `insurances-basic-catalog` | Fase 2: Config | BAJO | C-02 |
| **C-06** | `patients-directory` | Fase 3: Pacientes | MEDIO | C-02 |
| **C-07** | `create-appointment-overlap-prevention` | Fase 3: Agenda | CRITICO | C-03, C-04, C-06 |
| **C-08** | `appointment-reschedule-cancel` | Fase 3: Agenda | MEDIO | C-07 |
| **C-09** | `public-booking-flow` | Fase 4: Reserva | ALTO | C-05, C-07 |
| **C-10** | `mercadopago-deposit-integration` | Fase 4: Pagos | CRITICO | C-07, C-09 |
| **C-11** | `whatsapp-cloud-notifications` | Fase 4: WhatsApp | ALTO | C-07, C-08 |
| **C-12** | `smart-waitlist-engine` | Fase 5: Diferenciador | MEDIO | C-08, C-11 |
| **C-13** | `clinical-record-anamnesis` | Fase 6: Clínica | CRITICO | C-06 |
| **C-14** | `odontogram-fdi` | Fase 6: Clínica | MEDIO | C-13 |
| **C-15** | `digital-informed-consent` | Fase 6: Cumplimiento | ALTO | C-13 |
| **C-16** | `treatment-plans-quotes` | Fase 6: Presupuestos | MEDIO | C-14 |
| **C-17** | `cash-session-payments` | Fase 7: Caja | ALTO | C-10, C-16 |
| **C-18** | `arca-electronic-invoicing` | Fase 7: ARCA | CRITICO | C-17 |
| **C-19** | `insurance-draft-settlement` | Fase 7: Obras Soc. | BAJO | C-05, C-17 |
| **C-20** | `audit-trail-access-log` | Fase 8: Auditoría | CRITICO | C-02 |
| **C-21** | `data-export-total-takeout` | Fase 8: Cierre | ALTO | C-08, C-13, C-17, C-20 |

---

### Change recomendado para el Ciclo OPSX de la Cátedra

Para cumplir la **Etapa 6 del Trabajo de Integración**:
* **Change elegido:** `C-07: create-appointment-overlap-prevention`
* **Justificación metodológica:** Corresponde al núcleo del problema relevado en el Discovery (evitar sillones vacíos y sobreturnos conflictivos), posee reglas de negocio 100% verificables con escenarios Gherkin formales (`Dado/Cuando/Entonces`: franja libre, colisión de profesional, colisión de sillón, adyacencia de borde y sobreturno gobernado), y es una unidad atómica ejecutable de forma completa y rigurosa.
