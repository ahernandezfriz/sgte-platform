"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Library, BookOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils" // Asegúrate de tener esta utilidad (ver nota abajo)

// Definimos las rutas del menú
const rutas = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Estudiantes",
    icon: Users,
    href: "/students",
    color: "text-violet-500",
  },
  {
    label: "Banco de Tareas",
    icon: Library,
    href: "/tasks",
    color: "text-pink-700",
  },
  // {
  //   label: "Planes (Futuro)",
  //   icon: BookOpen,
  //   href: "/plans",
  //   color: "text-orange-700",
  // },
]

export function SidebarNavegacion() {
  const pathname = usePathname() // Detecta en qué URL estás

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        
        {/* LOGO O TÍTULO */}
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             {/* Puedes poner una imagen aquí con <Image /> */}
             <div className="bg-white rounded-full w-full h-full flex items-center justify-center text-slate-900 font-bold">
               SG
             </div>
          </div>
          <h1 className="text-xl font-bold">
            SGTE Clínico
          </h1>
        </Link>
        
        {/* LISTA DE ENLACES */}
        <div className="space-y-1">
          {rutas.map((ruta) => (
            <Link
              key={ruta.href}
              href={ruta.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                // Lógica de "Activo": Si la URL coincide, pon fondo blanco translúcido
                pathname === ruta.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <ruta.icon className={cn("h-5 w-5 mr-3", ruta.color)} />
                {ruta.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* PIE DEL SIDEBAR (Opcional) */}
      <div className="px-3 py-2">
         <div className="bg-slate-800 rounded-lg p-3 text-xs text-center text-zinc-400">
            Versión Prototipo 2.0
         </div>
      </div>
    </div>
  )
}