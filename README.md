# turnos-odont-met

Sistema de gestión de turnos y agenda odontológica para el mercado argentino.

## Requisitos

- Node.js 22 LTS

## Instalación

```bash
npm ci
```

## Verificación

```bash
npm test
npm run typecheck
```

## Estructura

| Ruta | Propósito |
|---|---|
| `docs/discovery/` | Informe y PDF de Discovery, consigna y checklist estructurado |
| `docs/consigna/` | Enunciado académico original y extracción de texto |
| `docs/evidence/` | Evidencia visual de instalación |
| `docs/discovery/evidence/` | Extracciones de texto y evidencia auxiliar del informe |
| `knowledge-base/` | Base de conocimiento canónica del proyecto |
| `openspec/` | Especificaciones vigentes y changes archivados |
| `src/` | Implementación TypeScript del change de prevención de solapamientos |
| `tests/` | Tests Jest de los escenarios del change |
| `scripts/` | Scripts auxiliares de validación y generación (ejecutar desde la raíz) |
| `AGENTS.md` / `CLAUDE.md` | Reglas de trabajo y del dominio |
| `CHANGES.md` | Roadmap de implementación |
| `.active-orchestrator-state.json` | Estado estructurado de la fundación |

## Datos de ejemplo

Todos los datos de ejemplo y pruebas son ficticios y anonimizados. No se almacenan datos reales de pacientes ni se transmiten datos clínicos por WhatsApp.
