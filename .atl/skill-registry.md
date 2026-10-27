# Skill Registry

> **Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.
> Fuente de verdad de las skills y andamiaje instalados para el proyecto **turnos-odontologia**.

---

## User Skills & Installed Harness

| Trigger | Skill | Path |
|---|---|---|
| `/opsx:explore` | `openspec-explore` | `.opencode/skills/openspec-explore/SKILL.md` |
| `/opsx:propose` | `openspec-propose` | `.opencode/skills/openspec-propose/SKILL.md` |
| `/opsx:apply` | `openspec-apply-change` | `.opencode/skills/openspec-apply-change/SKILL.md` |
| `/opsx:archive` | `openspec-archive-change` | `.opencode/skills/openspec-archive-change/SKILL.md` |
| `/opsx:sync` | `openspec-sync-specs` | `.opencode/skills/openspec-sync-specs/SKILL.md` |
| `/opsx:update` | `openspec-update-change` | `.opencode/skills/openspec-update-change/SKILL.md` |
| `/active-orchestrator` | `active-orchestrator` | `C:/Users/Aida/.config/opencode/skills/active-orchestrator/SKILL.md` |
| `/discovery-research` | `discovery-research` | `C:/Users/Aida/.config/opencode/skills/discovery-research/SKILL.md` |
| `/kb-creator` | `kb-creator` | `C:/Users/Aida/.config/opencode/skills/kb-creator/SKILL.md` |
| `/roadmap-generator` | `roadmap-generator` | `C:/Users/Aida/.config/opencode/skills/roadmap-generator/SKILL.md` |
| `/find-skills` | `find-skill` | `C:/Users/Aida/.config/opencode/skills/find-skill/SKILL.md` |
| `/skill-registry` | `skill-registry` | `C:/Users/Aida/.config/opencode/skills/skill-registry/SKILL.md` |
| `/agent-instruction` | `agent-instruction` | `C:/Users/Aida/.config/opencode/skills/agent-instruction/SKILL.md` |
| `/web-scraper` | `web-scraper` | `C:/Users/Aida/.config/opencode/skills/web-scraper/SKILL.md` |

---

## Compact Rules

### openspec-propose
- Planificar antes de codear: solo crea artefactos en `openspec/changes/<name>/` (`proposal.md`, `design.md`, `specs/`, `tasks.md`).
- Redactar escenarios verificables en formato Gherkin (`Dado / Cuando / Entonces`).
- Cobertura obligatoria: al menos 1 camino feliz, 1 de error de negocio y 1 caso de borde.
- Nunca comenzar la implementación en la misma respuesta que genera el proposal.

### openspec-apply-change
- La especificación aprobada en `propose` es un contrato cerrado.
- NUNCA improvisar requerimientos ni alterar reglas de negocio no contenidas en la spec.
- Si falta una decisión de diseño o una regla, pausar y volver a `propose`.
- TDD obligatorio: escribir tests que representen cada escenario antes de cerrar las tareas.

### openspec-archive-change
- Verificar que la totalidad de los tests automatizados del change estén en verde antes de archivar.
- Mover el directorio del change a `openspec/changes/archive/AAAA-MM-DD-<name>/`.
- Actualizar `CHANGES.md` marcando el checkbox correspondiente a `[x]`.

### active-orchestrator
- Controlar transiciones de estado a través de `.active-orchestrator-state.json`.
- Respetar el protocolo de inspección inter-fase (Continuar / Ajustar / Parar acá).
- Mantener la separación de responsabilidades: el orquestador no redacta código ni documentos directamente.

---

## Project Conventions

| File | Path | Notes |
|---|---|---|
| `AGENTS.md` | `AGENTS.md` | Instrucciones principales del agente, stack y reglas duras |
| `CLAUDE.md` | `CLAUDE.md` | Espejo sincronizado de AGENTS.md para compatibilidad de harnesses |
| `CHANGES.md` | `CHANGES.md` | Índice maestro de roadmap, camino crítico y dependencias |
| `09_decisiones_y_supuestos.md` | `knowledge-base/09_decisiones_y_supuestos.md` | Decisiones de arquitectura y alcance confirmadas |
| `05_reglas_de_negocio.md` | `knowledge-base/05_reglas_de_negocio.md` | 111 reglas codificadas de dominio odontológico y agenda |
