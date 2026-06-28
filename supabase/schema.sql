-- Ejecuta esto en el SQL Editor de Supabase (una sola vez).

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_date date not null,
  slot_time text not null,
  player_name text not null,
  created_at timestamptz not null default now(),
  -- Núcleo anti-overbooking: un único jugador por hueco y día.
  constraint bookings_slot_unique unique (booking_date, slot_time)
);

create index if not exists bookings_date_idx on public.bookings (booking_date);

-- RLS: activamos seguridad a nivel de fila.
alter table public.bookings enable row level security;

-- Lectura pública (la página muestra qué huecos están ocupados).
drop policy if exists "bookings_select_public" on public.bookings;
create policy "bookings_select_public"
  on public.bookings for select
  to anon
  using (true);

-- Inserción pública (los jugadores reservan con la anon key).
drop policy if exists "bookings_insert_public" on public.bookings;
create policy "bookings_insert_public"
  on public.bookings for insert
  to anon
  with check (true);

-- El borrado (cancelar cita) lo hace el panel admin con la SERVICE ROLE key,
-- que salta RLS. No damos política de delete a anon a propósito.
