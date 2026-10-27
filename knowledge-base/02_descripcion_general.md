# Descripción General

> **Estado del documento.** Proyecto greenfield: no hay stack elegido, código ni repositorio de aplicación. **Todo el contenido técnico de este archivo es una propuesta**, derivada de las brechas y del MVP sugerido en `discovery/discovery.md` (§C.3, §C.4 y §D.3). Las decisiones se consolidan en `09_decisiones_y_supuestos.md` y las preguntas que las bloquean en `10_preguntas_abiertas.md`.

## Stack tecnológico

> Propuesta (no decidido). El objetivo es un monolito modular con tipado de punta a punta, despliegue simple y una curva de adopción razonable para un equipo pequeño.

| Capa | Tecnología propuesta | Versión mínima | Justificación |
|---|---|---|---|
| Lenguaje | TypeScript | 5.6 | Tipado compartido entre API, dominio y frontend |
| Runtime | Node.js LTS | 22 | Ecosistema maduro para SaaS y colas de trabajo |
| Framework backend | NestJS | 11 | Módulos, inyección de dependencias y *guards* para RBAC |
| Acceso a datos | Prisma ORM | 6 | Migraciones versionadas y tipado del esquema |
| Base de datos | PostgreSQL | 16 | Transacciones, `tstzrange`, restricciones de exclusión y RLS |
| Caché y colas | Redis + BullMQ | 7 / 5 | Recordatorios, reintentos, expiración de señas y ofertas |
| Frontend | Next.js (App Router) + React | 15 / 19 | PWA para personal y portal del paciente, SSR para el link público |
| UI | Tailwind CSS + componentes accesibles | 4 | Consistencia visual y rapidez de implementación |
| Validación | Zod | 3 | Esquemas compartidos entre formularios y API |
| Autenticación | JWT de acceso + refresh rotativo; Argon2id | — | Sesiones cortas y revocación por dispositivo |
| Pruebas | Vitest + Supertest + Testcontainers | — | Pruebas de dominio y de integración con PostgreSQL real |
| Almacenamiento de archivos | S3 compatible (SSE) | — | Radiografías, consentimientos firmados y exportaciones |
| Observabilidad | OpenTelemetry + logs estructurados + Sentry | — | Trazas por request y alertas de fallos de integración |
| Contenedores | Docker + Docker Compose | — | Paridad entre desarrollo y producción |
| Integración continua | GitHub Actions | — | *Lint*, pruebas y migraciones en cada *pull request* |

**Suposición:** el equipo dispone de Node.js y Docker en el entorno de desarrollo. La cátedra exige Go, Git y Node instalados; la elección de TypeScript no contradice ese requisito y se fundamenta en la afinidad con el dominio y la velocidad de entrega (`DD-11`).

## Arquitectura general

> Propuesta (no decidido). **Monolito modular** con un único despliegue de API y módulos de dominio aislados por fronteras explícitas. Se descarta microservicios para v1.0: el volumen esperado no los justifica y multiplican el costo operativo de un equipo pequeño.

```
Navegador del personal (PWA)      Portal del paciente (PWA)      WhatsApp / Meta
             │                              │                          │
             └──────────────┬───────────────┘                          │
                            │ HTTPS                                    │ webhooks
                            ▼                                          ▼
                    ┌───────────────┐                          ┌───────────────┐
                    │  CDN / WAF    │                          │  API pública  │
                    └───────┬───────┘                          └───────┬───────┘
                            │                                          │
                            ▼                                          │
                    ┌───────────────┐                                  │
                    │  Next.js SSR  │                                  │
                    └───────┬───────┘                                  │
                            │ /api/v1                                  │
                            ▼                                          ▼
        ┌─────────────────────────────────────────────────────────────────────┐
        │                     API NestJS (monolito modular)                  │
        │  identidad │ agenda │ pacientes │ clínica │ cobros │ facturación   │
        │  comunicación │ lista de espera │ auditoría │ exportación          │
        └───────┬───────────────────────┬───────────────────────┬────────────┘
                │                       │                       │
                ▼                       ▼                       ▼
        ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
        │ PostgreSQL 16 │       │ Redis + BullMQ│       │  S3 (SSE)     │
        │ RLS por tenant│       │ colas/outbox  │       │ archivos      │
        └───────────────┘       └───────┬───────┘       └───────────────┘
                                        │
                     ┌──────────────────┼──────────────────┐
                     ▼                  ▼                  ▼
             ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
             │ WhatsApp Cloud│  │ Mercado Pago  │  │ ARCA WSAA /   │
             │ API (Meta)    │  │ Checkout API  │  │ wsfev1        │
             └───────────────┘  └───────────────┘  └───────────────┘
```

### Decisiones de alto nivel

1. **Multi-tenant con base única y aislamiento por fila.** Cada tabla de negocio lleva `tenant_id`; PostgreSQL aplica *Row Level Security* y la API fija el tenant desde el token. Se evita una base por cliente porque complica migraciones y soporte; el aislamiento lógico se refuerza con pruebas automatizadas (`DD-05`).
2. **El sillón es una entidad de primera clase.** La agenda no se modela sólo como “turnos de un profesional”: el recurso físico `chair` tiene disponibilidad propia y participa de la restricción de solapamiento. Es el diferenciador de dominio que el mercado ya valora en DentalSoft, Órbita y Dentalink (`DD-06`).
3. **Doble barrera contra superposiciones.** Validación en el servicio de dominio y restricción de exclusión en PostgreSQL sobre rangos `tstzrange` por profesional y por sillón. La base de datos es la última línea de defensa ante concurrencia (`DD-07`).
4. **Patrón *outbox* para efectos externos.** El cambio de estado del turno y el mensaje a WhatsApp se escriben en la misma transacción; un trabajador publica el mensaje y reintenta con idempotencia. Evita turnos confirmados sin notificación o mensajes duplicados.
5. **Adaptadores anticorrupción para integraciones locales.** ARCA (SOAP), Mercado Pago (REST) y WhatsApp (Graph API) quedan detrás de interfaces propias. Un cambio de proveedor o de versión no contamina el dominio.
6. **Exportación como capacidad de primer nivel.** Un módulo dedicado produce un paquete completo de datos por tenant, con manifiesto y checksum, sin depender del estado de la suscripción (`DD-12`).

## Módulos de dominio

| Módulo | Responsabilidad | Entidades principales |
|---|---|---|
| Identidad y acceso | Cuentas, usuarios, roles, sesiones, 2FA, invitaciones | `Tenant`, `User`, `Membership`, `Session` |
| Configuración | Sucursales, sillones, prestaciones, horarios, obras sociales | `Branch`, `Chair`, `Service`, `WorkingHours`, `Insurance` |
| Agenda | Disponibilidad, turnos, reprogramaciones, bloqueos, sobreturnos | `Appointment`, `Block`, `AvailabilitySlot` |
| Pacientes | Datos demográficos, contactos, obra social, consentimientos | `Patient`, `PatientInsurance`, `Consent` |
| Clínica | Historia clínica, odontograma, notas, planes de tratamiento | `ClinicalRecord`, `ClinicalNote`, `ToothFinding`, `TreatmentPlan` |
| Cobros | Caja, pagos, señas, devoluciones, conciliación | `Payment`, `Deposit`, `CashSession` |
| Facturación | Comprobantes ARCA, CAE, QR, notas de crédito | `Invoice`, `InvoiceLine` |
| Comunicación | Opt-in, plantillas, envíos, estados y costos | `MessageTemplate`, `MessageLog`, `OptIn` |
| Lista de espera | Inscripción, prioridad, ofertas y aceptación | `WaitlistEntry`, `WaitlistOffer` |
| Auditoría | Registro inmutable de accesos y cambios | `AuditEvent` |
| Exportación | Paquetes de datos y solicitudes de baja | `ExportRequest` |
| Plataforma | Planes, suscripción, uso y soporte | `Plan`, `Subscription`, `UsageRecord` |

## Integraciones externas

| Servicio | Propósito | Tipo | Criticidad | Notas |
|---|---|---|---|---|
| WhatsApp Cloud API (Meta) | Recordatorios, confirmaciones, ofertas de lista de espera | REST + webhooks | Alta | Requiere número verificado, plantillas `utility` aprobadas y opt-in explícito |
| Mercado Pago | Seña al reservar y cobros por link/QR | REST + webhooks | Alta | Verificación de firma; conciliación por `external_reference` |
| ARCA | Facturación electrónica B/C, CAE y QR fiscal | SOAP (WSAA + `wsfev1`/`wsmtxca`) | Alta | Certificado por tenant, ticket de acceso de 12 horas |
| Google Calendar | Sincronización de la agenda del profesional | REST (OAuth 2.0) | Media | Sólo lectura/escritura de eventos; no datos clínicos |
| Obras sociales | Validación y liquidación en línea | SOAP por convenio | Baja en v1.0 | Fase 2; en v1.0 sólo catálogo y borrador de liquidación |
| Correo transaccional | Invitaciones, copia de historia clínica, exportaciones | REST/SMTP | Media | Alternativa de contacto cuando WhatsApp falla |
| Almacenamiento S3 | Radiografías, consentimientos y exportaciones | SDK | Media | Cifrado en reposo y URLs firmadas de corta duración |
| Pasarela de suscripción del SaaS | Cobro del plan a cada consultorio | REST | Media | Fuera del MVP; puede resolverse con el mismo Mercado Pago |

### Reglas de integración

- Toda llamada externa se ejecuta desde un trabajador, nunca dentro del ciclo de request del usuario, salvo la consulta de disponibilidad de pago.
- Cada mensaje, pago o comprobante tiene una **clave de idempotencia** propia y un registro de intentos.
- Los webhooks se validan por firma y se procesan de forma idempotente; un evento repetido no duplica efectos.
- Las credenciales de ARCA y Mercado Pago son **por tenant** y se almacenan cifradas; la plataforma no opera con una cuenta única.
- Los datos clínicos no se transmiten por WhatsApp ni por correo electrónico sin cifrado adicional; sólo se envían datos mínimos de turno.

## API REST

> Propuesta (no decidido). Prefijo `/api/v1`, JSON, autenticación por `Bearer` y aislamiento por tenant. Los endpoints públicos usan tokens de corta duración o enlaces firmados.

| Recurso | Endpoints principales | Notas |
|---|---|---|
| Autenticación | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/2fa/verify` | Refresh rotativo y revocación por dispositivo |
| Cuenta | `GET /tenant`, `PATCH /tenant`, `GET /tenant/usage` | Configuración y consumo del plan |
| Sucursales y sillones | `GET/POST /branches`, `PATCH /branches/:id`, `GET/POST /chairs` | Sillón asociado a sucursal |
| Profesionales | `GET/POST /professionals`, `PATCH /professionals/:id`, `PUT /professionals/:id/services` | Prestaciones y obras sociales por profesional |
| Prestaciones | `GET/POST /services`, `PATCH /services/:id` | Duración, precio, seña y especialidad |
| Disponibilidad | `GET /availability?professional=&service=&from=&to=` | Cálculo server-side de huecos |
| Turnos | `GET/POST /appointments`, `PATCH /appointments/:id`, `POST /appointments/:id/cancel`, `POST /appointments/:id/reschedule`, `POST /appointments/:id/check-in` | Validación de solapamiento y auditoría |
| Bloqueos | `GET/POST /blocks`, `DELETE /blocks/:id` | Feriados, ausencias y mantenimiento |
| Pacientes | `GET/POST /patients`, `PATCH /patients/:id`, `GET /patients/:id/timeline` | Datos demográficos y vínculo con la clínica |
| Historia clínica | `GET /patients/:id/clinical-record`, `POST /clinical-notes`, `PATCH /clinical-notes/:id`, `POST /clinical-notes/:id/sign` | Contenido clínico restringido por rol |
| Odontograma | `GET/PUT /patients/:id/odontogram`, `POST /odontogram/findings` | FDI, superficies y estados |
| Planes de tratamiento | `GET/POST /treatment-plans`, `PATCH /treatment-plans/:id`, `POST /treatment-plans/:id/accept` | Presupuesto y aceptación |
| Consentimientos | `POST /consents`, `POST /consents/:id/sign`, `GET /patients/:id/consents` | Evidencia de autoría |
| Lista de espera | `GET/POST /waitlist`, `POST /waitlist/:id/offer`, `POST /offers/:token/accept`, `POST /offers/:token/decline` | Orden de llegada y ventana de aceptación |
| Pagos | `GET/POST /payments`, `POST /payments/:id/refund`, `GET/POST /deposits` | Caja y seña |
| Facturación | `GET/POST /invoices`, `POST /invoices/:id/issue`, `POST /invoices/:id/credit-note` | Emisión contra ARCA |
| Mensajería | `GET /messages`, `GET /templates`, `POST /templates/sync` | Estado y costo por mensaje |
| Exportación | `POST /exports`, `GET /exports/:id`, `GET /exports/:id/download` | Paquete completo con vencimiento |
| Auditoría | `GET /audit-events?resource=&actor=&from=&to=` | Sólo roles habilitados |
| Webhooks | `POST /webhooks/whatsapp`, `POST /webhooks/mercadopago` | Firma obligatoria e idempotencia |
| Público | `GET /public/:slug/availability`, `POST /public/:slug/appointments`, `GET /public/appointments/:token`, `POST /public/appointments/:token/cancel` | Sin sesión; rate limit y token firmado |
| Salud | `GET /health`, `GET /ready` | Sin autenticación, sin datos sensibles |

## Requisitos no funcionales

| Atributo | Objetivo propuesto |
|---|---|
| Disponibilidad | 99,5 % mensual en v1.0; ventana de mantenimiento informada |
| Latencia | p95 < 400 ms en endpoints de agenda; p95 < 1,5 s en cálculo de disponibilidad de 30 días |
| Concurrencia | Reserva simultánea del mismo hueco resuelta por restricción de base; sólo una confirma |
| Recuperación | RPO ≤ 15 minutos y RTO ≤ 4 horas para la base transaccional |
| Retención | Historia clínica 10 años; auditoría 10 años; mensajes 24 meses; exportaciones 7 días |
| Accesibilidad | WCAG 2.1 AA en el portal del paciente y en la agenda |
| Idioma | Español (Argentina); formato de fecha `dd/mm/aaaa` y moneda ARS |
| Trazabilidad | Toda modificación de turno, pago, comprobante y acceso a historia clínica genera evento de auditoría |
