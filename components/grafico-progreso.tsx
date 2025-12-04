'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Props {
  datos: any[] // Recibiremos las sesiones crudas
}

export function GraficoProgreso({ datos }: Props) {
  
  // 1. Transformación de Datos: Convertimos sesiones DB a formato Gráfico
  const dataGrafico = datos
    .filter(sesion => sesion.status === 'COMPLETED' && sesion.sessionLogs.length > 0) // Solo sesiones terminadas y con tareas
    .map(sesion => {
      const totalTareas = sesion.sessionLogs.length
      // Contamos cuántas tareas fueron 'ACHIEVED' (Logradas)
      const logradas = sesion.sessionLogs.filter((log: any) => log.grade === 'ACHIEVED').length
      
      // Calculamos porcentaje (0 a 100)
      const porcentaje = Math.round((logradas / totalTareas) * 100)

      return {
        fecha: format(new Date(sesion.date), 'dd/MM', { locale: es }),
        porcentaje: porcentaje,
        objetivo: sesion.objective
      }
    })
    // Recharts dibuja de izquierda a derecha, aseguramos el orden por fecha
    .reverse() 

  if (dataGrafico.length < 2) {
    return (
      <Card>
        <CardHeader><CardTitle>Progreso del Estudiante</CardTitle></CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
          Se necesitan al menos 2 sesiones finalizadas para mostrar tendencias.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Logro (%)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataGrafico} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="fecha" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              unit="%" 
              domain={[0, 100]} // El eje Y siempre va de 0 a 100
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="porcentaje" 
              stroke="#2563eb" // Azul
              strokeWidth={3}
              dot={{ r: 4, fill: "#2563eb" }}
              activeDot={{ r: 6 }}
              name="Logro"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}