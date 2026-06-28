import Link from "next/link";
import { redirect } from "next/navigation";
import { SLOT_TIMES } from "@/lib/config";
import { isAllowedDate, prettyDate } from "@/lib/dates";
import { store } from "@/lib/store";
import { isAdmin } from "@/lib/auth";
import Logo from "../../../Logo";
import { cancelAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminDayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin");

  const { date } = await params;
  const valid = isAllowedDate(date);

  const bookings = valid ? await store.listByDates([date]) : [];
  const byTime = new Map(bookings.map((b) => [b.slot_time, b]));
  const reservedCount = bookings.length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex flex-col items-start">
        <Link href="/admin" className="text-sm text-green-800 hover:underline">
          ‹ Volver al calendario
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <Logo size={44} />
          <h1 className="text-2xl font-bold capitalize">
            {valid ? prettyDate(date) : "Día no válido"}
          </h1>
        </div>
      </header>

      {!valid ? (
        <p className="text-gray-600">Ese día no es de fisioterapia.</p>
      ) : (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <p className="mb-3 text-sm text-gray-500">
            {reservedCount}/{SLOT_TIMES.length} plazas ocupadas
          </p>
          <ul className="divide-y divide-gray-100">
            {SLOT_TIMES.map((time) => {
              const b = byTime.get(time);
              return (
                <li
                  key={time}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-sm">
                    <span className="font-mono text-gray-500">{time}</span>
                    {b ? (
                      <> — {b.player_name}</>
                    ) : (
                      <span className="ml-2 text-gray-400">Libre</span>
                    )}
                  </span>
                  {b && (
                    <form action={cancelAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="booking_date" value={date} />
                      <button className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                        Cancelar
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </main>
  );
}
