# Consigna y verificación de cumplimiento

> Documento de control del informe `discovery.md`. Acá viven el enunciado y el mapa de trazabilidad; el informe queda sólo con la investigación de mercado.

## 1. Consigna (texto del enunciado)

> **Objetivo.** Realizar una búsqueda exhaustiva de sistemas odontológicos que permitan gestionar turnos y agenda de pacientes, para identificar soluciones existentes, comparar funcionalidades y detectar oportunidades para desarrollar un producto competitivo.
>
> **Alcance y prioridad.** (1) Argentina. (2) Latinoamérica. (3) Soluciones internacionales relevantes que puedan utilizarse o inspirar un producto para el mercado argentino.
>
> **Fuentes.** Exclusivamente verificables: sitios oficiales de cada proveedor, documentación pública, páginas de precios, centros de ayuda, videos oficiales, marketplaces confiables y reseñas verificadas. Cada fuente se indica con URL y fecha de consulta. No se inventan funcionalidades: si una característica no está demostrada públicamente, se consigna "No evidenciado".
>
> **Dimensiones relevadas por sistema.** Nombre del producto, empresa proveedora, país de origen y URL oficial · segmento objetivo · modalidad (SaaS, nube, app móvil, instalación local o híbrida) · gestión de agenda (vista diaria/semanal, múltiples profesionales, múltiples sillones o boxes, duración variable, bloqueos, sobreturnos, prevención de solapamientos) · turnos digitales (reserva online 24/7, enlace de reserva, web, redes sociales, chatbot, WhatsApp, confirmación, cancelación, reprogramación, lista de espera) · automatización (recordatorios, confirmaciones, seguimiento de ausentes, recuperación, controles periódicos, campañas) · gestión odontológica (ficha clínica, anamnesis, odontograma, periodontograma, imágenes/radiografías, presupuestos, planes de tratamiento) · administración (caja, cobros, facturación, señas, Mercado Pago, obras sociales/prepagas, liquidaciones, reportes y métricas) · integraciones (WhatsApp Business API, Google Calendar, sitio web, APIs públicas, Mercado Pago, AFIP/ARCA, radiología, firma digital, marketing) · operación (sucursales, roles y permisos, auditoría, exportación de datos, soporte y capacitación) · seguridad y cumplimiento (datos sensibles de salud, privacidad, trazabilidad, respaldo, control de acceso, normativa argentina aplicable) · modelo comercial (prueba gratuita, plan gratuito, precios publicados, moneda, modalidad de cobro, costos adicionales visibles) · fortalezas, limitaciones y diferenciales evidentes · evidencia de adopción (casos de éxito, cantidad de clientes sólo si está publicada, reseñas verificables).
>
> **Entregables.** **A.** Tabla comparativa de al menos 15 sistemas ordenados por relevancia para Argentina. **B.** Matriz de puntuación de 0 a 5 con los pesos: turnos y automatización 25 %, funcionalidad odontológica clínica 20 %, integraciones locales y WhatsApp 15 %, administración/cobros/facturación 15 %, experiencia del paciente 10 %, seguridad/exportación/trazabilidad 10 %, precio y facilidad de adopción 5 %. **C.** Análisis competitivo: estándares de mercado, diferenciadores reales, vacíos del mercado argentino y oportunidades de innovación. **D.** Recomendación final: cinco competidores prioritarios para demo, tres productos de referencia de experiencia de usuario y un MVP sugerido (imprescindibles, diferenciadores, etapas posteriores).
>
> **Registro.** Español formal, con criterio crítico, diferenciando siempre una funcionalidad comprobada de una afirmación comercial del proveedor.

## 2. Trazabilidad: requisito → dónde se cumple

Las letras de sección refieren a `discovery.md`: **A.1–A.5** tablas comparativas y anexos · **B** matriz ponderada · **C** análisis competitivo · **D** recomendación final · **E** los 11 puntos del checklist · **F** fuentes.

| Requisito de la consigna | Dónde se cumple | Estado |
|---|---|---|
| Alcance: Argentina → Latinoamérica → internacionales relevantes | Encabezado · A.1 · A.2 | Cumplido |
| Fuentes verificables con URL y fecha de consulta por fuente | A.5 · F | Cumplido (A.5 agregado en esta revisión) |
| Consignar "No evidenciado" cuando no hay demostración pública | Leyenda · todas las tablas | Cumplido |
| Nombre, empresa proveedora, país y URL oficial | A.1 · A.2 · A.5 | Cumplido |
| Segmento objetivo | A.1 · A.2 | Cumplido |
| Modalidad (SaaS, nube, móvil, local, híbrida) | A.1 · A.2 | Cumplido |
| Gestión de agenda: vista diaria/semanal, multi-profesional, multi-sillón, duración variable, bloqueos, sobreturnos, solapamientos | A.1 columna "Agenda / turnos" | Cumplido |
| Turnos digitales: reserva 24/7, enlace, web, redes, chatbot, WhatsApp, confirmación, cancelación, reprogramación, lista de espera | A.1 columnas "Agenda / turnos" y "Automatización"; el vacío de lista de espera se documenta en C.3 | Cumplido |
| Automatización: recordatorios, confirmaciones, ausentes, recuperación, controles, campañas | A.1 columna "Automatización" | Cumplido |
| Gestión odontológica: ficha, anamnesis, odontograma, periodontograma, imágenes, presupuestos, planes | A.1 columna "Clínica" | Cumplido |
| Administración: caja, cobros, facturación, señas, Mercado Pago, obras sociales, liquidaciones, reportes | A.1 columna "Admin / fiscal" | Cumplido |
| Integraciones: WhatsApp API, Google Calendar, web, API pública, Mercado Pago, AFIP/ARCA, radiología, firma digital, marketing | A.1 columna "Integraciones" | Cumplido |
| Operación: sucursales, roles y permisos, auditoría, exportación, soporte y capacitación | **A.3** | Cumplido (agregado en esta revisión) |
| Seguridad y cumplimiento: datos de salud, privacidad, trazabilidad, respaldo, control de acceso, normativa argentina | **A.3** + sección E.9 | Cumplido (agregado en esta revisión) |
| Modelo comercial: prueba, plan gratuito, precios, moneda, cobro, costos adicionales | **A.4** | Cumplido (agregado en esta revisión) |
| Fortalezas, limitaciones y diferenciales evidentes | **A.3** columna de balance + C.2 | Cumplido (agregado en esta revisión) |
| Evidencia de adopción: casos de éxito, clientes publicados, reseñas verificables | **A.3** columna "Adopción publicada" | Cumplido (agregado en esta revisión) |
| Tabla comparativa de al menos 15 sistemas, ordenada por relevancia para Argentina | A.1 (14 sistemas AR/LatAm) + A.2 (7 internacionales) = **21 sistemas** | Cumplido |
| Matriz 0–5 con los siete pesos indicados | B | Cumplido |
| Análisis competitivo: estándares, diferenciadores, vacíos, oportunidades | C.1 · C.2 · C.3 · C.4 | Cumplido |
| Recomendación: 5 competidores para demo, 3 referencias de UX, MVP sugerido | D.1 · D.2 · D.3 | Cumplido |
| Español formal, criterio crítico, funcionalidad comprobada vs. afirmación comercial | Registro formalizado; etiquetas `[verified]` / `[claim]` / `[no evid.]` en todo el documento | Cumplido (formalizado en esta revisión) |

## 3. Registro de la revisión de consistencia (22/10/2026)

Correcciones aplicadas sobre la versión con las modificaciones del usuario:

1. **Se extrajo la consigna** del informe a este documento (sección 1), con las dimensiones y entregables exigidos.
2. **Se agregaron los anexos A.3, A.4 y A.5**, porque la tabla A.1 no cubría tres bloques que el enunciado pide explícitamente por sistema: operación (sucursales, roles, auditoría, exportación, soporte y capacitación), seguridad y cumplimiento, modelo comercial detallado, fortalezas/limitaciones y evidencia de adopción.
3. **Se propagó la corrección de DentalSoft (no publica precio)** a los lugares donde había quedado desactualizada: la matriz B (precio 3,0 → 1,5; total 3,88 → **3,81**, por lo que desciende al sexto lugar), el cuadro C.2 ("precio publicado en pesos") y la fila de D.1.
4. **Registro formalizado:** se reemplazaron las formas de voseo del resumen ejecutivo por español formal, según lo pedido en el enunciado.
5. **Limpieza final:** la verificación de cumplimiento (sección 2) y este registro salieron de `discovery.md` para que el informe contenga únicamente el relevamiento.
