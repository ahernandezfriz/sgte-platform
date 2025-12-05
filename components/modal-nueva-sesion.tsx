"use client"

import { useState, useTransition } from "react"
import { crearSesionDesdeDashboard } from "@/actions/crear-sesion-dashboard"
import { Button } from "@/components/ui/button" // Asegúrate de tener este componente o usa uno HTML
import { Plus, Loader2 } from "lucide-react"

// Definimos qué tipo de datos esperamos recibir (la lista de alumnos)
interface Props {
  estudiantes: {
    id: string
    name: string
  }[]
}

export function ModalNuevaSesion({ estudiantes }: Props) {
  const [isOpen, setIsOpen] = useState(false) // Controla si el modal se ve o no
  const [isPending, startTransition] = useTransition() // Controla el estado de carga
  const [mensaje, setMensaje] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setMensaje("")
    
    // Usamos startTransition para que la UI no se congele
    startTransition(async () => {
      const resultado = await crearSesionDesdeDashboard(formData)
      
      if (resultado?.error) {
        setMensaje("❌ " + resultado.error)
      } else {
        setMensaje("✅ Sesión agendada correctamente")
        // Opcional: Cerrar el modal después de 1 segundo
        setTimeout(() => {
          setIsOpen(false)
          setMensaje("")
        }, 1500)
      }
    })
  }

  return (
    <>
      {/* BOTÓN ACTIVADOR (El que se ve en el Dashboard) */}
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="w-4 h-4 mr-2" />
        Agendar Sesión
      </Button>

      {/* EL MODAL (Overlay oscuro + Caja blanca) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Encabezado del Modal */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Nueva Sesión</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form action={handleSubmit} className="p-6 space-y-4">
              
              {/* Selección de Estudiante */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Estudiante</label>
                <select 
                  name="studentId" 
                  required
                  className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecciona un paciente...</option>
                  {estudiantes.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de Fecha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Fecha Programada</label>
                <input 
                  type="date" 
                  name="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]} // Fecha de hoy por defecto
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Mensajes de Estado */}
              {mensaje && (
                <p className={`text-sm p-2 rounded ${mensaje.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {mensaje}
                </p>
              )}

              {/* Pie del Modal (Botones) */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    "Confirmar Agendamiento"
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}