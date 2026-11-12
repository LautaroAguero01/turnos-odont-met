-- Schema de prevención de solapamientos (C-07)
-- Reglas de negocio: RN-AG-03, RN-AG-04, RN-AG-09

-- Restricción de exclusión por profesional (RN-AG-03)
ALTER TABLE appointment
  ADD CONSTRAINT ex_appointment_professional
  EXCLUDE USING gist (
    professional_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  )
  WHERE (
    status IN ('pending_deposit', 'confirmed', 'checked_in', 'in_progress')
    AND is_overbook = false
  );

-- Restricción de exclusión por sillón (RN-AG-04)
ALTER TABLE appointment
  ADD CONSTRAINT ex_appointment_chair
  EXCLUDE USING gist (
    chair_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  )
  WHERE (
    status IN ('pending_deposit', 'confirmed', 'checked_in', 'in_progress')
    AND is_overbook = false
  );

-- Límite de 1 sobreturno por profesional y horario de inicio (RN-AG-09)
CREATE UNIQUE INDEX uq_appointment_overbook_slot
  ON appointment (professional_id, starts_at)
  WHERE is_overbook = true
    AND status IN ('pending_deposit', 'confirmed', 'checked_in', 'in_progress');