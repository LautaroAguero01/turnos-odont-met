# turnos-odont-met

Sistema de gestión de turnos y agenda odontológica para el mercado argentino. El backend está organizado como un monolito modular TypeScript; por ahora contiene módulos de dominio y aplicación, no un servidor HTTP ejecutable.

## Requisitos

- Node.js 22 LTS
- PostgreSQL para ejecutar migraciones o validar el esquema Prisma

## Instalación

```bash
npm ci
```

Copiar `.env.example` a `.env` y configurar `DATABASE_URL` con una base PostgreSQL local. No usar credenciales reales en archivos versionados.

## Tests y chequeos

```bash
npm test
npm run typecheck
npm run check:env
```

Para validar el esquema y aplicar las migraciones a la base indicada por `DATABASE_URL`:

```bash
npm run prisma:validate
npm run prisma:migrate
```

## Estructura

| Ruta | Propósito |
|---|---|
| `apps/api/src/modules/identity/` | Dominio, casos de uso y adaptadores de identidad y autenticación |
| `apps/api/src/modules/tenants/` | Dominio y registro de tenants |
| `apps/api/src/modules/scheduling/` | Dominio, caso de uso y persistencia en memoria para turnos |
| `apps/api/src/shared/` | Servicios y errores compartidos |
| `prisma/` | Esquema y migraciones PostgreSQL |
| `tests/unit/` | Tests unitarios de agenda y aislamiento multi-tenant |
| `docs/discovery/` | Informe y PDF de Discovery, consigna y checklist estructurado |
| `docs/consigna/` | Enunciado académico original y extracción de texto |
| `docs/evidence/` | Evidencia visual de instalación |
| `knowledge-base/` | Base de conocimiento del proyecto |
| `openspec/changes/archive/` | Changes OpenSpec archivados; C-07 contiene la especificación implementada |
| `scripts/` | Scripts auxiliares de validación y generación |
| `AGENTS.md` / `CLAUDE.md` | Instrucciones y reglas del dominio |
| `CHANGES.md` | Roadmap y estado de los changes |

## Datos de prueba

Todos los datos de ejemplo y pruebas son ficticios y anonimizados. No se almacenan datos reales de pacientes ni se transmiten datos clínicos por WhatsApp.
