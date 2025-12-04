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

  // 3. Renderizar el Componente Interactivo (Cliente) enviándole los datos iniciales
  return (
    <div className="max-w-4xl mx-auto p-6">
      <VistaSesionInteractiva 
        sesion={datos.sesion} 
        bancoTareas={datos.bancoTareas} 
      />
    </div>
  )
}