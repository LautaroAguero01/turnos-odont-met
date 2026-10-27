# Actores y Roles

> **Estado.** Los actores provienen del checklist de discovery (§E.2) y de la operación observada en los competidores (§A.3). La matriz RBAC es una **propuesta (no decidida)** derivada de las restricciones de la Ley 25.326 y de la Ley 26.529: el acceso a datos clínicos no se concede por jerarquía administrativa, sino por rol clínico y vínculo con el paciente.

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| **Odontólogo/a titular** | Profesional que decide la compra y, en consultorios pequeños, también atiende y administra | PWA de gestión; puede acumular los roles `owner` y `professional` |
| **Administrador/a de la cuenta** | Persona que configura sucursales, sillones, prestaciones, usuarios y facturación | PWA de gestión, sección Configuración |
| **Recepcionista / secretaria** | Agenda, confirma, cobra, gestiona la lista de espera y responde consultas | PWA de gestión; es el usuario de mayor frecuencia de uso |
| **Odontólogo/a asociado** | Profesional que atiende en la clínica y necesita ver su agenda, sus pacientes y su liquidación | PWA de gestión con alcance restringido a su agenda y sus pacientes |
| **Administrativo/a de obras sociales y facturación** | Valida prestaciones, registra copagos, liquida y emite comprobantes | PWA de gestión, módulos Cobros y Facturación |
| **Paciente** | Persona que reserva, confirma, cancela, paga la seña y consulta su información | Portal PWA por enlace mágico o token; WhatsApp para notificaciones |
| **Operador de la plataforma** | Personal interno del SaaS: soporte, altas, planes y observabilidad | Consola interna; sin acceso al contenido clínico salvo *break-glass* auditado |
| **Integrador / cliente de API** | Tercero autorizado que consume la API pública | Token de API con alcance limitado (v1.1/v2; fuera de v1.0) |
| **Sistemas externos** | Meta/WhatsApp, Mercado Pago, ARCA, Google Calendar y obras sociales | Webhooks y llamadas salientes; no son usuarios con sesión |

### Actores internos de la plataforma

| Componente | Función | Permisos efectivos |
|---|---|---|
| Trabajador de recordatorios | Envía plantillas de WhatsApp y reintenta fallos | Lectura de turnos y mensajes del tenant; escritura de `MessageLog` |
| Trabajador de lista de espera | Detecta huecos, emite ofertas y expira ventanas | Lectura/escritura de `WaitlistEntry` y `WaitlistOffer` |
| Trabajador de facturación | Emite comprobantes pendientes y reintenta ante caída de ARCA | Lectura de pagos y escritura de `Invoice` |
| Trabajador de exportación | Genera paquetes de datos y los publica | Lectura global del tenant; escritura de `ExportRequest` |
| Conciliador de pagos | Procesa webhooks de Mercado Pago y concilia | Lectura/escritura de `Payment` y `Deposit` |

## RBAC — Matriz de permisos

**Notación:** `C` crear · `R` leer · `U` actualizar · `D` eliminar o dar de baja · `A` aprobar, firmar o emitir · `—` sin acceso · `P` parcial (sólo los registros propios o los estrictamente necesarios).

Los roles son **acumulables**: un usuario puede ser `owner` y `professional` a la vez. La autorización efectiva es la unión de sus roles, con la restricción adicional de vínculo clínico.

| Recurso | Titular (`owner`) | Administrador (`admin`) | Recepcionista (`receptionist`) | Profesional (`professional`) | Facturación (`billing`) | Operador de plataforma | Paciente |
|---|---|---|---|---|---|---|---|
| Datos de la cuenta y plan | R U | R | — | — | — | R U | — |
| Sucursales | C R U D | C R U | R | R | R | — | — |
| Sillones | C R U D | C R U D | R | R | — | — | — |
| Usuarios e invitaciones | C R U D | C R U | — | — | — | R | — |
| Roles y permisos | C R U D | R | — | — | — | R | — |
| Prestaciones y duración | C R U D | C R U D | R | R | R | — | R |
| Horarios y bloqueos | C R U D | C R U D | C R U | C R U (propios) | — | — | — |
| Obras sociales aceptadas | C R U D | C R U D | R | C R U (propias) | R | — | — |
| Pacientes (demografía y contactos) | C R U D | C R U D | C R U | R P | R | — | R P |
| Historia clínica y notas | — | — | — | C R U A (pacientes propios) | — | — | R P (copia) |
| Odontograma | — | — | — | C R U (pacientes propios) | — | — | R P (copia) |
| Planes de tratamiento y presupuestos | — | R | R | C R U (pacientes propios) | R | — | R P |
| Consentimientos informados | — | R | R | C R U A | — | — | R A P |
| Turnos y agenda | C R U D | C R U D | C R U D | R P U P (propios) | R | — | C R U P (propios) |
| Lista de espera | C R U D | C R U D | C R U D | R P | — | — | C R U P (propio) |
| Caja y pagos | R | R | C R U | R P (producción propia) | C R U | — | R P (propios) |
| Señas y devoluciones | R A | R A | C R | — | C R A | — | R P |
| Facturas y notas de crédito | R | R | R | — | C R A | — | R P |
| Reportes operativos | R | R | R P | R P (propios) | R | — | — |
| Auditoría | R | R | — | — | — | R P (*break-glass*) | — |
| Exportación total | C R | R | — | — | — | — | R P (su historia) |
| Mensajes y plantillas | R | C R U | C R | — | — | — | — |
| Configuración de integraciones | C R U D | C R U | — | — | R | — | — |

### Reglas de composición

- **El acceso clínico exige rol `professional` y vínculo con el paciente.** El titular que no ejerce como profesional no puede leer historias clínicas; si atiende, acumula el rol `professional`.
- **La recepcionista no accede al contenido clínico.** Puede ver que un paciente tiene una historia clínica y gestionar el turno, pero no notas, diagnósticos, odontograma ni imágenes. Esta separación reduce el riesgo de acceso innecesario a datos sensibles (Ley 25.326, art. 9).
- **Facturación no accede al detalle clínico.** Sólo ve la prestación facturada, el código y el importe; no el diagnóstico.
- **El operador de la plataforma no tiene acceso permanente.** Cualquier acceso de soporte requiere justificación, aprobación del titular y queda registrado como evento `break_glass` con vencimiento automático.
- **El paciente sólo accede a sus propios datos** mediante enlace mágico o token firmado de corta duración; no existe registro con contraseña en v1.0.
- **Los roles no se eliminan si tienen usuarios activos:** se desactivan y se reasignan.

## Rutas públicas

| Ruta | Método | Qué expone | Protección |
|---|---|---|---|
| `/b/{slug}` | GET | Página de reserva del consultorio: nombre comercial, sucursales, prestaciones y profesionales visibles | Rate limit por IP; sin datos de pacientes |
| `/api/v1/public/{slug}/availability` | GET | Huecos disponibles según prestación, profesional y sucursal | Rate limit; no revela identidad de otros pacientes |
| `/api/v1/public/{slug}/appointments` | POST | Alta de turno con datos mínimos del paciente | Validación, captcha opcional, idempotencia y token de verificación |
| `/api/v1/public/appointments/{token}` | GET | Detalle del propio turno | Token firmado de 256 bits con vencimiento |
| `/api/v1/public/appointments/{token}/cancel` | POST | Cancelación según política | Token firmado; ventana de cancelación |
| `/api/v1/public/offers/{token}/accept` | POST | Aceptación de un hueco ofrecido por lista de espera | Token de un solo uso y vencimiento en minutos |
| `/api/v1/public/offers/{token}/decline` | POST | Rechazo explícito de la oferta | Token de un solo uso |
| `/api/v1/public/patients/{token}/clinical-record` | GET | Copia de la historia clínica del paciente | Token de un solo uso, vencimiento corto y auditoría |
| `/api/v1/webhooks/whatsapp` | POST | Eventos de Meta | Firma `X-Hub-Signature-256` |
| `/api/v1/webhooks/mercadopago` | POST | Eventos de pago | Firma y consulta de estado al emisor |
| `/api/v1/health`, `/api/v1/ready` | GET | Estado del servicio | Sin datos sensibles; rate limit |

### Reglas de las rutas públicas

- Ninguna ruta pública devuelve apellidos, documentos, teléfonos ni motivos de consulta de terceros.
- El listado de disponibilidad muestra únicamente fecha, hora, profesional (nombre y especialidad) y sucursal.
- Todo token público es **de un solo uso cuando produce un efecto** (aceptar oferta, cancelar, descargar historia clínica) y expira en un plazo corto.
- Los intentos fallidos de acceso a un token se registran y se limitan por IP y por token.
- El link público del consultorio puede desactivarse sin afectar la operación interna.
