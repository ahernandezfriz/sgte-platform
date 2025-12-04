import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
// Si tienes globals.css, impórtalo. Si da error, comenta la línea.
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Sistema SGTE",
  description: "Gestión de Terapias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es">
      <body className="bg-slate-50 min-h-screen">
        {/* Un borde rojo temporal para saber que este layout está cargando */}
        <main className="border-t-4 border-red-500">
          {children}
        </main>
      </body>
    </html>
    </ClerkProvider>
    
  );
}