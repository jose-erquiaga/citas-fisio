"use server";

import { revalidatePath } from "next/cache";
import { store } from "@/lib/store";
import {
  checkPassword,
  isAdmin,
  setAdminCookie,
  clearAdminCookie,
} from "@/lib/auth";

export interface LoginState {
  status: "idle" | "error";
  message?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD) {
    return {
      status: "error",
      message: "Falta configurar ADMIN_PASSWORD en el servidor.",
    };
  }
  if (!checkPassword(password)) {
    return { status: "error", message: "Contraseña incorrecta." };
  }
  await setAdminCookie();
  revalidatePath("/admin");
  return { status: "idle" };
}

export async function logoutAction(): Promise<void> {
  await clearAdminCookie();
  revalidatePath("/admin");
}

export async function cancelAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await store.remove(id);
  const date = String(formData.get("booking_date") ?? "");
  revalidatePath("/admin");
  revalidatePath("/");
  if (date) {
    revalidatePath(`/admin/dia/${date}`);
    revalidatePath(`/dia/${date}`);
  }
}
