"use server";

import { revalidatePath } from "next/cache";
import { store } from "@/lib/store";
import { isValidSlotTime } from "@/lib/config";
import { isAllowedDate } from "@/lib/dates";

export interface ReserveState {
  status: "idle" | "ok" | "error";
  message?: string;
}

export async function reserveAction(
  _prev: ReserveState,
  formData: FormData
): Promise<ReserveState> {
  const name = String(formData.get("player_name") ?? "").trim();
  const dateKey = String(formData.get("booking_date") ?? "");
  const slotTime = String(formData.get("slot_time") ?? "");

  if (!name) {
    return { status: "error", message: "Escribe tu nombre." };
  }
  if (name.length > 60) {
    return { status: "error", message: "El nombre es demasiado largo." };
  }
  if (!isAllowedDate(dateKey)) {
    return { status: "error", message: "Día no válido." };
  }
  if (!isValidSlotTime(slotTime)) {
    return { status: "error", message: "Hora no válida." };
  }

  const result = await store.create(dateKey, slotTime, name);
  revalidatePath("/");
  revalidatePath("/admin");

  if (!result.ok) {
    return { status: "error", message: result.message };
  }
  return {
    status: "ok",
    message: `Reservado: ${slotTime}. ¡Nos vemos, ${name}!`,
  };
}
