# Reglas de Negocio

> **Estado.** Las reglas marcadas con `[E.7]` provienen del checklist de discovery (`discovery/discovery.md` §E.7) y son decisiones de producto adoptadas. Las marcadas como **derivada** son propuestas de este documento para hacer operativas aquellas reglas; deben validarse con el usuario (`P1-01`). Las marcadas como **normativa** surgen de la Ley 25.326, la Ley 26.529 o la reglamentación de ARCA.
>
> Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad con historias de usuario, flujos y pruebas.

## Dominio: Autenticación y sesión (RN-AU)

- **RN-AU-01**: El correo electrónico identifica al usuario de forma global y es único en la plataforma. — Evita cuentas duplicadas entre consultorios.
- **RN-AU-02**: Las contraseñas se almacenan con Argon2id y deben tener al menos 12 caracteres. No se admiten contraseñas en texto plano ni reversibles. *(derivada)*
- **RN-AU-03**: El token de acceso dura 15 minutos; el token de refresco dura 30 días, rota en cada uso y se revoca al cerrar sesión o al desactivar al usuario. *(derivada)*
- **RN-AU-04**: Los roles `owner` y `admin` requieren segundo factor (TOTP) obligatorio; para `professional`, `receptionist` y `billing` es opcional pero recomendado. *(derivada)*
- **RN-AU-05**: Tras cinco intentos fallidos consecutivos, la cuenta se bloquea 15 minutos y se registra el evento. *(derivada)*
- **RN-AU-06**: Un usuario desactivado pierde todas sus sesiones de forma inmediata, pero sus registros históricos se conservan. *(derivada)*

## Dominio: Cuenta, tenants y roles (RN-TE)

- **RN-TE-01**: El identificador público del consultorio (`slug`) es único, en minúsculas y no puede reutilizarse aunque la cuenta se cierre. *(derivada)*
- **RN-TE-02**: Un usuario puede pertenecer a más de una cuenta con roles distintos; el rol se evalúa por cuenta y nunca se hereda entre cuentas. *(derivada)*
- **RN-TE-03**: Toda cuenta debe tener al menos un `owner` activo. No se puede desactivar al último `owner` sin designar un reemplazo. *(derivada)*
- **RN-TE-04**: Un usuario con notas clínicas firmadas o comprobantes emitidos no se elimina: se desactiva y se reasignan sus tareas. *(derivada)*
- **RN-TE-05**: El acceso de soporte de la plataforma a datos de un tenant requiere justificación, autorización del titular, plazo máximo de 24 horas y registro `break_glass` en auditoría. *(derivada)*
- **RN-TE-06**: La cuenta puede suspenderse por falta de pago, pero la suspensión no bloquea la exportación de datos ni la copia de historia clínica al paciente. `[E.7]` *(portabilidad)*

## Dominio: Agenda y sillones (RN-AG)

- **RN-AG-01**: La duración de un turno se toma de la prestación (`service.duration_min`) o del ajuste por profesional (`professional_service.duration_override_min`). No se admiten turnos sin duración definida. *(derivada)*
- **RN-AG-02**: Entre dos turnos del mismo profesional se aplica el margen de limpieza (`buffer_min`) configurado en la prestación. El margen ocupa agenda, aunque no sea visible para el paciente. *(derivada)*
- **RN-AG-03**: Un profesional no puede tener dos turnos activos superpuestos. Se consideran activos los estados `pending_deposit`, `confirmed`, `checked_in` e `in_progress`. `[E.7]`
- **RN-AG-04**: Un sillón no puede tener dos turnos activos superpuestos. La restricción se aplica aunque los turnos pertenezcan a profesionales distintos. `[E.7]`
- **RN-AG-05**: Un turno que termina a las 10:00 y otro que comienza a las 10:00 **no** se consideran superpuestos. Los rangos se interpretan como `[inicio, fin)`. *(derivada)*
- **RN-AG-06**: El sillón asignado debe pertenecer a la misma sucursal que el turno; no se puede agendar en un sillón de otra sede. *(derivada)*
- **RN-AG-07**: Un profesional sólo puede recibir turnos de prestaciones que tenga habilitadas (`professional_service.active = true`). *(derivada)*
- **RN-AG-08**: Un turno sólo puede ubicarse dentro de un horario de atención del profesional en esa sucursal y fuera de bloqueos, feriados o ausencias. *(derivada)*
- **RN-AG-09**: El sobreturno está permitido únicamente a `owner`, `admin` o `receptionist`, exige motivo escrito y queda marcado con `is_overbook = true`. Se admite como máximo un sobreturno por profesional y franja horaria, y la interfaz debe advertir el conflicto antes de confirmar. `[E.7]` *(los competidores relevados destacan la detección de solapamiento)*
- **RN-AG-10**: Un turno reprogramado conserva su historial y se valida contra la agenda en el nuevo horario; no se edita la hora de un turno ya confirmado sin registrar el cambio. *(derivada)*
- **RN-AG-11**: La cancelación libera el horario de inmediato y dispara la evaluación de la lista de espera si hay pacientes compatibles. `[E.7]`
- **RN-AG-12**: El estado `no_show` sólo puede registrarlo el personal después de la hora de inicio más una tolerancia configurable (por defecto, 15 minutos). *(derivada)*
- **RN-AG-13**: Un turno `completed` requiere una nota clínica asociada dentro de las 72 horas; si no existe, el sistema lo marca como “cierre pendiente” y lo informa al profesional. *(derivada)*
- **RN-AG-14**: Toda fecha y hora se almacena en UTC y se muestra en la zona horaria del consultorio. Los cambios de zona horaria no alteran turnos ya agendados. *(derivada)*
- **RN-AG-15**: Un sillón en mantenimiento no recibe turnos nuevos, pero conserva los turnos existentes; la interfaz debe permitir reprogramarlos. *(derivada)*

## Dominio: Turnos y reserva online (RN-TU)

- **RN-TU-01**: No se puede reservar con menos anticipación que la configurada por profesional y prestación. El valor por defecto propuesto es 2 horas. `[E.7]`
- **RN-TU-02**: La reserva online admite un horizonte máximo configurable; el valor por defecto propuesto es 90 días. *(derivada)*
- **RN-TU-03**: Sólo se ofrecen en el link público las prestaciones, profesionales y sucursales marcados como visibles. Un profesional inactivo o sin cupo no aparece. *(derivada)*
- **RN-TU-04**: La reserva pública solicita únicamente nombre, teléfono, documento opcional, correo opcional y obra social opcional. No solicita motivo de consulta ni datos clínicos. *(derivada, minimización)*
- **RN-TU-05**: Un paciente no puede tener dos turnos activos en la misma franja horaria con el mismo profesional. *(derivada)*
- **RN-TU-06**: Un turno confirmado por el paciente no puede ser reasignado sin su cancelación explícita. `[E.7]`
- **RN-TU-07**: La ventana de cancelación sin retención de seña es configurable por consultorio; el valor por defecto propuesto es 24 horas antes del turno. `[E.7]`
- **RN-TU-08**: La reprogramación online se permite hasta dos veces por turno; a partir de la tercera, deriva a contacto con el consultorio. *(derivada)*
- **RN-TU-09**: Al iniciar una reserva con seña, el horario se retiene por 10 minutos. Si el pago no se acredita, el turno se cancela y el horario se libera. *(derivada)*
- **RN-TU-10**: El link público aplica límite de intentos por IP y por teléfono, y puede exigir verificación adicional ante patrones anómalos. *(derivada)*
- **RN-TU-11**: La reserva online respeta las obras sociales aceptadas por el profesional elegido; si la obra social del paciente no está aceptada, no se ofrece ese profesional. `[E.7]` *(C.3, vacío 8)*

## Dominio: Señas, cobros y devoluciones (RN-SE)

- **RN-SE-01**: La seña se define por prestación y puede ser obligatoria, opcional o inexistente. `[E.7]`
- **RN-SE-02**: La seña puede ser un importe fijo o un porcentaje del precio; nunca puede superar el precio de la prestación. *(derivada)*
- **RN-SE-03**: El turno pasa a `confirmed` sólo cuando el pago de la seña está aprobado. Mientras tanto permanece en `pending_deposit`. *(derivada)*
- **RN-SE-04**: Si el paciente cancela dentro de la ventana protegida, la seña se devuelve, se retiene total o parcialmente, o se imputa a otro turno, según la política configurada. `[E.7]`
- **RN-SE-05**: Si el paciente no se presenta, la seña se retiene según la política configurada y el hecho queda registrado como `no_show`. *(derivada)*
- **RN-SE-06**: Toda devolución genera un movimiento propio; no se edita ni se elimina el pago original. *(derivada)*
- **RN-SE-07**: Los pagos en efectivo se imputan a una sesión de caja abierta; el cierre calcula la diferencia entre lo esperado y lo declarado. *(derivada)*
- **RN-SE-08**: La plataforma no custodia fondos de terceros: cada consultorio cobra en su propia cuenta de Mercado Pago. La plataforma sólo registra y concilia. *(derivada; evita asumir rol de entidad financiera)*
- **RN-SE-09**: Una seña sólo puede devolverse por el mismo medio de pago, salvo registro manual justificado y auditado. *(derivada)*

## Dominio: Lista de espera (RN-LE)

- **RN-LE-01**: La lista de espera se ordena por orden de llegada (`created_at`). Una prioridad clínica distinta requiere justificación y queda auditada. `[E.7]`
- **RN-LE-02**: Sólo se ofrecen huecos compatibles con la sucursal, la prestación, el profesional y las obras sociales aceptadas por el profesional. `[E.7]`
- **RN-LE-03**: La oferta se envía al primero de la lista compatible y tiene una ventana de aceptación configurable; el valor por defecto propuesto es 15 minutos. `[E.7]`
- **RN-LE-04**: Si el paciente rechaza o no responde dentro de la ventana, la oferta expira y se pasa al siguiente paciente. El paciente que no respondió vuelve a `waiting`. `[E.7]`
- **RN-LE-05**: Un paciente no puede tener más de una oferta pendiente a la vez. *(derivada)*
- **RN-LE-06**: Sólo se ofrecen horarios liberados por cancelación o reprogramación; un turno confirmado no se ofrece. *(derivada)*
- **RN-LE-07**: La aceptación de una oferta crea el turno en estado `confirmed` (o `pending_deposit` si la prestación exige seña) y retira al paciente de la lista. *(derivada)*
- **RN-LE-08**: El personal puede aceptar una oferta en nombre del paciente; la acción requiere motivo y queda auditada. *(derivada)*

## Dominio: Historia clínica y odontograma (RN-CL)

- **RN-CL-01**: Existe una única historia clínica por paciente y consultorio; los profesionales comparten la historia dentro del mismo tenant. *(derivada)*
- **RN-CL-02**: Sólo un usuario con rol `professional` y vínculo con el paciente puede leer o escribir la historia clínica. El rol administrativo no accede al contenido. *(Ley 25.326, art. 9)*
- **RN-CL-03**: Una nota clínica firmada es inmutable. Las correcciones se registran como `addendum` con referencia a la nota original y nueva firma. *(derivada)*
- **RN-CL-04**: El odontograma usa numeración FDI y distingue dentición permanente (11–48) y temporaria (51–85), con estado por pieza y por superficie. *(derivada)*
- **RN-CL-05**: La historia clínica no se elimina y se conserva 10 años desde el último registro. `[E.7]` *(Ley 26.529, art. 15)*
- **RN-CL-06**: El paciente tiene derecho a una copia de su historia clínica dentro de las 48 horas de solicitarla; el sistema debe generarla y registrar la entrega. *(Ley 26.529, art. 14)*
- **RN-CL-07**: Las imágenes y radiografías se almacenan cifradas, con nombre opaco y acceso por URL firmada de corta duración. *(derivada)*
- **RN-CL-08**: Los datos clínicos no se envían por WhatsApp ni por correo sin cifrado; sólo se transmiten datos mínimos de turno. `[E.7]`
- **RN-CL-09**: No se realiza un tratamiento invasivo sin consentimiento informado firmado. *(derivada)*
- **RN-CL-10**: Si el paciente es menor de edad, el consentimiento y la comunicación se gestionan con su tutor o responsable legal. *(derivada)*

## Dominio: Consentimientos (RN-CO)

- **RN-CO-01**: Cada plantilla de consentimiento tiene versión y texto inmutable; un consentimiento firmado referencia la versión exacta. *(derivada)*
- **RN-CO-02**: La firma electrónica simple se registra con hash del documento, fecha, IP, agente de usuario y método de firma. *(Ley 25.506, firma electrónica)*
- **RN-CO-03**: La revocación de un consentimiento no elimina el documento original; se registra como evento posterior. *(derivada)*
- **RN-CO-04**: Antes de la primera atención se requiere consentimiento para el tratamiento de datos personales y, cuando corresponda, para el uso de imágenes. *(Ley 25.326)*

## Dominio: Facturación electrónica (RN-FA)

- **RN-FA-01**: Sólo se emite comprobante desde un pago aprobado o una prestación efectivamente realizada. *(derivada)*
- **RN-FA-02**: El tipo de comprobante (A, B o C) se determina por la condición fiscal del emisor y del receptor; el sistema no permite combinaciones inválidas. En v1.0 se implementan B y C; la factura A queda supeditada a la condición de responsable inscripto del consultorio. *(derivada)*
- **RN-FA-03**: Ningún comprobante se entrega sin CAE autorizado por ARCA. *(normativa)*
- **RN-FA-04**: La numeración es correlativa por punto de venta y tipo de comprobante; no se admiten saltos ni reutilización. *(normativa)*
- **RN-FA-05**: Si ARCA no responde, el comprobante queda en estado `contingency` y se reintenta; nunca se emite dos veces el mismo número. *(derivada)*
- **RN-FA-06**: La anulación se realiza con nota de crédito; un comprobante emitido no se edita ni se elimina. *(normativa)*
- **RN-FA-07**: El comprobante no incluye diagnóstico, pieza dental ni detalle clínico; sólo la prestación facturable. *(minimización)*
- **RN-FA-08**: Los comprobantes y sus CAE se conservan 10 años. *(normativa)*

## Dominio: Obras sociales y prepagas (RN-OS)

- **RN-OS-01**: Las obras sociales aceptadas se definen por profesional, no por clínica. `[E.7]`
- **RN-OS-02**: La cobertura del paciente se registra con obra social, plan y número de afiliado; sin número de afiliado no se puede liquidar. *(derivada)*
- **RN-OS-03**: En v1.0 el copago se calcula con la configuración del consultorio y no se valida en línea contra la obra social. *(propuesta de alcance; ver `DD-04`)*
- **RN-OS-04**: Cuando la prestación lo requiera, se registra número de autorización y vencimiento. *(derivada)*
- **RN-OS-05**: La liquidación de v1.0 es un **borrador exportable**; no constituye presentación definitiva ante la obra social. *(propuesta de alcance)*
- **RN-OS-06**: La cobertura registrada en un turno histórico no cambia si el paciente cambia de obra social con posterioridad. *(derivada)*
- **RN-OS-07**: Los datos de afiliación no se comparten con terceros ajenos a la prestación y se tratan como datos sensibles. *(Ley 25.326)*

## Dominio: Comunicaciones por WhatsApp (RN-WA)

- **RN-WA-01**: No se envía ningún mensaje `utility` sin opt-in explícito del paciente para ese número y categoría. *(política de Meta)*
- **RN-WA-02**: Sólo se usan plantillas aprobadas por Meta; fuera de la ventana de 24 horas no se envía texto libre. *(política de Meta)*
- **RN-WA-03**: Los mensajes no contienen diagnósticos, tratamientos, imágenes ni datos clínicos. `[E.7]`
- **RN-WA-04**: La categoría `utility` se reserva para recordatorios, confirmaciones, cancelaciones y ofertas de turno. Las campañas requieren categoría `marketing` y opt-in específico. *(política de Meta)*
- **RN-WA-05**: La revocación del opt-in se procesa de inmediato y bloquea envíos futuros, salvo comunicaciones legales impostergables. *(derivada)*
- **RN-WA-06**: Cada envío registra plantilla, estado, costo estimado y código de error; el costo se imputa al consultorio. *(derivada)*
- **RN-WA-07**: Si el mensaje crítico falla, se intenta un canal alternativo (correo o llamada registrada) y se informa en la agenda. *(derivada)*
- **RN-WA-08**: El número del paciente se normaliza a formato E.164 antes de cualquier envío. *(derivada)*

## Dominio: Privacidad, seguridad y datos personales (RN-PR)

- **RN-PR-01**: Sólo se recogen los datos necesarios para la finalidad declarada (minimización). *(Ley 25.326, art. 4)*
- **RN-PR-02**: Los datos no se usan para fines distintos de la atención, la gestión administrativa y el cumplimiento legal. *(Ley 25.326, art. 5)*
- **RN-PR-03**: El tratamiento requiere consentimiento informado, salvo las excepciones legales. *(Ley 25.326, arts. 5 y 6)*
- **RN-PR-04**: El acceso se rige por el principio de menor privilegio y por vínculo clínico. *(Ley 25.326, art. 9)*
- **RN-PR-05**: Toda lectura de historia clínica, exportación o acceso de soporte genera un evento de auditoría inmutable. *(derivada)*
- **RN-PR-06**: Los datos se cifran en tránsito (TLS 1.2 o superior) y en reposo (base, almacenamiento y respaldos). *(Ley 25.326, art. 9)*
- **RN-PR-07**: La transferencia internacional de datos requiere base legal, información al titular y cláusulas contractuales adecuadas. *(Ley 25.326, art. 12)*
- **RN-PR-08**: Las bases de datos se registran ante la AAIP cuando corresponda. *(Ley 25.326, art. 21)*
- **RN-PR-09**: El titular puede ejercer acceso, rectificación y supresión en los plazos legales; la supresión no alcanza a datos cuya conservación sea obligatoria. *(Ley 25.326, arts. 14–16)*
- **RN-PR-10**: Todo incidente de seguridad con riesgo para los titulares se registra y se notifica según la normativa aplicable. *(derivada)*
- **RN-PR-11**: La exportación total de datos está disponible en cualquier momento, incluso con la cuenta suspendida. `[E.7]`
- **RN-PR-12**: Los respaldos se cifran y se prueba su restauración al menos una vez por trimestre. *(derivada)*
- **RN-PR-13**: El responsable del tratamiento debe estar definido por contrato entre la plataforma y el consultorio; la figura propuesta es corresponsabilidad con roles documentados. *(propuesta; ver `P0-04`)*

## Dominio: Excepciones globales (RN-EX)

- **RN-EX-01**: Ninguna consulta de negocio puede ejecutarse sin `tenant_id`; el aislamiento se impone por RLS y se prueba en cada suite. *(derivada)*
- **RN-EX-02**: Los efectos externos (mensaje, pago, comprobante) son idempotentes: un reintento no duplica el efecto. *(derivada)*
- **RN-EX-03**: Los importes se expresan en ARS con dos decimales; no se usan números de punto flotante para dinero. *(derivada)*
- **RN-EX-04**: Los registros con obligación legal de conservación no se eliminan; se desactivan o se anonimizan cuando la ley lo permita. *(derivada)*
- **RN-EX-05**: Los entornos que no son de producción no contienen datos reales de pacientes; se usan datos ficticios o anonimizados. *(derivada; requisito de la cátedra)*
- **RN-EX-06**: Toda regla de negocio debe tener al menos una prueba automatizada que la verifique, con especial énfasis en las reglas de agenda y de solapamiento. *(derivada; criterio de aceptación del trabajo)*
