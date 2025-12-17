'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { crearSesion } from "@/actions/crear-sesion"
import { Student } from "@prisma/client"

export function ModalAgendar({ estudiantes }: { estudiantes: Student[] }) {
  const [open, setOpen] = useState(false)

  // LÓGICA INTELIGENTE:
  // Si la lista tiene solo 1 estudiante, asumimos que estamos en su perfil.
  const estudiantePreseleccionado = estudiantes.length === 1 ? estudiantes[0] : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          + Agendar Nueva Sesión
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Terapia</DialogTitle>
          <DialogDescription>
            {estudiantePreseleccionado 
              ? `Creando cita para ${estudiantePreseleccionado.name}`
              : "Selecciona un alumno para crear una nueva cita."}
          </DialogDescription>
        </DialogHeader>

        <form action={crearSesion} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label>Estudiante</Label>
            
            {estudiantePreseleccionado ? (
              // CASO 1: MODO FIJO (Perfil)
              // Mostramos el nombre en un input deshabilitado (visual) y mandamos el ID oculto
              <>
                <Input value={estudiantePreseleccionado.name} disabled className="bg-slate-100 font-bold text-slate-600" />
                <input type="hidden" name="studentId" value={estudiantePreseleccionado.id} />
              </>
            ) : (
              // CASO 2: MODO SELECCIÓN (Dashboard)
              <Select name="studentId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar alumno..." />
                </SelectTrigger>
                <SelectContent>
                  {estudiantes.map((est) => (
                    <SelectItem key={est.id} value={est.id}>
                      {est.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Fecha</Label>
            <Input type="date" name="date" required />
          </div>

          <div className="grid gap-2">
            <Label>Objetivo (Opcional)</Label>
            <Input name="objective" placeholder="Ej: Reforzar fonema /R/" />
          </div>

          <Button type="submit" className="mt-4 w-full">
            Confirmar Cita
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}