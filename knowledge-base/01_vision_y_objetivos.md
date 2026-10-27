# Visión y Objetivos

> **Fuentes de este documento.** `discovery/discovery.md` (investigación de mercado del 22/10/2026), `discovery/consigna.md` (enunciado y trazabilidad de la cátedra) y la sección `discovery` de `.active-orchestrator-state.json`. Los datos de mercado conservan las etiquetas de evidencia del informe: `[verified]` (documentado públicamente), `[claim]` (afirmación comercial no auditada) y `[no evid.]` (no evidenciado públicamente; no implica inexistencia).
>
> **Estado del proyecto.** Proyecto greenfield: no existe código, stack elegido ni repositorio de aplicación. Todo lo técnico se presenta como propuesta explícita (`> Propuesta (no decidido)` o `**Suposición:**`) y se consolida en `08_arquitectura_propuesta.md` y `09_decisiones_y_supuestos.md`.

## Propósito del sistema

**Un SaaS de gestión de turnos y agenda odontológica para consultorios y clínicas de Argentina que convierte la operación de recepción en un flujo automatizado, medible y auditable, sin perder el control clínico ni el cumplimiento legal.**

El punto de partida documentado es que los consultorios odontológicos argentinos gestionan la agenda con una combinación de WhatsApp manual, planilla y agenda en papel o en un software que no se comunica con nada. El resultado es doble: **sillones vacíos por ausencias** (no-show sin reemplazo) y **trabajo administrativo no facturable** (confirmar uno por uno, liquidar obras sociales a mano, facturar en otro sistema). El dolor principal se asume como ausentismo más carga administrativa, no como falta de funcionalidad clínica; ese supuesto debe validarse con clientes reales (`SU-01`).

La investigación de mercado concluye que la agenda diaria/semanal multi-profesional, la historia clínica con odontograma y el recordatorio por WhatsApp son **commodities** desde 2020 en Argentina. La competencia real se concentra en cuatro frentes: automatización de punta a punta por WhatsApp, obras sociales y prepagas, facturación electrónica ARCA y precio/transparencia. Ningún producto argentino relevado combina agenda multi-sillón, reserva online, recordatorios automáticos, obras sociales y ARCA a precio PyME con precio público en pesos.

## Contexto competitivo (síntesis)

El relevamiento cubre **21 sistemas**: 14 de Argentina y Latinoamérica y 7 internacionales de referencia. La matriz ponderada (0–5) y el análisis completo están en `discovery/discovery.md`, secciones A, B y C. Para la definición del producto se retienen los siguientes arquetipos:

| Arquetipo | Productos de referencia | Qué demuestra | Implicancia para este producto |
|---|---|---|---|
| Profundidad administrativa con precio opaco | DentalTec, Bilog, Dentalink | Validación o liquidación de obras sociales y facturación electrónica argentina en DentalTec y Bilog `[verified]` | Es el foso más caro; no se ataca completo en v1 |
| Precio claro con administración débil | Odonto.ar, Odonthia | Precio público y baja fricción de adopción, sin liquidación de obras sociales ni ARCA `[verified]` | El precio transparente es condición de entrada, no diferencial |
| Producto moderno en dólares y sin circuito local completo | DentalCore, Órbita | ARCA nativo y WhatsApp oficial en DentalCore; IA conversacional en Órbita; ninguno con obras sociales completas `[verified]` | La arquitectura moderna no alcanza si falta el circuito local |
| Benchmark técnico y de experiencia | Dentally, Cliniko, Open Dental | API pública con sandbox, precio visible, relleno de huecos, onboarding simple `[verified]` | Son referencias de arquitectura y UX, no competidores locales |

**Brechas priorizadas** (detalle en `discovery/discovery.md` §C.3):

1. **Lista de espera:** no evidenciada en ningún competidor argentino del relevamiento. Cada cancelación equivale a un sillón vacío y a un ingreso perdido.
2. **API pública:** no evidenciada en ningún competidor argentino del relevamiento. No hay ecosistema ni portabilidad real.
3. **Circuito completo:** facturación ARCA, obras sociales, Mercado Pago y agenda en un mismo producto, a precio PyME, no se verifica en ninguno del relevamiento.
4. **Consultorio unipersonal que atiende obras sociales:** queda huérfano; los productos baratos no liquidan obras sociales y los que liquidan son caros y opacos.
5. **Auditoría y portabilidad:** sólo DentalCore y DentalTec evidencian auditoría completa; Dentalink elimina la cuenta a los 30 días de impago `[verified]`.

### Competidores prioritarios para demo

| Prioridad | Competidor | Qué mirar | Por qué |
|---|---|---|---|
| 1 | **DentalSoft** | Sobreturnos con detección de solapamiento, liquidación a obras sociales y profesionales, reserva online en cuatro pasos | Es el competidor más cercano al producto objetivo; no publica precios |
| 2 | **Dentalink** | Vista por sillón, odontograma y periodontograma, circuito de obras sociales argentinas | Marca el techo funcional clínico a igualar |
| 3 | **DentalTec** | Validación en tiempo real contra obras sociales, cierre multinivel y ARCA | Es el foso administrativo que se decide atacar en v2 |
| 4 | **Bilog** | Modalidad híbrida, liquidaciones y envejecimiento de la UX | Muestra el segmento conservador y el costo del on-premise |
| 5 | **DentalCore** | ARCA nativo, WhatsApp oficial, auditoría y exportación con cuenta suspendida | Es el competidor nuevo con la arquitectura más moderna |
| Extra | **Órbita** | IA conversacional, agenda por sillón e integración con Dentalink y Benty | Referencia de IA; su core está en preventa |

### Referencias de experiencia de usuario

1. **Cliniko** — simplicidad, onboarding y API sólida; el estándar de “software de salud que no da miedo”.
2. **Curve Dental** — referencia visual de *charting* legible y flujo todo-en-uno.
3. **Dentally** — referencia dental-técnica: agenda orientada a producción, relleno de huecos y API con sandbox.

*(Referencia local de simplicidad: **Odonto.ar** — reserva online y precio claro, pero sin automatización. Es el ejemplo de qué no recortar: los recordatorios.)*

> **Advertencia metodológica heredada.** No existe conteo oficial de odontólogos ni de penetración de software en Argentina. Todo dato de mercado es autodeclarado por proveedores y debe tratarse como benchmark, no como tamaño de mercado.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| **Odontólogo/a titular** (decide la compra y atiende) | No perder ingresos por sillones vacíos | Ver su agenda y producción; reducir tiempo administrativo; cumplir con la normativa sin contratar más personal |
| **Recepcionista / secretaria** (usuario operativo principal) | Agendar, confirmar y cobrar sin llamadas ni planillas paralelas | Evitar superposiciones; recuperar cancelaciones; responder consultas por WhatsApp con información consistente |
| **Odontólogo/a asociado** | Ver su agenda, sus pacientes y su liquidación | Registrar la evolución clínica; acceder sólo a la información que le corresponde |
| **Administrativo de obras sociales y facturación** | Liquidar prestaciones y emitir comprobantes sin duplicar carga | Controlar topes, copagos y autorizaciones; conciliar cobros; exportar reportes |
| **Paciente** | Reservar, confirmar, cancelar y pagar la seña en menos de un minuto | Recibir recordatorios útiles; obtener copia de su historia clínica; no repetir datos |
| **Operador de la plataforma** (interno del SaaS) | Sostener la disponibilidad y dar soporte sin acceder a datos clínicos | Gestionar altas, planes y uso; auditar accesos de soporte |

## Propuesta de valor

1. **Recuperar el sillón vacío:** lista de espera inteligente que ofrece automáticamente el turno liberado por WhatsApp, con ventana de aceptación configurable. Convierte cancelaciones en ingresos medibles.
2. **Eliminar la confirmación manual:** recordatorios y confirmaciones por WhatsApp Cloud API oficial con botones de confirmar/cancelar que liberan el turno en el sistema.
3. **Cerrar el circuito administrativo sin salir del producto:** caja, seña con Mercado Pago y facturación ARCA nativa desde el presupuesto cobrado.
4. **Cumplir y no quedar cautivo:** consentimiento digital, auditoría inmutable, historia clínica conservada y exportación total en cualquier momento, incluso con la cuenta suspendida.
5. **Precio público en pesos y alta autoservicio:** posicionamiento explícito frente a un mercado que cotiza por asesor y cobra en dólares.

## Alcance v1.0 (MVP)

El alcance se deriva de `discovery/discovery.md` §D.3 y del checklist §E.5. La versión 1.0 incluye los ocho imprescindibles y **dos** de los cuatro diferenciadores candidatos.

### Imprescindibles

- [ ] **Agenda multi-profesional por sillón** con duración variable por prestación, bloqueos, sobreturnos y prevención de solapamiento por profesional y por sillón.
- [ ] **Reserva online 24/7 por link público**, con reglas configurables: anticipación mínima, especialidades habilitadas, obras sociales aceptadas y cupo por profesional.
- [ ] **Recordatorios y confirmación por WhatsApp Cloud API oficial** (plantillas `utility`), con link de confirmar/cancelar que libera el turno.
- [ ] **Ficha clínica con odontograma FDI**, presupuestos y planes de tratamiento.
- [ ] **Caja y cobros con Mercado Pago** (link/QR) y seña al reservar.
- [ ] **Roles y permisos, multi-sucursal y auditoría de accesos.**
- [ ] **Exportación total de datos** en cualquier momento, incluso con la cuenta suspendida.
- [ ] **Cumplimiento mínimo:** consentimiento informado digital, respaldo cifrado y política de privacidad alineada a la Ley 25.326, con aviso de transferencia internacional cuando corresponda.

### Diferenciadores de v1.0 (dos elegidos)

- [ ] **Lista de espera inteligente** con oferta automática del hueco liberado y ventana de aceptación configurable.
- [ ] **Facturación ARCA nativa** desde el presupuesto cobrado (comprobantes B/C, CAE y QR fiscal).

> **Propuesta (no decidido).** El informe de discovery deja cuatro candidatos y pide elegir dos. Se eligen lista de espera y ARCA porque atacan directamente las dos pérdidas del problema (sillón vacío y carga administrativa). El precio público en pesos se trata como decisión comercial y no como funcionalidad; la API pública se posterga a v1.1/v2. La elección queda registrada en `DD-03`.

### Refinamiento de alcance propuesto

- **Obras sociales en v1.0 (versión mínima):** catálogo manual por consultorio, obra social por paciente, copago informado, obra social aceptada por profesional y **borrador de liquidación exportable**. No incluye validación en línea ni liquidación definitiva; eso corresponde a v2. Este recorte es una propuesta y se justifica en `DD-04`.
- **Multi-sucursal:** el modelo de datos y los permisos lo soportan desde v1.0; la interfaz de administración de múltiples sucursales puede limitarse a una sucursal por cuenta en el piloto.
- **Portal del paciente:** PWA accesible por enlace mágico, sin aplicación nativa.
- **Historia clínica:** copia al paciente dentro de las 48 horas y conservación de 10 años, conforme a la Ley 26.529.

## Fuera de alcance

Queda explícitamente fuera de la versión 1.0:

- Validación en línea y liquidación definitiva de obras sociales y prepagas (v2; requiere convenio por convenio).
- Periodontograma de seis sitios (v1.1).
- Emisión de recetas electrónicas y cualquier integración con ReNaPDiS (decisión de alcance pendiente, `P0-01`).
- Ortodoncia con galería y seguimiento, estética facial y flujos de especialidad avanzada.
- Aplicación nativa para el paciente o para el profesional.
- Telemedicina y videoconsulta.
- Campañas de marketing, NPS, fidelización y BI avanzado.
- Firma digital certificada; en v1.0 se usa firma electrónica simple con evidencia de autoría.
- Facturación multi-moneda o multi-país.
- API pública documentada con sandbox (v1.1/v2).
- Custodia de fondos de terceros, *split* de pagos o billetera propia.
- Gestión de inventario, laboratorio y radiología/PACS.
- Facturación automática de la suscripción del propio SaaS.

## Métricas de éxito

> **Propuesta (no decidido).** No existen líneas de base públicas del mercado; los objetivos son hipótesis a validar con las primeras cuentas.

| Métrica | Objetivo v1.0 | Cómo se mide | Riesgo |
|---|---|---|---|
| Tasa de ausentismo (no-show) | Reducción de al menos 30 % respecto de la línea de base de la cuenta a 90 días | Turnos `no_show` / turnos confirmados | La línea de base no existe al inicio; requiere instrumentación previa |
| Recuperación de cancelaciones | ≥ 30 % de las cancelaciones elegibles cubiertas por lista de espera | Ofertas aceptadas / cancelaciones con lista disponible | Depende de masa crítica de pacientes en espera |
| Tiempo de alta de turno en mostrador | < 60 segundos | Telemetría de la interfaz | No mide calidad de la agenda resultante |
| Activación del consultorio | Agenda operativa con reserva online en < 1 día | Alta completa: profesional + sillón + prestaciones + link publicado | Puede requerir migración de datos |
| Adopción de reserva online | ≥ 25 % de los turnos nuevos a 60 días | Turnos con origen `public_link` / total | Pacientes de mayor edad pueden preferir WhatsApp |
| Costo de WhatsApp por turno confirmado | Definir tras 30 días de uso real | Costo de mensajes / turnos confirmados | El precio de Meta cambia por país y categoría |
| Retención de cuentas | ≥ 90 % a 6 meses en el piloto | Cuentas activas / altas | Muestra pequeña |

## Restricciones de alto nivel

El detalle normativo y las reglas codificadas están en `05_reglas_de_negocio.md` (dominios RN-PR y RN-WA) y en `11_integraciones_locales_ar.md`.

- Los datos de salud son datos sensibles (Ley 25.326, arts. 2, 7 y 9): consentimiento, finalidad y seguridad reforzada.
- La transferencia internacional de datos está restringida (Ley 25.326, art. 12): condiciona el *hosting* y el soporte fuera del país (`P0-04`).
- Registro de bases de datos ante la AAIP (Ley 25.326, art. 21).
- Historia clínica conservada 10 años, íntegra, inalterable y recuperable, con copia al paciente en 48 horas (Ley 26.529).
- Si se emiten recetas: Decreto 345/2024 y Resolución 1959/2024 (ReNaPDiS), con firma electrónica o digital.
- Facturación: la RG 5866 de ARCA incorpora obligados por etapas; desde el 1/10/2026 alcanza a instituciones médicas privadas y profesionales.
- WhatsApp: opt-in por categoría, plantillas aprobadas y prohibición de datos clínicos o telemedicina por ese canal.

## Supuestos críticos

Los supuestos completos, con origen, riesgo y forma de validación, están en `09_decisiones_y_supuestos.md`. Los que condicionan la visión son:

- `SU-01`: el dolor principal es ausentismo más carga administrativa, no falta de funcionalidad clínica.
- `SU-02`: el segmento inicial es consultorio unipersonal y clínica chica de 2 a 5 sillones.
- `SU-03`: existe disposición a pagar un precio público en pesos por un producto que resuelve agenda, WhatsApp y ARCA en un solo lugar.
- `SU-04`: la lista de espera encuentra pacientes disponibles en un horizonte de pocas horas.
- `SU-05`: el consultorio puede operar la reserva online con seña sin fricción excesiva para sus pacientes.
