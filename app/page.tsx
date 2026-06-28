import { SLOT_TIMES } from "@/lib/config";
import { upcomingDates, prettyDate } from "@/lib/dates";
import { store, usingSupabase } from "@/lib/store";
import DayCard, { type SlotView } from "./DayCard";
import Logo from "./Logo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dates = upcomingDates();
  const bookings = await store.listByDates(dates);

  // Mapa "fecha|hora" -> ocupado
  const takenSet = new Set(bookings.map((b) => `${b.booking_date}|${b.slot_time}`));

  const days = dates.map((dateKey) => {
    const slots: SlotView[] = SLOT_TIMES.map((time) => ({
      time,
      taken: takenSet.has(`${dateKey}|${time}`),
    }));
    return { dateKey, label: prettyDate(dateKey), slots };
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex flex-col items-center text-center">
        <Logo size={88} className="mb-3" />
        <h1 className="text-2xl font-bold">Citas de fisioterapia</h1>
        <p className="mt-1 text-sm text-gray-600">
          Martes, miércoles y viernes · de 19:30 a 21:00 · 4 plazas por día.
        </p>
        {!usingSupabase() && (
          <p className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-800">
            Modo desarrollo: datos guardados en local (.data/bookings.json).
            Configura Supabase para producción.
          </p>
        )}
      </header>

      {days.length === 0 ? (
        <p className="text-gray-600">No hay días disponibles ahora mismo.</p>
      ) : (
        <div className="grid gap-4">
          {days.map((d) => (
            <DayCard
              key={d.dateKey}
              dateKey={d.dateKey}
              label={d.label}
              slots={d.slots}
            />
          ))}
        </div>
      )}

      <footer className="mt-8 text-center text-xs text-gray-400">
        <a href="/admin" className="hover:underline">
          Acceso fisio
        </a>
      </footer>
    </main>
  );
}
