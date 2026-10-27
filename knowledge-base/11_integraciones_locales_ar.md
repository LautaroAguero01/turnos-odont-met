# Integraciones Locales: WhatsApp, Pagos, ARCA y Obras Sociales

> **Estado.** Documento complementario al modelo de datos y a la arquitectura. Describe las integraciones que hacen específico al mercado argentino y que el discovery identifica como frentes de competencia (`discovery.md` §1, §C.2 y §E.8). **Todas las decisiones de implementación son propuestas (no decididas)**; los datos de terceros conservan la etiqueta de evidencia del informe.

## 1. WhatsApp Cloud API (Meta)

### Por qué es crítico

El recordatorio por WhatsApp es un commodity desde 2020, pero la automatización de punta a punta —confirmación, recontacto, recuperación y lista de espera— es uno de los cuatro frentes de competencia reales. Los competidores relevados usan WhatsApp, pero con profundidad dispar: DentalSoft y Bilog ofrecen recordatorios `[verified]`; DentalCore y Órbita usan la API oficial `[verified]`; Odonto.ar no evidencia motor de recordatorios `[no evid.]`.

### Diseño propuesto

| Aspecto | Propuesta |
|---|---|
| Proveedor | WhatsApp Cloud API oficial de Meta, con número verificado por consultorio o por plataforma, según el modelo de alta |
| Categoría | `utility` para recordatorios, confirmaciones, cancelaciones y ofertas; `marketing` sólo con opt-in específico |
| Plantillas | Aprobadas por Meta, versionadas y sincronizadas; variables mínimas: nombre, fecha, hora, profesional, sucursal |
| Opt-in | Registro explícito por número y categoría; revocación inmediata |
| Ventana | Fuera de las 24 horas posteriores al último mensaje del paciente sólo se usan plantillas aprobadas |
| Botones | “Confirmar” y “Cancelar” en recordatorios; “Aceptar” y “Rechazar” en ofertas de lista de espera |
| Datos | Prohibido incluir diagnóstico, tratamiento, pieza dental, imágenes o cualquier dato clínico |
| Envío | Trabajador con *outbox*, reintentos exponenciales e idempotencia por `provider_message_id` |
| Costo | Se registra por mensaje; el precio de referencia del relevamiento es USD 0,0260 por mensaje `utility` |
| Alternativa | Correo o llamada registrada cuando el mensaje crítico falla |

### Flujo técnico

```
Evento de dominio → outbox_event → trabajador → Graph API /messages
                                           ← wamid
                        message_log(status=sent, costo estimado)
Meta → webhook (statuses) → validar firma → message_log(delivered/read/failed)
Paciente → botón → webhook (messages) → acción de dominio (confirmar/cancelar/aceptar)
```

### Reglas de implementación

- La firma `X-Hub-Signature-256` se valida con el `app_secret`; un evento sin firma válida se descarta y se audita.
- El webhook responde `200` rápido y procesa de forma asíncrona; Meta reintenta si no recibe respuesta.
- Un mensaje no se envía si el opt-in está revocado, si la plantilla no está aprobada o si el turno ya no está en un estado que lo justifique.
- El contenido de la plantilla se revisa contra una lista de prohibiciones (diagnóstico, tratamiento, imágenes, datos de salud).
- El costo se imputa al tenant y se muestra en el panel; si el plan tiene límite, se alerta antes de agotarlo.
- Los números se normalizan a E.164 y se validan antes de guardar.

### Riesgos

| Riesgo | Mitigación |
|---|---|
| Cambio de precio o política de Meta | Medición de costo, plantillas reutilizables y canal alternativo |
| Rechazo de plantillas | Revisión previa y versionado; plantillas de respaldo |
| Bloqueo del número | Uso de la API oficial, opt-in y límites de frecuencia |
| Fuga de datos clínicos | Validación de contenido y prohibición explícita en el código y en las plantillas |

## 2. Mercado Pago

### Por qué es crítico

La seña al reservar con liberación automática del turno es uno de los vacíos del mercado (`C.3`, vacío 7). Sólo DentalSoft lo insinúa; Órbita tiene link de pago `[verified]`; DentalCore usa Mercado Pago `[verified]`; Bilog y Odonto.ar no lo evidencian `[no evid.]`.

### Diseño propuesto

| Aspecto | Propuesta |
|---|---|
| Producto | Checkout API o preferencias de pago con link y QR |
| Cuenta | Cada consultorio conecta su propia cuenta; la plataforma no custodia fondos |
| Uso | Seña al reservar, cobro de prestaciones y cobro de planes de tratamiento |
| Referencia | `external_reference` única por operación (tenant + tipo + id) |
| Webhook | Validación de firma, consulta del estado al emisor y procesamiento idempotente |
| Reembolsos | Por el mismo medio; movimiento separado y auditado |
| Conciliación | Comparación diaria entre pagos del proveedor y registros internos |
| Split | No evidenciado en el relevamiento; se posterga y se evalúa antes de implementar |

### Flujo técnico

```
API → crear preferencia (monto, concepto, external_reference, back_urls)
     ← init_point / qr
Paciente → paga en Mercado Pago
Mercado Pago → webhook → validar firma → GET /v1/payments/{id}
                        → payment(status=approved) + deposit
                        → appointment confirmed
                        → outbox: WhatsApp de confirmación
```

### Reglas de implementación

- Nunca se confirma un turno por la redirección del navegador: la fuente de verdad es el webhook más la consulta de estado.
- Un pago aprobado no se elimina; se reembolsa total o parcialmente con un movimiento nuevo.
- Si el webhook llega antes de que la transacción local esté confirmada, se guarda el evento y se procesa cuando el turno existe.
- Si el pago llega después del vencimiento del hold, se registra y se ofrece reubicar; no se confirma un turno liberado.
- Los reembolsos respetan la política de seña (`RN-SE-04`).
- Las credenciales son por tenant y se almacenan cifradas; el token de la plataforma no se usa para cobrar a los pacientes.

## 3. ARCA (ex AFIP)

### Por qué es crítico

La facturación electrónica integrada al cobro es un diferenciador real: DentalCore y DentalTec la evidencian `[verified]`; Bilog incorporó factura electrónica sólo para Argentina en la versión 7.6.0 `[verified]`; DentalSoft, Odonto.ar, Odonthia y Órbita no la evidencian `[no evid.]`.

### Diseño propuesto

| Aspecto | Propuesta |
|---|---|
| Servicios | WSAA para autenticación; `wsfev1` para factura electrónica; `wsmtxca` cuando el régimen lo requiera |
| Certificado | Por tenant; clave privada cifrada; renovación alertada antes del vencimiento |
| Ticket de acceso | `TA` con vigencia de 12 horas; caché por tenant y servicio |
| Comprobantes | Factura B y C; nota de crédito para anulación |
| Datos | Punto de venta, tipo, número, CAE, vencimiento del CAE, QR fiscal |
| Contingencia | Estado `contingency`, reintento idempotente y alerta al administrador |
| Numeración | Correlativa por punto de venta y tipo; consulta del último número autorizado |
| Obligación | RG 5866: incorporación por etapas; desde el 1/10/2026 alcanza a instituciones médicas privadas y profesionales |

### Flujo técnico

```
Facturación → API → InvoiceService
                 ├── verificar pago aprobado
                 ├── obtener TA (WSAA; cache 12 h)
                 ├── reservar número (transacción)
                 ├── wsfev1 → CAE
                 ├── guardar invoice + QR + PDF
                 └── outbox: correo al paciente
Si ARCA falla → invoice(contingency) → job de reintento → CAE
```

### Reglas de implementación

- No se emite un comprobante sin pago aprobado o prestación realizada (`RN-FA-01`).
- El número se reserva en una transacción y se confirma con el CAE; si la llamada falla, se libera la reserva o se conserva para el reintento, sin duplicar.
- Un comprobante emitido no se edita: se anula con nota de crédito.
- El PDF no incluye diagnóstico ni detalle clínico.
- Los certificados y las claves nunca se guardan en el repositorio ni en texto plano.
- El entorno de homologación se usa para pruebas; producción requiere certificado y punto de venta reales.
- Si el certificado vence, se bloquea la emisión y se alerta con antelación.

### Riesgos

| Riesgo | Mitigación |
|---|---|
| Caída de ARCA | Contingencia, reintentos y comunicación al consultorio |
| Vencimiento de TA o certificado | Alerta previa, renovación asistida y bloqueo controlado |
| Duplicación de números | Reserva transaccional y clave de idempotencia |
| Error de datos fiscales | Validación previa y edición sólo antes de emitir |

## 4. Obras sociales y prepagas

### Estado en el mercado

La validación en línea contra obras sociales es el foso de DentalTec: más de 15 obras sociales, topes, frecuencias y autorizaciones `[verified]`, con una barrera estimada de 12 a 24 meses (`C.2`). Dentalink liquida obras sociales argentinas con arancel y copago `[verified]`. Odonto.ar calcula obra social y paciente, pero no evidencia liquidación `[no evid.]`. Odonthia no liquida, no valida en línea y no trae nomencladores `[verified]`.

### Alcance propuesto

| Etapa | Alcance |
|---|---|
| v1.0 | Catálogo manual de obras sociales, cobertura por paciente, aceptación por profesional, copago informado y **borrador exportable** de liquidación |
| v1.1 | Mejoras del borrador, plantillas por obra social y conciliación de copagos |
| v2 | Validación en línea y liquidación definitiva por convenio (SOAP por obra social) |

### Modelo mínimo

- `insurance`: obra social o prepaga configurada por el consultorio.
- `professional_insurance`: aceptación por profesional y copago.
- `patient_insurance`: obra social, plan y número de afiliado del paciente.
- `appointment.insurance_id`: cobertura declarada al momento del turno.
- `treatment_item`: prestación, pieza y precio; el borrador agrupa por obra social y profesional.

### Reglas

- La cobertura se define por profesional, no por clínica (`RN-OS-01`).
- Sin número de afiliado no se puede liquidar (`RN-OS-02`).
- El copago es una estimación configurada, no una validación en línea (`RN-OS-03`).
- El borrador se rotula “no presentado” y no reemplaza la presentación oficial (`RN-OS-05`).
- Los datos de afiliación se tratan como sensibles y no se comparten con terceros ajenos a la prestación (`RN-OS-07`).

### Riesgos

- **Prometer en v1.0 lo que es v2:** retrasa el lanzamiento y genera expectativas incumplidas.
- **Catálogo manual inviable:** si el consultorio no puede cargar sus códigos, el borrador no se usa.
- **Cambios de nomenclador:** el modelo debe permitir versiones y vigencias, no códigos rígidos.

## 5. Google Calendar

### Propuesta

- Sincronización por profesional mediante OAuth 2.0.
- Se exportan únicamente eventos de turno: fecha, hora, sucursal y profesional; **sin datos clínicos**.
- La fuente de verdad es la agenda del producto; Google Calendar es una vista.
- Los cambios de horario se reflejan por actualización o cancelación del evento.
- Si el token se revoca, se alerta al profesional y se detiene la sincronización sin afectar la agenda interna.
- La integración es opcional y se puede desactivar por profesional.

**Estado:** propuesta; el discovery no evidencia que los competidores argentinos la ofrezcan de forma generalizada (`[no evid.]` en DentalSoft, Bilog, Odonto.ar y Odonthia; DentalSoft la menciona en su descripción `[verified]`). Se prioriza por debajo de WhatsApp y ARCA.

## 6. Correo transaccional

- Invitaciones, verificación de cuenta, copia de historia clínica, exportaciones y alertas operativas.
- Enlaces firmados con vencimiento; nunca se envía historia clínica completa en el cuerpo del correo.
- Se registra el envío y el rebote; si falla, se reintenta y se alerta.
- El remitente y el dominio se configuran con SPF, DKIM y DMARC.

## 7. Matriz normativa

| Norma | Qué exige | Impacto en el producto |
|---|---|---|
| Ley 25.326 | Protección de datos personales; datos sensibles; consentimiento; seguridad; transferencia internacional; registro ante AAIP | Consentimiento, minimización, RBAC, auditoría, cifrado, aviso de transferencia y registro |
| Ley 26.529 | Historia clínica: conservación 10 años, integridad, copia al paciente en 48 h | Modelo inmutable, retención y flujo de copia |
| Decreto 345/2024 y Resolución 1959/2024 | Receta electrónica y ReNaPDiS | Decisión de alcance (`P0-01`); no se emiten recetas en v1.0 |
| RG 5866 de ARCA | Incorporación de obligados a la facturación electrónica por etapas | Facturación B/C, CAE y QR; contingencia |
| Política de WhatsApp Business | Opt-in, plantillas aprobadas, prohibición de datos clínicos y telemedicina | Plantillas `utility`, validación de contenido y canal alternativo |
| Ley 25.506 | Firma electrónica y digital | Firma electrónica simple con evidencia en v1.0; digital certificada después |

## 8. Matriz de fallos de integración

| Integración | Fallo | Efecto | Respuesta |
|---|---|---|---|
| WhatsApp | API caída o error 5xx | No se envía el recordatorio | Reintento exponencial, alerta y canal alternativo |
| WhatsApp | Plantilla rechazada | No se puede enviar esa categoría | Bloqueo, alerta y plantilla de respaldo |
| Mercado Pago | Webhook no llega | El turno queda pendiente | Consulta periódica de estado y conciliación |
| Mercado Pago | Pago duplicado | Riesgo de doble cobro | Idempotencia por `provider_payment_id` |
| ARCA | TA vencido | No se emite el comprobante | Renovación automática y bloqueo controlado |
| ARCA | Servicio caído | Factura pendiente | Contingencia y reintento sin duplicar número |
| Obras sociales | Validación no disponible (v2) | No se confirma la prestación | Registro manual y borrador |
| Google Calendar | Token revocado | No se sincroniza | Alerta y reintento de vinculación |

## 9. Entornos de prueba

| Proveedor | Entorno | Qué se prueba |
|---|---|---|
| WhatsApp | Número de prueba de Meta | Plantillas, webhooks y estados |
| Mercado Pago | Credenciales de prueba y usuarios de test | Preferencias, pagos aprobados/rechazados y reembolsos |
| ARCA | Homologación | WSAA, CAE, contingencia y numeración |
| Google Calendar | Cuenta de prueba | OAuth, creación y cancelación de eventos |

**Regla:** ningún entorno de prueba contiene datos reales de pacientes ni credenciales productivas. Los ejemplos y capturas usan datos ficticios.
