'use client'

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { ModalAgendar } from "@/components/modal-agendar"

// Definimos el tipo de datos que recibiremos (Sesiones con sus relaciones)
interface Props {
  sesiones: any[]
  estudiantes: any[]
}

export default function DashboardAgenda({ sesiones, estudiantes }: Props) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date())

  // 1. Filtrar sesiones según la fecha seleccionada en el calendario
  const sesionesDelDia = sesiones.filter(sesion => 
    fechaSeleccionada && isSameDay(new Date(sesion.date), fechaSeleccionada)
  )

  // 2. Identificar qué días tienen sesiones para ponerles un puntito en el calendario
  // Creamos un array de Dates solo con los días que tienen eventos
  const diasConSesiones = sesiones.map(s => new Date(s.date))

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* COLUMNA IZQUIERDA: CALENDARIO Y ACCIONES */}
      <div className="w-full lg:w-[350px] space-y-6">
        
        {/* Tarjeta del Calendario */}
        <Card>
            <CardContent className="p-4 flex justify-center">
                <Calendar
                    mode="single"
                    selected={fechaSeleccionada}
                    onSelect={setFechaSeleccionada}
                    locale={es}
                    className="rounded-md border shadow-sm"
                    // MODIFICADOR: Pone un estilo especial a los días con sesiones
                    modifiers={{
                        tieneEvento: diasConSesiones
                    }}
                    modifiersStyles={{
                        tieneEvento: { 
                            fontWeight: 'bold', 
                            color: '#2563eb', // Azul
                            textDecoration: 'underline decoration-blue-300'
                        }
                    }}
                />
            </CardContent>
        </Card>

        {/* Botones de Acción Rápida */}
        <div className="grid gap-2">
            <ModalAgendar estudiantes={estudiantes} />
            
            <div className="grid grid-cols-2 gap-2">
                <Link href="/students" className="w-full">
                    <Button variant="outline" className="w-full">👥 Estudiantes</Button>
                </Link>
                <Link href="/tasks" className="w-full">
                    <Button variant="outline" className="w-full">📚 Banco</Button>
                </Link>
            </div>
        </div>

        {/* Resumen Estadístico Rápido */}
        <Card className="bg-slate-50">
            <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-500">Total Sesiones Registradas</p>
                <p className="text-3xl font-bold text-slate-800">{sesiones.length}</p>
            </CardContent>
        </Card>
      </div>

      {/* COLUMNA DERECHA: LISTA DE SESIONES DEL DÍA */}
      <div className="flex-1 space-y-6">
        
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">
                Agenda del {fechaSeleccionada ? format(fechaSeleccionada, "d 'de' MMMM", { locale: es }) : "Día"}
            </h2>
            <Badge variant="secondary" className="text-base px-3">
                {sesionesDelDia.length} citas
            </Badge>
        </div>

        {/* LISTA DINÁMICA */}
        <div className="grid gap-4">
            {sesionesDelDia.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-xl text-slate-400 bg-white">
                    <p className="text-lg">No hay sesiones para este día.</p>
                    <p className="text-sm">Selecciona otro día en el calendario o agenda una nueva.</p>
                </div>
            ) : (
                sesionesDelDia.map((sesion) => (
                    <Link key={sesion.id} href={`/sessions/${sesion.id}`}>
                        <Card className="hover:border-blue-400 transition-all cursor-pointer group hover:shadow-md">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Indicador de Estado */}
                                    <div className={`w-3 h-3 rounded-full ${
                                        sesion.status === 'COMPLETED' ? 'bg-green-500' : 
                                        sesion.status === 'SCHEDULED' ? 'bg-blue-500' : 'bg-red-400'
                                    }`} />
                                    
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700">
                                            {sesion.treatmentPlan.student.name}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {sesion.objective || "Sin objetivo definido"}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-1">
                                    <Badge variant="outline">{sesion.status}</Badge>
                                    <span className="text-xs text-slate-400">
                                        {/* Aquí podríamos poner la hora si la tuviéramos */}
                                        ID: {sesion.id.slice(0,4)}...
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))
            )}
        </div>

      </div>
    </div>
  )
}