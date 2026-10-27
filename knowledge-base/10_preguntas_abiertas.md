# Preguntas Abiertas

> **Estado.** Documento de incertidumbres heredadas del discovery, de inconsistencias detectadas al construir la base de conocimiento y de decisiones que aún no pueden tomarse con la evidencia disponible. Las preguntas `P0` bloquean el roadmap o la implementación; las `P1` bloquean el lanzamiento o el modelo comercial; las `P2` pueden resolverse después.
>
> **Regla de este documento:** ninguna pregunta se responde por inferencia silenciosa. Si un dato no está en el discovery con etiqueta `[verified]` o `[claim]`, se registra aquí.

## Inconsistencias detectadas

### IN-01 — “Commodity” versus evidencia de la tabla comparativa
**Documento A dice:** el resumen ejecutivo afirma que la agenda multi-profesional, la historia clínica con odontograma y el recordatorio por WhatsApp son commodities desde 2020 (`discovery.md` §1).
**Documento B dice:** la tabla A.1 muestra que Odonto.ar no tiene motor de recordatorios evidenciado, que Odonthia sólo envía recordatorios en planes pagos y que DentalTec no evidencia reserva online.
**Impacto:** si se asume que todos los competidores ya cubren lo básico, se subestima la oportunidad de ejecución y se puede recortar una funcionalidad que el segmento todavía no tiene resuelta.
**Resolución propuesta:** tratar agenda, historia clínica y recordatorios como **expectativa de mercado**, no como commodity universal; diferenciar por confiabilidad y automatización de punta a punta. Ver `DD-03`.

### IN-02 — “Elegir dos” diferenciadores entre cuatro candidatos
**Documento A dice:** `D.3` enumera cuatro diferenciadores candidatos para v1 y pide “elegir DOS, no cinco”.
**Documento B dice:** dos de esos cuatro (precio público en pesos y API pública) son decisiones de posicionamiento o de plataforma, no funcionalidades comparables con lista de espera y ARCA.
**Impacto:** el alcance de v1 queda ambiguo y el roadmap podría incluir cuatro frentes o ninguno.
**Resolución propuesta:** elegir dos funcionalidades (lista de espera y ARCA) y tratar el precio público como decisión comercial y la API pública como etapa posterior. Ver `DD-03`.

### IN-03 — Datos de adopción `[claim]` usados en la matriz
**Documento A dice:** la matriz B incluye la dimensión “precio y adopción” y asigna puntajes a productos con clientes autodeclarados.
**Documento B dice:** la sección A.3 advierte que Capterra, GetApp y B2B Stack bloquearon el acceso y que las cifras de adopción deben considerarse `[claim]` hasta verificación manual.
**Impacto:** el orden de la matriz puede estar influido por afirmaciones comerciales no auditadas; el ranking no debe usarse como verdad de mercado.
**Resolución propuesta:** usar la matriz como herramienta comparativa de producto, no como estudio de participación; en la KB no se repiten cifras de adopción como hechos.

### IN-04 — Afirmaciones absolutas sobre vacíos del mercado
**Documento A dice:** “Nadie tiene lista de espera” y “Nadie expone API pública” (`C.3`).
**Documento B dice:** la metodología del propio informe indica que `[no evid.]` significa “no evidenciado públicamente”, no inexistente.
**Impacto:** una afirmación absoluta puede ser refutada por un competidor no relevado y debilitar el análisis.
**Resolución propuesta:** formular los vacíos como “no evidenciado en el relevamiento” y mantener la oportunidad, sin convertirla en un hecho absoluto. La KB adopta esa formulación.

### IN-05 — Puntaje de precio de DentalTec
**Documento A dice:** la matriz B asigna 2,0 en “precio y adopción” a DentalTec.
**Documento B dice:** A.4 indica que DentalTec no publica precios y cobra packs de WhatsApp en USD (9/25/48), y C.2 usa el precio publicado como diferenciador.
**Impacto:** el puntaje de precio parece alto para un producto sin precio público; el orden podría cambiar si se aplicara el mismo criterio que a DentalSoft (1,5).
**Resolución propuesta:** revisar la rúbrica de “precio y adopción” antes de usar la matriz para decisiones; no modificar el informe sin evidencia adicional.

### IN-06 — Cobertura de ARCA y obligación legal
**Documento A dice:** la RG 5866 incorpora obligados por etapas y desde el 1/10/2026 alcanza a instituciones médicas privadas y profesionales (`E.9`).
**Documento B dice:** varios competidores argentinos no evidencian ARCA (DentalSoft, Dentalink en Argentina, Odonto.ar, Odonthia, Órbita).
**Impacto:** no puede concluirse que esos productos incumplan; pueden no estar alcanzados aún, usar otro sistema o no haberlo documentado. Tratarlos como “no cumplidores” sería un error.
**Resolución propuesta:** describir la situación como “ARCA no evidenciado”, no como incumplimiento; validar la obligación concreta de cada segmento antes de usarla como argumento comercial.

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Estado / Resolución | Bloquea | Decisor |
|---|---|---|---|---|
| **P0** | ¿El producto emite recetas electrónicas en v1.0? | **Resuelta:** v1 no las emite (`DD-14`) | Alcance legal y roadmap | Confirmado por usuario |
| **P0** | ¿Cuál es el segmento inicial y la multi-sucursal entra en v1.0? | **Resuelta:** consultorio unipersonal y clínica chica (2–5 sillones) (`DD-01`) | Modelo de datos, RBAC y roadmap | Confirmado por usuario |
| **P0** | ¿Las obras sociales se atacan en v1.0 o en v2? | **Resuelta:** v1 con catálogo manual + borrador; validación en línea en v2 (`DD-04`) | Alcance del módulo administrativo | Confirmado por usuario |
| **P0** | ¿Cuál es el stack tecnológico definitivo? | Abierta (propuesta TypeScript/NestJS/PostgreSQL) | Roadmap y fase Apply | Tech Lead |
| **P0** | ¿Dónde se aloja y quién es el responsable del tratamiento? | Abierta (propuesta hosting regional + corresponsabilidad) | Arquitectura y cumplimiento | Product Owner + legal |
| P1 | ¿Se validan las reglas de negocio derivadas con el usuario? | Especificaciones y pruebas | Product Owner |
| P1 | ¿Cuál es la política de seña y la ventana de cancelación por defecto? | Flujo de reserva y cobros | Product Owner |
| P1 | ¿El precio en pesos es fijo o indexado y con qué referencia? | Modelo comercial | Product Owner |
| P1 | ¿El costo de WhatsApp se incluye en el plan o se cobra por mensaje? | Unit economics | Product Owner |
| P1 | ¿Cómo se migran los datos desde Dentalink, Bilog o DentalSoft? | Onboarding y adopción | Product Owner |
| P1 | ¿La multi-sucursal se administra desde la interfaz en v1.0? | Alcance de configuración | Tech Lead |
| P1 | ¿El certificado de ARCA se gestiona con onboarding asistido o autoservicio? | Activación de facturación | Product Owner |
| P1 | ¿Cómo se evita la duplicación de pacientes y cómo se fusionan? | Calidad de datos y clínica | Tech Lead |
| P1 | ¿Cómo se gestiona el consentimiento de menores y tutores? | Cumplimiento y flujo clínico | Product Owner + legal |
| P1 | ¿De dónde sale el catálogo de obras sociales y el nomenclador? | Módulo de obras sociales | Product Owner |
| P1 | ¿Cómo se cobra la suscripción del propio SaaS? | Operación comercial | Product Owner |
| P1 | ¿Qué límites de uso y almacenamiento tiene cada plan? | Costos e infraestructura | Tech Lead |
| P2 | ¿Se agrega periodontograma en v1.1? | Roadmap posterior | Product Owner |
| P2 | ¿Se publica una API con sandbox? | Plataforma y ecosistema | Tech Lead |
| P2 | ¿Se incorpora un copiloto de recepción con IA? | Producto y costos | Product Owner |
| P2 | ¿Se integra Google Calendar en v1.0 o v1.1? | Alcance de integraciones | Tech Lead |
| P2 | ¿Se ofrece aplicación nativa del paciente? | Roadmap posterior | Product Owner |
| P2 | ¿Se agrega firma digital certificada? | Cumplimiento avanzado | Product Owner |
| P2 | ¿Se incorporan inventario, laboratorio o radiología? | Módulos adyacentes | Product Owner |
| P2 | ¿Se soportan multi-moneda o multi-país? | Expansión regional | Product Owner |

## Detalle de las preguntas P0

### P0-01 — ¿El producto emite recetas electrónicas en v1.0?
**Estado:** Resuelta (adoptada `DD-14`).
**Resolución:** El producto **no emitirá** recetas electrónicas en v1.0. Se excluye la inscripción y adecuación directa a ReNaPDiS (Decreto 345/2024 y Res. 1959/2024), simplificando el alcance regulatorio del MVP.

### P0-02 — ¿Cuál es el segmento inicial y la multi-sucursal entra en v1.0?
**Estado:** Resuelta (adoptada `DD-01`).
**Resolución:** El segmento inicial es **consultorio unipersonal y clínica chica (2 a 5 sillones)**. El modelo de datos contempla `branch` para no bloquear el crecimiento futuro, pero la interfaz operativa de v1.0 se simplifica para la operativa unisede/clínica chica.

### P0-03 — ¿Cuál es el stack tecnológico definitivo?
**Por qué bloquea:** sin stack no se puede planificar la fase Apply ni estimar el esfuerzo. La KB propone TypeScript/Node/PostgreSQL (`DD-09`), pero es una propuesta, no una decisión del equipo.
**Opciones:** (a) TypeScript + NestJS + PostgreSQL; (b) Python + FastAPI + PostgreSQL; (c) Go + PostgreSQL; (d) otro.
**Recomendación provisional:** (a) por afinidad con el dominio, tipado de punta a punta y velocidad de entrega; revisar si el equipo prefiere otra opción.

### P0-04 — ¿Dónde se aloja y quién es el responsable del tratamiento?
**Por qué bloquea:** la Ley 25.326 restringe la transferencia internacional (art. 12) y exige registro ante la AAIP (art. 21); el modelo de responsabilidad (plataforma, consultorio o corresponsables) define contratos, accesos y procesos de incidentes.
**Opciones:** (a) hosting en Argentina; (b) hosting regional con cláusulas contractuales; (c) corresponsabilidad con roles documentados; (d) plataforma como responsable principal.
**Recomendación provisional:** hosting regional con garantías y corresponsabilidad documentada (`SU-13`, `SU-14`), sujeto a revisión legal.

### P0-05 — ¿Las obras sociales se atacan en v1.0 o en v2?
**Estado:** Resuelta (adoptada `DD-04`).
**Resolución:** En v1.0 se incluye el **mínimo operativo**: catálogo manual de obras sociales, asociación por profesional, copago registrado por paciente y borrador exportable para facturación. La validación en línea de credenciales/elegibilidad queda diferida a v2.

## Incertidumbres de discovery registradas por la KB

Las siguientes entradas siguen el formato de la regla de baja confianza del contrato de estado. No bloquean la generación de la KB, pero deben resolverse antes de planificar.

- `[DISCOVERY]` **`stack`** no pudo inferirse con confianza de las fuentes: el proyecto es greenfield y no hay stack elegido. Se propone TypeScript + Node.js + PostgreSQL, marcado como “propuesto, no decidido”. **Confirmar:** ¿qué lenguaje, framework y base de datos adopta el equipo para la fase Apply?
- `[DISCOVERY]` **`scale`** se infirió como `multi_tenant` por el modelo SaaS, pero la operación multi-sucursal no está confirmada en el discovery. **Confirmar:** ¿la v1.0 opera una sola sucursal por cuenta o varias desde el inicio?
- `[DISCOVERY]` **`system_type`** se infirió como `saas_multi_tenant` a partir del modelo de producto y de los roles; no hay una definición técnica explícita en las fuentes. **Confirmar:** ¿se ratifica el SaaS multi-tenant como tipo de sistema?
- `[DISCOVERY]` **`timezone` y calendario de feriados** no están definidos en el discovery. Se asume `America/Argentina/Buenos_Aires`, pero no se especifica qué feriados aplican por jurisdicción. **Confirmar:** ¿el calendario de feriados es nacional, provincial o configurable por sucursal?
- `[DISCOVERY]` **`modalidad de facturación del SaaS`** no está definida: el discovery describe precios de competidores, no el precio ni el ciclo de cobro propio. **Confirmar:** ¿suscripción mensual, anual o mixta; con qué límites de uso?

## Huecos del discovery que conviene cubrir antes del roadmap

| Hueco | Por qué importa | Dónde impacta |
|---|---|---|
| No hay entrevistas con consultorios | Todo el problema se infiere de la oferta de los competidores, no de la demanda | `01`, `09` (`SU-01`) |
| No hay datos oficiales de mercado | El TAM y la penetración son estimaciones | `01`, `09` (`SU-10`) |
| No se relevó el circuito real de obras sociales | El alcance mínimo de `DD-04` puede quedar corto o largo | `05` (RN-OS), `06` (US-032) |
| No se verificó el costo real de WhatsApp en Argentina | El modelo de precios puede ser inviable | `09` (`SU-06`), `P1-04` |
| No se definió el proceso de alta de ARCA para un consultorio | El diferenciador puede quedar inaccesible | `09` (`SU-09`), `P1-07` |
| No se relevó la migración desde sistemas existentes | La adopción puede frenarse por la carga de datos | `09` (`SU-02`), `P1-05` |
| No se midió la tasa de no-show de la Argentina | El ROI de la lista de espera es una hipótesis | `01` (métricas), `09` (`SU-04`) |
| No se definió el tratamiento de pacientes menores | Afecta consentimiento y comunicación | `05` (RN-CL-10), `P1-09` |
