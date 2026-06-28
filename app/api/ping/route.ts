import { NextResponse } from "next/server";
import { store } from "@/lib/store";

// Endpoint de "mantener viva" la base de datos.
// Lo llama el cron de Vercel (ver vercel.json) una vez al día para que el
// proyecto gratuito de Supabase no se pause por inactividad.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Una lectura mínima basta para registrar actividad en Supabase.
    const rows = await store.listUpcoming();
    return NextResponse.json({
      ok: true,
      bookings: rows.length,
      at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
