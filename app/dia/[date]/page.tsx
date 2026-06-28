import Link from "next/link";
import { SLOT_TIMES } from "@/lib/config";
import { isAllowedDate, prettyDate, toDateKey } from "@/lib/dates";
import { store } from "@/lib/store";
import DayCard, { type SlotView } from "../../DayCard";
import Logo from "../../Logo";

export const dynamic = "force-dynamic";

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const today = toDateKey(new Date());
  const valid = isAllowedDate(date) && date >= today;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex flex-col items-center text-center">
        <Logo size={72} className="mb-3" />
        <Link
          href="/"
          className="self-start text-sm text-green-800 hover:underline"
        >
          ‹ Volver al calendario
        </Link>
      </header>

      {!valid ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200">
          <p className="text-gray-700">
            Ese día no está disponible para reservar.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Ver calendario
          </Link>
        </div>
      ) : (
        <DayContent date={date} />
      )}
    </main>
  );
}

async function DayContent({ date }: { date: string }) {
  const bookings = await store.listByDates([date]);
  const byTime = new Map(bookings.map((b) => [b.slot_time, b.player_name]));

  const slots: SlotView[] = SLOT_TIMES.map((time) => ({
    time,
    takenBy: byTime.get(time),
  }));

  return <DayCard dateKey={date} label={prettyDate(date)} slots={slots} />;
}
