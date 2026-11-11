# Appointment Specification

## Purpose
Proveer la capacidad de creación de turnos ordinarios y sobreturnos garantizando la prevención de solapamientos temporales tanto por profesional como por sillón/box odontológico, asegurando la integridad de la agenda multi-profesional.

## Requirements

### Requirement: Prevención de solapamiento de turnos por profesional y sillón
El sistema DEBE (SHALL) permitir la creación de turnos ordinarios únicamente cuando no exista superposición temporal en la agenda del profesional ni en la del sillón asignado, admitiendo sobreturnos excepcionales gobernados y adyacencias exactas.

#### Scenario: Camino feliz — Turno en franja libre (RN-AG-03, RN-AG-04)
- **DADO** que no existen turnos activos para el profesional "P1" en el rango 10:00–11:00
- **Y** que no existen turnos activos para el sillón "S1" en ese mismo rango
- **Y** que el tenant es "T1"
- **CUANDO** se solicita crear un turno de duración 60 min para P1 en S1 comenzando a las 10:00
- **ENTONCES** el sistema crea el turno con estado "confirmed"
- **Y** retorna el turno con su identificador único
- **Y** el turno queda almacenado en el repositorio

#### Scenario: Error de negocio — Profesional ocupado (RN-AG-03)
- **DADO** que el profesional "P1" tiene un turno activo (estado "confirmed") de 09:30 a 10:30
- **Y** el tenant es "T1"
- **CUANDO** se solicita crear un turno para P1 comenzando a las 10:00 (duración 60 min)
- **ENTONCES** el sistema rechaza la solicitud con el error "ProfessionalConflictError"
- **Y** no se crea ningún turno en el repositorio
- **Y** el error identifica al profesional en conflicto

#### Scenario: Error de negocio — Sillón ocupado por otro profesional (RN-AG-04)
- **DADO** que el sillón "S1" tiene un turno activo del profesional "P2" (estado "confirmed") de 09:00 a 10:30
- **Y** el profesional "P1" está libre en ese rango
- **Y** el tenant es "T1"
- **CUANDO** se solicita crear un turno para P1 en el sillón "S1" comenzando a las 10:00 (duración 60 min)
- **ENTONCES** el sistema rechaza la solicitud con el error "ChairConflictError"
- **Y** no se crea ningún turno en el repositorio
- **Y** el error identifica al sillón en conflicto

#### Scenario: Caso de borde — Adyacencia exacta es permitida (RN-AG-05)
- **DADO** que el profesional "P1" tiene un turno activo que termina exactamente a las 11:00
- **Y** que el sillón "S1" queda libre a partir de las 11:00
- **Y** el tenant es "T1"
- **CUANDO** se solicita crear un turno para P1 en "S1" comenzando a las 11:00 (duración 60 min)
- **ENTONCES** el sistema crea el turno exitosamente con estado "confirmed"

#### Scenario: Sobreturno gobernado — Excepción permitida con motivo (RN-AG-09)
- **DADO** que el profesional "P1" tiene un turno activo (estado "confirmed") de 10:00 a 11:00
- **Y** que no existe aún ningún sobreturno para P1 en esa franja
- **Y** el tenant es "T1"
- **CUANDO** se solicita crear un sobreturno para P1 en el sillón "S2" de 10:00 a 11:00
- **Y** se proporciona el motivo "Urgencia odontológica paciente derivado"
- **ENTONCES** el sistema crea el turno con estado "confirmed" y marcador isOverbook = true
- **Y** el motivo queda registrado en el turno
