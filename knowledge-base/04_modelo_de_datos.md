# Modelo de Datos

> **Estado.** El modelo es una **propuesta (no decidida)** para un SaaS multi-tenant de gestión odontológica. No existe implementación previa. Se deriva de los imprescindibles del MVP (`discovery/discovery.md` §D.3), de las oportunidades de `§C.4` (lista de espera, seña y auditoría), de las reglas de agenda y obras sociales (`§E.7`) y de las restricciones legales (`§E.9`). Los nombres de tablas y campos son orientativos; el esquema definitivo se aprobará con el stack elegido (`P0-03`).

## Convenciones

- Todas las tablas de negocio incluyen `id uuid`, `tenant_id uuid`, `created_at timestamptz`, `updated_at timestamptz` y, cuando corresponde, `deleted_at timestamptz` (baja lógica).
- Las fechas y horas se almacenan en UTC (`timestamptz`); la zona horaria del consultorio se guarda en `tenant.timezone` y se aplica en la presentación.
- Los importes usan `numeric(12,2)` y moneda `ARS` en v1.0; no se usan `float`.
- Los enums se implementan como tipos de PostgreSQL o tablas de catálogo, no como texto libre.
- Las claves foráneas son `ON DELETE RESTRICT` por defecto; las bajas de datos clínicos se resuelven por estado, no por borrado físico.
- Los registros clínicos y de auditoría son **inmutables** una vez firmados o emitidos; las correcciones se agregan como enmienda.

## Dominios

| Dominio | Descripción | Tablas principales |
|---|---|---|
| Plataforma | Cuentas, planes, suscripción y uso | `tenant`, `plan`, `subscription`, `usage_record` |
| Identidad | Usuarios, roles, sesiones e invitaciones | `user`, `membership`, `session`, `invitation` |
| Organización | Sucursales, sillones, horarios y bloqueos | `branch`, `chair`, `working_hours`, `block` |
| Catálogo | Prestaciones, duración, precios y obras sociales | `service`, `professional_service`, `insurance`, `professional_insurance` |
| Pacientes | Datos demográficos, contactos y coberturas | `patient`, `patient_insurance` |
| Agenda | Turnos, estados, sobreturnos y reprogramaciones | `appointment`, `appointment_status_history` |
| Lista de espera | Inscripciones, ofertas y respuestas | `waitlist_entry`, `waitlist_offer` |
| Clínica | Historia clínica, notas, odontograma y planes | `clinical_record`, `clinical_note`, `odontogram`, `tooth_finding`, `treatment_plan`, `treatment_item` |
| Consentimientos | Autorizaciones informadas y evidencia | `consent`, `consent_template` |
| Cobros | Caja, pagos, señas y devoluciones | `cash_session`, `payment`, `deposit`, `refund` |
| Facturación | Comprobantes ARCA y líneas | `invoice`, `invoice_line` |
| Comunicación | Plantillas, opt-in, envíos y costos | `message_template`, `opt_in`, `message_log` |
| Auditoría | Eventos inmutables de acceso y cambio | `audit_event` |
| Exportación | Solicitudes y paquetes de datos | `export_request` |
| Integración | Eventos externos y *outbox* | `webhook_event`, `outbox_event` |

## ERD (Entity Relationship Diagram)

```
plan 1──* subscription *──1 tenant
tenant 1──* branch 1──* chair
tenant 1──* user 1──* membership *──1 tenant
professional *──1 user
professional 1──* working_hours *──1 branch
professional 1──* professional_service *──1 service
professional 1──* professional_insurance *──1 insurance
branch 1──* block

tenant 1──* patient 1──* patient_insurance *──1 insurance
patient 1──1 clinical_record 1──* clinical_note
clinical_record 1──* odontogram 1──* tooth_finding
patient 1──* treatment_plan 1──* treatment_item *──1 service
patient 1──* consent
patient 1──* appointment
patient 1──* waitlist_entry 1──* waitlist_offer

appointment *──1 branch
appointment *──1 chair
appointment *──1 professional
appointment *──1 service
appointment 1──* appointment_status_history
appointment 1──0..1 deposit 1──* payment
appointment 1──0..1 clinical_note

payment 1──0..1 invoice 1──* invoice_line
cash_session 1──* payment

tenant 1──* message_template
tenant 1──* message_log *──1 patient
tenant 1──* audit_event
tenant 1──* export_request
tenant 1──* webhook_event
tenant 1──* outbox_event
```

## Entidades

### `tenant`

Representa la cuenta de un consultorio, clínica o red. Es la raíz del aislamiento multi-tenant.

- **Atributos:** `id uuid`, `slug text` (único, URL pública), `legal_name text`, `commercial_name text`, `cuit char(11)`, `timezone text` (por defecto `America/Argentina/Buenos_Aires`), `currency char(3)` (`ARS`), `status enum(active, suspended, closed)`, `settings jsonb`, `data_controller_role enum(tenant, platform, joint)`, `created_at`, `updated_at`.
- **Relaciones:** 1─* `branch`, `user`, `patient`, `service`, `insurance`, `audit_event`; 1─1 `subscription`.
- **Constraints:** `slug` único y en minúsculas; `cuit` válido cuando está presente; `status = closed` no elimina datos clínicos.
- **Índices:** `uq_tenant_slug`.

### `branch`

Sucursal física del consultorio.

- **Atributos:** `id`, `tenant_id`, `name`, `address text`, `phone text`, `timezone text`, `active boolean`.
- **Relaciones:** 1─* `chair`, `working_hours`, `block`, `appointment`.
- **Constraints:** nombre único por tenant; no se puede desactivar una sucursal con turnos futuros sin reprogramarlos.

### `chair`

Sillón o box. **Entidad de primera clase** para la prevención de solapamientos.

- **Atributos:** `id`, `tenant_id`, `branch_id`, `name` (por ejemplo, “Sillón 1”), `room text`, `status enum(active, maintenance, inactive)`, `notes`.
- **Relaciones:** 1─* `appointment`, `block`.
- **Constraints:** nombre único por sucursal; un sillón en `maintenance` no recibe turnos nuevos, pero conserva los existentes.
- **Índices:** `(tenant_id, branch_id, status)`.

### `professional`

Perfil clínico asociado a un usuario.

- **Atributos:** `id`, `tenant_id`, `user_id`, `license_number text` (matrícula), `specialties text[]`, `color char(7)`, `default_branch_id`, `accepts_new_patients boolean`, `active boolean`.
- **Relaciones:** *─1 `user`; 1─* `working_hours`, `professional_service`, `professional_insurance`, `appointment`, `clinical_note`.
- **Constraints:** matrícula única por tenant; un profesional inactivo no aparece en la reserva pública ni recibe turnos nuevos.

### `service` (prestación)

Ítem del catálogo que se agenda y se cobra.

- **Atributos:** `id`, `tenant_id`, `code text` (código interno o de nomenclador), `name`, `description`, `duration_min integer` (5–480), `buffer_min integer` (0–60), `price numeric(12,2)`, `deposit_required boolean`, `deposit_type enum(none, fixed, percentage)`, `deposit_value numeric(12,2)`, `specialty text`, `requires_authorization boolean`, `active boolean`.
- **Relaciones:** 1─* `professional_service`, `appointment`, `treatment_item`, `invoice_line`.
- **Constraints:** `duration_min > 0`; `deposit_value >= 0`; si `deposit_type = percentage`, `0 <= deposit_value <= 100`; código único por tenant.
- **Índices:** `(tenant_id, active)`, `uq_service_code`.

### `professional_service`

Habilitación y ajustes de una prestación por profesional.

- **Atributos:** `id`, `tenant_id`, `professional_id`, `service_id`, `duration_override_min integer`, `price_override numeric(12,2)`, `active boolean`.
- **Constraints:** único `(professional_id, service_id)`; la duración efectiva es `COALESCE(duration_override_min, service.duration_min)`.

### `insurance` (obra social o prepaga)

Catálogo de coberturas **configurado por el consultorio**. No se distribuye un nomenclador oficial en v1.0.

- **Atributos:** `id`, `tenant_id`, `name`, `code text`, `type enum(os, prepaga, particular, convenio)`, `active boolean`.
- **Relaciones:** 1─* `patient_insurance`, `professional_insurance`, `appointment` (cobertura declarada).
- **Constraints:** nombre único por tenant.

### `professional_insurance`

Obras sociales que acepta cada profesional. Materializa la regla `RN-OS-01`.

- **Atributos:** `id`, `tenant_id`, `professional_id`, `insurance_id`, `copay numeric(12,2)`, `notes`.
- **Constraints:** único `(professional_id, insurance_id)`. **La cobertura se define por profesional, no por clínica.**

### `patient`

Persona atendida. Los datos de prueba deben ser ficticios.

- **Atributos:** `id`, `tenant_id`, `first_name`, `last_name`, `doc_type enum(DNI, CUIL, PASSPORT, OTHER)`, `doc_number`, `birth_date date`, `phone_e164 text`, `email citext`, `address text`, `guardian_name text`, `guardian_phone text`, `notes text` (no clínicas), `status enum(active, inactive, merged)`, `merged_into_id uuid`, `created_at`.
- **Relaciones:** 1─* `patient_insurance`, `appointment`, `clinical_record`, `treatment_plan`, `consent`, `payment`, `waitlist_entry`.
- **Constraints:** único `(tenant_id, doc_type, doc_number)` cuando `doc_number` no es nulo; `phone_e164` en formato E.164; no se permite borrado físico si existe historia clínica.
- **Índices:** `(tenant_id, last_name, first_name)`, `(tenant_id, phone_e164)`, `(tenant_id, doc_number)`.

### `appointment`

Turno. Es el agregado central de la agenda.

- **Atributos:** `id`, `tenant_id`, `branch_id`, `chair_id`, `professional_id`, `patient_id`, `service_id`, `insurance_id` (opcional), `starts_at timestamptz`, `ends_at timestamptz`, `status enum(pending_deposit, confirmed, checked_in, in_progress, completed, cancelled_by_patient, cancelled_by_clinic, no_show, rescheduled)`, `source enum(reception, public_link, whatsapp, api, migration)`, `is_overbook boolean`, `overbook_reason text`, `deposit_id uuid`, `cancellation_reason text`, `cancelled_at`, `created_by uuid`, `notes text` (no clínicas).
- **Relaciones:** *─1 `branch`, `chair`, `professional`, `patient`, `service`; 1─* `appointment_status_history`; 1─0..1 `deposit`, `clinical_note`; 1─0..1 `invoice` vía pago.
- **Constraints:**
  - `ends_at > starts_at`.
  - `ends_at - starts_at` coherente con la duración efectiva de la prestación, salvo sobreturno justificado.
  - **Exclusión por profesional:** no puede haber dos turnos activos solapados para el mismo `professional_id`.
  - **Exclusión por sillón:** no puede haber dos turnos activos solapados para el mismo `chair_id`.
  - Estados que ocupan agenda: `pending_deposit`, `confirmed`, `checked_in`, `in_progress`. Los sobreturnos (`is_overbook = true`) quedan exentos de la exclusión y se controlan con `RN-AG-09`.
  - Un turno `completed` no puede volver a `confirmed`; se crea uno nuevo.
- **Índices:** `(tenant_id, starts_at)`, `(professional_id, starts_at)`, `(chair_id, starts_at)`, `(patient_id, starts_at)`, `(tenant_id, status)`.
- **Restricción de exclusión propuesta:**

```sql
ALTER TABLE appointment
  ADD CONSTRAINT ex_appointment_professional
  EXCLUDE USING gist (
    professional_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  )
  WHERE (status IN ('pending_deposit','confirmed','checked_in','in_progress')
         AND is_overbook = false);

ALTER TABLE appointment
  ADD CONSTRAINT ex_appointment_chair
  EXCLUDE USING gist (
    chair_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  )
  WHERE (status IN ('pending_deposit','confirmed','checked_in','in_progress')
         AND is_overbook = false);

CREATE UNIQUE INDEX uq_appointment_overbook_slot
  ON appointment (professional_id, starts_at)
  WHERE is_overbook = true
    AND status IN ('pending_deposit','confirmed','checked_in','in_progress');
```

> La restricción de exclusión requiere la extensión `btree_gist`. El solapamiento se valida también en el servicio de dominio para devolver un error de negocio legible antes de llegar a la base. Los sobreturnos quedan excluidos de la restricción y limitados por el índice único a uno por profesional y horario de inicio.

### `appointment_status_history`

Bitácora de cambios de estado.

- **Atributos:** `id`, `tenant_id`, `appointment_id`, `from_status`, `to_status`, `reason text`, `actor_user_id`, `created_at`.
- **Constraints:** sólo inserción; no se actualiza ni se elimina.

### `waitlist_entry`

Paciente en espera de un hueco.

- **Atributos:** `id`, `tenant_id`, `patient_id`, `branch_id`, `professional_id` (opcional), `service_id` (opcional), `preferred_from timestamptz`, `preferred_to timestamptz`, `priority integer` (orden de llegada), `status enum(waiting, offered, accepted, expired, converted, withdrawn)`, `notes`, `created_at`.
- **Relaciones:** 1─* `waitlist_offer`.
- **Constraints:** un paciente no puede tener dos entradas `waiting` para la misma prestación y sucursal; `priority` se asigna por `created_at` (FIFO) salvo prioridad clínica justificada y auditada.

### `waitlist_offer`

Oferta de un hueco concreto a una entrada de lista de espera.

- **Atributos:** `id`, `tenant_id`, `waitlist_entry_id`, `appointment_id` (turno liberado), `token_hash text`, `offered_at`, `expires_at`, `status enum(pending, accepted, declined, expired, superseded)`, `responded_at`.
- **Constraints:** una sola oferta `pending` por entrada; `expires_at = offered_at + ventana configurada`; token de un solo uso almacenado como hash.
- **Índices:** `(tenant_id, status, expires_at)`.

### `clinical_record`

Historia clínica del paciente en el establecimiento. Única por paciente y tenant.

- **Atributos:** `id`, `tenant_id`, `patient_id`, `blood_type text`, `allergies text[]`, `antecedents jsonb`, `current_medication text`, `summary text`, `opened_at`, `last_entry_at`, `retention_until date` (por defecto, último registro + 10 años).
- **Relaciones:** 1─* `clinical_note`, `odontogram`, `treatment_plan`, `consent`.
- **Constraints:** único `(tenant_id, patient_id)`; no se elimina; `retention_until` se recalcula con cada nota firmada.

### `clinical_note`

Nota de evolución o atención.

- **Atributos:** `id`, `tenant_id`, `clinical_record_id`, `appointment_id` (opcional), `author_professional_id`, `note_type enum(evolution, anamnesis, procedure, prescription_note, addendum)`, `content text`, `diagnosis_codes text[]` (CIE-10, opcional), `signed_at timestamptz`, `signature_hash text`, `amends_note_id uuid`.
- **Constraints:** una nota firmada es inmutable; las correcciones se registran como `addendum` con referencia a la nota original; `author_professional_id` debe tener rol clínico activo.
- **Índices:** `(clinical_record_id, signed_at DESC)`.

### `odontogram` y `tooth_finding`

Representación del odontograma FDI con historial.

- **`odontogram`:** `id`, `tenant_id`, `clinical_record_id`, `version integer`, `created_by`, `created_at`, `notes`.
- **`tooth_finding`:** `id`, `tenant_id`, `odontogram_id`, `tooth_code char(2)` (FDI: 11–48 y 51–85), `surface enum(O, M, D, V, L, P, whole)`, `condition enum(healthy, caries, filled, missing, crown, endodontic, implant, prosthesis, sealant, fracture, other)`, `severity enum(none, initial, moderate, advanced)`, `notes`, `recorded_by`, `recorded_at`.
- **Constraints:** `tooth_code` válido según dentición permanente o temporaria; único `(odontogram_id, tooth_code, surface)` para el estado vigente; el historial se conserva por versiones sucesivas del odontograma.
- **Índices:** `(odontogram_id, tooth_code)`.

### `treatment_plan` y `treatment_item`

Presupuesto y plan de tratamiento.

- **`treatment_plan`:** `id`, `tenant_id`, `patient_id`, `professional_id`, `title`, `status enum(draft, presented, accepted, rejected, in_progress, completed, abandoned)`, `total_amount numeric(12,2)`, `valid_until date`, `accepted_at`, `acceptance_evidence jsonb`.
- **`treatment_item`:** `id`, `tenant_id`, `treatment_plan_id`, `service_id`, `tooth_code`, `surface`, `quantity integer`, `unit_price numeric(12,2)`, `status enum(pending, scheduled, done, cancelled)`, `appointment_id`.
- **Constraints:** `quantity > 0`; el total se recalcula desde los ítems; un plan aceptado no se edita, se versiona.

### `consent`

Consentimiento informado con evidencia.

- **Atributos:** `id`, `tenant_id`, `patient_id`, `template_id`, `template_version`, `consent_type enum(informed, data_processing, image_use, treatment)`, `status enum(pending, signed, revoked, expired)`, `signed_at`, `signer_name`, `signer_doc`, `signature_method enum(simple_electronic, digital)`, `evidence_hash`, `ip_address inet`, `user_agent text`, `document_url`, `revoked_at`.
- **Constraints:** un consentimiento firmado es inmutable; la revocación se registra como nuevo evento, no borra el original.

### `cash_session`

Apertura y cierre de caja por usuario y sucursal.

- **Atributos:** `id`, `tenant_id`, `branch_id`, `opened_by`, `opened_at`, `closed_by`, `closed_at`, `opening_amount`, `closing_amount`, `expected_amount`, `difference`, `status enum(open, closed)`.
- **Constraints:** una sola sesión abierta por usuario y sucursal.

### `payment`

Movimiento de cobro.

- **Atributos:** `id`, `tenant_id`, `patient_id`, `appointment_id` (opcional), `treatment_plan_id` (opcional), `cash_session_id` (opcional), `amount numeric(12,2)`, `currency char(3)`, `method enum(cash, transfer, debit, credit, mercadopago_link, mercadopago_qr, other)`, `status enum(pending, approved, rejected, refunded, partially_refunded, cancelled)`, `external_reference text`, `provider_payment_id text`, `idempotency_key text`, `paid_at`, `created_by`.
- **Constraints:** `amount > 0`; `idempotency_key` único por tenant; `external_reference` único cuando existe; no se elimina un pago aprobado, se reembolsa.
- **Índices:** `(tenant_id, paid_at)`, `(tenant_id, status)`.

### `deposit`

Seña asociada a un turno.

- **Atributos:** `id`, `tenant_id`, `appointment_id`, `amount`, `status enum(pending, paid, applied, refunded, retained, expired)`, `expires_at`, `payment_id`, `refund_policy enum(full, partial, none)`, `retained_amount`.
- **Constraints:** único `(appointment_id)` para señas activas; si `expires_at` vence sin pago, el turno pasa a `cancelled_by_clinic` y se libera el hueco.

### `invoice` y `invoice_line`

Comprobante fiscal emitido contra ARCA.

- **`invoice`:** `id`, `tenant_id`, `patient_id`, `payment_id`, `point_of_sale integer`, `invoice_type enum(A, B, C, credit_note_B, credit_note_C)`, `number integer`, `issue_date date`, `receiver_doc_type`, `receiver_doc_number`, `receiver_name`, `net_amount`, `vat_amount`, `total_amount`, `currency`, `cae text`, `cae_expires_at date`, `arca_status enum(pending, issued, rejected, contingency)`, `qr_payload text`, `pdf_url text`.
- **`invoice_line`:** `id`, `invoice_id`, `description`, `quantity`, `unit_price`, `vat_rate`, `total`.
- **Constraints:** único `(tenant_id, point_of_sale, invoice_type, number)`; el número se asigna en secuencia autorizada por ARCA; un comprobante emitido no se edita, se anula con nota de crédito.

### `message_template`

Plantilla de WhatsApp aprobada.

- **Atributos:** `id`, `tenant_id`, `name`, `category enum(utility, marketing, authentication)`, `language`, `body text`, `variables jsonb`, `meta_template_id`, `status enum(draft, pending, approved, rejected, paused)`, `last_synced_at`.

### `opt_in`

Autorización del paciente para recibir mensajes.

- **Atributos:** `id`, `tenant_id`, `patient_id`, `phone_e164`, `category enum(utility, marketing)`, `source enum(reception, public_link, whatsapp_reply, import)`, `granted_at`, `revoked_at`, `evidence jsonb`.
- **Constraints:** único `(tenant_id, patient_id, phone_e164, category)` vigente; sin opt-in `utility` no se envía recordatorio.

### `message_log`

Registro de cada envío.

- **Atributos:** `id`, `tenant_id`, `patient_id`, `appointment_id` (opcional), `waitlist_offer_id` (opcional), `template_id`, `channel enum(whatsapp, email, sms)`, `to_phone`, `status enum(queued, sent, delivered, read, failed, skipped)`, `provider_message_id`, `error_code`, `cost_amount numeric(10,4)`, `cost_currency`, `sent_at`, `payload_summary jsonb` (sin datos clínicos).
- **Constraints:** `provider_message_id` único cuando existe; no se almacena contenido clínico.

### `audit_event`

Registro inmutable de accesos y cambios.

- **Atributos:** `id bigserial`, `tenant_id`, `actor_user_id`, `actor_role`, `action text` (por ejemplo, `clinical_record.read`), `resource_type`, `resource_id`, `before_hash`, `after_hash`, `ip_address inet`, `user_agent text`, `request_id`, `occurred_at`.
- **Constraints:** sólo inserción; permisos de base revocan `UPDATE` y `DELETE`; retención mínima 10 años.
- **Índices:** `(tenant_id, occurred_at DESC)`, `(tenant_id, resource_type, resource_id)`, `(actor_user_id, occurred_at)`.

### `export_request`

Solicitud de exportación total o de historia clínica.

- **Atributos:** `id`, `tenant_id`, `requested_by`, `scope enum(tenant_full, patient_clinical_record)`, `patient_id` (opcional), `format enum(json, csv, pdf)`, `status enum(queued, processing, ready, expired, failed)`, `file_url`, `checksum`, `expires_at`, `created_at`.
- **Constraints:** el archivo se elimina a los 7 días; el evento de descarga se audita.

### `webhook_event` y `outbox_event`

Soporte de integraciones confiables.

- **`webhook_event`:** `id`, `provider enum(whatsapp, mercadopago, arca)`, `external_id`, `payload jsonb`, `signature_valid boolean`, `processed_at`, `attempts`, `status`.
- **`outbox_event`:** `id`, `tenant_id`, `aggregate_type`, `aggregate_id`, `event_type`, `payload jsonb`, `available_at`, `processed_at`, `attempts`, `last_error`.
- **Constraints:** `webhook_event (provider, external_id)` único; el *outbox* se publica al menos una vez y los consumidores son idempotentes.

## Reglas transversales del modelo

1. **Aislamiento:** toda consulta de negocio filtra por `tenant_id`; RLS lo impone a nivel de base. Un `tenant_id` ausente en una consulta es un error de programación, no un caso válido.
2. **Integridad temporal:** los rangos de turno usan `[inicio, fin)`; un turno que termina a las 10:00 y otro que empieza a las 10:00 no se solapan.
3. **Concurrencia:** la creación y reprogramación usan transacción con bloqueo por profesional y sillón, más la restricción de exclusión como red de seguridad.
4. **Historia clínica:** no se borra; se versiona y se conserva 10 años desde el último registro. Las notas firmadas son inmutables.
5. **Auditoría:** toda lectura de historia clínica, exportación y acceso de soporte genera `audit_event`.
6. **Minimización:** `message_log` y `outbox_event` no contienen diagnósticos, notas ni imágenes; sólo identificadores y datos de contacto estrictamente necesarios.
7. **Bajas:** el cierre de cuenta suspende el acceso, pero conserva los datos clínicos por el plazo legal y permite la exportación.

## Seed data inicial

> **Propuesta.** Los datos de ejemplo son **ficticios** y no corresponden a personas reales. La cátedra exige no usar datos reales de pacientes en ejemplos, pruebas ni capturas.

| Entidad | Datos mínimos |
|---|---|
| `plan` | `starter` (1 profesional, 1 sucursal), `clinic` (hasta 5 profesionales, 3 sucursales) |
| `tenant` | `consultorio-demo` — “Consultorio Odontológico Demo”, CUIT ficticio, zona `America/Argentina/Buenos_Aires` |
| `branch` | “Sede Centro” (dirección ficticia) |
| `chair` | “Sillón 1”, “Sillón 2”, “Sillón 3” |
| `user` | titular demo, recepcionista demo, profesional demo |
| `professional` | “Dra. Demo Uno” (odontología general), “Dr. Demo Dos” (endodoncia) |
| `service` | Consulta (30 min), Limpieza (45), Obturación (45), Endodoncia (90), Extracción (60), Corona (60), Control (15), Urgencia (30) |
| `insurance` | “Obra Social Demo A”, “Prepaga Demo B”, “Particular” |
| `patient` | 20 pacientes ficticios con DNI de prueba, teléfonos y correos de ejemplo |
| `appointment` | Turnos de ejemplo en estados `confirmed`, `completed`, `no_show`, `cancelled_by_patient` |
| `waitlist_entry` | 3 pacientes en espera para “Consulta” y “Endodoncia” |

**Datos que nunca deben sembrarse:** documentos reales, teléfonos reales, historias clínicas reales, credenciales de ARCA o Mercado Pago y certificados productivos. Las pruebas de integración usan dobles de servicio o entornos de prueba.
