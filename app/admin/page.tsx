import { store } from "@/lib/store";
import { isAdmin } from "@/lib/auth";
import { toDateKey } from "@/lib/dates";
import LoginForm from "./LoginForm";
import Logo from "../Logo";
import Calendar from "../Calendar";
import { logoutAction } from "./actions";

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

  // Nº de reservas por día (para marcar el calendario).
  const counts: Record<string, number> = {};
  for (const b of bookings) {
    counts[b.booking_date] = (counts[b.booking_date] ?? 0) + 1;
  }

  const today = toDateKey(new Date());

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <h1 className="text-2xl font-bold">Gestión de citas</h1>
        </div>
        <form action={logoutAction}>
          <button className="text-sm text-gray-500 hover:underline">
            Salir
          </button>
        </form>
      </header>

      <p className="mb-4 text-sm text-gray-600">
        Pulsa un día para ver las citas y cancelarlas.
      </p>

      <Calendar counts={counts} today={today} hrefBase="/admin/dia" />
    </main>
  );
}
