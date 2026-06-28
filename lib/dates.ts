import { ALLOWED_WEEKDAYS, WEEKS_AHEAD } from "./config";

// Fecha local en formato YYYY-MM-DD (sin desfases de zona horaria).
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Nombre del día en castellano (ej. "martes").
const WEEKDAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function weekdayName(dateKey: string): string {
  const d = parseDateKey(dateKey);
  return WEEKDAY_NAMES[d.getDay()];
}

// Texto legible: "martes 30 jun".
const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

export function prettyDate(dateKey: string): string {
  const d = parseDateKey(dateKey);
  return `${WEEKDAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, day] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, day);
}

// Lista de días válidos (martes/miércoles/viernes) desde hoy hasta WEEKS_AHEAD.
export function upcomingDates(from: Date = new Date()): string[] {
  const result: string[] = [];
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const totalDays = WEEKS_AHEAD * 7;
  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if ((ALLOWED_WEEKDAYS as readonly number[]).includes(d.getDay())) {
      result.push(toDateKey(d));
    }
  }
  return result;
}

export function isAllowedDate(dateKey: string): boolean {
  const d = parseDateKey(dateKey);
  return (ALLOWED_WEEKDAYS as readonly number[]).includes(d.getDay());
}
