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
| `knowledge-base/` | Base de conocimiento canónica del proyecto |
| `openspec/` | Especificaciones vigentes y changes archivados |
| `src/` | Implementación TypeScript del change de prevención de solapamientos |
| `tests/` | Tests Jest de los escenarios del change |
| `AGENTS.md` / `CLAUDE.md` | Reglas de trabajo y del dominio |
| `CHANGES.md` | Roadmap de implementación |
| `.active-orchestrator-state.json` | Estado estructurado de la fundación |

## Datos de ejemplo

Todos los datos de ejemplo y pruebas son ficticios y anonimizados. No se almacenan datos reales de pacientes ni se transmiten datos clínicos por WhatsApp.
