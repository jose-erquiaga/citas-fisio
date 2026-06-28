"use client";

import { useState } from "react";

// Muestra el escudo del club desde /public/logo.png.
// Si el archivo no existe, no muestra nada (la web no se rompe).
export default function Logo({
  size = 72,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Escudo del club"
      width={size}
      height={size}
      onError={() => setOk(false)}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ maxHeight: size }}
    />
  );
}
