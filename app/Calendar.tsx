"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ALLOWED_WEEKDAYS, SLOTS_PER_DAY } from "@/lib/config";
import { toDateKey, parseDateKey } from "@/lib/dates";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
// Cabecera lunes→domingo
const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

function isFisioDay(d: Date): boolean {
  return (ALLOWED_WEEKDAYS as readonly number[]).includes(d.getDay());
}

export default function Calendar({
  counts,
  today,
  hrefBase = "/dia",
}: {
  counts: Record<string, number>;
  today: string; // YYYY-MM-DD
  hrefBase?: string; // ruta destino al pulsar un día (público: /dia, admin: /admin/dia)
}) {
  const router = useRouter();
  const now = parseDateKey(today);
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const go = (key: string) => {
    setPendingKey(key);
    startTransition(() => router.push(`${hrefBase}/${key}`));
  };

  const first = new Date(view.y, view.m, 1);
  const leading = (first.getDay() + 6) % 7; // huecos antes del día 1 (lunes primero)
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () =>
    setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  const nextMonth = () =>
    setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));

  // No dejar retroceder a meses ya pasados.
  const atCurrentMonth =
    view.y === now.getFullYear() && view.m === now.getMonth();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={atCurrentMonth}
          aria-label="Mes anterior"
          className="rounded-lg px-3 py-1 text-lg text-green-800 hover:bg-green-50 disabled:opacity-30"
        >
          ‹
        </button>
        <h2 className="text-lg font-bold text-gray-800">
          {MONTH_NAMES[view.m]} {view.y}
        </h2>
        <button
          onClick={nextMonth}
          aria-label="Mes siguiente"
          className="rounded-lg px-3 py-1 text-lg text-green-800 hover:bg-green-50"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="py-1 text-xs font-semibold text-gray-400">
            {w}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`b${i}`} />;

          const d = new Date(view.y, view.m, day);
          const key = toDateKey(d);
          const fisio = isFisioDay(d);
          const past = key < today;
          const count = counts[key] ?? 0;
          const free = Math.max(0, SLOTS_PER_DAY - count);
          const full = free === 0;
          const selectable = fisio && !past;

          if (!selectable) {
            return (
              <div
                key={key}
                className="flex aspect-square items-center justify-center rounded-lg text-sm text-gray-300"
              >
                {day}
              </div>
            );
          }

          const loading = isPending && pendingKey === key;

          let color: string;
          if (loading) {
            color = "bg-green-600 text-white ring-2 ring-green-700";
          } else if (full) {
            color = "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200";
          } else {
            color = "bg-green-50 text-green-900 hover:bg-green-100 active:bg-green-200";
          }

          return (
            <button
              key={key}
              onClick={() => go(key)}
              disabled={isPending}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm font-medium transition active:scale-95 ${color}`}
              title={
                full ? "Completo" : `${free} plaza${free === 1 ? "" : "s"} libre${free === 1 ? "" : "s"}`
              }
            >
              <span className="text-sm font-semibold">{day}</span>
              <span
                className={`mt-0.5 text-[10px] font-medium leading-none ${
                  loading
                    ? "text-white"
                    : full
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                {loading ? "Abriendo…" : full ? "Lleno" : `${free} libre${free === 1 ? "" : "s"}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-green-50 ring-1 ring-green-200" />
          Día con fisio
        </span>
        <span className="flex items-center gap-1">
          <span className="font-medium text-green-700">2 libres</span>
          Plazas disponibles
        </span>
        <span className="flex items-center gap-1">
          <span className="font-medium text-red-600">Lleno</span>
          Completo
        </span>
      </div>
    </div>
  );
}
