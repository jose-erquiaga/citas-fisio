import type { Store } from "./types";
import { supabaseStore } from "./supabase";
import { localStore } from "./local";

export type { Booking, CreateResult, Store } from "./types";

// Indica si Supabase está configurado.
export function usingSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Selecciona el almacén: Supabase si hay credenciales, si no el local (dev).
export const store: Store = usingSupabase() ? supabaseStore : localStore;
