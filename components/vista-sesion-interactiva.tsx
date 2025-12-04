'use client'

import { useState, useTransition } from "react"
// Importamos tipos y enums
// Borramos SessionStatus y TaskGrade de la lista
import { Session, SessionLog, Task, Student, TreatmentPlan } from "@prisma/client"
// Importamos actions
import { actualizarEstadoSesion, calificarActividad, guardarObservacionGeneral, agregarTareaASesion } from "@/actions/gestionar-sesion"
// Importamos UI
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { BotonEliminar } from "@/components/boton-eliminar"
import { eliminarSesion } from "@/actions/eliminar-datos" // <--- Importante

// Importamos el PDF dinámicamente
import dynamic from "next/dynamic"

const BotonDescargaPDF = dynamic(() => import('@/components/pdf/boton-descarga'), {
  ssr: false,
  loading: () => <Button variant="outline" disabled>Cargando PDF...</Button>
})

type SesionCompleta = Session & {
  sessionLogs: SessionLog[];
  treatmentPlan: TreatmentPlan & {
    student: Student;
  };
}

interface Props {
  sesion: SesionCompleta;
  bancoTareas: Task[];
}

export default function VistaSesionInteractiva({ sesion, bancoTareas }: Props) {
  const [isPending, startTransition] = useTransition()
  const [tareaSeleccionada, setTareaSeleccionada] = useState<string>("")
  
  const estudiante = sesion.treatmentPlan.student

  // Handlers
  const handleCambioEstado = (nuevoEstado: string) => {
    startTransition(() => actualizarEstadoSesion(sesion.id, nuevoEstado))
  }

  const handleFinalizarSesion = () => {
    // Marcamos como COMPLETADA
    startTransition(() => actualizarEstadoSesion(sesion.id, "COMPLETED"))
  }

  const handleReabrirSesion = () => {
    // Permitimos volver a editar si hubo un error
    startTransition(() => actualizarEstadoSesion(sesion.id, "SCHEDULED"))
  }

  const handleCalificar = (idLog: string, nuevaNota: string) => {
    startTransition(() => calificarActividad(idLog, nuevaNota))
  }

  const handleAgregarTarea = () => {
    if (!tareaSeleccionada) return;
    startTransition(async () => {
      await agregarTareaASesion(sesion.id, tareaSeleccionada)
      setTareaSeleccionada("")
    })
  }

  const getColorEstado = (estado: string) => {
    if (estado === 'COMPLETED') return 'bg-green-100 text-green-800 border-green-200';
    if (estado === 'SCHEDULED') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (estado === 'ABSENT') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-slate-100';
  }

  return (
    <div className="space-y-6 pb-20"> {/* pb-20 para dar espacio al scroll final */}
      
      {/* 1. PANEL SUPERIOR SIMPLIFICADO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{estudiante.name}</h2>
          <p className="text-sm text-slate-500">Objetivo: {sesion.objective}</p>
        </div>
        
        {/* Solo mostramos el estado visualmente */}
        <Badge variant="outline" className={`text-sm px-3 py-1 ${getColorEstado(sesion.status)}`}>
            {sesion.status === 'SCHEDULED' ? '📅 En Progreso' : 
             sesion.status === 'COMPLETED' ? '✅ Finalizada' : sesion.status}
        </Badge>
      </div>

      {/* 2. ZONA DE TRABAJO (Editable solo si NO está finalizada o si queremos permitir edición siempre) */}
      <div className="grid gap-6">
          
        {/* TARJETA DE ACTIVIDADES */}
        <Card className={sesion.status === 'COMPLETED' ? 'opacity-90' : ''}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Evaluación de Actividades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Selector de Tareas (Solo si no está finalizada) */}
              {sesion.status !== 'COMPLETED' && (
                <div className="flex gap-2 p-4 bg-blue-50 rounded-lg border border-blue-100 items-end">
                    <div className="flex-1 space-y-2">
                    <Label className="text-xs font-bold text-blue-700 uppercase">Agregar desde Banco de Tareas</Label>
                    <Select value={tareaSeleccionada} onValueChange={setTareaSeleccionada} disabled={isPending}>
                        <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Buscar actividad..." />
                        </SelectTrigger>
                        <SelectContent>
                        {bancoTareas.map((tarea) => (
                            <SelectItem key={tarea.id} value={tarea.id}>
                            {tarea.title}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <Button onClick={handleAgregarTarea} disabled={!tareaSeleccionada || isPending}>
                    {isPending ? "..." : "Agregar +"}
                    </Button>
                </div>
              )}

              {/* Lista de Tareas */}
              {sesion.sessionLogs.length === 0 ? (
                <p className="text-center text-slate-400 py-4 border-2 border-dashed rounded italic">
                  No hay actividades evaluadas todavía.
                </p>
              ) : (
                sesion.sessionLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-white rounded-lg border shadow-sm space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{log.taskTitle}</h4>
                        {log.taskDescription && <p className="text-sm text-slate-500 mt-1">{log.taskDescription}</p>}
                      </div>
                      <div className="flex-shrink-0">
                        {/* Si está finalizada, mostramos solo texto, si no, el selector */}
                        {sesion.status === 'COMPLETED' ? (
                            <Badge variant={log.grade === 'ACHIEVED' ? 'default' : 'secondary'}>
                                {log.grade === 'ACHIEVED' ? 'Logrado' : 
                                 log.grade === 'PARTIALLY_ACHIEVED' ? 'En Proceso' : 'No Logrado'}
                            </Badge>
                        ) : (
                            <Select 
                            defaultValue={log.grade || undefined} 
                            onValueChange={(val) => handleCalificar(log.id, val)}
                            disabled={isPending}
                            >
                            <SelectTrigger className={`w-[180px] ${log.grade ? 'border-green-500 bg-green-50' : ''}`}>
                                <SelectValue placeholder="Calificar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NOT_ACHIEVED">🔴 No lo logra</SelectItem>
                                <SelectItem value="PARTIALLY_ACHIEVED">🟡 Con dificultad</SelectItem>
                                <SelectItem value="ACHIEVED">🟢 Lo logra</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
        </Card>

        {/* OBSERVACIONES */}
        <Card>
            <CardHeader><CardTitle>Cierre de Sesión</CardTitle></CardHeader>
            <CardContent>
              <Label>Observación General</Label>
              <Textarea 
                placeholder="Comentarios finales..." 
                className="mt-2"
                defaultValue={sesion.generalNotes || ''}
                onBlur={(e) => guardarObservacionGeneral(sesion.id, e.target.value)}
                disabled={sesion.status === 'COMPLETED'} // Bloqueamos edición si está finalizada
              />
            </CardContent>
        </Card>

        {/* 3. ZONA DE FINALIZACIÓN (FOOTER DE ACCIÓN) */}
        <div className="mt-4 p-6 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-4 text-center">
            
            {sesion.status === 'COMPLETED' ? (
                <div className="w-full space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-lg">
                        <span>✨ Sesión Finalizada y Guardada</span>
                    </div>
                    <p className="text-slate-500 text-sm">Ya puedes generar el documento de respaldo.</p>
                    
                    <div className="flex justify-center gap-4">
                        {/* AQUI APARECE EL PDF SOLO AL FINAL */}
                        <BotonDescargaPDF sesion={sesion} />
                        
                        <Button variant="ghost" onClick={handleReabrirSesion} className="text-slate-400 hover:text-slate-600">
                            Editar de nuevo
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <Button 
                        size="lg" 
                        className="w-full md:w-1/3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                        onClick={handleFinalizarSesion}
                        disabled={isPending}
                    >
                        {isPending ? "Guardando..." : "✅ Finalizar Sesión"}
                    </Button>
                    <p className="text-xs text-slate-400 mt-3">
                        Al finalizar, se bloqueará la edición y se habilitará la descarga del PDF.
                    </p>
                </div>
            )}

            {/* 4. ZONA DE PELIGRO (DELETE) */}
            <div className="mt-12 border-t pt-8 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
                <BotonEliminar 
                    id={sesion.id} 
                    accionEliminar={eliminarSesion} 
                    textoBoton="Eliminar esta Sesión"
                    descripcion="Se borrará la sesión y todas las notas asociadas. El historial del estudiante se actualizará."
                />
            </div>

        </div>

      </div>
    </div>
  )
}