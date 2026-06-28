# Citas de fisioterapia

Web para que los jugadores reserven cita de fisioterapia. Cuando un día se llena,
deja de admitir reservas y se marca como **LLENO**.

- Días: **martes, miércoles y viernes**.
- Horario: **19:30 a 21:00**, **4 plazas por día** (19:30, 19:50, 20:10, 20:30).
- Para reservar solo hace falta el **nombre**.
- Panel del fisio en `/admin` para ver y cancelar citas.

Todo es configurable en `lib/config.ts` (horas, días y semanas visibles).

## Cómo evita que se apunten de más

La tabla de reservas tiene una restricción **UNIQUE `(booking_date, slot_time)`**.
Si dos personas intentan coger el mismo hueco a la vez, la base de datos solo
acepta una; la otra recibe el aviso "ese hueco acaba de ocuparse". No hay forma de
sobrepasar las 4 plazas.

## Arranque en local (sin configurar nada)

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Sin Supabase configurado, las reservas se guardan en
`.data/bookings.json` (solo para pruebas locales).

Para entrar al panel admin define una contraseña antes de arrancar:

```bash
# .env.local
ADMIN_PASSWORD=la-que-quieras
```

## Producción (Supabase + Vercel)

1. Crea un proyecto gratis en https://supabase.com.
2. En el **SQL Editor**, ejecuta el contenido de `supabase/schema.sql`.
3. Copia `.env.local.example` a `.env.local` y rellena:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (en *Settings → API*; necesaria para cancelar citas)
   - `ADMIN_PASSWORD`
4. Despliega en https://vercel.com (importa el repo) y añade esas mismas variables
   de entorno en el proyecto de Vercel.

Si las variables de Supabase están presentes, la app las usa automáticamente; si no,
cae al almacén local de desarrollo.

## Estructura

- `lib/config.ts` — horas, días, semanas visibles.
- `lib/dates.ts` — generación de fechas válidas.
- `lib/store/` — capa de datos (Supabase y almacén local).
- `lib/auth.ts` — login del panel admin.
- `app/page.tsx` + `app/DayCard.tsx` — página pública de reservas.
- `app/admin/` — panel del fisio.
- `supabase/schema.sql` — tabla y restricciones para Supabase.

## Comandos

| Tarea | Comando |
|---|---|
| Desarrollo | `npm run dev` |
| Type-check | `npm run typecheck` |
| Build | `npm run build` |
| Producción local | `npm run start` |

## Mantener viva la base de datos (keep-alive)

El proyecto gratuito de Supabase se pausa tras ~1 semana sin actividad. Para
evitarlo, `vercel.json` define un **cron diario** que llama a `/api/ping`, que hace
una lectura mínima en Supabase. Se activa solo al desplegar en Vercel; no hay que
configurar nada. Si la web se usa con normalidad, ni siquiera hace falta.
