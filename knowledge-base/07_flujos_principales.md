# Flujos Principales

> **Estado.** Los flujos describen el comportamiento esperado del sistema propuesto. No hay implementación que los respalde todavía; se escriben para que las especificaciones OpenSpec y las pruebas se deriven de ellos. Los nombres de componentes corresponden a `02_descripcion_general.md` y `08_arquitectura_propuesta.md`.

## Flujo 1: Alta autoservicio del consultorio

**Disparador:** el odontólogo titular completa el formulario público de registro.
**Actor:** titular (`owner`).

**Pasos**:
1. El frontend valida los campos y consulta la disponibilidad del `slug`.
2. La API crea el `tenant`, el `user` con contraseña Argon2id, la `membership` con rol `owner` y una `branch` por defecto, en una sola transacción.
3. El dominio aprovisiona la suscripción en estado de prueba (14 días) y registra el evento de alta.
4. El servicio de correo envía la verificación; el usuario queda en estado `pending_verification`.
5. Al verificar el correo, el usuario inicia sesión y el asistente de configuración lo guía a crear el primer sillón, las prestaciones y el horario.
6. Al publicar el link, el consultorio aparece en la reserva pública.

**Diagrama de secuencia**:

```
Titular → PWA → API → PostgreSQL
                    ├── tenant + user + membership + branch
                    ├── subscription(trial)
                    └── audit_event(tenant.created)
          ← 201 Created + token de verificación
Correo ← API (verificación)
Titular → PWA → API → (activa usuario) → asistente de configuración
```

**Casos de error**:
- `slug` ya utilizado → `409 Conflict` con sugerencias alternativas; no se crea nada.
- Correo ya registrado → `409` con opción de recuperar acceso; no se revela si la cuenta pertenece a otro tenant.
- Falla el envío de correo → la cuenta queda creada y se ofrece reenvío; se registra alerta.
- El titular abandona el asistente → puede retomarlo; el link público permanece desactivado hasta publicarlo.

## Flujo 2: Inicio de sesión y contexto de tenant

**Disparador:** un usuario abre la PWA de gestión.
**Actor:** cualquier usuario del consultorio.

**Pasos**:
1. El usuario ingresa correo y contraseña.
2. La API verifica Argon2id, estado del usuario y bloqueo por intentos fallidos.
3. Si el rol lo exige, se solicita el código TOTP y se valida la ventana de 30 segundos.
4. La API emite un token de acceso de 15 minutos y un refresh token rotativo de 30 días.
5. Si el usuario pertenece a más de un tenant, se muestra el selector; el tenant elegido se incluye en el contexto de la sesión.
6. Cada request posterior fija `app.tenant_id` para RLS y verifica permisos con los *guards* de rol.

**Diagrama de secuencia**:

```
Usuario → PWA → API → PostgreSQL
                     ├── verificar credenciales
                     ├── verificar 2FA
                     ├── registrar sesión y refresh
                     └── audit_event(auth.login)
          ← access_token + refresh (HttpOnly) + tenants
PWA → API (request) → guard de rol → set app.tenant_id → consulta RLS
```

**Casos de error**:
- Credenciales inválidas → `401` genérico, sin distinguir correo inexistente de contraseña incorrecta.
- Cinco intentos fallidos → bloqueo de 15 minutos y evento de auditoría.
- Usuario sin 2FA configurado y rol obligado → se fuerza la configuración antes de continuar.
- Usuario desactivado → `403` y revocación inmediata de sesiones.
- Token expirado → el cliente renueva con refresh; si el refresh fue revocado, vuelve al login.

## Flujo 3: Alta de turno en mostrador con prevención de solapamiento

**Disparador:** la recepcionista agenda un turno presencial o telefónico.
**Actor:** recepcionista, administrador o titular.

**Pasos**:
1. La recepcionista busca o crea al paciente y selecciona prestación, profesional, sucursal y fecha.
2. La API calcula la duración efectiva y el margen de limpieza.
3. El servicio de agenda valida: profesional habilitado para la prestación, horario de atención, bloqueos, disponibilidad de sillón y ausencia de solapamiento.
4. El frontend muestra los horarios disponibles; el usuario elige uno.
5. La API abre una transacción, bloquea la fila del profesional y del sillón (`SELECT ... FOR UPDATE`), vuelve a validar y crea el `appointment`.
6. La restricción de exclusión de PostgreSQL confirma la integridad si otra transacción compitió por el mismo hueco.
7. Se registra `appointment_status_history` y `audit_event`.
8. Si la prestación no exige seña, el turno nace `confirmed` y se encola el mensaje de confirmación; si exige seña, nace `pending_deposit`.
9. La agenda se actualiza en la pantalla de la recepcionista.

**Diagrama de secuencia**:

```
Recepción → PWA → API → AgendaService → PostgreSQL
                                   ├── validar reglas
                                   ├── BEGIN
                                   ├── lock profesional/sillón
                                   ├── revalidar solapamiento
                                   ├── INSERT appointment
                                   ├── INSERT history + audit
                                   └── COMMIT (exclusión)
                       → Outbox → BullMQ → WhatsApp
              ← 201 + turno
```

**Casos de error**:
- Profesional ocupado → `409` con el turno en conflicto y opción de elegir otro horario o crear sobreturno.
- Sillón ocupado → `409` con los sillones libres de la sucursal.
- Fuera de horario o bloqueo → `422` con el motivo.
- Profesional no habilitado para la prestación → `422` y sugerencia de profesionales habilitados.
- Colisión concurrente → la base rechaza la segunda inserción; la API devuelve `409` y no deja datos parciales.
- Paciente duplicado → se ofrece fusionar o continuar con el existente.

## Flujo 4: Reserva online con seña

**Disparador:** el paciente abre el link público del consultorio.
**Actor:** paciente.

**Pasos**:
1. El paciente elige sucursal, prestación y profesional; el sistema muestra sólo combinaciones válidas.
2. La API calcula la disponibilidad con anticipación mínima, horizonte máximo, bloqueos y cupo.
3. El paciente elige un horario y completa nombre, teléfono, documento opcional y obra social opcional.
4. Si la prestación exige seña, la API crea un `appointment` en `pending_deposit` con vencimiento a 10 minutos y una preferencia de pago en Mercado Pago.
5. El paciente paga por link o QR; Mercado Pago envía el webhook firmado.
6. La API valida la firma, consulta el estado del pago y, si está aprobado, registra `payment` y `deposit`, y pasa el turno a `confirmed`.
7. Se envía la confirmación por WhatsApp y se muestra la página con los datos del turno, el comprobante y el enlace de cancelación.
8. Un trabajo programado cancela los turnos `pending_deposit` vencidos y libera el horario.

**Diagrama de secuencia**:

```
Paciente → PWA pública → API → PostgreSQL (hold 10 min)
                         └── Mercado Pago (preference)
Paciente → Mercado Pago (pago)
Mercado Pago → API (webhook firmado)
API → Mercado Pago (GET payment) → API → PostgreSQL (payment + deposit + confirmed)
API → Outbox → WhatsApp (confirmación)
API → PWA (página de confirmación)
Job → PostgreSQL (expirar holds vencidos) → Liberar + lista de espera
```

**Casos de error**:
- Pago rechazado → el turno sigue en `pending_deposit` hasta el vencimiento; se informa y se ofrece reintentar.
- Webhook duplicado → idempotencia por `provider_payment_id`; no se duplica el pago.
- Webhook fuera de orden → se consulta el estado actual al proveedor antes de decidir.
- Pago aprobado después del vencimiento → se registra el pago y se ofrece reubicar; no se confirma un turno ya liberado.
- El paciente cierra el navegador antes de pagar → el hold expira y el horario se libera.
- La obra social declarada no es aceptada por el profesional → no se ofrece ese profesional desde el inicio.

## Flujo 5: Recordatorios y confirmación por WhatsApp

**Disparador:** un trabajo programado detecta turnos que cumplen la ventana de recordatorio.
**Actor:** sistema; el paciente responde.

**Pasos**:
1. El trabajador consulta turnos `confirmed` o `pending_deposit` en la ventana de 48 h y 24 h.
2. Verifica opt-in `utility` vigente, plantilla aprobada y que el turno no haya sido confirmado ya.
3. Encola el mensaje en el *outbox* y lo envía por WhatsApp Cloud API con botones “Confirmar” y “Cancelar”.
4. Meta devuelve `wamid`; se registra estado `sent` y costo estimado.
5. El paciente pulsa “Confirmar” → el webhook actualiza `message_log` y el turno queda `confirmed` con evidencia.
6. El paciente pulsa “Cancelar” → el webhook cancela el turno con motivo `patient_whatsapp`, libera el horario y dispara la lista de espera.
7. Los estados `delivered`, `read` y `failed` se actualizan por webhook.

**Diagrama de secuencia**:

```
Job → PostgreSQL (turnos en ventana)
    → verificar opt-in + plantilla
    → Outbox → BullMQ → WhatsApp Cloud API
WhatsApp → API (webhook status) → message_log
Paciente → WhatsApp (botón) → API (webhook) → turno confirmado/cancelado
                                          └── lista de espera (si cancela)
```

**Casos de error**:
- Sin opt-in → no se envía; se registra `skipped` y se muestra alerta a recepción.
- Plantilla rechazada por Meta → se bloquea el envío y se alerta al administrador.
- Número inválido → `failed` con código; se sugiere actualizar el contacto.
- Meta no responde → reintento exponencial; tras tres fallos, se intenta correo y se alerta.
- El paciente responde con texto libre → fuera de la ventana de 24 h no se procesa automáticamente; se deriva a recepción.
- El turno ya fue cancelado → el mensaje se marca `skipped` para no confundir al paciente.

## Flujo 6: Cancelación y oferta automática de lista de espera

**Disparador:** se cancela o reprograma un turno y hay pacientes en espera.
**Actor:** paciente, recepción o profesional.

**Pasos**:
1. La cancelación registra motivo, actor, fecha y aplica la política de seña.
2. El horario se libera y se publica un evento `appointment.released`.
3. El servicio de lista de espera busca entradas `waiting` compatibles por sucursal, prestación, profesional y obra social, en orden de llegada.
4. Toma la primera entrada y crea una `waitlist_offer` con token de un solo uso y vencimiento (15 minutos por defecto).
5. Envía la oferta por WhatsApp con dos botones: “Aceptar” y “Rechazar”.
6. Si el paciente acepta, se crea el turno (o se reserva con seña) y la entrada pasa a `converted`.
7. Si rechaza, no responde o la oferta vence, se marca `expired` y se repite el proceso con la siguiente entrada.
8. El panel muestra la cancelación recuperada y el tiempo de cobertura.

**Diagrama de secuencia**:

```
Cancelación → API → PostgreSQL (turno cancelado + released)
                  → WaitlistService → buscar compatible (FIFO)
                                    → crear offer (token, 15 min)
                                    → Outbox → WhatsApp
Paciente → WhatsApp (aceptar) → API → validar token/vigencia
                                    → crear turno → offer accepted
                                    → entry converted
Job → offer vencida → siguiente entrada
```

**Casos de error**:
- Dos cancelaciones simultáneas → cada una genera su propia oferta; una entrada no recibe dos ofertas.
- El paciente acepta cuando la oferta venció → se rechaza con mensaje y se ofrece la lista nuevamente.
- El horario fue tomado por otro canal mientras la oferta estaba vigente → se bloquea el horario durante la oferta y, si venció, se libera.
- El paciente no tiene opt-in → la oferta no se envía; se muestra en el panel para gestión telefónica.
- La prestación exige seña → la aceptación crea un turno `pending_deposit` con su propio plazo de pago.
- No hay pacientes compatibles → el horario queda publicado en la reserva online y se registra como no cubierto.

## Flujo 7: Atención clínica, odontograma y consentimiento

**Disparador:** el paciente llega al consultorio y la recepción lo marca como presente.
**Actor:** recepcionista (check-in) y odontólogo (atención).

**Pasos**:
1. La recepción busca el turno y ejecuta `check-in`; el estado pasa a `checked_in`.
2. El profesional abre el turno y accede a la historia clínica del paciente; el acceso genera `audit_event(clinical_record.read)`.
3. Si es la primera atención, completa anamnesis, alergias y antecedentes.
4. Registra hallazgos en el odontograma por pieza y superficie; cada cambio queda con autor y fecha.
5. Si corresponde un tratamiento invasivo, genera el consentimiento desde la plantilla vigente y lo firma con el paciente en pantalla.
6. Al finalizar, firma la nota clínica; la nota queda inmutable y se actualiza `last_entry_at` y `retention_until`.
7. El turno pasa a `completed` y se habilita el cobro y la facturación.
8. Si el paciente solicita copia, se genera el PDF y se envía por el portal o correo dentro de las 48 horas.

**Diagrama de secuencia**:

```
Recepción → API (check-in) → PostgreSQL
Profesional → PWA → API (clinical_record.read) → audit_event
           → API (odontogram update) → PostgreSQL
           → API (consent sign) → PostgreSQL + S3
           → API (note sign) → PostgreSQL (immutable)
           → API (complete) → Outbox (cobro/facturación)
```

**Casos de error**:
- El profesional no tiene vínculo con el paciente → `403`; se solicita asignación.
- Se intenta editar una nota firmada → `409`; se ofrece crear addendum.
- Falla el almacenamiento de la firma → no se marca el consentimiento como firmado; se reintenta.
- El paciente es menor y no hay tutor → no se permite firmar el consentimiento.
- Se cierra el turno sin nota → queda “cierre pendiente” y se alerta a las 72 horas.
- Se intenta eliminar un registro clínico → `405`; sólo se admite enmienda.

## Flujo 8: Cobro y facturación ARCA

**Disparador:** el paciente abona una prestación o se cobra un plan de tratamiento.
**Actor:** recepcionista o administrativo de facturación.

**Pasos**:
1. La recepción registra el pago en efectivo, transferencia o Mercado Pago; si es link/QR, se genera la preferencia y se espera el webhook.
2. El pago queda `approved` y se asocia al turno o al plan.
3. El administrativo solicita la factura; el sistema determina tipo de comprobante y punto de venta.
4. El adaptador ARCA obtiene el ticket de acceso (WSAA) con el certificado del tenant; si el ticket está vigente, lo reutiliza.
5. Envía el comprobante a `wsfev1`; ARCA devuelve CAE, vencimiento y número.
6. Se guarda el comprobante con QR y se genera el PDF.
7. El comprobante se envía al paciente y queda disponible en la historia administrativa.
8. Si ARCA está caído, el comprobante queda en `contingency` y un trabajo reintenta; el número no se repite.

**Diagrama de secuencia**:

```
Recepción → API → PostgreSQL (payment approved)
Facturación → API → InvoiceService → ARCA adapter
                                  ├── WSAA (TA 12 h)
                                  ├── wsfev1 (CAE)
                                  └── guardar invoice + QR + PDF
             ← invoice emitida
API → Correo/Portal → Paciente
Job → ARCA (contingencia) → reintento idempotente
```

**Casos de error**:
- Certificado vencido → `arca_status = pending`; se alerta al administrador y no se emite.
- ARCA no responde → contingencia, reintento y aviso; el pago no se pierde.
- Punto de venta inválido → se rechaza antes de llamar a ARCA.
- Pago no aprobado → no se permite emitir.
- Webhook de Mercado Pago duplicado → no se duplica el pago ni la factura.
- Nota de crédito sobre comprobante ya anulado → `409`.

## Flujo 9: Exportación total y baja de cuenta

**Disparador:** el titular solicita una exportación o inicia la baja.
**Actor:** titular; el sistema.

**Pasos**:
1. El titular solicita la exportación desde Configuración y elige alcance y formato.
2. La API crea `export_request` y encola el trabajo; se registra `audit_event(export.requested)`.
3. El trabajador recorre las tablas del tenant, genera JSON/CSV/PDF, calcula checksum y sube el paquete a S3 con cifrado.
4. Se envía un enlace firmado de 7 días; cada descarga se audita.
5. Si el titular inicia la baja, la cuenta pasa a `suspended` y luego a `closed`; el acceso operativo se bloquea.
6. La exportación sigue disponible durante el plazo legal; la historia clínica se conserva 10 años y se puede entregar al paciente.
7. Un trabajo de retención elimina sólo los datos que la ley permite eliminar y deja registro de la eliminación.

**Diagrama de secuencia**:

```
Titular → API → export_request → BullMQ → ExportWorker
                                     ├── leer tablas del tenant
                                     ├── generar paquete + checksum
                                     └── S3 (SSE)
             ← enlace firmado (7 días)
Titular → API (baja) → tenant.suspended → tenant.closed
Job → retención legal → conservar HC / eliminar lo permitido
```

**Casos de error**:
- Exportación en curso y cuenta suspendida → el trabajo continúa; la suspensión no bloquea la portabilidad.
- Paquete demasiado grande → se divide en partes y se notifica.
- Falla el almacenamiento → se reintenta; el solicitante ve `failed` con opción de reintentar.
- Solicitud de supresión de datos clínicos → se rechaza con fundamento legal y se ofrece copia.
- Descarga después del vencimiento → `410 Gone`; se puede solicitar un nuevo paquete.
