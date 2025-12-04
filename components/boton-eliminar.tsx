'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { Trash2 } from "lucide-react" // Ícono de basurero

interface Props {
  id: string
  accionEliminar: (id: string) => Promise<void>
  titulo?: string
  descripcion?: string
  textoBoton?: string
}

export function BotonEliminar({ 
  id, 
  accionEliminar, 
  titulo = "¿Estás absolutamente seguro?", 
  descripcion = "Esta acción no se puede deshacer. Se eliminará permanentemente de la base de datos.",
  textoBoton = "Eliminar"
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleConfirmar = () => {
    startTransition(async () => {
      await accionEliminar(id)
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending} className="gap-2">
           {/* Si no tienes lucide-react instalado, quita el ícono <Trash2 /> */}
           🗑️ {isPending ? "Eliminando..." : textoBoton}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>
            {descripcion}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmar} 
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isPending ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}