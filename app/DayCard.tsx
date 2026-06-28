"use client";

import { useActionState } from "react";
import { reserveAction, type ReserveState } from "./actions";

export interface SlotView {
  time: string;
  takenBy?: string; // nombre de quien lo reservó; vacío = libre
}

const initial: ReserveState = { status: "idle" };

export default function DayCard({
  dateKey,
  label,
  slots,
}: {
  dateKey: string;
  label: string;
  slots: SlotView[];
}) {
  const [state, formAction, pending] = useActionState(reserveAction, initial);

  const freeCount = slots.filter((s) => !s.takenBy).length;
  const full = freeCount === 0;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{label}</h2>
        {full ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold uppercase tracking-wide text-red-700">
            Lleno
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {freeCount} libre{freeCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="booking_date" value={dateKey} />
        {!full && (
          <input
            type="text"
            name="player_name"
            placeholder="Tu nombre"
            maxLength={60}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        )}
        <div className="grid grid-cols-2 gap-2">
          {slots.map((s) =>
            s.takenBy ? (
              <div
                key={s.time}
                className="rounded-lg bg-gray-100 px-3 py-2 text-center"
              >
                <div className="text-sm font-semibold text-gray-700">
                  {s.time}
                </div>
                <div className="truncate text-xs text-gray-500" title={s.takenBy}>
                  {s.takenBy}
                </div>
              </div>
            ) : (
              <button
                key={s.time}
                type="submit"
                name="slot_time"
                value={s.time}
                disabled={pending}
                className="rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
              >
                Reservar {s.time}
              </button>
            )
          )}
        </div>
      </form>

      {state.status !== "idle" && state.message && (
        <p
          className={`mt-3 text-sm ${
            state.status === "ok" ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
