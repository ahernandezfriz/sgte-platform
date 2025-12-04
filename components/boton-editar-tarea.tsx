'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Task } from "@prisma/client"
import { editarTarea } from "@/actions/editar-tarea"
import { Pencil } from "lucide-react" // Ícono de lápiz

export function BotonEditarTarea({ task }: { task: Task }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
           ✏️ Editar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Actividad</DialogTitle>
        </DialogHeader>

        {/* Action apunta al archivo que creamos en el paso 1 */}
        <form action={async (formData) => {
            await editarTarea(formData)
            setOpen(false) // Cerramos el modal al guardar
        }} className="grid gap-4 py-4">
          
          {/* Campo oculto para enviar el ID */}
          <input type="hidden" name="id" value={task.id} />

          <div className="grid gap-2">
            <Label>Título</Label>
            <Input name="title" defaultValue={task.title} required />
          </div>

          <div className="grid gap-2">
            <Label>Descripción</Label>
            <Textarea name="description" defaultValue={task.description || ''} />
          </div>

          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}