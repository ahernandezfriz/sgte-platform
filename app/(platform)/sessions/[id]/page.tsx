import { obtenerSesionPorId } from "@/actions/obtener-sesion"
import { notFound } from "next/navigation"
import VistaSesionInteractiva from "@/components/vista-sesion-interactiva"

interface PropsPagina {
  params: Promise<{ id: string }>
}

export default async function PaginaDetalleSesion({ params }: PropsPagina) {
  // 1. Obtener ID
  const { id } = await params
  
  // 2. Obtener Datos
  const datos = await obtenerSesionPorId(id)

  if (!datos) {
    return notFound()
  }


  // Pre-calculamos el link de volver aquí para facilitar la vida al componente cliente
  const studentId = datos.sesion.treatmentPlan.student.id;
  const planId = datos.sesion.treatmentPlan.id;
  const backLink = `/students/${studentId}/plans/${planId}`;


  // 3. Renderizar el Componente Interactivo (Cliente) enviándole los datos iniciales
  return (
    <div className="max-w-4xl mx-auto p-6">
      <VistaSesionInteractiva 
        sesion={datos.sesion} 
        bancoTareas={datos.bancoTareas} 
        backLink={backLink} // <--- Pasamos el link
      />
    </div>
  )
}