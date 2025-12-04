'use client'

import { useState } from "react"
import { Task } from "@prisma/client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Buscador } from "./buscador"
import { BotonEditarTarea } from "./boton-editar-tarea"
import { BotonEliminar } from "./boton-eliminar"
import { eliminarTareaBanco } from "@/actions/eliminar-datos"

interface Props {
  tareasIniciales: Task[]
}

export function ListaTareas({ tareasIniciales }: Props) {
  const [termino, setTermino] = useState("")

  const tareasFiltradas = tareasIniciales.filter(t => 
    t.title.toLowerCase().includes(termino.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(termino.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <Buscador valor={termino} onChange={setTermino} placeholder="Buscar actividad..." />
        <span className="text-sm text-slate-500">Total: {tareasFiltradas.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tareasFiltradas.map((tarea) => (
          <Card key={tarea.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">{tarea.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-slate-500 line-clamp-4">
                {tarea.description || "Sin descripción"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-slate-50/50 p-4">
               <BotonEditarTarea task={tarea} />
               <BotonEliminar 
                  id={tarea.id} 
                  accionEliminar={eliminarTareaBanco} 
                  textoBoton="Borrar" 
                  descripcion="Se eliminará del banco."
               />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}