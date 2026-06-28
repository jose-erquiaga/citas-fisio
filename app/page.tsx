import { toDateKey } from "@/lib/dates";
import { store, usingSupabase } from "@/lib/store";
import Calendar from "./Calendar";
import Logo from "./Logo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const bookings = await store.listUpcoming();

  // Nº de reservas por día (para marcar el calendario).
  const counts: Record<string, number> = {};
  for (const b of bookings) {
    counts[b.booking_date] = (counts[b.booking_date] ?? 0) + 1;
  }

  const today = toDateKey(new Date());

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex flex-col items-center text-center">
        <Logo size={88} className="mb-3" />
        <h1 className="text-2xl font-bold">Citas de fisioterapia</h1>
        <p className="mt-1 text-sm text-gray-600">
          Martes, miércoles y viernes · de 19:30 a 21:00 · 4 plazas por día.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Elige un día con fisio para ver las horas y reservar.
        </p>
        {!usingSupabase() && (
          <p className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-800">
            Modo desarrollo: datos guardados en local (.data/bookings.json).
            Configura Supabase para producción.
          </p>
        )}
      </header>

      <Calendar counts={counts} today={today} />

      <footer className="mt-8 text-center text-xs text-gray-400">
        <a href="/admin" className="hover:underline">
          Acceso fisio
        </a>
      </footer>
    </main>
  );
}
