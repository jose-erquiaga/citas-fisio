"use client";

import { useActionState } from "react";
import Logo from "../Logo";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = { status: "idle" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form
      action={formAction}
      className="mx-auto mt-16 max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
    >
      <div className="flex flex-col items-center text-center">
        <Logo size={72} className="mb-2" />
        <h1 className="text-xl font-bold">Acceso fisio</h1>
      </div>
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        required
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
      >
        Entrar
      </button>
      {state.status === "error" && state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
