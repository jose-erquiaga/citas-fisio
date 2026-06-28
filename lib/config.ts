// Configuración central de la agenda de fisioterapia.
// Cambia aquí horas, días o cuántas semanas se muestran.

// Horas de cada cita (una cada 20 min).
// 19:30-21:00 → 4 citas.
export const SLOT_TIMES = ["19:30", "19:50", "20:10", "20:30"] as const;

// Días de la semana permitidos (0=domingo, 1=lunes, ... 6=sábado).
// Martes(2), Miércoles(3), Viernes(5).
export const ALLOWED_WEEKDAYS = [2, 3, 5] as const;

// Cuántas semanas hacia delante se muestran para reservar.
export const WEEKS_AHEAD = 3;

export const SLOTS_PER_DAY = SLOT_TIMES.length;

export type SlotTime = (typeof SLOT_TIMES)[number];

export function isValidSlotTime(t: string): t is SlotTime {
  return (SLOT_TIMES as readonly string[]).includes(t);
}
