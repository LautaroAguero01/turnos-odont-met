# Funcionalidades

> **Estado.** Historias derivadas del MVP sugerido en `discovery/discovery.md` §D.3 y de los casos de uso §E.3. La prioridad `[MVP]` indica alcance de v1.0; `[v1.1]` y `[v2]` quedan fuera del primer lanzamiento. Cada historia referencia las reglas de `05_reglas_de_negocio.md` que la gobiernan.
>
> Formato: **Como** [actor] **quiero** [acción] **para** [beneficio]. Los criterios de aceptación son verificables y se traducirán en escenarios de especificación y pruebas.

## Épica 1: Cuenta, identidad y acceso

### US-001 — Alta autoservicio del consultorio `[MVP]`
**Como** odontólogo titular
**Quiero** crear mi cuenta, definir el nombre público de mi consultorio y empezar a configurar la agenda sin intervención comercial
**Para** evaluar el producto el mismo día y no depender de una demo ni de una cotización.

**Criterios de aceptación**:
- [ ] El alta solicita nombre, correo, contraseña, nombre comercial y `slug`; valida que el `slug` no exista.
- [ ] El titular queda con rol `owner` y la cuenta en estado `active`.
- [ ] El alta crea una sucursal por defecto y ofrece crear el primer sillón.
- [ ] La cuenta recibe un período de prueba de 14 días sin tarjeta (propuesta comercial).
- [ ] El correo de verificación expira en 24 horas y se puede reenviar.

**Reglas relacionadas**: RN-AU-01, RN-AU-02, RN-TE-01, RN-TE-03.

### US-002 — Equipo, invitaciones y roles `[MVP]`
**Como** titular
**Quiero** invitar a recepción, profesionales y facturación con el rol que corresponde
**Para** que cada persona acceda sólo a lo que necesita.

**Criterios de aceptación**:
- [ ] La invitación se envía por correo, tiene vencimiento y es de un solo uso.
- [ ] El rol se asigna por cuenta y puede combinarse (por ejemplo, `owner` + `professional`).
- [ ] No se puede desactivar al último `owner` activo.
- [ ] Un usuario desactivado pierde sus sesiones de inmediato.
- [ ] La recepción no obtiene acceso al contenido clínico por la sola asignación del rol.

**Reglas relacionadas**: RN-TE-02, RN-TE-03, RN-TE-04, RN-AU-06, RN-CL-02.

### US-003 — Inicio de sesión con segundo factor `[MVP]`
**Como** usuario del consultorio
**Quiero** iniciar sesión con contraseña y, cuando corresponda, un código de segundo factor
**Para** proteger el acceso a datos de salud.

**Criterios de aceptación**:
- [ ] El token de acceso dura 15 minutos y el de refresco rota en cada uso.
- [ ] `owner` y `admin` no pueden operar sin configurar TOTP.
- [ ] Cinco intentos fallidos bloquean la cuenta 15 minutos.
- [ ] El cierre de sesión revoca el token de refresco del dispositivo.

**Reglas relacionadas**: RN-AU-02 a RN-AU-06.

## Épica 2: Configuración operativa

### US-004 — Sucursales y sillones `[MVP]`
**Como** administrador
**Quiero** dar de alta sucursales y sillones con su estado
**Para** que la agenda refleje la capacidad física real.

**Criterios de aceptación**:
- [ ] Cada sillón pertenece a una sucursal y tiene nombre único dentro de ella.
- [ ] Un sillón puede marcarse `maintenance` o `inactive` sin borrar turnos históricos.
- [ ] No se puede desactivar una sucursal con turnos futuros sin reprogramarlos.
- [ ] La agenda muestra los sillones activos por sucursal.

**Reglas relacionadas**: RN-AG-06, RN-AG-15.

### US-005 — Catálogo de prestaciones `[MVP]`
**Como** administrador
**Quiero** definir prestaciones con duración, precio, margen y política de seña
**Para** que cada turno tenga una duración y un importe consistentes.

**Criterios de aceptación**:
- [ ] La duración es obligatoria y se expresa en minutos (5 a 480).
- [ ] La seña puede ser inexistente, fija o porcentual, y nunca supera el precio.
- [ ] Se puede ajustar duración y precio por profesional sin alterar el catálogo general.
- [ ] Una prestación inactiva no se ofrece en la reserva pública ni en turnos nuevos.

**Reglas relacionadas**: RN-AG-01, RN-AG-02, RN-SE-01, RN-SE-02, RN-TU-03.

### US-006 — Horarios, bloqueos y feriados `[MVP]`
**Como** administrador o profesional
**Quiero** definir horarios de atención por sucursal y bloquear ausencias o feriados
**Para** que la disponibilidad publicada sea real.

**Criterios de aceptación**:
- [ ] El horario se define por profesional, sucursal y día de la semana, con intervalos múltiples.
- [ ] Un bloqueo impide nuevos turnos en el rango y advierte sobre turnos existentes.
- [ ] El profesional puede bloquear su propia agenda; no puede bloquear la de otro.
- [ ] Los feriados se pueden cargar por calendario y aplican a todas las agendas de la sucursal.

**Reglas relacionadas**: RN-AG-08, RN-AG-15, RN-TU-02.

### US-007 — Obras sociales aceptadas por profesional `[MVP]`
**Como** administrador o profesional
**Quiero** registrar qué obras sociales acepta cada profesional y con qué copago
**Para** que la reserva online no ofrezca combinaciones inválidas.

**Criterios de aceptación**:
- [ ] La cobertura se asocia al profesional, no a la clínica.
- [ ] El paciente puede declarar su obra social al reservar y sólo ve profesionales que la aceptan.
- [ ] El copago se muestra como estimación y no como validación en línea.
- [ ] El catálogo de obras sociales es editable por el consultorio.

**Reglas relacionadas**: RN-OS-01, RN-OS-03, RN-TU-11.

## Épica 3: Agenda y turnos

### US-008 — Agenda por sillón con vistas diaria y semanal `[MVP]`
**Como** recepcionista
**Quiero** ver la agenda organizada por sillón y por profesional, en vista diaria y semanal
**Para** detectar huecos y evitar dos pacientes en la misma silla.

**Criterios de aceptación**:
- [ ] La vista muestra turnos, bloqueos, sobreturnos y estados con código de color.
- [ ] Se puede alternar entre agrupación por sillón y por profesional.
- [ ] Los turnos que se solapan se resaltan visualmente.
- [ ] La navegación entre días y semanas conserva la sucursal seleccionada.
- [ ] La carga inicial de una semana se completa en menos de 1,5 segundos en condiciones normales.

**Reglas relacionadas**: RN-AG-03, RN-AG-04, RN-AG-09, RN-AG-14.

### US-009 — Alta de turno con prevención de solapamiento `[MVP]`
**Como** recepcionista
**Quiero** crear un turno y que el sistema impida superponer profesional o sillón
**Para** no cometer errores que después cuestan una espera o una pérdida de ingreso.

**Criterios de aceptación**:
- [ ] Al elegir paciente, prestación, profesional, sillón y horario, el sistema valida disponibilidad.
- [ ] Si el profesional o el sillón están ocupados, se rechaza con un mensaje que indica el conflicto.
- [ ] Un turno que empieza exactamente cuando termina otro se acepta.
- [ ] El turno se guarda con estado `confirmed` (o `pending_deposit` si exige seña).
- [ ] La creación exitosa genera un evento de auditoría y, si corresponde, un mensaje de confirmación.

**Reglas relacionadas**: RN-AG-01 a RN-AG-08, RN-TU-05, RN-SE-03, RN-WA-01.

### US-010 — Reprogramación de turno `[MVP]`
**Como** recepcionista
**Quiero** reprogramar un turno conservando su historial
**Para** resolver un imprevisto sin perder la trazabilidad.

**Criterios de aceptación**:
- [ ] La reprogramación exige un horario válido y vuelve a validar solapamientos.
- [ ] Se registra el estado anterior, el nuevo horario, el actor y el motivo.
- [ ] El turno original no se elimina; queda como `rescheduled`.
- [ ] Se notifica al paciente por el canal disponible.
- [ ] Si la prestación exige seña, se indica si la seña se conserva o se recalcula.

**Reglas relacionadas**: RN-AG-10, RN-AG-11, RN-SE-04, RN-WA-04.

### US-011 — Cancelación y liberación del horario `[MVP]`
**Como** recepcionista o paciente
**Quiero** cancelar un turno y liberar el horario de inmediato
**Para** que otro paciente pueda ocuparlo.

**Criterios de aceptación**:
- [ ] La cancelación registra motivo, actor y fecha.
- [ ] El horario queda disponible en la agenda en el mismo instante.
- [ ] Se evalúa la lista de espera si hay pacientes compatibles.
- [ ] Se aplica la política de seña configurada y se informa al paciente.
- [ ] Un turno ya completado no puede cancelarse; requiere nota de ajuste.

**Reglas relacionadas**: RN-AG-11, RN-SE-04, RN-LE-02, RN-LE-06.

### US-012 — Sobreturno controlado `[MVP]`
**Como** recepcionista o titular
**Quiero** registrar un sobreturno con advertencia y motivo
**Para** atender una urgencia sin perder el control de la agenda.

**Criterios de aceptación**:
- [ ] El sistema advierte el conflicto de profesional y de sillón antes de confirmar.
- [ ] Sólo `owner`, `admin` o `receptionist` pueden crear sobreturnos.
- [ ] El motivo es obligatorio y el turno queda marcado como sobreturno.
- [ ] Se admite como máximo un sobreturno por profesional y franja horaria.
- [ ] El sobreturno aparece diferenciado en la agenda y en los reportes.

**Reglas relacionadas**: RN-AG-09, RN-AG-03, RN-AG-04.

## Épica 4: Reserva online

### US-013 — Link público de reserva `[MVP]`
**Como** paciente
**Quiero** reservar un turno desde un link en menos de un minuto
**Para** no llamar en horario de oficina.

**Criterios de aceptación**:
- [ ] El link `/{slug}` muestra sucursales, prestaciones y profesionales habilitados.
- [ ] La disponibilidad se calcula en el servidor y respeta anticipación mínima, bloqueos y cupos.
- [ ] El paciente elige prestación, profesional, fecha y hora, y confirma con nombre y teléfono.
- [ ] El turno aparece en la agenda del consultorio en estado `confirmed` o `pending_deposit`.
- [ ] La pantalla de confirmación ofrece agregar el turno al calendario y el enlace de cancelación.
- [ ] El flujo funciona en un teléfono móvil sin aplicación nativa.

**Reglas relacionadas**: RN-TU-01 a RN-TU-06, RN-TU-11, RN-AG-08.

### US-014 — Reserva con seña por Mercado Pago `[MVP]`
**Como** paciente
**Quiero** pagar la seña al reservar con link o QR
**Para** asegurar mi turno y evitar que se pierda.

**Criterios de aceptación**:
- [ ] Si la prestación exige seña, el horario se retiene 10 minutos mientras se paga.
- [ ] El pago se confirma por webhook firmado y el turno pasa a `confirmed`.
- [ ] Si el pago no se acredita, el turno se cancela y el horario se libera.
- [ ] El comprobante de pago se muestra al paciente y queda asociado al turno.
- [ ] Un pago duplicado o un webhook repetido no genera dos señas.

**Reglas relacionadas**: RN-SE-02, RN-SE-03, RN-TU-09, RN-EX-02.

### US-015 — Autogestión del turno por token `[MVP]`
**Como** paciente
**Quiero** confirmar, cancelar o reprogramar mi turno desde el enlace que recibí
**Para** resolverlo sin llamar.

**Criterios de aceptación**:
- [ ] El enlace contiene un token firmado, de un solo uso para acciones con efecto y con vencimiento.
- [ ] Sólo se muestran los datos del propio turno; no se exponen datos de otros pacientes.
- [ ] La cancelación respeta la ventana configurada e informa el efecto sobre la seña.
- [ ] La reprogramación ofrece únicamente horarios disponibles y se limita a dos veces online.
- [ ] Toda acción queda auditada con IP y fecha.

**Reglas relacionadas**: RN-TU-06, RN-TU-07, RN-TU-08, RN-SE-04, RN-PR-05.

## Épica 5: Comunicaciones por WhatsApp

### US-016 — Opt-in y gestión de plantillas `[MVP]`
**Como** recepcionista
**Quiero** registrar el consentimiento del paciente y usar plantillas aprobadas
**Para** enviar recordatorios sin infringir la política de Meta.

**Criterios de aceptación**:
- [ ] Sin opt-in `utility` vigente no se envía ningún recordatorio.
- [ ] El paciente puede revocar el opt-in y el bloqueo es inmediato.
- [ ] Las plantillas se sincronizan con su estado de aprobación.
- [ ] El sistema no permite texto libre fuera de la ventana de 24 horas.
- [ ] Los mensajes no incluyen diagnóstico, tratamiento ni imágenes.

**Reglas relacionadas**: RN-WA-01 a RN-WA-05, RN-CL-08.

### US-017 — Recordatorio y confirmación automática `[MVP]`
**Como** recepcionista
**Quiero** que el sistema envíe recordatorios a las 48 y 24 horas con botones de confirmar o cancelar
**Para** no llamar a 30 pacientes por día.

**Criterios de aceptación**:
- [ ] Se envían dos recordatorios configurables (por defecto 48 h y 24 h antes).
- [ ] Los botones “Confirmar” y “Cancelar” actualizan el estado del turno.
- [ ] La cancelación desde WhatsApp libera el horario y dispara la lista de espera.
- [ ] Si el paciente ya confirmó, no se envía el segundo recordatorio.
- [ ] El envío se registra con estado y costo.
- [ ] Un fallo de WhatsApp genera reintento y alerta visible en la agenda.

**Reglas relacionadas**: RN-WA-02, RN-WA-04, RN-WA-06, RN-WA-07, RN-AG-11.

### US-018 — Trazabilidad y costo de mensajes `[MVP]`
**Como** titular
**Quiero** ver cuántos mensajes se enviaron, cuántos se entregaron y cuánto costaron
**Para** controlar el gasto de WhatsApp.

**Criterios de aceptación**:
- [ ] El panel muestra enviados, entregados, leídos, fallidos y costo estimado por período.
- [ ] Se puede filtrar por profesional, sucursal y tipo de mensaje.
- [ ] El costo se imputa al consultorio y se exporta en CSV.
- [ ] Los mensajes fallidos se pueden reintentar manualmente.

**Reglas relacionadas**: RN-WA-06, RN-PR-11.

## Épica 6: Lista de espera inteligente

### US-019 — Inscripción en lista de espera `[MVP]`
**Como** recepcionista
**Quiero** anotar a un paciente que busca un horario que hoy no existe
**Para** ofrecerle el primer hueco que se libere.

**Criterios de aceptación**:
- [ ] La inscripción registra paciente, sucursal, prestación, profesional preferido y rango de fechas.
- [ ] El orden se asigna por llegada; una prioridad distinta exige justificación.
- [ ] Un paciente no puede tener dos entradas activas para la misma prestación y sucursal.
- [ ] El paciente puede solicitar la baja de la lista.
- [ ] La lista es visible para recepción y administración.

**Reglas relacionadas**: RN-LE-01, RN-LE-02, RN-LE-05.

### US-020 — Oferta automática del hueco liberado `[MVP]`
**Como** recepcionista
**Quiero** que al liberarse un turno se ofrezca automáticamente al primero de la lista
**Para** no perder el sillón.

**Criterios de aceptación**:
- [ ] Al cancelarse o reprogramarse un turno, el sistema identifica entradas compatibles.
- [ ] Se envía una oferta por WhatsApp con ventana de aceptación (15 minutos por defecto).
- [ ] Si el paciente acepta, se crea el turno y se retira de la lista.
- [ ] Si rechaza o no responde, la oferta expira y se pasa al siguiente.
- [ ] El turno ofrecido no puede ser tomado por otro canal mientras la oferta está vigente.
- [ ] La aceptación en nombre del paciente por parte del personal requiere motivo y auditoría.
- [ ] El panel muestra cancelaciones recuperadas y tiempo medio de cobertura.

**Reglas relacionadas**: RN-LE-02 a RN-LE-08, RN-TU-09.

## Épica 7: Historia clínica y odontograma

### US-021 — Ficha clínica y anamnesis `[MVP]`
**Como** odontólogo
**Quiero** registrar antecedentes, alergias y evolución del paciente
**Para** atender con información completa y dejar constancia legal.

**Criterios de aceptación**:
- [ ] La historia clínica es única por paciente y consultorio.
- [ ] Sólo profesionales con vínculo con el paciente acceden al contenido.
- [ ] La anamnesis incluye alergias, medicación, antecedentes y observaciones.
- [ ] La nota firmada es inmutable y las correcciones se agregan como addendum.
- [ ] Cada lectura y escritura queda auditada.
- [ ] La interfaz no permite guardar una nota sin profesional responsable.

**Reglas relacionadas**: RN-CL-01 a RN-CL-03, RN-PR-04, RN-PR-05.

### US-022 — Odontograma FDI `[MVP]`
**Como** odontólogo
**Quiero** registrar el estado de cada pieza y superficie en un odontograma interactivo
**Para** documentar el diagnóstico y la evolución.

**Criterios de aceptación**:
- [ ] El odontograma distingue dentición permanente y temporaria con numeración FDI.
- [ ] Permite registrar condición por pieza y por superficie (oclusal, mesial, distal, vestibular, lingual/palatino).
- [ ] Conserva el historial de cambios con autor y fecha.
- [ ] Se puede imprimir o exportar en PDF junto con la historia clínica.
- [ ] No se puede editar un odontograma cerrado sin generar una nueva versión.

**Reglas relacionadas**: RN-CL-04, RN-CL-07, RN-CL-08.

### US-023 — Consentimiento informado digital `[MVP]`
**Como** odontólogo
**Quiero** obtener la firma del paciente antes de un tratamiento
**Para** cumplir con la Ley 26.529 y reducir el riesgo legal.

**Criterios de aceptación**:
- [ ] La plantilla tiene versión y texto inmutable.
- [ ] La firma se registra con hash, fecha, IP y agente de usuario.
- [ ] El documento firmado se puede descargar y queda asociado a la historia clínica.
- [ ] La revocación no elimina el documento original.
- [ ] Si el paciente es menor, se solicita firma del tutor.

**Reglas relacionadas**: RN-CO-01 a RN-CO-04, RN-CL-09, RN-CL-10.

### US-024 — Copia de historia clínica al paciente `[MVP]`
**Como** paciente
**Quiero** solicitar y recibir una copia de mi historia clínica
**Para** ejercer mi derecho de acceso.

**Criterios de aceptación**:
- [ ] La solicitud se registra con fecha y hora.
- [ ] La copia se genera en PDF dentro de las 48 horas.
- [ ] La entrega se realiza por el portal o por correo, con enlace de un solo uso.
- [ ] La descarga queda auditada.
- [ ] La copia incluye notas firmadas, odontograma y consentimientos.

**Reglas relacionadas**: RN-CL-05, RN-CL-06, RN-PR-09.

## Épica 8: Presupuestos y planes de tratamiento

### US-025 — Plan de tratamiento y presupuesto `[MVP]`
**Como** odontólogo
**Quiero** armar un plan con prestaciones, piezas y precios, y compartirlo con el paciente
**Para** que apruebe el tratamiento y se convierta en turnos y cobros.

**Criterios de aceptación**:
- [ ] El plan agrupa ítems con prestación, pieza, cantidad y precio.
- [ ] El total se calcula automáticamente y se muestra en ARS.
- [ ] El plan se puede presentar por link o PDF y registrar la aceptación.
- [ ] Un plan aceptado no se edita; se versiona.
- [ ] Los ítems aceptados pueden convertirse en turnos y en pagos.

**Reglas relacionadas**: RN-SE-01, RN-CL-03, RN-FA-01.

## Épica 9: Caja y cobros

### US-026 — Caja diaria y registro de pagos `[MVP]`
**Como** recepcionista
**Quiero** abrir la caja, registrar cobros y cerrarla con arqueo
**Para** rendir el día sin planillas paralelas.

**Criterios de aceptación**:
- [ ] Se registran pagos en efectivo, transferencia, débito, crédito y Mercado Pago.
- [ ] Cada pago queda asociado a paciente y, cuando corresponde, a turno o plan.
- [ ] El cierre muestra el total esperado, el declarado y la diferencia.
- [ ] Un pago aprobado no se elimina; se reembolsa con movimiento propio.
- [ ] Sólo puede haber una caja abierta por usuario y sucursal.

**Reglas relacionadas**: RN-SE-06, RN-SE-07, RN-SE-09.

### US-027 — Cobro con Mercado Pago `[MVP]`
**Como** recepcionista
**Quiero** generar un link o QR de pago y que el sistema lo concilie
**Para** cobrar sin manejar efectivo y sin cargar el pago dos veces.

**Criterios de aceptación**:
- [ ] El link se genera por importe y concepto, con referencia externa única.
- [ ] El webhook firmado actualiza el pago a `approved` o `rejected`.
- [ ] La conciliación es idempotente y tolera eventos repetidos o fuera de orden.
- [ ] El pago aprobado se refleja en la caja y habilita la facturación.
- [ ] El usuario puede reintentar la consulta de estado si el webhook no llega.

**Reglas relacionadas**: RN-SE-03, RN-SE-08, RN-FA-01, RN-EX-02.

## Épica 10: Facturación electrónica ARCA

### US-028 — Emisión de factura B/C con CAE y QR `[MVP]`
**Como** administrativo de facturación
**Quiero** emitir el comprobante desde el pago cobrado y obtener el CAE
**Para** cerrar el circuito fiscal sin otro sistema.

**Criterios de aceptación**:
- [ ] El comprobante se genera desde un pago aprobado y muestra prestación e importe, sin datos clínicos.
- [ ] El sistema obtiene CAE de ARCA y guarda número, tipo, punto de venta y vencimiento.
- [ ] El PDF incluye el QR fiscal y se puede enviar al paciente.
- [ ] Si ARCA no responde, el comprobante queda en contingencia y se reintenta sin duplicar números.
- [ ] La anulación se realiza con nota de crédito.
- [ ] El certificado y el ticket de acceso se gestionan por consultorio.

**Reglas relacionadas**: RN-FA-01 a RN-FA-08.

## Épica 11: Operación, auditoría y cumplimiento

### US-029 — Auditoría de accesos y cambios `[MVP]`
**Como** titular
**Quiero** ver quién accedió a una historia clínica o modificó un turno
**Para** detectar usos indebidos y cumplir con la normativa.

**Criterios de aceptación**:
- [ ] Se registran accesos de lectura y escritura a historia clínica, turnos, pagos y comprobantes.
- [ ] El registro es inmutable y no puede editarse desde la aplicación.
- [ ] Se puede filtrar por usuario, recurso, fecha y acción.
- [ ] El acceso de soporte de la plataforma queda marcado como `break_glass`.
- [ ] La exportación del registro está disponible para el titular.

**Reglas relacionadas**: RN-PR-05, RN-TE-05, RN-EX-01.

### US-030 — Exportación total de datos `[MVP]`
**Como** titular
**Quiero** descargar todos los datos de mi consultorio en cualquier momento
**Para** no quedar cautivo y poder migrar.

**Criterios de aceptación**:
- [ ] La exportación incluye pacientes, turnos, historia clínica, odontogramas, pagos, comprobantes y auditoría.
- [ ] Se genera un paquete con manifiesto y checksum.
- [ ] El enlace de descarga vence a los 7 días y su acceso queda auditado.
- [ ] La exportación funciona aunque la cuenta esté suspendida por falta de pago.
- [ ] El formato principal es JSON; se ofrece CSV para tablas operativas y PDF para documentos.

**Reglas relacionadas**: RN-PR-11, RN-TE-06, RN-EX-04.

### US-031 — Panel operativo del consultorio `[MVP]`
**Como** titular
**Quiero** ver ocupación, ausentismo, cancelaciones recuperadas y producción
**Para** tomar decisiones con datos y no con percepciones.

**Criterios de aceptación**:
- [ ] El panel muestra turnos por estado, ocupación por sillón y profesional, y tasa de no-show.
- [ ] Muestra cancelaciones recuperadas por lista de espera y tiempo medio de cobertura.
- [ ] Permite filtrar por sucursal, profesional y período.
- [ ] Los indicadores se pueden exportar en CSV.
- [ ] No muestra datos clínicos ni identificadores innecesarios de pacientes.

**Reglas relacionadas**: RN-PR-01, RN-PR-11, RN-LE-08.

### US-032 — Borrador de liquidación de obras sociales `[MVP, alcance mínimo]`
**Como** administrativo
**Quiero** obtener un borrador de liquidación por obra social y profesional
**Para** ordenar el circuito sin pretender validar en línea en v1.0.

**Criterios de aceptación**:
- [ ] El borrador agrupa prestaciones por obra social, profesional y período.
- [ ] Muestra copago informado, importe de obra social e importe particular.
- [ ] Exporta en CSV y PDF con leyenda “borrador no presentado”.
- [ ] No valida topes, frecuencias ni autorizaciones en línea.
- [ ] La cobertura histórica del turno no se altera si el paciente cambia de obra social.

**Reglas relacionadas**: RN-OS-02 a RN-OS-07.

## Priorización y alcance

| Épica | Historias | Prioridad | Origen |
|---|---|---|---|
| Cuenta, identidad y acceso | US-001 a US-003 | MVP | D.3 (roles y permisos, onboarding autoservicio) |
| Configuración operativa | US-004 a US-007 | MVP | D.3 (agenda, sillones, prestaciones, obras sociales por profesional) |
| Agenda y turnos | US-008 a US-012 | MVP | D.3 imprescindibles 1 y 6 |
| Reserva online | US-013 a US-015 | MVP | D.3 imprescindible 2 |
| WhatsApp | US-016 a US-018 | MVP | D.3 imprescindible 3 |
| Lista de espera | US-019 y US-020 | MVP (diferenciador 1) | C.3, C.4 y D.3 |
| Historia clínica | US-021 a US-024 | MVP | D.3 imprescindible 4 y cumplimiento |
| Presupuestos | US-025 | MVP | D.3 imprescindible 4 |
| Caja y cobros | US-026 y US-027 | MVP | D.3 imprescindible 5 |
| Facturación ARCA | US-028 | MVP (diferenciador 2) | D.3 y C.2 |
| Operación y cumplimiento | US-029 a US-031 | MVP | D.3 imprescindibles 6, 7 y 8 |
| Obras sociales | US-032 | MVP acotado | E.7 y decisión `DD-04` |

### Fuera de v1.0

| Funcionalidad | Etapa | Motivo |
|---|---|---|
| Periodontograma de seis sitios | v1.1 | Detalle clínico valioso, no bloqueante para el lanzamiento (D.3) |
| Validación en línea y liquidación definitiva de obras sociales | v2 | Requiere convenio por convenio; es el foso más caro (C.2, D.3) |
| API pública con sandbox | v1.1/v2 | Posicionamiento de plataforma; no bloquea el MVP |
| Receta electrónica y ReNaPDiS | Decisión pendiente | Obligación legal si se emiten recetas (`P0-01`) |
| Ortodoncia, estética facial, telemedicina | v2 | Fuera del dolor central |
| App nativa del paciente | v2 | Se resuelve con PWA + WhatsApp |
| Campañas, NPS, fidelización, BI avanzado | v2 | No atacan el problema inicial |
| Firma digital certificada | v1.1 | Se comienza con firma electrónica simple y evidencia |
| Facturación multi-moneda y multi-país | v2 | Mercado inicial Argentina |
| Inventario, laboratorio, radiología/PACS | v2 | Módulos adyacentes |
