import { SidebarNavegacion } from "@/components/sidebar-navegacion";
import { UserButton } from "@clerk/nextjs";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-slate-50 min-h-screen">
      
      {/* 1. SIDEBAR FIJO (Izquierda) */}
      {/* 'hidden md:flex': Se oculta en móviles y se muestra en PC */}
      {/* 'w-72': Ancho de la barra */}
      {/* 'fixed': Se queda quieto al hacer scroll */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900 text-white">
        <SidebarNavegacion />
      </div>

      {/* 2. ZONA DE CONTENIDO (Derecha) */}
      {/* 'md:pl-72': Deja un margen a la izquierda del mismo ancho que el sidebar para no taparse */}
      <main className="md:pl-72 h-full">
        
        {/* A. Barra Superior (Header) */}
        {/* Aquí va el botón de usuario de Clerk alineado a la derecha */}
        <div className="flex items-center justify-end p-4 h-16 border-b bg-white shadow-sm">
          <UserButton showName />
        </div>

        {/* B. Las páginas hijas (Dashboard, Students, etc.) */}
        {/* Aquí se inyecta el page.tsx correspondiente */}
        <div className="h-full">
           {children}
        </div>
        
      </main>
    </div>
  );
}