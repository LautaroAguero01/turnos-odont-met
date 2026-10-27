# Decisiones y Supuestos

> **Estado.** Las decisiones marcadas como **adoptada (discovery)** provienen de la recomendación final del informe (`discovery/discovery.md` §D) y del checklist §E. Las marcadas como **propuesta (no decidida)** son decisiones técnicas o de alcance de este documento, necesarias para poder planificar, pero sujetas a confirmación. Los supuestos son inferencias; ninguno debe tratarse como hecho verificado.

## Decisiones documentadas

### DD-01 — Producto y segmento inicial
**Estado:** adoptada (confirmada por el usuario).
**Decisión:** construir un SaaS de gestión de turnos y agenda odontológica para Argentina, con foco inicial en el consultorio unipersonal y la clínica chica de 2 a 5 sillones, sin excluir al profesional independiente que atiende obras sociales.
**Contexto:** el discovery identifica que el consultorio unipersonal que atiende obras sociales queda huérfano: los productos baratos no liquidan obras sociales y los que liquidan son caros y opacos (`C.3`, vacío 4). El usuario confirmó este segmento como foco prioritario de v1.0.
**Alternativas consideradas:** (a) clínicas medianas y grandes multi-sede, (b) círculos y gerenciadoras, (c) consultorio unipersonal y clínica chica.
**Justificación:** el segmento (c) es el que sufre el dolor operativo y no tiene una oferta completa a precio accesible; además permite un onboarding autoservicio y un ciclo de venta corto.
**Trade-offs aceptados:** menor ticket promedio y mayor volumen de cuentas; la validación en línea de obras sociales queda fuera de v1.0 porque ese segmento no justifica el costo de convenio por convenio.

### DD-02 — Alcance del MVP
**Estado:** adoptada (discovery).
**Decisión:** el MVP se compone de los ocho imprescindibles de `D.3`: agenda por sillón con prevención de solapamiento; reserva online con reglas; WhatsApp oficial con confirmación; ficha clínica y odontograma FDI; caja, Mercado Pago y seña; roles, multi-sucursal y auditoría; exportación total; cumplimiento mínimo.
**Contexto:** el informe advierte que construir como “diferencial” lo que ya es estándar es un error de posicionamiento (`C.1`).
**Alternativas consideradas:** un turnero mínimo sin historia clínica; un producto administrativo sin agenda; un MVP más amplio con obras sociales en línea.
**Justificación:** los ocho ítems son la tabla de entrada para competir; sin ellos el producto no se puede vender.
**Trade-offs aceptados:** el MVP es exigente para un equipo pequeño; se mitiga con el orden de implementación y con el recorte de obras sociales (`DD-04`).

### DD-03 — Dos diferenciadores para v1.0
**Estado:** propuesta (no decidida).
**Decisión:** construir en v1.0 **lista de espera inteligente** y **facturación ARCA nativa**. El precio público en pesos se trata como decisión comercial y la API pública se posterga a v1.1/v2.
**Contexto:** `D.3` ofrece cuatro candidatos y pide elegir dos, pero dos de ellos son posicionamiento y no funcionalidad. La ambigüedad se registra en `IN-02`.
**Alternativas consideradas:** lista de espera + API pública; ARCA + API pública; los cuatro a la vez.
**Justificación:** lista de espera ataca el sillón vacío y ARCA ataca la carga administrativa; son las dos pérdidas del problema. La API pública no genera ingresos directos en el corto plazo y exige un esfuerzo de documentación y soporte.
**Trade-offs aceptados:** se resigna el posicionamiento “API-first” en el lanzamiento; se compensa con exportación total y una arquitectura preparada para exponerla.

### DD-04 — Obras sociales en v1.0: alcance mínimo
**Estado:** adoptada (confirmada por el usuario).
**Decisión:** en v1.0 se implementa catálogo manual de obras sociales, cobertura por paciente, copago informado, aceptación por profesional y **borrador exportable de liquidación**. No se implementa validación en línea ni liquidación definitiva (diferidas a v2).
**Contexto:** la validación en tiempo real es el foso de DentalTec y requiere convenio por convenio, con una barrera estimada de 12 a 24 meses (`C.2`). El usuario confirmó limitar v1.0 al catálogo manual y borrador exportable, postergando la validación en línea a v2.
**Alternativas consideradas:** (a) no incluir nada de obras sociales en v1.0, (b) incluir validación en línea, (c) incluir el mínimo operativo.
**Justificación:** sin registrar la obra social no se puede cumplir la regla de aceptación por profesional ni calcular el copago; con el mínimo se habilita el circuito y se evita prometer una integración que retrasaría el lanzamiento.
**Trade-offs aceptados:** el consultorio sigue haciendo la validación por su cuenta; el producto no reemplaza todavía al sistema administrativo en ese punto.

### DD-05 — Multi-tenant con base única y RLS
**Estado:** propuesta (no decidida).
**Decisión:** una sola base PostgreSQL, `tenant_id` en todas las tablas de negocio y políticas de Row Level Security.
**Contexto:** el producto es un SaaS para muchas cuentas; el modelo de datos debe aislar datos clínicos sensibles.
**Alternativas consideradas:** una base por tenant; un esquema por tenant; una base única sin RLS.
**Justificación:** la base única simplifica migraciones, respaldos y soporte; RLS agrega una barrera verificable que no depende sólo del código de aplicación.
**Trade-offs aceptados:** el aislamiento lógico exige disciplina y pruebas; una consulta mal escrita puede ser catastrófica si RLS se desactiva. Se mitiga con pruebas de aislamiento en CI y revisión obligatoria de migraciones.

### DD-06 — El sillón como entidad de primera clase
**Estado:** adoptada (derivada del discovery).
**Decisión:** modelar `chair` con disponibilidad propia y usarlo como recurso de agenda, además del profesional.
**Contexto:** la agenda por sillón con bloqueo de solapamiento es un diferenciador de dominio verificado en DentalSoft, Órbita y Dentalink (`C.2`); no es un detalle de interfaz.
**Alternativas consideradas:** agenda sólo por profesional; sillón como atributo de texto del turno.
**Justificación:** sin entidad propia no se puede impedir el doble uso de una silla ni calcular ocupación real.
**Trade-offs aceptados:** mayor complejidad de configuración y de cálculo de disponibilidad.

### DD-07 — Doble validación de solapamiento y tratamiento del sobreturno
**Estado:** propuesta (no decidida).
**Decisión:** validar solapamiento en el dominio y en PostgreSQL con restricciones de exclusión sobre `tstzrange` por profesional y por sillón. Los sobreturnos se marcan con `is_overbook = true`, quedan fuera de la restricción y se limitan a uno por profesional y franja.
**Contexto:** la concurrencia puede producir dos turnos válidos por separado que se superponen; la aplicación sola no alcanza. A la vez, el negocio exige admitir sobreturnos con advertencia (`RN-AG-09`).
**Alternativas consideradas:** sólo validación de aplicación; bloqueo pesimista de toda la agenda; prohibir sobreturnos.
**Justificación:** la base garantiza integridad y el dominio devuelve errores legibles; el sobreturno sigue siendo posible pero controlado y visible.
**Trade-offs aceptados:** la restricción de exclusión requiere `btree_gist` y complica las migraciones; el sobreturno queda exceptuado de la protección automática y depende de la regla de aplicación.

### DD-08 — Monolito modular en lugar de microservicios
**Estado:** propuesta (no decidida).
**Decisión:** un único despliegue de API con módulos de dominio aislados; trabajadores separados para colas.
**Contexto:** equipo pequeño, dominio todavía en validación y necesidad de velocidad de entrega.
**Alternativas consideradas:** microservicios por dominio; arquitectura serverless.
**Justificación:** reduce costo operativo, latencia y complejidad transaccional; permite extraer módulos más adelante si el volumen lo exige.
**Trade-offs aceptados:** un fallo en un módulo puede afectar a todos; se mitiga con límites de módulo, pruebas y despliegue gradual.

### DD-09 — Stack TypeScript, NestJS, PostgreSQL y Prisma
**Estado:** propuesta (no decidida). **Este es el campo de menor confianza del estado (`[DISCOVERY]` en `10_preguntas_abiertas.md`).**
**Decisión:** TypeScript 5.6+, Node.js 22 LTS, NestJS 11, Prisma 6, PostgreSQL 16, Redis 7 con BullMQ, Next.js 15 y React 19.
**Contexto:** no hay stack elegido; la cátedra permite definirlo y pide que quede documentado en la knowledge-base.
**Alternativas consideradas:** Python con FastAPI y SQLAlchemy; Go con Chi y sqlc; Java con Spring Boot.
**Justificación:** un solo lenguaje en backend y frontend, tipado fuerte, ecosistema maduro para SaaS, y buena integración con colas y pruebas.
**Trade-offs aceptados:** mayor consumo de memoria que Go; el equipo debe conocer TypeScript. Si el equipo prefiere otro stack, esta decisión se revisa antes del roadmap (`P0-03`).

### DD-10 — WhatsApp Cloud API oficial y minimización de datos
**Estado:** adoptada (discovery) + propuesta de implementación.
**Decisión:** usar WhatsApp Cloud API oficial con plantillas `utility` aprobadas y opt-in explícito; no enviar datos clínicos. El envío se hace por un trabajador con *outbox* e idempotencia.
**Contexto:** el recordatorio por WhatsApp es un commodity, pero la automatización de punta a punta es un frente de competencia (`§1`). La política de Meta prohíbe datos clínicos y exige plantillas.
**Alternativas consideradas:** WhatsApp Web no oficial; SMS; correo solamente.
**Justificación:** el canal oficial evita bloqueos y permite escalar; la minimización reduce el riesgo legal.
**Trade-offs aceptados:** costo por mensaje y dependencia de la aprobación de plantillas de Meta.

### DD-11 — Seña con Mercado Pago sin custodia de fondos
**Estado:** propuesta (no decidida).
**Decisión:** cada consultorio conecta su propia cuenta de Mercado Pago; la plataforma genera link/QR, concilia por webhook y no retiene fondos de terceros. El horario se retiene 10 minutos mientras se paga.
**Contexto:** el informe recomienda seña con Mercado Pago y liberación automática (`C.3`, vacío 7); evaluar *marketplace/split* no está evidenciado (`E.8`).
**Alternativas consideradas:** cuenta única de la plataforma con *split*; cobro manual; transferencia.
**Justificación:** evita asumir obligaciones de entidad financiera y simplifica la conciliación; el dinero llega directo al consultorio.
**Trade-offs aceptados:** la experiencia de conexión de la cuenta es más compleja para el consultorio; el soporte debe ayudar con la vinculación.

### DD-12 — Exportación total como capacidad permanente
**Estado:** adoptada (discovery).
**Decisión:** permitir exportación completa en JSON, CSV y PDF, con manifiesto y checksum, en cualquier momento y aun con la cuenta suspendida. El enlace vence a los 7 días.
**Contexto:** el lock-in es un riesgo legal y comercial; Dentalink elimina la cuenta a los 30 días de impago y Bilog exporta sólo CSV a la baja (`C.3`, vacío 6). DentalCore usa la exportación como argumento comercial (`C.2`).
**Alternativas consideradas:** exportación sólo al momento de la baja; exportación limitada a tablas operativas.
**Justificación:** es un diferenciador de confianza y una obligación práctica frente a datos sensibles.
**Trade-offs aceptados:** costo de almacenamiento y de generar paquetes grandes; se mitiga con vencimiento y compresión.

### DD-13 — PWA y WhatsApp en lugar de aplicación nativa
**Estado:** propuesta (no decidida).
**Decisión:** el paciente usa una PWA accesible por enlace y WhatsApp; no se desarrolla app nativa en v1.0.
**Contexto:** el informe sugiere empezar con PWA + WhatsApp (`D.3`).
**Alternativas consideradas:** app nativa iOS/Android; sólo WhatsApp.
**Justificación:** reduce costo, evita dependencia de tiendas y cubre el caso de uso principal (reservar y confirmar).
**Trade-offs aceptados:** menor engagement y ausencia de notificaciones push propias; se compensa con WhatsApp.

### DD-14 — Sin receta electrónica en v1.0
**Estado:** adoptada (confirmada por el usuario). **Resuelve `P0-01`.**
**Decisión:** el producto no emite recetas electrónicas en v1.0 y no se inscribe en ReNaPDiS; si el consultorio las necesita, se integra con un sistema que sí las emita.
**Contexto:** el informe advierte que emitir recetas es una obligación legal (Decreto 345/2024 y Resolución 1959/2024) y no un feature menor (`D.3`, §E.9). El usuario confirmó que en v1.0 no se emiten recetas para acotar el alcance regulatorio y de firma.
**Alternativas consideradas:** emitir recetas propias e inscribirse; no emitir; integrarse con terceros.
**Justificación:** inscribirse en ReNaPDiS exige cumplir requisitos técnicos y regulatorios que exceden el MVP; la integración puede resolverse después.
**Trade-offs aceptados:** el producto no cubre el circuito completo de prescripción; puede ser un requisito de compra para algunas clínicas. Debe confirmarse antes del roadmap.

### DD-15 — Precio público en pesos y onboarding autoservicio
**Estado:** propuesta (no decidida).
**Decisión:** publicar precios en ARS y permitir que el consultorio se dé de alta sin intervención comercial, con un periodo de prueba de 14 días.
**Contexto:** los jugadores con profundidad administrativa no publican precios y los baratos no resuelven el circuito; el arbitraje de producto es precio claro con administración (`B`, lectura crítica; `C.2`).
**Alternativas consideradas:** cotización por asesor; precio en dólares; freemium.
**Justificación:** la transparencia es un argumento de venta en un mercado que cotiza por asesor y cobra en dólares.
**Trade-offs aceptados:** la indexación y el costo de WhatsApp pueden erosionar el margen; el modelo de precios queda abierto (`P1-04`).

### DD-16 — Separación entre acceso administrativo y acceso clínico
**Estado:** propuesta (no decidida).
**Decisión:** el rol administrativo no accede al contenido clínico; el acceso requiere rol `professional` y vínculo con el paciente. Toda lectura se audita.
**Contexto:** los datos de salud son sensibles (Ley 25.326, arts. 2, 7 y 9) y varios competidores no evidencian auditoría completa (`C.3`, vacío 5).
**Alternativas consideradas:** acceso amplio para el titular; acceso por sucursal; acceso sólo al profesional tratante.
**Justificación:** reduce el riesgo de acceso innecesario y convierte la privacidad en una característica del producto.
**Trade-offs aceptados:** la recepción no puede resolver consultas clínicas por teléfono; se deriva al profesional.

### DD-17 — Firma electrónica simple con evidencia
**Estado:** propuesta (no decidida).
**Decisión:** usar firma electrónica simple con hash, sello temporal, IP y agente de usuario; no firma digital certificada en v1.0.
**Contexto:** el informe sugiere empezar con firma electrónica simple y evidencia (`D.3`); la firma digital certificada queda para una etapa posterior.
**Alternativas consideradas:** firma digital certificada desde el inicio; firma en papel escaneada.
**Justificación:** cubre el consentimiento informado y reduce fricción; la certificación agrega costo y complejidad.
**Trade-offs aceptados:** menor fuerza probatoria que la firma digital; se documenta la limitación y se ofrece upgrade.

## Supuestos inferidos

### SU-01 — El dolor principal es ausentismo más carga administrativa
**Supuesto:** los consultorios priorizan reducir sillones vacíos y trabajo administrativo por encima de funcionalidades clínicas avanzadas.
**Origen:** `discovery.md` §E.1, con la advertencia explícita de que es un supuesto a confirmar.
**Riesgo si es falso:** el producto podría invertir en agenda y automatización cuando el mercado valora más la historia clínica o la facturación.
**Cómo validar:** entrevistas con 10 a 15 consultorios y análisis de su tasa de no-show y horas administrativas.

### SU-02 — El segmento inicial es consultorio unipersonal y clínica chica
**Supuesto:** el segmento de 1 a 5 sillones es el que tiene mayor dolor y menor oferta adecuada.
**Origen:** `C.3` (vacío 4) y `DD-01`.
**Riesgo si es falso:** el producto queda con un ticket bajo y un costo de adquisición alto; las clínicas grandes exigirían obras sociales en línea.
**Cómo validar:** pipeline de ventas y tasa de conversión por segmento durante el piloto.

### SU-03 — Existe disposición a pagar un precio público en pesos
**Supuesto:** el consultorio acepta pagar una suscripción mensual en ARS por un producto que resuelve agenda, WhatsApp y ARCA.
**Origen:** `C.2` (precio publicado) y `DD-15`.
**Riesgo si es falso:** el modelo comercial no cierra; el mercado podría estar acostumbrado a precios en dólares o a cotización opaca.
**Cómo validar:** prueba de precio con tres niveles y medición de conversión de trial a pago.

### SU-04 — La lista de espera encuentra pacientes disponibles
**Supuesto:** hay suficientes pacientes en espera como para cubrir una parte relevante de las cancelaciones.
**Origen:** `C.3` (vacío 1) y `C.4` (oportunidad 2).
**Riesgo si es falso:** el diferenciador no produce el ROI prometido y se vuelve una función secundaria.
**Cómo validar:** piloto con 20 consultorios midiendo ofertas aceptadas sobre cancelaciones elegibles.

### SU-05 — Los pacientes aceptan pagar una seña online
**Supuesto:** la seña por Mercado Pago reduce el no-show sin agregar fricción excesiva.
**Origen:** `C.3` (vacío 7) y `D.3` (imprescindible 5).
**Riesgo si es falso:** la conversión de reserva online cae y el consultorio prefiere cobrar en el local.
**Cómo validar:** experimento A/B en el link público con y sin seña.

### SU-06 — El costo de WhatsApp puede incluirse en el plan
**Supuesto:** el precio de los mensajes `utility` (USD 0,026 por mensaje según el relevamiento) es absorbible en el plan sin destruir el margen.
**Origen:** `E.10` (dependencia de WhatsApp) y `A.4` (costos adicionales).
**Riesgo si es falso:** el uso intensivo genera pérdida por cuenta; habría que cobrar por mensaje.
**Cómo validar:** modelar costo por turno confirmado con datos reales de 30 días y definir límites de uso.

### SU-07 — El catálogo de obras sociales puede configurarse manualmente
**Supuesto:** el consultorio conoce sus códigos, copagos y condiciones y puede cargarlos sin un nomenclador oficial integrado.
**Origen:** `C.2` (validación en línea es el foso de DentalTec) y `DD-04`.
**Riesgo si es falso:** la carga manual es inviable y el borrador de liquidación no se usa.
**Cómo validar:** prueba de carga con 5 consultorios y medición de tiempo y errores.

### SU-08 — La infraestructura del consultorio permite operar online
**Supuesto:** el consultorio tiene internet estable, al menos un dispositivo con navegador moderno y un teléfono con WhatsApp.
**Origen:** contexto operativo inferido del relevamiento; no está medido.
**Riesgo si es falso:** la adopción se frena por conectividad o por equipos obsoletos.
**Cómo validar:** encuesta de infraestructura en el piloto y diseño de una experiencia de baja conectividad.

### SU-09 — El consultorio puede gestionar su certificado de ARCA
**Supuesto:** el titular o su contador puede obtener y renovar el certificado digital, con asistencia de la plataforma.
**Origen:** `C.2` (ARCA como diferenciador) y `E.8`.
**Riesgo si es falso:** la facturación no se activa y el diferenciador queda inaccesible.
**Cómo validar:** onboarding asistido con 5 consultorios y medición del tiempo hasta la primera factura.

### SU-10 — El tamaño de mercado debe estimarse, no medirse
**Supuesto:** no hay datos oficiales de odontólogos ni de penetración; el TAM se estima a partir de fuentes indirectas.
**Origen:** advertencia metodológica del discovery y `E.10`.
**Riesgo si es falso:** el plan comercial se dimensiona sobre una base errónea.
**Cómo validar:** triangulación con colegios profesionales, cámaras y datos de empleo, aceptando el margen de error.

### SU-11 — El periodontograma no es bloqueante para v1.0
**Supuesto:** el segmento inicial no exige periodontograma de seis sitios para adoptar el producto.
**Origen:** `D.3` lo ubica en v1.1 y lo considera imprescindible sólo si el target incluye periodoncia.
**Riesgo si es falso:** se pierden clínicas con foco en periodoncia.
**Cómo validar:** entrevistas con periodoncistas y análisis de la demanda en el piloto.

### SU-12 — El equipo puede entregar el MVP en el marco del trabajo académico
**Supuesto:** el alcance de v1.0 es compatible con el tiempo y el equipo disponibles; el trabajo exige un único change implementado y archivado.
**Origen:** consigna de la cátedra (`desarrollo-active-stack.pdf`) y estado greenfield.
**Riesgo si es falso:** el alcance se recorta o el change queda incompleto.
**Cómo validar:** roadmap con un change pequeño y verificable; priorizar el flujo de creación de turno sin solapamiento.

### SU-13 — La figura de responsabilidad de datos puede resolverse por contrato
**Supuesto:** la plataforma y el consultorio pueden operar como corresponsables con roles documentados, sin que la plataforma sea responsable principal del tratamiento.
**Origen:** `E.11`, pregunta 9; `RN-PR-13`.
**Riesgo si es falso:** la plataforma asume obligaciones legales más pesadas y debe cambiar contratos, hosting y procesos.
**Cómo validar:** revisión legal con especialista en protección de datos y modelo de contrato de adhesión.

### SU-14 — Es posible alojar con un proveedor que cumpla la Ley 25.326
**Supuesto:** existe una opción de hosting (en Argentina o en el exterior con garantías) que satisface el artículo 12 y las expectativas de los clientes.
**Origen:** `E.9` (transferencia internacional restringida) y `P0-04`.
**Riesgo si es falso:** el producto no puede operar legalmente con el proveedor elegido o pierde clientes por objeción de residencia.
**Cómo validar:** análisis legal de opciones y consulta a clientes piloto sobre exigencia de hosting local.

## Registro de cambios

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-10-27 | Creación del documento | Fase de knowledge-base del flujo de fundación |
| 2026-10-27 | Confirmación de DD-01, DD-04 y DD-14 | Decisiones de alcance del usuario previo a roadmap-generator |
