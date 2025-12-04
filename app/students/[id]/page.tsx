import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { ModalAgendar } from "@/components/modal-agendar"
import { GraficoProgreso } from "@/components/grafico-progreso" // <--- IMPORT NUEVO

interface Props {
  params: Promise<{ id: string }>
}

export default async function PaginaPerfilEstudiante({ params }: Props) {
  const { id } = await params

  // 1. Buscamos al estudiante
  const estudiante = await db.student.findUnique({
    where: { id },
    include: {
      treatmentPlans: {
        orderBy: { year: 'desc' },
        include: {
          sessions: {
            orderBy: { date: 'desc' },
            include: {
              sessionLogs: true // <--- ¡CRUCIAL! Necesitamos esto para calcular el gráfico
            }
          }
        }
      }
    }
  })

  if (!estudiante) {
    return notFound()
  }

  const planActual = estudiante.treatmentPlans[0]

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- ENCABEZADO --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 bg-white p-6 rounded-xl border shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-800">{estudiante.name}</h1>
              <Badge>{estudiante.course}</Badge>
            </div>
            <p className="text-slate-500 font-mono mt-1">RUT: {estudiante.rut || 'No registrado'}</p>
            
            <div className="flex gap-4 mt-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <span>🏥</span> <strong>Dx:</strong> {estudiante.diagnosis}
              </div>
              <div className="flex items-center gap-1">
                <span>👤</span> <strong>Apoderado:</strong> {estudiante.guardianName}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <ModalAgendar estudiantes={[estudiante]} />
            <Link href="/students">
              <Button variant="ghost" size="sm">← Volver al directorio</Button>
            </Link>
          </div>
        </div>

        {/* --- SECCIÓN DE ESTADÍSTICAS (NUEVO) --- */}
        {planActual && planActual.sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* El Gráfico ocupa 2 columnas */}
            <div className="md:col-span-2">
              <GraficoProgreso datos={planActual.sessions} />
            </div>

            {/* Resumen rápido ocupa 1 columna */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-slate-800">
                    {planActual.sessions.length}
                  </div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Sesiones Totales</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {planActual.sessions.filter(s => s.status === 'COMPLETED').length}
                  </div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Finalizadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {planActual.sessions.filter(s => s.status === 'SCHEDULED').length}
                  </div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Por realizar</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* --- HISTORIAL DE SESIONES --- */}
        {!planActual ? (
          <div className="p-12 text-center border-2 border-dashed rounded-lg bg-white">
            <h3 className="text-lg font-semibold text-slate-600">Sin Plan de Tratamiento</h3>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
              📂 Historial Detallado
            </h2>

            <div className="grid gap-4">
              {planActual.sessions.map((sesion) => (
                <Link key={sesion.id} href={`/sessions/${sesion.id}`}>
                  <Card className="hover:border-blue-400 transition-colors cursor-pointer group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          sesion.status === 'COMPLETED' ? 'bg-green-500' : 
                          sesion.status === 'SCHEDULED' ? 'bg-blue-500' : 'bg-slate-300'
                        }`} />
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-blue-700">
                            {format(sesion.date, "EEEE d 'de' MMMM", { locale: es })}
                          </p>
                          <p className="text-sm text-slate-500">
                            {sesion.objective || "Sin objetivo"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{sesion.status}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}