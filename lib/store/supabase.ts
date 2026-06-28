import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { toDateKey } from "../dates";
import type { Booking, CreateResult, Store } from "./types";

const TABLE = "bookings";

function client(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Para escrituras/borrados usamos la service role si está disponible
  // (el panel admin la necesita); si no, la anon key.
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Código de error de violación de restricción única en Postgres.
const UNIQUE_VIOLATION = "23505";

export const supabaseStore: Store = {
  async listByDates(dateKeys: string[]): Promise<Booking[]> {
    if (dateKeys.length === 0) return [];
    const { data, error } = await client()
      .from(TABLE)
      .select("*")
      .in("booking_date", dateKeys);
    if (error) throw new Error(error.message);
    return (data ?? []) as Booking[];
  },

  async listUpcoming(): Promise<Booking[]> {
    const today = toDateKey(new Date());
    const { data, error } = await client()
      .from(TABLE)
      .select("*")
      .gte("booking_date", today)
      .order("booking_date", { ascending: true })
      .order("slot_time", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as Booking[];
  },

  async create(
    dateKey: string,
    slotTime: string,
    name: string
  ): Promise<CreateResult> {
    const { data, error } = await client()
      .from(TABLE)
      .insert({ booking_date: dateKey, slot_time: slotTime, player_name: name })
      .select()
      .single();
    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return {
          ok: false,
          reason: "conflict",
          message: "Ese hueco acaba de ocuparse, elige otro.",
        };
      }
      return { ok: false, reason: "error", message: error.message };
    }
    return { ok: true, booking: data as Booking };
  },

  async remove(id: string): Promise<void> {
    const { error } = await client().from(TABLE).delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
