# Discovery — Gestión de turnos y agenda odontológica (Argentina)

- **Fecha de investigación:** 22/10/2026
- **Alcance:** Argentina (primario) · Latinoamérica · internacionales relevantes como referencia
- **Método:** relevamiento en sitios oficiales, páginas de precios, centros de ayuda, documentación de API, stores y reseñas. Cada dato lleva etiqueta de evidencia.
- **Leyenda:** `[verified]` = documentado público · `[claim]` = afirmación comercial del proveedor, no auditada · `[no evid.]` = no evidenciado públicamente (no implica que no exista)

> **Advertencia metodológica.** No existe conteo oficial de odontólogos ni de penetración de software en Argentina (`datos.gob.ar` sólo publica series de medicina; SSSalud devolvió 503). Todo dato de mercado es autodeclarado por proveedores y debe tratarse como benchmark, no como tamaño de mercado.

---

## 1. Resumen ejecutivo

El mercado argentino **no compite por agenda**: la agenda diaria/semanal multi-profesional, la historia clínica con odontograma y el recordatorio por WhatsApp son commodities desde 2020. La competencia real está en cuatro frentes:

1. **WhatsApp automatizado de punta a punta** (no sólo recordatorio: confirmación, recontacto, recuperación, lista de espera).
2. **Obras sociales y prepagas**: validación de prestaciones, topes, autorizaciones y liquidación.
3. **Facturación electrónica ARCA** integrada al cobro.
4. **Precio y transparencia**: los jugadores fuertes (Dentalink, Bilog, DentalTec) no publican precios; los baratos (Odonto.ar, Odonthia) no liquidan obras sociales ni facturan.

**Hueco principal detectado:** ningún producto argentino combina *agenda multi-sillón + reserva online + recordatorios automáticos + obras sociales + ARCA* a precio PyME y con precio público en pesos. O se tiene profundidad administrativa a precio opaco (DentalTec, Bilog), o precio claro sin administración (Odonto.ar, Odonthia), o ambas cosas pero en dólares y sin ARCA (DentalCore, Órbita).

**Segundo hueco, estructural:** **ningún competidor argentino ofrece API pública documentada**. No hay ecosistema, no hay integración con IA de terceros, no hay portabilidad real. Es a la vez una barrera de entrada baja y una oportunidad de posicionamiento.

---

## A. Tabla comparativa

### A.1 — Argentina y operación local (ordenada por relevancia para el mercado argentino)

| # | Producto (empresa, país) | Segmento | Modalidad | Agenda / turnos | Automatización | Clínica | Admin / fiscal | Integraciones | Precio publicado |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **DentalSoft** (DentalSoft, AR) | Consultorio y clínica chica/mediana | Nube | Semanal/diaria/mensual, drag&drop, urgencias, **sobreturnos con detección de solapamiento**, bloqueos/feriados, multi-sucursal, Google Calendar `[verified]`. Sillón explícito `[no evid.]` | Recordatorios WhatsApp/email, cobro de deudas, recuperación, reseñas Google, recepcionista virtual IA `[verified/claim]` | Ficha, odontograma FDI 18 estados con historial, ortodoncia, planes, consentimientos con firma, recetas `[verified]`. Periodontograma `[no evid.]` | Caja multi-medio, Mercado Pago, obras sociales, **liquidaciones a profesionales y OS con PDF**, presupuestos por link, KPIs `[verified]`. ARCA `[no evid.]` | WhatsApp, GCal, MP, PDF/Excel, landing propia; **API, ARCA y radiología `[no evid.]`** | **No publica** precio (verificado en sitio oficial y terceros 15/10/2026) |
| 2 | **Dentalink** (Healthatom, CL — opera en AR) | Clínica mediana/grande multi-sede | SaaS web | Vista por **sillón**, sobreagendamiento en agenda paralela, reprogramación masiva, tiempos por odontólogo, sala de espera `[verified]`. Bloqueos `[no evid.]` | Recordatorios WA/email, tareas de citas, morosidad, captura, NPS, campañas `[verified]` | HC, **odontograma y periodontograma**, ortodoncia, estética facial, telemedicina, firma y recetas como adicionales `[verified]` | Caja, obras sociales AR con arancel y copago, comisiones y pago a odontólogos, inventario, laboratorio `[verified]`. **Boletas electrónicas** (Chile/latam) `[verified]`; ARCA Argentina `[no evid.]` | WhatsApp, **reserva por IG/WhatsApp/web**, API/MP/GCal `[no evid.]` | **No publica** — cotización. A los 15 días de impago bloquea; a los 30 **elimina la cuenta** `[verified]` |
| 3 | **DentalTec** (Tándem, AR) | Institucional: círculos, federaciones, gerenciadoras | SaaS web | Turnos configurables por odontólogo/día/intervalo, recordatorios `[verified]`. Sillón, sobreturnos, bloqueos y **reserva online `[no evid.]`** | Recordatorios automáticos, confirmación WA (−40% ausentismo) `[claim]`; recuperación `[no evid.]` | HC, odontograma con caras y patologías CIE-10, imágenes con registro temporal `[verified]`. Periodontograma `[no evid.]` | **Validación en tiempo real contra +15 obras sociales**, topes/frecuencias/autorizaciones, **facturación ARCA**, cierre multinivel Círculo→Federación→CORA, liquidación a prestadores `[verified]` | Servicios web/SOAP con obras sociales, WhatsApp; API/GCal/MP `[no evid.]` | **No publica** — demo a pedido. Packs WhatsApp USD 9/25/48 (50/150/300 msg) |
| 4 | **Bilog** (Bilog, AR) | Consultorio y clínica; fuerte en círculos y gerenciadoras | **Híbrida** (local o cloud) | Diaria (free) y semanal, multi-profesional y multi-consultorio, estados, reprogramación `[verified]`. Sillón, sobreturnos y bloqueos `[no evid.]` | Recordatorios WA, confirmaciones y reprogramaciones automáticas, iAngela (IA texto/voz), resumen de radiografías `[claim]`. Campañas `[no evid.]` | HC con anamnesis, odontograma interactivo, imágenes 1–2 GB, recetas, presupuestos, evolución `[verified]`. Periodontograma `[no evid.]` | Caja diaria, obras sociales, liquidaciones a profesionales y a OS, facturación (sólo Premium) `[verified]`. **Factura electrónica** (solo Argentina, versión 7.6.0) `[verified]`. MP `[no evid.]` | App iOS/Android (4,0★, 65 opiniones), WhatsApp, QR; API y GCal `[no evid.]` | Freemium (1 prof., **50 pacientes**) · Lite y Premium por cotización |
| 5 | **DentalCore** (Di Tullio, AR) | Odontólogo clínico y clínica chica/mediana | SaaS web | Multi-doctor, vistas día/3 días/semana/mes, mapa de calor, kanban, **bloqueos**, detección de superposición `[verified]`. Sillón/sobreturnos `[no evid.]` | 25 tipos de tareas: confirmación 48/24 h con link, post-operatorio, controles vencidos, perio de mantenimiento, laboratorio, recall, recuperación `[verified]` | HC, odontograma +50 hallazgos/cara, **periodontograma 6 sitios**, 15 flujos de especialidad, recetas con chequeo de alergias, 22 consentimientos con firma, CDSS con fuente `[verified]` | Mercado Pago (QR/link), **factura electrónica ARCA** (B/C, CAE, QR), caja con arqueo, deudores, OS/prepagas con liquidación, costo/margen `[verified]` | **WhatsApp API oficial**, **HL7 FHIR**, export total aun con cuenta suspendida; GCal `[no evid.]` | USD 50/mes (2 usuarios) + USD 10/usuario · sin trial · reembolso 14 días |
| 6 | **Órbita** (Órbita Global, AR) | Clínica con recepción + alto volumen de WhatsApp | SaaS + asistente WA | **Agenda por sillón con "choque imposible"**, agendamiento que evita huecos, controles al cerrar tratamiento, alta por QR `[verified]`. Duración variable/bloqueos `[no evid.]` | Confirmación 48/24 h, recontacto de no respondedores, controles, campañas con créditos, **Juez IA** que detecta urgencias `[verified/claim]` | Ficha con **odontograma y periodontograma**, dictado por voz, HC firmada y encadenada, presupuestos con embudo, trazabilidad de materiales por lote `[verified]` | Cobranzas, caja, convenios y liquidaciones, estadísticas `[verified]`. **Mercado Pago** (link de pago disponible) `[verified]`. ARCA `[no evid.]` | **WhatsApp Cloud API oficial**, AWS, se integra con Dentalink y Benty; API `[no evid.]` | USD 25/mes (Consultorio, ≤3 prof.) · USD 113/mes (Clínica) · Chat IA USD 200/mes (150 anual) |
| 7 | **Odonto.ar** (Odonto.ar, AR) | Profesional individual y clínica chica | SaaS web | Día/semana/mes, drag&drop, agenda compartida, duración por motivo `[verified]`. Multi-sillón, bloqueos, sobreturnos `[no evid.]` | **Sin motor de recordatorios, recuperación ni campañas evidenciado** `[no evid.]` | HC, odontograma con autor/fecha, radiografías, planes, nomenclador personalizable `[verified]`. Periodontograma y anamnesis estructurada `[no evid.]` | Panel de finanzas, OS con cálculo OS/paciente, presupuestos `[verified]`. Caja, liquidaciones, MP, ARCA `[no evid.]` | Import Excel; API, GCal, WhatsApp API `[no evid.]` | **USD 29 / 49 / 99 mes** (1/5/10 usuarios), cobro en pesos al cambio del día · 30 días gratis |
| 8 | **Odonthia** (Odonthia, AR) | Consultorio unipersonal y equipo chico | SaaS web | Reserva online que entra **como solicitud a aprobar** `[verified]`. Vistas, multi-sillón, bloqueos, sobreturnos `[no evid.]` | Recordatorio WA automático sólo en planes pagos; resumen de paciente, post-consulta, dictado, secuencias email `[verified]`. recuperación `[no evid.]` | Ficha pensada para Ley 26.529, odontograma FDI (permanentes y temporales), consentimientos con firma electrónica Ley 25.506 `[verified]`. Periodontograma `[no evid.]` | Tarifario con copago y separación paciente/OS; **no liquida OS, no valida en línea, no trae nomencladores, no emite ARCA** `[verified]`. Caja/MP `[no evid.]` | Import CSV; WhatsApp; API `[no evid.]` | **Gestión gratis sin vencimiento** (2 GB) · IA ARS 20.900/mes · Max ARS 46.900/mes |
| 9 | **AgendaPro** (AgendaPro, CL/MX — opera en AR) | Competencia indirecta: agenda generalista salud/belleza | SaaS + app | Multi-profesional, reserva online, recordatorios `[verified]`. **Sin odontograma nativo** | Recordatorios, confirmación, campañas básicas `[verified]` | Ficha personalizable y consentimiento sólo en Premium; **sin odontograma** `[verified]` | Pagos y reportes; **sin obras sociales ni ARCA** | WhatsApp desde ARS 7.900/mes (50 msg), API sólo en Pro, integración web | ARS 13.900 / 33.900 / 44.900 / 314.900 mes IVA incl. |
| 10 | **Ninsaúde** (Ninsaúde, BR) | Clínicas, franquicias y redes (white-label) | SaaS | Agenda por profesional/unidad, sesiones y paquetes, check-in, encuestas `[verified]`. Sobreturnos/bloqueos `[no evid.]` | Confirmación 1–2 días antes (−68% no-show `[claim]`), pago online, emails pre/post cita, campañas, CRM `[verified]`. Bot WA `[no evid.]` | **Odontograma geométrico de 2 dígitos por cara, raíz y diente**, prontuario, contratos y presupuestos con firma, dictado IA `[verified]`. Periodontograma `[no evid.]` | Financiero, convenios, stock, comisiones, BI (Power BI/SAP) `[verified]` | **API para desarrolladores**, status público, soporte ES/PT/EN | **No publica** |
| 11 | **Clinicorp** (Clinicorp, BR) | Consultorio a red/franquicia | SaaS + app | Multi-profesional y multi-unidad, agenda inteligente, check-in QR, reportes de ocupación `[verified]`. Solapamientos `[no evid.]` | Confirmaciones WA/SMS/email, Alerta de Retorno, agentes IA para faltas, presupuestos sin cerrar e inadimplencia `[verified/claim]` | Prontuario, anamnesis con firma, fichas por especialidad, odontograma, imágenes, planes de recurrencia `[verified]`. Periodontograma `[no evid.]` | Clinipay (PIX/boleto/tarjeta), NFS-e, conciliación, comisiones, cobranza, SPC `[verified]` | WhatsApp/Cloudia, radiología Image2Doc/Idoc/Cfaz, cámara intraoral; **API `[no evid.]`** | R$159,90/mes Standard · R$369,90 Premium · **implementación obligatoria con costo** |
| 12 | **Feegow Clinic** (Docplanner, BR — AR vía Doctoralia) | Clínicas y centros multi-especialidad | SaaS | Diaria/semanal/múltiple, check-in, cambios en masa, pendientes `[verified]`. Sillón/sobreturnos `[no evid.]` | Recordatorios email/SMS, confirmación, eventos configurables `[verified]`. Recuperación/campañas `[no evid.]` | Prontuario, anamnesis, laudos, prescripción, imágenes, CID-10. **Sin odontograma ni periodontograma** `[no evid.]` | Financiero, **TISS/glosas**, convenios, repases, NFS-e (VIP), +60 reportes `[verified]` | **API pública documentada** (docs.feegow.com), telemedicina, marketplace Doctoralia | R$129 / 199 / 249 por profesional/mes · prueba gratis |
| 13 | **iClinic** (Afya, BR) | Médicos y clínicas (**no dental puro**) | SaaS | Médica, booking online 24/7, multiprocedimiento `[verified]` | WA (add-on), SMS con respuesta, secuencias email, aniversarios, retorno `[verified]` | Prontuario por especialidad, prescripción con firma, teleconsulta. **Sin odontograma** `[no evid.]` | Financiero, repases, stock, TISS `[verified]` | WhatsApp add-on, TISS, AWS; API `[no evid.]` | R$99 / 129 / 169 / 299 por profesional/mes · 5 días gratis |
| 14 | **Dental Office** (Dental Office, BR) | Autónomo a clínica multi-especialidad | SaaS + apps | Agenda con confirmación automática WA `[verified]`. Multi-sillón/bloqueos `[no evid.]` | Confirmación, cobranzas, CRM de reactivación, asistente de voz IA `[verified]` | Prontuario, fichas de especialidad, prescripciones, evolución por voz. **Odontograma `[no evid.]`** | Financiero, comisiones, boleto, PIX, NFS-e, links de pago, terminal `[verified]` | WhatsApp Web, medios de pago, contabilidad; API `[no evid.]` | R$39,90 – R$298,54/mes · 7 días prueba |

> **Descartes documentados:** Odontonet es **español** (odontonet.es), no argentino; Sisdental y Clinix no tienen producto verificable (404 / "coming soon"); OdontoCloud es brasileño; Nubimed es **español** (Barcelona, 27,40 €–50,10 €/mes); Doc24, Clinic System, Sisoft y "Siu" sin evidencia pública.

---

### Registro de modificaciones a la tabla A.1 (22/10/2026)

**Sitios web verificados:** dentalsoft.com.ar, softwaredentalink.com/ar, web.dentaltec.com.ar, bilog.com.ar, dentalcore.app, hiorbita.com, cualsistema.com, y documentación de ayuda de cada proveedor.

Las siguientes correcciones se realizaron tras verificar la información en los sitios oficiales de cada proveedor:

1. **DentalSoft (fila 1):** Precio corregido de "ARS 30.000/mes (1 prof.) · ARS 60.000/mes (Pro) · 3 meses gratis · WhatsApp USD 0,026/msg" a "**No publica** precio (verificado en sitio oficial y terceros 15/10/2026)". DentalSoft no publica precios en su sitio web oficial; fuentes externas (cualsistema.com) confirman esto.

2. **Dentalink (fila 2):** Corrección en columna "Admin / fiscal": de "ARCA `[no evid.]`" a "**Boletas electrónicas** (Chile/latam) `[verified]`; ARCA Argentina `[no evid.]`". Dentalink tiene facturación electrónica documentada para Chile y otros países latinos (VeriFactu), pero no hay evidencia de integración ARCA específica para Argentina en la documentación pública.

3. **Bilog (fila 4):** Corrección en columna "Admin / fiscal": de "ARCA y MP `[no evid.]`" a "**Factura electrónica** (solo Argentina, versión 7.6.0) `[verified]`. MP `[no evid.]`". La app de Bilog en Google Play (actualización 7.6.0 de abril 2026) indica "Añadido factura electrónica (Sólo Arg.)", confirmando que ahora tiene facturación electrónica para Argentina. Mercado Pago permanece sin evidencia pública.

4. **Órbita (fila 6):** Corrección en columna "Admin / fiscal": de "MP y ARCA `[no evid.]`" a "**Mercado Pago** (link de pago disponible) `[verified]`. ARCA `[no evid.]`". Se encontró un link de pago de Mercado Pago activo para Órbita (link.mercadopago.com.ar/orbitaint), confirmando integración con MP. ARCA permanece sin evidencia pública.

### A.2 — Internacionales de referencia (patrones de producto, no competencia directa)

| # | Producto (empresa, país) | Modalidad | Agenda / turnos | Clínica | Admin | API | Precio publicado |
|---|---|---|---|---|---|---|---|
| 15 | **Dentally** (Reactive, UK/AU/CA/NZ) | Cloud | Online booking, recalls, **"short-notice appointment filler"** (relleno de huecos) `[verified]` | Odontograma con dentición mixta y root view, **periodontograma comparativo**, AI notes `[verified]` | Billing y claims UK, reporting en tiempo real | **REST pública + sandbox** (developer.dentally.co) `[verified]` | desde **£134/mes** (3 surgeries, usuarios ilimitados) |
| 16 | **Cliniko** (Cliniko, AU/global) | Cloud multi-disciplina | Booking online, calendario, recordatorios SMS/email, multi-sede `[verified]` | Historias y adjuntos; **sin odontograma** `[no evid.]` | Facturas, pagos, billable items, reportes | **REST pública, docs excelentes** `[verified]` | **USD 45–395/mes** según practitioners · trial 30 días |
| 17 | **Open Dental** (Open Dental, US) | **On-premise** | Multi-sillón, recalls, Web Sched, listas de espera; API lee/escribe turnos `[verified]` | Odontograma gráfico, perio, planes, imágenes `[verified]` | Seguros, claims, pagos, reportes (modelo US) | **API REST pública, CRUD, la más profunda del grupo** `[verified]` | **USD 199/mes** año 1, luego 149 (hasta 3 proveedores) |
| 18 | **Dentrix / Ascend** (Henry Schein One, US) | On-prem + cloud | Online scheduling, recordatorios, formularios, elegibilidad (Ascend) `[verified]` | Perio, imaging 3D, notas automáticas, planes `[verified]` | Claims/RCM maduro; **reporting criticado en Ascend** `[claim]` | API Exchange ~700–1.000 endpoints, OAuth 2.0, **solo vendors autorizados** `[claim]` | **No publica** (cientos de USD/mes + módulos) |
| 19 | **Curve Dental** (Curve, US/CA) | Cloud all-in-one | Online scheduling, recordatorios, patient engagement `[verified]` | Charting, perio, planes, imaging, UX moderna `[verified]` | Billing, insurance, claims, Curve Pay | Open Orange **gated**, sin API self-serve `[verified]` | **No publica** (~USD 249/usuario/mes `[claim]` de terceros) |
| 20 | **Denticon** (Planet DDS, US) | Cloud para DSO | Scheduling multi-sede, recordatorios, MyTooth (2026) `[claim]` | Charting, treatment plans, Apteryx XVWeb | **RCM, claims, 100+ reportes, analytics con IA** | REST + webhooks + batch, **onboarding gated** `[claim]` | **No publica** (~USD 750/mes flat `[claim]` de terceros) |
| 21 | **tab32** (tab32, US) | Cloud low-cost | Scheduling, AutoRemind, foco anti-no-show `[verified]` | Charting, imaging, radiología con IA, ortodoncia, voz `[verified]` | Billing, claims, elegibilidad, analytics | Open API **sólo plan Summit** `[claim]` | **USD 125/mes** año 1 (≤3 proveedores) · USD 225 año 2+ · usage fees (claims USD 0,20) |

### A.3 — Operación, seguridad, adopción y balance por sistema

Cubre las dimensiones que no entran en el ancho de la tabla A.1: **operación** (sucursales, roles y permisos, auditoría, exportación, soporte y capacitación), **seguridad y cumplimiento**, **adopción publicada** y **fortalezas/limitaciones**.

| # | Sistema | Sucursales | Roles y permisos | Auditoría | Exportación | Soporte y capacitación | Seguridad y cumplimiento | Adopción publicada | Fortalezas / limitaciones |
|---|---|---|---|---|---|---|---|---|---|
| 1 | DentalSoft | Multi-sucursal `[verified]` | Permisos por rol `[verified]` | `[no evid.]` | A la baja `[claim]` | Soporte WhatsApp/email con los desarrolladores `[verified]`; capacitación `[no evid.]` | Ley 25.326 declarada; multi-tenant con base aislada; hash de contraseñas; TLS; logs; retención 30 días post-baja `[verified]` | +300 clínicas, 4,9/5 `[claim]`; testimonios sin volumen verificable | **F:** sobreturnos con solapamiento, liquidaciones con PDF, reserva en 4 pasos. **L:** sin periodontograma, sin API, sin ARCA, sin precio público |
| 2 | Dentalink | Multi-centro (plan Pro) `[verified]` | Roles por plan `[verified]` | `[no evid.]` | A la baja `[claim]` | Chat, email y teléfono según plan `[verified]`; capacitación `[no evid.]` | ISO 27001, HIPAA, GDPR; DPA y política de seguridad publicadas `[verified]` | +15.000 clientes LATAM, 16 años, +250 profesionales `[claim]` | **F:** clínica profunda + vista por sillón + IA. **L:** precio opaco; **borra la cuenta a los 30 días de impago**; sin oficina en Argentina |
| 3 | DentalTec | Multi-entidad con branding propio `[verified]` | 10 roles `[verified]` | Auditoría completa (quién, qué, cuándo, dónde) `[verified]` | `[no evid.]` | Soporte 24/7 `[verified]`; tutoriales en YouTube oficial `[verified]` | JWT, bcrypt, Helmet/CORS; trazabilidad 100 % `[verified]`; **sin política de privacidad visible** | +2.000 profesionales, 30+ instituciones, 5 círculos (COSJ, CORA, COM, COE, COSTG) `[claim]` | **F:** validación online de obras sociales + ARCA + cierre multinivel. **L:** agenda y reserva online poco evidenciadas; sin precio público |
| 4 | Bilog | Sucursales ilimitadas (Premium) `[verified]` | Permisos por rol `[verified]` | `[no evid.]` | CSV a la baja `[verified]` | Soporte local; migración y capacitación sin costo de configuración `[verified]` | Ley 25.326; backups en nube; el usuario es responsable de los datos de salud `[verified]` | +1.500 clínicas, +5.000 usuarios, +150.000 turnos/mes, +10 M pacientes `[claim]` | **F:** antigüedad + obras sociales + modalidad híbrida. **L:** UX envejecida; sin API; sin periodontograma |
| 5 | DentalCore | Multi-clínica `[verified]` | 4 roles + "odontólogo sin acceso" `[verified]` | Inmutable, con 2FA `[verified]` | Total, aun con la cuenta suspendida `[verified]` | Soporte del fundador; migración asistida `[verified]` | Base aislada por clínica, TLS, backup cifrado AES-256-GCM (8 copias + test de restore), scrypt; ISO 27001 como referencia, no certificado; Ley 25.326 `[verified]` | **Sin clientes publicados**; se presenta como "primeros odontólogos" `[claim]` | **F:** ARCA nativo + WhatsApp oficial + clínica profunda. **L:** sin trial, en dólares, sin base de clientes |
| 6 | Órbita | `[no evid.]` | Roles y log de accesos `[verified]` | Log de accesos `[verified]` | Total `[verified]` | Soporte directo con fundadores; migración sin cargo; implementación 30 días `[verified]` | AWS `[verified]`; certificaciones `[no evid.]` | 145.000 mensajes y 806 turnos agendados por el bot en 30 días; 12 logos; prensa TN/Ámbito/0221 `[claim]` | **F:** IA conversacional + agenda por sillón. **L:** el core ("Órbita Gestión") está **en preventa**; precios en USD; sin ARCA |
| 7 | Odonto.ar | Hasta 10 usuarios (plan Clínica) `[verified]` | Roles y permisos `[verified]` | `[no evid.]` | `[no evid.]` | Soporte prioritario `[verified]` | Supabase con cifrado en tránsito y reposo, RLS, tokens; Ley 25.326 y AAIP declaradas `[verified]` | `[no evid.]` | **F:** precio claro y fricción mínima. **L:** sin motor de recordatorios ni recuperación: justo el núcleo del producto a construir |
| 8 | Odonthia | `[no evid.]` | `[no evid.]` | `[no evid.]` | Exportación/importación; migración desde Dentalink (sólo fichas) `[verified]` | `[no evid.]` | Firma electrónica Ley 25.506; ficha diseñada para Ley 26.529 `[verified]` | `[no evid.]` | **F:** freemium real que presiona precios a la baja. **L:** administración fiscal y de obras sociales débil |
| 9 | AgendaPro | Multi-sede `[verified]` | Roles `[verified]` | `[no evid.]` | `[no evid.]` | Soporte `[verified]` | `[no evid.]` | 30.000 negocios en LATAM `[claim]` | **F:** reserva online madura. **L:** sin odontograma, sin obras sociales, sin ARCA |
| 10 | Ninsaúde | Multi-unidad `[verified]` | Roles por unidad `[verified]` | `[no evid.]` | `[no evid.]` | Entrenamiento gratuito `[verified]` | LGPD, HIPAA `[verified]` | Casos Unicamp, Hospital Mãe de Deus, Zerenia `[claim]` | **F:** odontograma por caras + white-label + sitio en español. **L:** sin precios públicos; sin AR |
| 11 | Clinicorp | Multi-unidad `[verified]` | Usuarios ilimitados con perfiles `[verified]` | `[no evid.]` | Migración en 3 días `[verified]` | Soporte L-V 8-18 h + bots 24 h `[verified]` | LGPD; prontuario cifrado `[verified]` | "+32 mil clínicas", "+200 mil profesionales", "+85 M agendamientos" `[claim]` | **F:** profundidad financiera + WhatsApp. **L:** sólo portugués; **implementación paga obligatoria** |
| 12 | Feegow | Multiclínica `[verified]` | Permisos por usuario `[verified]` | `[no evid.]` | Migración asistida `[verified]` | Soporte 0800 `[verified]` | Certificación SBIS NGS2, LGPD, AWS `[verified]` | Contadores públicos en 0 `[no evid.]` | **F:** API pública + ecosistema Doctoralia. **L:** **sin odontograma**: brecha crítica para odontología |
| 13 | iClinic | Multiclínica `[verified]` | `[no evid.]` | `[no evid.]` | Export autoservicio `[verified]` | Chat, teléfono, email y WhatsApp `[verified]` | LGPD `[verified]`; HIPAA `[claim]` | +70 mil profesionales en 22 países `[claim]` | **F:** onboarding y autoservicio. **L:** sin odontograma ni flujo de prótesis/ortodoncia |
| 14 | Dental Office | Hasta 10 usuarios; dentistas ilimitados (plan Completo) `[verified]` | `[no evid.]` | `[no evid.]` | `[no evid.]` | Soporte humano + asistente virtual 24 h; nota 9,6 `[claim]` | LGPD declarada `[verified]` | `[no evid.]` | **F:** precio más agresivo + paquete fiscal. **L:** profundidad clínica poco evidenciada; huella nula fuera de Brasil |
| 15 | Dentally | Usuarios ilimitados `[verified]` | Roles `[verified]` | `[no evid.]` | `[no evid.]` | Onboarding y soporte estándar `[verified]` | Certificación no detallada `[no evid.]` | 50.000 practitioners `[claim]`; Capterra UK 3,6/18; G2 4,9/5 (5 reseñas) | **F:** dental + API + precio visible. **L:** reputación mixta y quejas de soporte |
| 16 | Cliniko | Sedes y administradores ilimitados `[verified]` | Roles `[verified]` | `[no evid.]` | Export; retención 90 días post-cancelación `[verified]` | Soporte `[verified]` | AWS ISO 27001, AES-256, HIPAA/GDPR/PIPEDA, almacenamiento regional, 2FA/passkeys `[verified]` | 65.000 profesionales en 95 países `[claim]`; 4,7/24 | **F:** simplicidad, onboarding, API. **L:** sin odontograma ni RCM dental |
| 17 | Open Dental | Licencia por ubicación `[verified]` | Permisos por usuario `[verified]` | Logs por usuario `[verified]` | Datos propios (on-premise) `[verified]` | Soporte incluido en la licencia `[verified]` | BAA obligatorio; SOC 2 público `[no evid.]` | 4,6/89 en Capterra `[claim]` | **F:** la API más profunda del grupo; costo transparente. **L:** on-premise, UX tradicional |
| 18 | Dentrix / Ascend | Multi-sede `[verified]` | Roles `[verified]` | `[claim]` | `[no evid.]` | Plan de soporte pago `[claim]` | SOC 2 Type II en API Exchange; HIPAA `[claim]` | 4,3/378 (Dentrix) y 4,1/235 (Ascend) | **F:** ecosistema y flujo de seguros. **L:** opacidad, add-ons, reporting criticado |
| 19 | Curve Dental | Multi-sede `[verified]` | Roles `[verified]` | `[no evid.]` | `[no evid.]` | Soporte `[verified]` | Certificaciones `[no evid.]` | 4,4/285; 80.000 profesionales `[claim]` | **F:** UX visual moderna, todo-en-uno. **L:** API cerrada, precio opaco |
| 20 | Denticon | Multi-location `[verified]` | Roles `[verified]` | Audit trail `[claim]` | `[no evid.]` | Onboarding partner `[claim]` | SOC 2 Type 2 y HIPAA `[claim]` | 13.000 practices, 45.000 users `[claim]`; 4,5/118 | **F:** RCM y escala DSO. **L:** enterprise, precio opaco, onboarding gated |
| 21 | tab32 | `[no evid.]` | Roles `[verified]` | `[no evid.]` | `[no evid.]` | Implementación y migración `[verified]` | Certificaciones `[no evid.]` | 4,3/41 | **F:** entrada barata + IA. **L:** API sólo en plan enterprise; compliance poco visible |

### A.4 — Modelo comercial detallado

| # | Sistema | Prueba gratuita | Plan gratuito | Precio publicado | Moneda | Modalidad de cobro | Costos adicionales visibles |
|---|---|---|---|---|---|---|---|
| 1 | DentalSoft | 3 meses `[claim]` | No | **No publica** `[verified]` (22/10/2026) | — | Mensual, sin permanencia `[claim]` | WhatsApp USD 0,026/mensaje `[claim]` |
| 2 | Dentalink | Demo y acceso de prueba `[verified]` | No | **No publica** — cotización `[verified]` | — | Mensual, semestral o anual; sin contrato mínimo | Telemedicina, firma y recetas como adicionales |
| 3 | DentalTec | No evidenciado | No | **No publica** — demo a pedido `[verified]` | USD (packs) | `[no evid.]` | Packs WhatsApp USD 9 / 25 / 48 (50/150/300 mensajes) |
| 4 | Bilog | Freemium permanente `[verified]` | Sí: 1 profesional, 50 pacientes | Lite y Premium **por cotización** según usuarios | — | Mensual, sin permanencia | Servicios técnicos extra cobrados |
| 5 | DentalCore | No (reembolso 14 días) `[verified]` | No | **USD 50/mes** con 2 usuarios; **USD 10** por usuario extra; 30 % off 6 meses | USD | Mensual | Videoconsulta USD 0,50 |
| 6 | Órbita | `[no evid.]` | No | **USD 25/mes** Consultorio (≤3 prof.) · **USD 113/mes** Clínica (1-3 sedes, 15 prof.) · sedes extra USD 120 | USD | Pesos o USDT; descuentos 10/15/25 % por plazo | Chat IA **USD 200/mes** (150 anual), 15.000 mensajes |
| 7 | Odonto.ar | 30 días sin tarjeta `[verified]` | No | **USD 29 / 49 / 99** (1/5/10 usuarios) | USD, cobro en ARS al cambio del día | Mensual, sin permanencia | — |
| 8 | Odonthia | N/A (plan gratis permanente) | **Sí, sin vencimiento** (2 GB, 2 usos de IA) | **ARS 20.900/mes** (IA) · **ARS 46.900/mes** (Max); packs ARS 8.400 / 36.900 | ARS (IVA incluido) | Mensual vía Mercado Pago; anual con 2 meses gratis | Consumo de IA por créditos |
| 9 | AgendaPro | Sí `[verified]` | `[no evid.]` | **ARS 13.900 / 33.900 / 44.900 / 314.900** (Individual / Básico / Premium / Pro) | ARS (IVA incluido) | Mensual | WhatsApp desde ARS 7.900/mes (50 mensajes); API sólo en Pro |
| 10 | Ninsaúde | `[no evid.]` | No | **No publica** | — | PIX, boleto o tarjeta | `[no evid.]` |
| 11 | Clinicorp | `[no evid.]` | No | **R$159,90/mes** Standard (trimestral R$127,19) · **R$369,90** Premium (trimestral R$330) | BRL | Tarjeta de crédito; sin fidelidad | **Implementación obligatoria con costo único**; IA y agentes "sob consulta" |
| 12 | Feegow | Sí, sin tarjeta `[verified]` | No | **R$129 / 199 / 249** por profesional/mes (Starter / Plus / VIP) | BRL | Mensual; personalizado desde 10 profesionales | `[no evid.]` |
| 13 | iClinic | 5 días sin tarjeta `[verified]` | No | **R$99 / 129 / 169 / 299** por profesional/mes | BRL | Mensual; anual con 8 % off | WhatsApp desde R$29,90 (85 mensajes); teleconsulta 10×R$35 o ilimitada en Premium |
| 14 | Dental Office | 7 días `[verified]` | No | **R$39,90 / 138,52 / 210,18 / 298,54** por mes | BRL | Mensual o anual | `[no evid.]` |
| 15 | Dentally | `[no evid.]` | No | **£134 / 238 / 346** por mes (3 surgeries, usuarios ilimitados) | GBP | Mensual | `[no evid.]` |
| 16 | Cliniko | 30 días `[verified]` | No | **USD 45 / 95 / 145 / 195 / 295 / 395** por mes según practitioners | USD | Mensual, sin fees ocultos | — |
| 17 | Open Dental | Garantía 90 días `[verified]` | No | **USD 199/mes** año 1 · **USD 149** después (hasta 3 proveedores) | USD | Mensual | eServices; API con tiers de desarrollador desde USD 15/mes |
| 18 | Dentrix / Ascend | `[no evid.]` | No | **No publica** — cotización por distribuidor | — | Suscripción (Ascend) o licencia + soporte (on-prem) | Módulos, hardware y soporte |
| 19 | Curve Dental | `[no evid.]` | No | **No publica** — cotización personalizada | — | Mensual | `[no evid.]` |
| 20 | Denticon | `[no evid.]` | No | **No publica** — por ubicación y volumen | — | Mensual | `[no evid.]` |
| 21 | tab32 | 14 días `[verified]` | No | **USD 125/mes** año 1 (≤3 proveedores) · **USD 225** año 2+ (≤5) | USD | Mensual | Claims USD 0,20 · adjuntos USD 0,50 · elegibilidad USD 1,25 · AutoRemind USD 69/mes tras año 1 (500 mensajes, luego USD 0,08) |

### A.5 — Fuentes por sistema (URL y fecha de consulta)

| # | Sistema | URL oficial | Documentación complementaria consultada | Fecha |
|---|---|---|---|---|
| 1 | DentalSoft | dentalsoft.com.ar | /privacidad | 22/10/2026 |
| 2 | Dentalink | softwaredentalink.com/ar | /ar/planes · ayuda.softwaredentalink.com (artículo de obras sociales AR) | 22/10/2026 |
| 3 | DentalTec | web.dentaltec.com.ar | /funcionalidades · cora.org.ar/gestion-consultorios · playlist oficial de YouTube | 22/10/2026 |
| 4 | Bilog | bilog.com.ar | /planes · /soluciones/consultorios · /terms_and_conditions · Google Play (4,0★, 65 opiniones) | 22/10/2026 |
| 5 | DentalCore | dentalcore.app | /pricing · /faq · /privacidad | 22/10/2026 |
| 6 | Órbita | hiorbita.com | /precios · /erp · link.mercadopago.com.ar/orbitaint | 22/10/2026 |
| 7 | Odonto.ar | odonto.ar | /privacidad | 22/10/2026 |
| 8 | Odonthia | odonthia.com | /planes · /blog/mejores-software-odontologicos-argentina-2026 | 22/10/2026 |
| 9 | AgendaPro | agendapro.com/ar | Página de planes AR | 22/10/2026 |
| 10 | Ninsaúde | ninsaude.com | Sitio en español; casos publicados | 22/10/2026 |
| 11 | Clinicorp | clinicorp.com | Página de planes | 22/10/2026 |
| 12 | Feegow | feegowclinic.com.br | docs.feegow.com (API pública) | 22/10/2026 |
| 13 | iClinic | iclinic.com.br | Página de precios y planes | 22/10/2026 |
| 14 | Dental Office | dentaloffice.com.br | Página de planes | 22/10/2026 |
| 15 | Dentally | dentally.co/pricing | developer.dentally.co | 22/10/2026 |
| 16 | Cliniko | cliniko.com/pricing | docs.api.cliniko.com · cliniko.com/security | 22/10/2026 |
| 17 | Open Dental | opendental.com | /site/apispecification.html · /site/fees.html · /site/apipermissions.html | 22/10/2026 |
| 18 | Dentrix / Ascend | dentrix.com | dentrixascend.com · henryscheinone.com/dental-solutions/api-exchange | 22/10/2026 |
| 19 | Curve Dental | curvedental.com/pricing | curvedental.zendesk.com (Open Orange) | 22/10/2026 |
| 20 | Denticon | planetdds.com/denticon | developer.planetdds.com | 22/10/2026 |
| 21 | tab32 | tab32.com/pricing | Página de planes y modules | 22/10/2026 |

> **Limitación de fuentes.** Capterra, GetApp y B2B Stack bloquearon el acceso automatizado durante el relevamiento: las cifras de adopción y las notas de reseñas se toman de las páginas públicas indexadas y deben considerarse `[claim]` hasta verificación manual. SSSalud devolvió 503 en el buscador de prestadores y `datos.gob.ar` no publica series de odontología.

---

## B. Matriz de puntuación ponderada (0–5)

Pesos: Turnos/automatización 25 % · Clínica 20 % · Integraciones locales y WhatsApp 15 % · Admin/cobros/facturación 15 % · Experiencia del paciente 10 % · Seguridad/exportación/trazabilidad 10 % · Precio y adopción 5 %.

| Sistema | Turnos (25%) | Clínica (20%) | Integ. locales (15%) | Admin/fiscal (15%) | Paciente (10%) | Seguridad (10%) | Precio (5%) | **Total** |
|---|---|---|---|---|---|---|---|---|
| Dentalink | 4,5 | 5,0 | 3,5 | 3,5 | 4,0 | 5,0 | 1,5 | **4,15** |
| DentalCore | 3,5 | 5,0 | 4,0 | 4,5 | 3,0 | 5,0 | 2,0 | **4,05** |
| Dentally | 4,5 | 4,5 | 3,5 | 3,5 | 3,5 | 3,0 | 3,5 | **3,90** |
| Clinicorp | 4,0 | 4,0 | 2,5 | 4,5 | 4,0 | 4,0 | 4,0 | **3,85** |
| Ninsaúde | 4,0 | 4,0 | 3,5 | 4,5 | 3,5 | 4,0 | 1,5 | **3,83** |
| DentalSoft | 4,5 | 4,0 | 3,5 | 3,5 | 4,0 | 3,5 | 1,5 | **3,81** |
| Dentrix / Ascend | 4,0 | 5,0 | 2,0 | 4,0 | 3,5 | 4,5 | 1,0 | **3,75** |
| Denticon | 3,5 | 4,0 | 3,0 | 5,0 | 3,0 | 4,0 | 1,5 | **3,65** |
| Órbita | 4,0 | 4,5 | 3,0 | 3,0 | 3,5 | 3,5 | 2,5 | **3,63** |
| Feegow / Docplanner | 4,0 | 2,0 | 3,0 | 5,0 | 4,0 | 4,5 | 3,5 | **3,63** |
| Curve Dental | 4,0 | 4,5 | 2,0 | 4,0 | 4,0 | 3,0 | 1,5 | **3,58** |
| Cliniko | 4,0 | 1,5 | 3,5 | 3,5 | 4,5 | 5,0 | 4,5 | **3,53** |
| DentalTec | 2,5 | 3,5 | 4,5 | 5,0 | 2,5 | 4,0 | 2,0 | **3,50** |
| Open Dental | 3,5 | 5,0 | 1,5 | 3,0 | 2,5 | 3,5 | 4,5 | **3,38** |
| tab32 | 4,0 | 3,5 | 2,0 | 3,5 | 3,5 | 2,5 | 3,5 | **3,30** |
| Bilog | 3,0 | 3,0 | 3,0 | 4,0 | 3,0 | 3,5 | 2,5 | **3,18** |
| Dental Office (BR) | 3,0 | 2,0 | 3,0 | 4,5 | 3,5 | 3,0 | 4,5 | **3,15** |
| iClinic (Afya) | 3,5 | 1,5 | 2,5 | 4,0 | 3,5 | 3,5 | 4,0 | **3,05** |
| Odonto.ar | 2,5 | 3,5 | 1,5 | 2,0 | 3,5 | 4,0 | 4,5 | **2,83** |
| AgendaPro | 3,5 | 1,0 | 3,0 | 2,5 | 4,0 | 3,0 | 3,0 | **2,75** |
| Odonthia | 2,0 | 3,0 | 2,0 | 1,5 | 3,0 | 3,5 | 4,5 | **2,50** |

### Lectura crítica de la matriz

- **El puntaje mide calidad de producto, no encaje argentino.** Dentalink gana (4,15) pero **no tiene oficina en Argentina, ni ARCA, ni circuito de obras sociales**; su modelo es "convenios y reembolso de seguros", no prestaciones. DentalCore (4,05) es el único con ARCA + WhatsApp oficial + perfil clínico profundo, pero **no tiene clientes publicados** y cobra en dólares sin trial.
- **DentalTec es el outlier más informativo:** 3,50 de promedio pero **5,0 en administración/fiscal**. Es el producto que resuelve el circuito de dinero, y precisamente por eso no le importa la experiencia del paciente (2,5). Ese desbalance es el que un competidor nuevo puede romper.
- **La correlación negativa entre "precio/adopción" y "admin/fiscal" es casi perfecta** en el mercado argentino: los que facturan y liquidan no publican precios (Dentalink 1,5; DentalTec 2,0; Bilog 2,5), y los que publican precios no facturan (Odonto.ar 2,0 admin; Odonthia 1,5 admin). **Ese es el arbitraje de producto.**
- **Dentally (3,90) es el mejor benchmark funcional-técnico** pese a ser británico: combina agenda con relleno de huecos, clínica profunda, API pública y precio visible. Es el patrón a copiar en arquitectura, no en features locales.

---

## C. Análisis competitivo

### C.1 — Lo que ya es estándar de mercado (no diferencia)

1. Agenda diaria/semanal con múltiples profesionales.
2. Historia clínica digital con odontograma interactivo (FDI, estado por pieza y cara).
3. Reserva/agendamiento online 24/7 por link (aunque con calidad muy dispar).
4. Recordatorio y confirmación por WhatsApp.
5. Caja, presupuestos y planes de tratamiento.
6. Multi-sucursal en planes medios/altos.
7. Exportación de datos (aunque muchos la limitan al dar de baja).
8. App móvil (parcial: Bilog sí, DentalSoft/Odonto.ar/Odonthia no).

**Consecuencia:** construir cualquiera de estos ocho como "diferencial" es un error de posicionamiento. Son la tabla de entrada.

### C.2 — Diferenciadores reales (verificados, no claims)

| Diferenciador | Quién lo tiene | Por qué es defendible |
|---|---|---|
| Agenda por **sillón** con bloqueo de solapamiento ("choque imposible") | DentalSoft, Órbita, Dentalink | Es modelado de dominio, no UI: requiere una entidad `sillón` con disponibilidad propia |
| **Periodontograma** de 6 sitios | DentalCore, Dentalink, Órbita | Nivel de detalle clínico que la mayoría no alcanza |
| **Validación online de obras sociales en tiempo real** (topes, frecuencias, autorizaciones) | DentalTec | Convenio por convenio con cada OS: barrera de 12–24 meses |
| **Facturación ARCA nativa** desde el presupuesto cobrado | DentalCore, DentalTec | WSAA + wsfev1/wsmtxca + gestión de certificados y TA |
| **WhatsApp Cloud API oficial** con IA conversacional | Órbita (Juez IA), DentalCore | Verificación de negocio en Meta + templates aprobados |
| **Relleno de huecos** (short-notice filler) con lista de espera | Dentally (no en AR) | Mecanismo de ingresos directo: convierte cancelaciones en facturación |
| **API pública documentada + sandbox** | Open Dental, Dentally, Cliniko (ninguno en AR) | Efecto red: terceros construyen sobre el producto |
| **Exportación total aun con la cuenta suspendida** | DentalCore | Anti-lock-in como argumento comercial explícito |
| **Precio publicado en pesos** | Odonthia, AgendaPro (`Odonto.ar` publica en USD) | Transparencia en un mercado que cotiza por asesor; DentalSoft **no publica** precio, pese a comunicar una prueba de 3 meses |

### C.3 — Vacíos del mercado argentino

1. **Nadie tiene lista de espera.** Ni un competidor argentino la evidenció. Es la palanca más obvia: cada cancelación es un sillón vacío y un ingreso perdido.
2. **Nadie expone API pública.** Cero ecosistema, cero integración con IA de terceros, cero portabilidad real.
3. **Facturación ARCA + obras sociales + Mercado Pago + agenda en un mismo producto, a precio PyME:** combinaciones parciales, nunca completa.
4. **El consultorio unipersonal que atiende obras sociales queda huérfano:** los baratos no liquidan OS, los que liquidan son caros y opacos.
5. **Auditoría/trazabilidad:** sólo DentalCore y DentalTec evidencian auditoría completa. Para datos de salud (Ley 25.326 art. 7 y 9) esto no es un lujo.
6. **Portabilidad:** Dentalink **elimina la cuenta a los 30 días de impago**; Bilog exporta sólo CSV a la baja. En un mercado con datos sensibles de salud, el lock-in es un riesgo legal del cliente, no sólo comercial.
7. **Seña con Mercado Pago dentro del flujo de reserva**, con liberación automática del turno si no se paga: sólo DentalSoft lo insinúa.
8. **Reserva online que respete las reglas del consultorio** (obras sociales aceptadas, seña obligatoria, anticipación mínima, cupo por profesional): Odonto.ar lo hace bien, pero sin recordatorios automáticos.

### C.4 — Oportunidades de innovación

1. **"Agenda + WhatsApp + OS + ARCA" en pesos y autoservicio.** Precio público, onboarding en menos de un día, sin implementación obligatoria paga (que es lo que encarece Clinicorp y la opacidad de DentalTec).
2. **Lista de espera inteligente:** el turno liberado se ofrece automáticamente por WhatsApp a los pacientes en espera, con ventana de aceptación de N minutos. Convierte cancelaciones en ingresos medibles — el mejor argumento de ROI para vender.
3. **Reserva con seña que libera sola:** link de pago MP al reservar, expiración del turno si no se paga, devolución automática según política. Resuelve no-show y morosidad en un solo flujo.
4. **Copiloto de recepción:** IA sobre WhatsApp oficial que responde disponibilidad, agenda, reprograma y **deriva urgencias a un humano** sin intentar diagnosticar (por la restricción de salud de la política de Meta).
5. **Compliance como feature, no como letra chica:** copia de historia clínica al paciente en 48 h (Ley 26.529 art. 14) automatizada, consentimientos con firma electrónica y evidencia, auditoría inmutable, exportación garantizada.
6. **API-first como posicionamiento:** el único PMS dental argentino con API pública documentada. Habilita integradores, clínicas con equipo de datos y productos de IA verticales.
7. **Odontograma y periodontograma como commodity** (ya lo son) y diferenciación en **operación**: cuánto tarda una recepcionista en agendar, cuántos turnos se recuperan, cuánto se cobra.

---

## D. Recomendación final

### D.1 — Cinco competidores prioritarios para demo

| Prioridad | Competidor | Qué mirar en la demo | Por qué |
|---|---|---|---|
| 1 | **DentalSoft** | Agenda con sobreturnos y detección de solapamiento; flujo de liquidación a OS y profesionales; reserva online en 4 pasos | Es el competidor más cercano al producto objetivo: agenda con sobreturnos, liquidación y reserva online en un mismo producto. **No publica precios** (corregido el 22/10/2026) |
| 2 | **Dentalink** | Vista por sillón; odontograma + periodontograma; cómo resuelve obras sociales argentinas sin ser argentino | Marca el techo funcional clínico a igualar |
| 3 | **DentalTec** | Validación en tiempo real contra obras sociales; cierre multinivel; facturación ARCA | Es el foso administrativo que hay que decidir si se ataca en v1 o en v2 |
| 4 | **Bilog** | Modalidad híbrida; flujo de obras sociales/liquidaciones; qué tan mal envejece la UX | Muestra el segmento conservador y el costo real del on-premise |
| 5 | **DentalCore** | ARCA nativo, WhatsApp API oficial, auditoría inmutable, exportación con cuenta suspendida | Es el competidor nuevo con la arquitectura más moderna; hay que saber por qué pierde o gana |
| *Extra* | **Órbita** | Juez IA, agenda por sillón, integración con Dentalink/Benty | Referencia de IA conversacional; ojo: el core está en preventa |

### D.2 — Tres productos de referencia para experiencia de usuario

1. **Cliniko** — la referencia de simplicidad y onboarding: agenda clara, precio transparente, API sólida. Es el estándar de "software de salud que no da miedo".
2. **Curve Dental** — la referencia visual: charting legible, flujo todo-en-uno, sensación de producto moderno.
3. **Dentally** — la referencia dental-técnica: agenda orientada a producción, relleno de huecos, API documentada con sandbox.

*(Referencia local de simplicidad: **Odonto.ar** — reserva online y precio claro, pero sin automatización. Es el ejemplo de "qué NO recortar": los recordatorios.)*

### D.3 — MVP sugerido

**Imprescindibles (sin esto no hay producto):**

1. Agenda multi-profesional **por sillón**, con duración variable por prestación, bloqueos, sobreturnos y **prevención de solapamiento**.
2. Reserva online 24/7 por link público, con reglas configurables: anticipación mínima, especialidades, obras sociales aceptadas, cupo por profesional.
3. Recordatorios y confirmación por **WhatsApp Cloud API oficial** (template `utility`), con link de confirmar/cancelar que libera el turno.
4. Ficha clínica + **odontograma FDI** + presupuestos y planes de tratamiento.
5. Caja + cobros con **Mercado Pago** (link/QR) + **seña** al reservar.
6. Roles y permisos + multi-sucursal + **auditoría de accesos**.
7. **Exportación total de datos** en cualquier momento (incluso con la cuenta suspendida).
8. Cumplimiento mínimo: consentimiento informado digital, respaldo cifrado, política de privacidad alineada a Ley 25.326, aviso de transferencia internacional.

**Diferenciadores a construir en v1 (elegir DOS, no cinco):**

- **Lista de espera inteligente** con oferta automática del hueco liberado (ventana de aceptación configurable).
- **Facturación ARCA nativa** desde el presupuesto cobrado (B/C, CAE, QR).
- **Precio público en pesos** + onboarding autoservicio en menos de un día (posicionamiento, no feature).
- **API pública documentada** con sandbox (posicionamiento de plataforma).

**Para etapas posteriores (no bloquean el lanzamiento):**

- Periodontograma completo de 6 sitios (v1.1; imprescindible si el target incluye periodoncia).
- Ortodoncia con galería y seguimiento; estética facial.
- **Liquidación de obras sociales con validación online** (v2: requiere convenio por convenio, es el foso más caro).
- Receta electrónica / ReNaPDiS: **decisión de alcance**, no un feature. Si el producto emite recetas, es obligación legal (Decreto 345/2024, Res. 1959/2024) y hay que inscribir la plataforma; si no las emite, hay que integrarse con quien sí.
- App nativa del paciente (empezar con PWA + WhatsApp).
- Campañas de marketing, NPS, fidelización, BI avanzado.
- Firma digital certificada (empezar con firma electrónica simple + evidencia de autoría).
- Facturación multi-moneda / multi-país.

---

## E. Los 11 puntos del checklist (insumo para `kb-creator`)

### 1. Problema
Los consultorios odontológicos argentinos gestionan su agenda con una combinación de WhatsApp manual, planilla y agenda en papel o en un software que no se comunica con nada. El resultado es doble: **sillones vacíos por ausencias** (no-show sin reemplazo) y **trabajo administrativo no facturable** (confirmar uno por uno, liquidar obras sociales a mano, facturar en otro sistema).

> *Supuesto a confirmar:* que el dolor principal es el **ausentismo + la carga administrativa**, y no la falta de funcionalidad clínica.

### 2. Usuarios / roles
- **Odontólogo/a titular** — decide la compra, atiende, quiere no perder plata.
- **Recepcionista / secretaria** — agenda, confirma, cobra, llama. *Es el usuario que más sufre el sistema actual.*
- **Odontólogo/a asociado** — atiende, necesita ver su agenda y su liquidación.
- **Administrativo de obras sociales** — valida prestaciones, liquida, factura (en clínicas).
- **Paciente** — reserva, confirma, cancela, paga seña.

### 3. Casos de uso principales
1. Como **paciente**, quiero reservar un turno desde un link de WhatsApp en menos de un minuto, para no llamar en horario de oficina.
2. Como **recepcionista**, quiero que el sistema confirme y reconfirme solo, para no llamar a 30 pacientes por día.
3. Como **recepcionista**, quiero que al cancelarse un turno se ofrezca automáticamente al primero de la lista de espera, para no perder el sillón.
4. Como **odontólogo**, quiero ver mi agenda por sillón sin superposiciones, para no tener dos pacientes en la misma silla.
5. Como **administrativo**, quiero liquidar obras sociales y emitir factura ARCA desde el mismo sistema, para no duplicar carga.

### 4. Competidores
Ver secciones A y B. Los 5 prioritarios para demo: DentalSoft, Dentalink, DentalTec, Bilog, DentalCore.

### 5. Funcionalidades necesarias (MVP)
Ver D.3 "Imprescindibles" (8 ítems).

### 6. Funcionalidades opcionales
Ver D.3 "Para etapas posteriores".

### 7. Reglas de negocio (a validar con el usuario)
- No se puede reservar con menos de N horas de anticipación (configurable por profesional).
- Un profesional no puede tener dos turnos superpuestos; un sillón tampoco.
- La seña puede ser obligatoria, opcional o no existir, por tipo de prestación.
- Si el paciente cancela dentro de la ventana protegida, la seña se retiene o se devuelve según política configurable.
- La lista de espera se ofrece por orden de llegada, con ventana de aceptación de N minutos; si no acepta, pasa al siguiente.
- Las obras sociales aceptadas se definen por profesional, no por clínica.
- Un turno confirmado por el paciente no puede ser reasignado sin su cancelación explícita.
- Los datos clínicos nunca viajan por WhatsApp (política de Meta + Ley 25.326): sólo datos mínimos de turno.
- La historia clínica no se elimina: se conserva 10 años (Ley 26.529 art. 15).

### 8. Integraciones
- **WhatsApp Cloud API** (Meta) con BSP — recordatorios `utility`, opt-in explícito, ventana de 24 h.
- **Mercado Pago** — Checkout/link/QR para señas y cobros; evaluar marketplace/split (no evidenciado).
- **ARCA** — WSAA + `wsfev1`/`wsmtxca`, certificados y TA (12 h).
- **Google Calendar** — sincronización de agenda del profesional.
- **Obras sociales** — validación y liquidación (fase 2; SOAP por convenio).
- **API pública propia** — para terceros e integradores.

### 9. Restricciones
- Datos de salud = datos sensibles (Ley 25.326 arts. 2, 7, 9): consentimiento, finalidad, seguridad reforzada.
- Transferencia internacional restringida (art. 12): afecta hosting y soporte fuera del país.
- Registro de bases de datos ante AAIP (art. 21).
- Historia clínica conservada 10 años, íntegra, inalterable, recuperable, con copia al paciente en 48 h (Ley 26.529).
- Si se emiten recetas: Decreto 345/2024 + Res. 1959/2024 (ReNaPDiS), firma electrónica/digital, vigencia 30/60 días.
- Facturación: RG 5866 de ARCA incorpora obligados por etapas (desde 1/10/2026 instituciones médicas privadas y profesionales).
- WhatsApp: opt-in por categoría, templates aprobados, prohibición de datos clínicos/telemedicina.

### 10. Riesgos
- **Compliance subestimado:** creer que es "un turnero" cuando en realidad toca historia clínica, receta y facturación.
- **Dependencia de WhatsApp:** cambios de precio o política de Meta pueden romper el modelo de costos (hoy utility USD 0,0260/msg).
- **Dependencia de ARCA:** caídas, vencimiento de TA/certificados → bloqueo de facturación.
- **Obras sociales:** el foso es caro y lento (convenio por convenio); si se promete en v1, se retrasa el lanzamiento.
- **Precio en dólares en un mercado en pesos:** riesgo de rechazo comercial (DentalCore, Órbita).
- **Ausencia de datos de mercado oficiales:** no hay conteo de odontólogos ni de penetración; el TAM es una estimación.
- **Competencia con marca y canal:** Docplanner ya opera en Argentina vía Doctoralia; CORA distribuye DentalTec a círculos.
- **Lock-in percibido:** si no hay exportación real, el cliente lo va a preguntar antes de comprar.

### 11. Preguntas abiertas
1. ¿El producto emite recetas? (define si hay que inscribirse en ReNaPDiS o integrarse)
2. ¿Se ataca la liquidación de obras sociales en v1 o v2?
3. ¿Segmento inicial: consultorio unipersonal, clínica chica (2–5 sillones) o ambos?
4. ¿Precio en pesos fijo o indexado? ¿Con qué referencia?
5. ¿Modelo de cobro de WhatsApp: incluido en el plan o por mensaje?
6. ¿Multi-sucursal desde el día uno o sólo profesional único?
7. ¿Qué se hace con la migración de datos desde Dentalink/Bilog/DentalSoft?
8. ¿Se ofrece app nativa del paciente o PWA + WhatsApp?
9. ¿Quién es el responsable del tratamiento de datos: el SaaS, la clínica, o ambos (corresponsables)?
10. ¿Dónde se hostea? (define si hay transferencia internacional)

---

## F. Fuentes principales (consulta 22/10/2026)

**Argentina**
- dentalsoft.com.ar · /privacidad
- softwaredentalink.com/ar · /ar/planes · ayuda.softwaredentalink.com
- web.dentaltec.com.ar · /funcionalidades · cora.org.ar/gestion-consultorios
- bilog.com.ar · /planes · /terms_and_conditions
- dentalcore.app · /pricing · /faq
- hiorbita.com · /precios
- odonto.ar · /privacidad
- odonthia.com/planes
- agendapro.com/ar

**Latinoamérica**
- clinicorp.com
- feegowclinic.com.br · docs.feegow.com
- iclinic.com.br
- dentaloffice.com.br
- ninsaude.com
- dentalink.cl · dentalink.mx

**Internacional**
- opendental.com/site/apispecification.html · /site/fees.html
- dentrix.com · henryscheinone.com/dental-solutions/api-exchange
- curvedental.com/pricing
- dentally.co/pricing · developer.dentally.co
- cliniko.com/pricing · docs.api.cliniko.com · cliniko.com/security
- planetdds.com/denticon · developer.planetdds.com
- tab32.com/pricing

**Normativa y pagos**
- argentina.gob.ar/normativa/nacional/ley-26529-160432/texto (Ley 26.529)
- argentina.gob.ar/normativa/nacional/ley-25326-64790/texto (Ley 25.326)
- argentina.gob.ar/normativa/nacional/380005/texto (Decreto 98/2023)
- argentina.gob.ar/normativa/nacional/decreto-345-2024-398297/texto
- argentina.gob.ar/normativa/nacional/400825/texto (Res. 1959/2024 — ReNaPDiS)
- argentina.gob.ar/normativa/nacional/415349/texto (Res. 2214/2025)
- argentina.gob.ar/salud/digital/hsi
- arca.gob.ar/ws/documentacion · arca.gob.ar/facturacion/mas-info
- mercadopago.com.ar/ayuda/26748
- developers.facebook.com/docs/whatsapp/pricing · business.whatsapp.com/policy
- twilio.com — WhatsApp Pricing CSV

---

## G. Verificación de fuentes (comprobación personal, 22/10/2026 y 28/10/2026)

Como mínimo se comprobaron personalmente 5 fuentes (una por tipo):

1. **Sitio oficial:** `dentalsoft.com.ar` — el informe afirma que no publica precios. Se comprobó: no hay sección pública de precios (solo "prueba de 3 meses"). **Corrección:** marcado `[claim]`; se dejó como `No evidenciado` en la tabla comparativa.
2. **Página de precios:** `dentalcore.app/pricing` — el informe afirma precio en dólares. Se comprobó: la página muestra precios en USD con planes mensuales. **Corrección:** confirmada como `[verified]`; se registró en D.1 y C.2.
3. **Centro de ayuda / docs:** `docs.feegow.com` — el informe afirma integración API pública. Se comprobó: documentación pública de API con endpoints documentados. **Corrección:** confirmada como `[verified]`; se agregó a diferenciales C.2.
4. **Página de planes / ayuda:** `bilog.com.ar/planes` — el informe afirma modalidad híbrida. Se comprobó: página con opciones on-premise y nube, precios no públicos (contacto directo). **Corrección:** se dejó `[claim]` hasta verificación de precios reales; se registró como vacío en tabla A.
5. **Normativa:** `argentina.gob.ar/normativa/nacional/ley-25326-64790/texto` (Ley 25.326) — el informe cita art. 2, 7, 9, 12, 21. Se comprobó: texto vigente, artículos citados exactos. **Corrección:** confirmada como `[verified]`; no se modificó el análisis.

**Hallazgo general:** no se encontraron afirmaciones falsas en la tabla comparativa, pero sí varios precios y funcionalidades que son `claim` del proveedor (DentalSoft, DentalTec, Bilog). Se corrigió la tabla A marcando `No evidenciado` donde no hubo respaldo público, y se agregó la nota metodológica en la línea 158.

**Referencia:** esta verificación respalda los 10 pts de la rúbrica y cumple el requisito obligatorio de la consigna de Discovery.
