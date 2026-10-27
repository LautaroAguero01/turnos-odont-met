# Arquitectura Propuesta

> **Estado.** Documento de **propuesta (no decidido)**. El proyecto es greenfield y no existe código. La arquitectura se deriva del MVP de `discovery/discovery.md` §D.3, de las brechas §C.3 y de las oportunidades §C.4, y de las restricciones legales §E.9. Las decisiones se registran en `09_decisiones_y_supuestos.md` y las incógnitas que las afectan en `10_preguntas_abiertas.md`.

## Principios rectores

1. **El dominio manda.** Las reglas de agenda, seña y lista de espera viven en código de dominio puro, testeable sin base de datos ni servicios externos.
2. **Una sola transacción por cambio de estado.** Un turno no puede quedar confirmado sin su historial, su evento de auditoría y su mensaje en el *outbox*.
3. **La base de datos es la última defensa.** Las restricciones críticas (solapamiento, numeración fiscal, unicidad) se imponen también en PostgreSQL.
4. **Integraciones detrás de adaptadores.** WhatsApp, Mercado Pago y ARCA se encapsulan; el dominio no conoce sus protocolos.
5. **Trazabilidad por defecto.** Toda acción sensible deja un evento inmutable con actor, recurso, fecha y contexto.
6. **Portabilidad como requisito.** La exportación no es un módulo opcional: es una capacidad de primer nivel.
7. **Datos clínicos separados del ruido operativo.** Los mensajes, logs y eventos externos no contienen información clínica.

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| Monolito modular | API completa | Menor costo operativo y despliegue único para un equipo pequeño (`DD-08`) |
| Arquitectura hexagonal por módulo | Agenda, clínica, cobros, facturación | Aísla el dominio de Prisma, HTTP y proveedores externos |
| Multi-tenant por fila con RLS | Todas las tablas de negocio | Aislamiento verificable sin multiplicar bases (`DD-05`) |
| *Outbox* transaccional | WhatsApp, Mercado Pago, ARCA | Evita efectos externos sin transacción y mensajes duplicados |
| Idempotencia por clave | Pagos, mensajes, comprobantes, reservas | Los reintentos y webhooks repetidos no duplican efectos |
| *Saga* local | Reserva con seña y expiración | Coordina hold, pago, confirmación y liberación sin transacción distribuida |
| *Anti-corruption layer* | ARCA (SOAP), obras sociales | Aísla protocolos heredados y permite reemplazarlos |
| Bloqueo optimista | Edición de agendas y fichas | Evita pisar cambios concurrentes |
| *Feature flags* | Lista de espera, ARCA, portal del paciente | Permite activar por tenant y revertir sin desplegar |
| *Rate limiting* y *circuit breaker* | Rutas públicas e integraciones | Protege el sistema de abuso y de fallos en cascada |
| Cifrado de campos | Certificados ARCA, tokens de Mercado Pago | Reduce el impacto de una fuga de base |

## Estructura de directorios

> Propuesta. Monorepo con aplicaciones y paquetes compartidos.

```
turnos-odontologia/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── identity/
│   │       │   ├── tenants/
│   │       │   ├── scheduling/
│   │       │   ├── patients/
│   │       │   ├── clinical/
│   │       │   ├── billing/
│   │       │   ├── invoicing/
│   │       │   ├── messaging/
│   │       │   ├── waitlist/
│   │       │   ├── audit/
│   │       │   └── exports/
│   │       ├── shared/
│   │       │   ├── auth/
│   │       │   ├── tenant/
│   │       │   ├── errors/
│   │       │   ├── outbox/
│   │       │   └── observability/
│   │       ├── jobs/
│   │       └── main.ts
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── (staff)/
│           │   ├── (public)/
│           │   └── api/
│           ├── features/
│           │   ├── agenda/
│           │   ├── pacientes/
│           │   ├── clinica/
│           │   ├── cobros/
│           │   ├── facturacion/
│           │   └── configuracion/
│           └── shared/
│               ├── ui/
│               ├── lib/
│               └── hooks/
├── packages/
│   ├── domain/          # reglas puras: solapamiento, seña, lista de espera
│   ├── contracts/       # esquemas Zod y tipos compartidos
│   └── config/          # ESLint, TypeScript, Tailwind
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── infra/
│   ├── docker/
│   └── compose.yaml
├── openspec/
├── knowledge-base/
└── README.md
```

### Capas dentro de cada módulo

```
modules/scheduling/
├── domain/
│   ├── appointment.entity.ts
│   ├── overlap.policy.ts
│   └── availability.service.ts
├── application/
│   ├── create-appointment.use-case.ts
│   ├── reschedule-appointment.use-case.ts
│   └── ports/
├── infrastructure/
│   ├── appointment.repository.ts
│   └── appointment.controller.ts
└── scheduling.module.ts
```

- **Dominio:** entidades, value objects y políticas sin dependencias de framework.
- **Aplicación:** casos de uso y puertos; orquesta transacciones y eventos.
- **Infraestructura:** controladores HTTP, repositorios Prisma y adaptadores externos.

## Seguridad

| Control | Implementación propuesta |
|---|---|
| Autenticación | Correo y contraseña con Argon2id; TOTP obligatorio para `owner` y `admin` |
| Sesiones | JWT de acceso de 15 minutos + refresh rotativo de 30 días en cookie `HttpOnly`, `Secure`, `SameSite=Lax` |
| Autorización | RBAC por rol y recurso, más verificación de vínculo clínico; *guards* en API y filtros en consultas |
| Aislamiento | `tenant_id` obligatorio y RLS de PostgreSQL; pruebas que intentan acceder a otro tenant |
| Validación de entrada | Esquemas Zod en el borde; *whitelisting* de campos; límites de tamaño |
| Sanitización | Codificación de salida en el frontend; sin `dangerouslySetInnerHTML` sobre datos de usuario |
| Secretos | Variables de entorno en desarrollo; *secret manager* en producción; nunca en el repositorio |
| Cifrado en tránsito | TLS 1.2+ obligatorio; HSTS; redirección de HTTP a HTTPS |
| Cifrado en reposo | PostgreSQL, S3 y respaldos cifrados; certificados ARCA cifrados con clave maestra |
| Contraseñas y tokens | Hash Argon2id; tokens públicos almacenados como hash, nunca en claro |
| Webhooks | Firma `X-Hub-Signature-256` (Meta) y validación de origen y estado (Mercado Pago) |
| Rate limiting | Por IP, por token y por tenant; especial en rutas públicas y login |
| Auditoría | `audit_event` sólo inserción; acceso de soporte con *break-glass* y vencimiento |
| Respaldos | Diarios completos + WAL continuo; restauración probada trimestralmente |
| Dependencias | Escaneo de vulnerabilidades en CI; actualizaciones automáticas de parches |
| Datos de prueba | Sólo datos ficticios; prohibido copiar producción a entornos no productivos |

### Modelo de amenazas resumido

| Amenaza | Mitigación |
|---|---|
| Acceso cruzado entre consultorios | RLS, pruebas de aislamiento y revisión de consultas |
| Empleado curioso lee historias clínicas | RBAC clínico, auditoría de lectura y alertas de volumen anómalo |
| Robo de sesión | Tokens cortos, refresh rotativo, revocación por dispositivo y 2FA |
| Fuga por WhatsApp | Prohibición de datos clínicos en plantillas y validación de contenido |
| Repudio de una firma | Hash, IP, agente de usuario y sello temporal |
| Manipulación de comprobantes | Numeración fiscal en base, CAE y nota de crédito inmutable |
| Fuerza bruta en link público | Rate limit, captcha adaptativo y tokens de un solo uso |
| Fuga por exportación | Enlaces firmados de 7 días, cifrado y auditoría de descarga |

## Variables de entorno

> Propuesta. Los valores son ejemplos; **ninguno debe contener credenciales reales en el repositorio**.

| Variable | Descripción | Ejemplo | Sensible |
|---|---|---|---|
| `NODE_ENV` | Entorno de ejecución | `development` | N |
| `PORT` | Puerto de la API | `3000` | N |
| `APP_BASE_URL` | URL de la aplicación de gestión | `http://localhost:3000` | N |
| `PUBLIC_BOOKING_BASE_URL` | URL base del link público | `http://localhost:3000/b` | N |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/turnos` | Y |
| `REDIS_URL` | Cadena de conexión a Redis | `redis://localhost:6379` | Y |
| `JWT_PRIVATE_KEY` | Clave privada para firmar tokens | `-----BEGIN PRIVATE KEY-----...` | Y |
| `JWT_PUBLIC_KEY` | Clave pública de verificación | `-----BEGIN PUBLIC KEY-----...` | N |
| `JWT_ACCESS_TTL` | Duración del token de acceso | `15m` | N |
| `REFRESH_TOKEN_TTL` | Duración del refresh | `30d` | N |
| `ENCRYPTION_KEY` | Clave maestra para campos cifrados | `base64:...` | Y |
| `S3_ENDPOINT` | Endpoint compatible con S3 | `http://localhost:9000` | N |
| `S3_BUCKET` | Bucket de archivos | `turnos-dev` | N |
| `S3_ACCESS_KEY` | Credencial de almacenamiento | `dev-access-key` | Y |
| `S3_SECRET_KEY` | Secreto de almacenamiento | `dev-secret-key` | Y |
| `WHATSAPP_PHONE_NUMBER_ID` | Identificador del número de WhatsApp | `1234567890` | N |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Cuenta de negocio de Meta | `0987654321` | N |
| `WHATSAPP_ACCESS_TOKEN` | Token de acceso a Graph API | `EAAG...` | Y |
| `WHATSAPP_VERIFY_TOKEN` | Token de verificación del webhook | `change-me` | Y |
| `WHATSAPP_APP_SECRET` | Secreto para validar la firma | `change-me` | Y |
| `MERCADOPAGO_CLIENT_ID` | Identificador de aplicación | `123456` | N |
| `MERCADOPAGO_CLIENT_SECRET` | Secreto de aplicación | `change-me` | Y |
| `MERCADOPAGO_WEBHOOK_SECRET` | Secreto de firma de webhooks | `change-me` | Y |
| `ARCA_ENV` | Entorno de ARCA | `homologacion` | N |
| `ARCA_CERT_PATH` | Ruta al certificado del tenant | `/secrets/arca/demo.crt` | Y |
| `ARCA_KEY_PATH` | Ruta a la clave privada | `/secrets/arca/demo.key` | Y |
| `SMTP_HOST` | Servidor de correo | `smtp.example.com` | N |
| `SMTP_USER` | Usuario de correo | `no-reply@example.com` | Y |
| `SMTP_PASSWORD` | Contraseña de correo | `change-me` | Y |
| `SENTRY_DSN` | DSN de errores | `https://...` | Y |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Endpoint de trazas | `http://localhost:4318` | N |
| `FEATURE_WAITLIST` | Activa la lista de espera | `true` | N |
| `FEATURE_ARCA` | Activa la facturación ARCA | `false` | N |
| `FEATURE_PATIENT_PORTAL` | Activa el portal del paciente | `true` | N |

## Despliegue propuesto

> Propuesta (no decidido). La decisión de región y de proveedor está condicionada por la Ley 25.326, art. 12 (`P0-04`).

| Componente | Propuesta inicial | Alternativa |
|---|---|---|
| API y frontend | Contenedores en un PaaS con región en Sudamérica | VPS con Docker Compose y proxy inverso |
| PostgreSQL | Servicio gestionado con copias automáticas y PITR | PostgreSQL autogestionado con WAL-G |
| Redis | Servicio gestionado | Redis autogestionado con persistencia AOF |
| Archivos | S3 compatible con cifrado y ciclo de vida | Almacenamiento local cifrado (sólo desarrollo) |
| CDN/WAF | CDN con reglas de rate limit y protección DDoS | Proxy inverso con ModSecurity |
| Secretos | *Secret manager* del proveedor | Variables protegidas del orquestador |
| Observabilidad | OpenTelemetry + Sentry + panel de métricas | Logs estructurados a archivo y alertas por correo |

**Consideración de residencia de datos:** si el proveedor no ofrece región en Argentina, se debe evaluar (a) hosting local, (b) región en un país con nivel adecuado de protección y cláusulas contractuales, o (c) consentimiento informado y aviso de transferencia. La decisión no está tomada.

## Estrategia de pruebas

| Nivel | Qué cubre | Herramientas |
|---|---|---|
| Unidad | Reglas de solapamiento, duración, seña, FIFO de lista de espera, cálculo de disponibilidad | Vitest |
| Integración | Repositorios, RLS, restricciones de exclusión, migraciones, webhooks idempotentes | Vitest + Testcontainers + PostgreSQL real |
| Contrato | Esquemas de request/response y adaptadores de WhatsApp, Mercado Pago y ARCA | Zod + dobles de servicio |
| Extremo a extremo | Reserva pública con seña, cancelación con lista de espera, emisión de factura | Playwright o pruebas de API |
| Carga | Cálculo de disponibilidad y creación concurrente de turnos | k6 |
| Seguridad | Aislamiento entre tenants, autorización por rol, rate limit | Suite dedicada |

**Regla de oro:** toda regla `RN-AG-03` y `RN-AG-04` (solapamiento por profesional y por sillón) debe tener pruebas de:
- turno que empieza exactamente al terminar otro (válido),
- solapamiento parcial (rechazado),
- solapamiento total (rechazado),
- dos requests concurrentes por el mismo hueco (sólo uno gana),
- sobreturno autorizado (permitido con advertencia),
- sillón de otra sucursal (rechazado).

## Observabilidad

- **Logs estructurados** en JSON con `request_id`, `tenant_id`, `user_id`, `route`, `status` y latencia; sin datos clínicos ni tokens.
- **Métricas** de negocio: turnos creados, confirmados, cancelados, no-show, ofertas de lista de espera, conversión, mensajes enviados y fallidos, facturas emitidas y contingencia ARCA.
- **Trazas** distribuidas por request, con spans para base de datos, cola y llamadas externas.
- **Alertas:** error rate > 2 % durante 5 minutos, cola de recordatorios con retraso > 10 minutos, ARCA con más de 10 comprobantes en contingencia, fallos de webhook repetidos, intentos de acceso cruzado entre tenants.
- **Paneles:** operación (turnos y ocupación), integraciones (éxito/fallo), cumplimiento (accesos clínicos y exportaciones).

## Riesgos arquitectónicos

| Riesgo | Impacto | Mitigación propuesta |
|---|---|---|
| Dependencia de WhatsApp | El costo o la política de Meta pueden romper el modelo | Adaptador propio, medición de costo, canal alternativo y plantillas aprobadas |
| Dependencia de ARCA | Caídas o vencimiento de certificados bloquean facturación | Contingencia, reintentos idempotentes y alertas de vencimiento |
| Complejidad de obras sociales | Puede retrasar el lanzamiento | v1.0 sólo catálogo y borrador; validación en línea en v2 |
| Aislamiento multi-tenant defectuoso | Fuga de datos sensibles | RLS, pruebas de aislamiento y revisión de consultas |
| Crecimiento de la agenda | Consultas de disponibilidad lentas | Índices por profesional y sillón, caché de catálogo y límites de horizonte |
| Zona horaria y feriados | Turnos mal agendados | UTC en base, zona por tenant y calendario de feriados explícito |
| Migración desde competidores | Alta fricción de adopción | Importadores CSV y periodo de convivencia; alcance a definir (`P1-06`) |
