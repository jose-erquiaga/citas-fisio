export interface Booking {
  id: string;
  booking_date: string; // YYYY-MM-DD
  slot_time: string; // "19:30"
  player_name: string;
  created_at: string; // ISO
}

export type CreateResult =
  | { ok: true; booking: Booking }
  | { ok: false; reason: "conflict" | "error"; message: string };

export interface Store {
  // Reservas de un conjunto de fechas (para la página pública).
  listByDates(dateKeys: string[]): Promise<Booking[]>;
  // Todas las reservas futuras (para el panel admin).
  listUpcoming(): Promise<Booking[]>;
  // Crea una reserva. Devuelve conflict si el hueco ya está ocupado.
  create(dateKey: string, slotTime: string, name: string): Promise<CreateResult>;
  // Borra una reserva por id (admin).
  remove(id: string): Promise<void>;
}
