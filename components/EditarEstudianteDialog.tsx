'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { editarEstudiante } from "@/actions/editar-estudiante"

// Definimos qué datos necesita este componente
interface Props {
  student: {
    id: string
    name: string
    rut: string | null
    course: string | null
    diagnosis: string | null
    guardianName: string | null
    guardianPhone: string | null
  }
}

export function EditarEstudianteDialog({ student }: Props) {
  const [open, setOpen] = useState(false)

  // Función envoltorio para cerrar el modal tras guardar
  async function handleSubmit(formData: FormData) {
    await editarEstudiante(formData)
    setOpen(false) // Cerramos el modal
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Estudiante</DialogTitle>
          <DialogDescription>
            Modifica los datos del estudiante aquí. Guarda los cambios al terminar.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="id" value={student.id} />
          
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input id="name" name="name" defaultValue={student.name} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" name="rut" defaultValue={student.rut || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Curso</Label>
              <Input id="course" name="course" defaultValue={student.course || ''} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Input id="diagnosis" name="diagnosis" defaultValue={student.diagnosis || ''} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="guardianName">Nombre Apoderado</Label>
            <Input id="guardianName" name="guardianName" defaultValue={student.guardianName || ''} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="guardianPhone">Teléfono Apoderado</Label>
            <Input id="guardianPhone" name="guardianPhone" defaultValue={student.guardianPhone || ''} />
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}