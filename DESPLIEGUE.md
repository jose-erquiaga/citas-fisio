# Guía para poner la web en marcha (paso a paso, sin saber de informática)

Lee esto con calma. Son muchos pasos pero todos son sencillos: básicamente crear
dos cuentas (con tu Gmail), copiar y pegar unos textos, y pulsar botones.

Tiempo total: unos 20-30 minutos. **Es gratis.**

Cuando termines, tendrás:
- Un **enlace para los jugadores** (donde se apuntan).
- Un **enlace para ti** con contraseña (donde ves y cancelas las citas).

Necesitas:
- Un ordenador (mejor que el móvil para esto).
- Tu cuenta de **Gmail**.
- La carpeta del proyecto (el código) que te han pasado.

> Consejo: ten abierto un bloc de notas para ir pegando los datos que copies.
> Los marcaré como **📋 GUARDA ESTO**.

---

# PARTE 1 — La base de datos (Supabase)

Aquí es donde se guardan las citas. Solo hay que crearla una vez.

### Paso 1.1 — Crear la cuenta
1. Abre el navegador y entra en **https://supabase.com**
2. Arriba a la derecha pulsa **Start your project** (o **Sign in**).
3. Pulsa **Continue with GitHub** o, si te aparece, usa tu correo. Si no tienes
   GitHub, pulsa **Sign up** y regístrate con tu **email de Gmail** y una
   contraseña. Confirma el correo si te lo pide (mira tu bandeja de entrada).

### Paso 1.2 — Crear el proyecto
1. Una vez dentro, pulsa el botón verde **New project**.
2. Si te pide crear una "Organization", ponle cualquier nombre (ej. tu nombre) y
   continúa.
3. Rellena:
   - **Name**: escribe `citas-fisio`
   - **Database Password**: pulsa **Generate a password** y luego
     **📋 GUARDA ESTO** (cópiala en tu bloc de notas por si acaso).
   - **Region**: elige la más cercana, por ejemplo *West EU (Ireland)* o
     *Central EU (Frankfurt)*.
4. Pulsa **Create new project**.
5. Espera 1-2 minutos a que aparezca el panel (verás un mensaje de "setting up").

### Paso 1.3 — Crear la tabla de citas
1. En el menú de la izquierda, busca y pulsa **SQL Editor** (icono de base de
   datos / "SQL").
2. Pulsa **New query** (o verás un recuadro de texto vacío).
3. Copia **TODO** el texto del recuadro de abajo y pégalo en ese recuadro:

```sql
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_date date not null,
  slot_time text not null,
  player_name text not null,
  created_at timestamptz not null default now(),
  constraint bookings_slot_unique unique (booking_date, slot_time)
);

create index if not exists bookings_date_idx on public.bookings (booking_date);

alter table public.bookings enable row level security;

drop policy if exists "bookings_select_public" on public.bookings;
create policy "bookings_select_public"
  on public.bookings for select to anon using (true);

drop policy if exists "bookings_insert_public" on public.bookings;
create policy "bookings_insert_public"
  on public.bookings for insert to anon with check (true);
```

4. Pulsa el botón **Run** (abajo a la derecha, o pulsa Ctrl+Enter).
5. Debe aparecer abajo un mensaje verde tipo **"Success. No rows returned"**.
   ✅ Eso significa que ha ido bien.

### Paso 1.4 — Copiar las 3 claves
1. En el menú de la izquierda, abajo del todo, pulsa **Project Settings**
   (la rueda dentada ⚙️).
2. Dentro, pulsa **API**.
3. Vas a copiar tres cosas a tu bloc de notas:
   - **Project URL** → **📋 GUARDA ESTO** como `URL`.
   - En **Project API keys**, la clave llamada **`anon` `public`** → pulsa el
     icono de copiar → **📋 GUARDA ESTO** como `ANON`.
   - En **Project API keys**, la clave llamada **`service_role` `secret`** →
     pulsa **Reveal** y luego copiar → **📋 GUARDA ESTO** como `SERVICE`.

> ⚠️ La clave `service_role` (`SERVICE`) es secreta. No la enseñes a nadie ni la
> publiques. Solo se usa en el paso de Vercel.

Ya está la base de datos. ✅

---

# PARTE 2 — Subir el código a GitHub

Vercel (lo de la Parte 3) necesita coger el código de un sitio. Ese sitio es
GitHub. Es como una carpeta en internet.

### Paso 2.1 — Crear cuenta en GitHub
1. Entra en **https://github.com**
2. Pulsa **Sign up** y regístrate con tu **email de Gmail**. Confirma el correo.

### Paso 2.2 — Crear el repositorio (la carpeta online)
1. Ya dentro, arriba a la derecha pulsa el **+** → **New repository**.
2. **Repository name**: escribe `citas-fisio`
3. Marca la opción **Private** (privado).
4. **NO** marques nada más (ni README, ni .gitignore).
5. Pulsa **Create repository**.

### Paso 2.3 — Subir los archivos del proyecto
1. En la página que aparece, busca el enlace que dice
   **"uploading an existing file"** y púlsalo.
2. Abre en tu ordenador la carpeta del proyecto que te pasaron.
3. **Importante:** selecciona TODOS los archivos y carpetas que hay dentro
   **MENOS** estas (si existen), que no hacen falta y pesan mucho:
   - la carpeta `node_modules`
   - la carpeta `.next`
   - la carpeta `.data`
4. Arrastra el resto a la ventana de GitHub (o usa "choose your files").
   - Debe subir, entre otros: las carpetas `app`, `lib`, `supabase`, y archivos
     como `package.json`, `next.config.ts`, etc.
5. Abajo pulsa el botón verde **Commit changes**.
6. Espera a que termine. Cuando recargues, deberías ver las carpetas `app`, `lib`,
   `supabase`, `public`... listadas. ✅

### Paso 2.4 — Poner el escudo del club (opcional pero recomendado)
Para que aparezca el escudo en la web:
1. Prepara la imagen del escudo y renómbrala exactamente a **`logo.png`**.
2. En GitHub, entra en la carpeta **`public`** de tu repositorio.
3. Pulsa **Add file → Upload files**, sube tu `logo.png` y pulsa
   **Commit changes**.

Si no pones logo, la web funciona igual, solo que sin escudo.

> Si te resulta complicado y conoces a alguien con soltura, este paso lo puede
> hacer en 1 minuto con "git". Pero con el método de arrastrar también funciona.

---

# PARTE 3 — Publicar la web (Vercel)

Aquí la web se convierte en una dirección de internet de verdad.

### Paso 3.1 — Crear cuenta
1. Entra en **https://vercel.com**
2. Pulsa **Sign Up** y elige **Continue with GitHub** (usa la cuenta de GitHub
   que acabas de crear). Acepta los permisos que pida.
3. Si te pregunta por un plan, elige el **Hobby** (gratuito).

### Paso 3.2 — Importar el proyecto
1. Pulsa **Add New…** → **Project**.
2. Te mostrará tus repositorios de GitHub. Busca **`citas-fisio`** y pulsa
   **Import**.
   - Si no lo ves, pulsa "Adjust GitHub App Permissions" y da acceso al repo.

### Paso 3.3 — Meter las claves (¡el paso clave!)
Antes de publicar, hay que pegar las claves que guardaste.

1. En la pantalla de configuración, busca y despliega **Environment Variables**
   (Variables de entorno).
2. Vas a añadir **CUATRO** variables. Para cada una: escribes el **Name** (nombre)
   a la izquierda, pegas el **Value** (valor) a la derecha y pulsas **Add**.

   | Name (escríbelo exacto) | Value (qué pegar) |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | tu `URL` guardada |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu `ANON` guardada |
   | `SUPABASE_SERVICE_ROLE_KEY` | tu `SERVICE` guardada |
   | `ADMIN_PASSWORD` | invéntate una contraseña, ej. `Fisio2026!` → **📋 GUARDA ESTO** |

   ⚠️ Los nombres deben escribirse **exactamente** como en la tabla (mayúsculas y
   guiones bajos incluidos). El truco: cópialos de aquí.

### Paso 3.4 — Publicar
1. Pulsa el botón **Deploy**.
2. Espera 1-2 minutos. Verás una animación y luego **"Congratulations"** 🎉.
3. Pulsa **Continue to Dashboard** o en la captura de la web.
4. Arriba verás la dirección de tu web, algo como
   **`https://citas-fisio-xxxx.vercel.app`** → **📋 GUARDA ESTO**.

---

# PARTE 4 — Comprobar que funciona

1. Abre tu dirección `https://citas-fisio-xxxx.vercel.app`.
   - Deben salir los martes, miércoles y viernes con 4 huecos cada uno.
2. Haz una reserva de prueba: escribe un nombre y pulsa una hora. El hueco debe
   quedar tachado.
3. Entra en la misma dirección añadiendo **`/admin`** al final:
   `https://citas-fisio-xxxx.vercel.app/admin`
   - Escribe la contraseña (`ADMIN_PASSWORD`) y entra.
   - Debes ver la reserva de prueba. Pulsa **Cancelar** para borrarla.

Si esto funciona, ¡ya está todo listo! ✅

---

# PARTE 5 — Usar la web (esto es lo único del día a día)

- **A los jugadores** les pasas el enlace normal:
  `https://citas-fisio-xxxx.vercel.app`
  Ahí se apuntan ellos solos (martes, miércoles y viernes; 4 plazas; cuando se
  llena, pone **LLENO** y no deja apuntarse más).

- **Para ti**, tu panel es:
  `https://citas-fisio-xxxx.vercel.app/admin`
  Entras con tu contraseña y ves quién viene cada día. Puedes **Cancelar** una
  cita si alguien avisa de que no puede venir (eso libera el hueco para otro).

---

# Problemas frecuentes

- **"La web da error al reservar".** Casi seguro es que una clave está mal escrita
  o falta. Ve a Vercel → tu proyecto → **Settings** → **Environment Variables** y
  revisa las cuatro. Si corriges algo, hay que volver a publicar: pestaña
  **Deployments** → en el primero, menú **···** → **Redeploy**.

- **"No me acuerdo de la contraseña del panel".** Cámbiala en Vercel → Settings →
  Environment Variables → `ADMIN_PASSWORD`, y haz **Redeploy** (como arriba).

- **"Quiero cambiar las horas o los días".** Eso se toca en el código
  (`lib/config.ts`). Pídeselo a quien te montó la web; es un cambio de 1 minuto.

- **¿Cuesta dinero?** No. Para este uso entra de sobra en los planes gratuitos de
  Supabase y Vercel.

- **¿Es seguro?** Las citas solo guardan el nombre y la hora. La clave secreta y
  la contraseña del panel no se ven en la web pública.
