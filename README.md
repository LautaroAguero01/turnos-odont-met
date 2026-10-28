# turnos-odontologia

Sistema de gestión de turnos y agenda odontológica para el mercado argentino.

## Instalación

```bash
npm install
```

Requiere Node 22 LTS.

## Ejecutar tests

```bash
npm test
# o directamente con Jest
node node_modules/jest/bin/jest.js --testPathPattern="create-appointment"
```

Todos los escenarios del change C-07 (`create-appointment-overlap-prevention`) deben pasar en verde.

## Estructura de carpetas relevantes

| Carpeta / archivo | Propósito |
|---|---|
| `knowledge-base/` | Base de conocimiento canónica (10 archivos) y `11_integraciones_locales_ar.md` |
| `discovery/` | Informe de Discovery (`discovery.md`, `discovery.pdf`) y consigna del agente (`consigna.md`) |
| `.active-orchestrator-state.json` | Estado de fundación (`step: done`, `discovery` registrado) |
| `AGENTS.md` / `CLAUDE.md` | Reglas duras del proyecto (privacidad, agenda, código) |
| `.atl/skill-registry.md` | Registro de skills del proyecto |
| `CHANGES.md` | Roadmap de implementación (C-01 a C-21) |
| `openspec/` | Especificaciones OpenSpec (`changes/`, `specs/`) |
| `src/` | Implementación del change C-07 (`application/`, `domain/`, `infrastructure/`) |
| `tests/` / `src/__tests__/` | Suite de tests contra el spec aprobado |

## Flujo de trabajo (OPSX)

1. `knowledge-base/` → comprender dominio.
2. `CHANGES.md` → elegir change del MVP recomendado.
3. `openspec/changes/` → `propose` → `apply` → `verify` → `archive`.
4. No se codifica sin spec aprobado; no se archiva con tests en rojo.

## Datos

Todos los datos de ejemplo y pruebas usan información **ficticia y anonimizada** (Ley 25.326 / Ley 26.529). No se almacenan datos reales de pacientes ni se transmiten datos clínicos por WhatsApp.

## Repositorio

Inicializado con repositorio vacío (`git init`). El historial de commits documenta cada etapa de fundación y el ciclo OPSX.
