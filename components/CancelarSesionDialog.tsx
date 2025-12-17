'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Ban } from "lucide-react"
import { cancelarSesion } from "@/actions/cancelar-sesion"
import { useState } from "react"

interface Props {
  sessionId: string
  studentId: string
  planId: string
}

export function CancelarSesionDialog({ sessionId, studentId, planId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
          <Ban className="w-4 h-4 mr-2" />
          No realizada / Suspender
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspender Sesión</DialogTitle>
          <DialogDescription>
            Indica el motivo por el cual no se realizará esta sesión. La sesión quedará marcada como cancelada.
          </DialogDescription>
        </DialogHeader>

        <form action={cancelarSesion} className="space-y-6 mt-2">
          <input type="hidden" name="sessionId" value={sessionId} />
          <input type="hidden" name="studentId" value={studentId} />
          <input type="hidden" name="planId" value={planId} />

          <RadioGroup name="reason" required defaultValue="Estudiante Ausente">
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
              <RadioGroupItem value="Estudiante Ausente" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer w-full">Estudiante Ausente</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
              <RadioGroupItem value="Actividad Escolar/Suspensión de clases" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer w-full">Actividad Escolar / Suspensión</Label>
            </div>
          </RadioGroup>

          <DialogFooter>
             <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
             <Button type="submit" variant="destructive">Confirmar Suspensión</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}