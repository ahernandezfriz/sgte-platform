import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { crearTareaEnBanco } from "@/actions/crear-tarea"
import Link from "next/link"
import { ListaTareas } from "@/components/lista-tareas" // <--- Componente nuevo

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PaginaBancoTareas() {

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const tareas = await db.task.findMany({ 
    where: { userId: userId }, // <--- SOLO MIS TAREAS
    orderBy: { createdAt: 'desc' }
   })

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Banco de Actividades</h1>
            <p className="text-slate-500">Biblioteca de recursos.</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button>+ Nueva Actividad</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Crear Actividad</SheetTitle>
                  <SheetDescription>Agrega un nuevo ejercicio.</SheetDescription>
                </SheetHeader>
                <form action={crearTareaEnBanco} className="space-y-4 mt-8">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea name="description" />
                  </div>
                  <Button type="submit" className="w-full">Guardar</Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Renderizamos la lista inteligente */}
        <ListaTareas tareasIniciales={tareas} />

      </div>
    </div>
  )
}