import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { toDateKey } from "../dates";
import type { Booking, CreateResult, Store } from "./types";

// Almacén local en JSON. SOLO para desarrollo cuando no hay Supabase configurado.
// No usar en producción serverless (sistema de archivos efímero / sin concurrencia real).

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

// Mutex en proceso para serializar lecturas/escrituras y emular el UNIQUE.
let chain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

async function writeAll(rows: Booking[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export const localStore: Store = {
  async listByDates(dateKeys: string[]): Promise<Booking[]> {
    const all = await readAll();
    const set = new Set(dateKeys);
    return all.filter((b) => set.has(b.booking_date));
  },

  async listUpcoming(): Promise<Booking[]> {
    const all = await readAll();
    const today = toDateKey(new Date());
    return all
      .filter((b) => b.booking_date >= today)
      .sort((a, b) =>
        a.booking_date === b.booking_date
          ? a.slot_time.localeCompare(b.slot_time)
          : a.booking_date.localeCompare(b.booking_date)
      );
  },

  create(dateKey: string, slotTime: string, name: string): Promise<CreateResult> {
    return withLock(async () => {
      const all = await readAll();
      const taken = all.some(
        (b) => b.booking_date === dateKey && b.slot_time === slotTime
      );
      if (taken) {
        return {
          ok: false as const,
          reason: "conflict" as const,
          message: "Ese hueco acaba de ocuparse, elige otro.",
        };
      }
      const booking: Booking = {
        id: randomUUID(),
        booking_date: dateKey,
        slot_time: slotTime,
        player_name: name,
        created_at: new Date().toISOString(),
      };
      all.push(booking);
      await writeAll(all);
      return { ok: true as const, booking };
    });
  },

  remove(id: string): Promise<void> {
    return withLock(async () => {
      const all = await readAll();
      await writeAll(all.filter((b) => b.id !== id));
    });
  },
};
