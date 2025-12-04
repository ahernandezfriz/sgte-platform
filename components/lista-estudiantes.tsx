'use client'

import { useState } from "react"
import { Student } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Buscador } from "./buscador"

interface Props {
  estudiantesIniciales: Student[]
}

export function ListaEstudiantes({ estudiantesIniciales }: Props) {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")

  // LÓGICA DE FILTRADO:
  const estudiantesFiltrados = estudiantesIniciales.filter((est) => {
    const texto = terminoBusqueda.toLowerCase()
    return (
      est.name.toLowerCase().includes(texto) ||
      (est.rut && est.rut.toLowerCase().includes(texto)) ||
      (est.diagnosis && est.diagnosis.toLowerCase().includes(texto))
    )
  })

  return (
    <div className="space-y-6">
      
      {/* BARRA DE BÚSQUEDA */}
      <div className="flex justify-between items-center">
        <Buscador 
          valor={terminoBusqueda} 
          onChange={setTerminoBusqueda} 
          placeholder="Buscar por nombre, RUT o diagnóstico..." 
        />
        <div className="text-sm text-slate-500">
            Mostrando {estudiantesFiltrados.length} de {estudiantesIniciales.length}
        </div>
      </div>

      {/* GRILLA DE RESULTADOS */}
      {estudiantesFiltrados.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg text-slate-400">
            No se encontraron alumnos con "{terminoBusqueda}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {estudiantesFiltrados.map((est) => (
            <Link key={est.id} href={`/students/${est.id}`} className="block group">
              <Card className="h-full hover:shadow-md transition-all border-slate-200 group-hover:border-blue-400 cursor-pointer">
                <CardHeader className="flex flex-row justify-between items-start pb-2">
                  <div>
                    <CardTitle className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                      {est.name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 font-mono mt-1">{est.rut}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {est.course}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-2 rounded text-sm border border-slate-100">
                    <span className="font-semibold text-slate-600 block text-xs uppercase tracking-wider mb-1">Diagnóstico:</span>
                    {est.diagnosis || "Sin diagnóstico"}
                  </div>
                  
                  <div className="text-sm space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="text-base">👤</span>
                      <span className="truncate">{est.guardianName || "Sin apoderado"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}