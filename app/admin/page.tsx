import { store } from "@/lib/store";
import { isAdmin } from "@/lib/auth";
import { prettyDate } from "@/lib/dates";
import type { Booking } from "@/lib/store";
import LoginForm from "./LoginForm";
import Logo from "../Logo";
import { cancelAction, logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <main className="px-4">
        <LoginForm />
      </main>
    );
  }

  const bookings = await store.listUpcoming();

  // Agrupar por día.
  const byDay = new Map<string, Booking[]>();
  for (const b of bookings) {
    const list = byDay.get(b.booking_date) ?? [];
    list.push(b);
    byDay.set(b.booking_date, list);
  }
  for (const list of byDay.values()) {
    list.sort((a, b) => a.slot_time.localeCompare(b.slot_time));
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <h1 className="text-2xl font-bold">Citas reservadas</h1>
        </div>
        <form action={logoutAction}>
          <button className="text-sm text-gray-500 hover:underline">
            Salir
          </button>
        </form>
      </header>

      {byDay.size === 0 ? (
        <p className="text-gray-600">No hay citas próximas.</p>
      ) : (
        <div className="grid gap-4">
          {[...byDay.entries()].map(([dateKey, list]) => (
            <div
              key={dateKey}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
            >
              <h2 className="mb-3 text-lg font-semibold capitalize">
                {prettyDate(dateKey)}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({list.length}/4)
                </span>
              </h2>
              <ul className="divide-y divide-gray-100">
                {list.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm">
                      <span className="font-mono text-gray-500">
                        {b.slot_time}
                      </span>{" "}
                      — {b.player_name}
                    </span>
                    <form action={cancelAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                        Cancelar
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
