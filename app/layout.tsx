import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Citas de fisioterapia",
  description: "Reserva tu cita de fisioterapia",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
