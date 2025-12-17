import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importamos Card
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2, Clock, PlayCircle, User, Phone, BookOpen, FileText, CheckCircle } from "lucide-react"; 
import { crearSesion } from "@/actions/crear-sesion";
import { GraficoProgreso } from "@/components/grafico-progreso"; // <--- Importamos el gráfico

type Props = {
  params: Promise<{
    id: string;      
    planId: string;  
  }>;
};

export default async function DetallePlan(props: Props) {
  const params = await props.params;
  const { id: studentId, planId } = params; 

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  if (!planId) return <div>Error: URL mal formada.</div>;

  // CONSULTA ACTUALIZADA: Incluimos sessionLogs para poder calcular el gráfico
  const plan = await db.treatmentPlan.findUnique({
    where: { id: planId },
    include: {
      student: true,
      sessions: {
        orderBy: { date: "asc" }, // Orden cronológico
        include: {
            sessionLogs: true // <--- NECESARIO PARA EL GRÁFICO
        }
      }
    }
  });

  if (!plan) return <div>Plan de tratamiento no encontrado</div>;

  return (
    <div className="p-6 space-y-8">
      
      {/* 1. Encabezado y Navegación */}
      <div className="flex flex-col gap-4">
        <Link 
          href={`/students/${studentId}`} 
          className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al perfil de {plan.student.name}
        </Link>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Plan de Tratamiento {plan.year}
            </h1>
            <p className="text-slate-500">
              Seguimiento y evolución clínica
            </p>
          </div>
          
          {/* BOTÓN AGENDAR (SHEET) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="shadow-md">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Nueva Sesión
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Agendar Nueva Sesión</SheetTitle>
                <SheetDescription>
                  Ingresa los detalles para la próxima sesión de terapia.
                </SheetDescription>
              </SheetHeader>

              <form action={crearSesion} className="space-y-4 mt-6">
                <input type="hidden" name="planId" value={plan.id} />
                <input type="hidden" name="studentId" value={studentId} />

                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input type="date" name="date" required />
                </div>

                <div className="space-y-2">
                  <Label>Objetivo Principal</Label>
                  <Input name="objective" placeholder="Ej: Fonema /R/" required />
                </div>

                <div className="space-y-2">
                  <Label>Notas Generales (Opcional)</Label>
                  <Textarea name="generalNotes" placeholder="Detalles extra..." />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Guardar Sesión
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* 2. SECCIÓN DE DATOS Y GRÁFICO (GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Tarjeta de Información Contextual */}
        <Card className="lg:col-span-1 h-full bg-slate-50/50 border-slate-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    Datos del Paciente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <span className="font-semibold text-slate-700 block mb-1">Diagnóstico:</span>
                    <div className="flex items-start gap-2 text-slate-600">
                        <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>{plan.student.diagnosis || "No registrado"}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold text-slate-700 block mb-1">Curso:</span>
                        <div className="flex items-center gap-2 text-slate-600">
                            <BookOpen className="w-4 h-4" />
                            <span>{plan.student.course || "S/I"}</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold text-slate-700 block mb-1">RUT:</span>
                        <span className="text-slate-600">{plan.student.rut || "S/I"}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                    <span className="font-semibold text-slate-700 block mb-2">Contacto Apoderado:</span>
                    <p className="text-slate-800 font-medium">{plan.student.guardianName || "No registrado"}</p>
                    {plan.student.guardianPhone && (
                        <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Phone className="w-4 h-4" />
                            <span>{plan.student.guardianPhone}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* COLUMNA DERECHA: Gráfico de Progreso */}
        <div className="lg:col-span-2 h-full">
            <GraficoProgreso datos={plan.sessions} />
        </div>
      </div>

      {/* 3. Listado de Sesiones */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Historial de Sesiones
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {plan.sessions.length} total
            </span>
        </h2>

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            {plan.sessions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <Calendar className="w-10 h-10 text-slate-300" />
                <p>No hay sesiones registradas en este plan todavía.</p>
            </div>
            ) : (
                <div>
                  {/* Contenedor tipo Lista con divisiones suaves */}
<ul className="divide-y divide-slate-100">
  {plan.sessions.map((session) => {
    const isCancelled = session.status === 'CANCELLED';
    const isCompleted = session.status === 'COMPLETED';
    const isPending = !isCancelled && !isCompleted; // Estado Pendiente

    return (
      <li key={session.id} className="group">
        <Link 
          href={`/sessions/${session.id}`}
          className="block py-4 px-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            
            {/* IZQUIERDA: Fecha + Etiquetas + Descripción */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {/* FECHA */}
                <span className={`font-semibold text-base ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                   {new Date(session.date).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                   })}
                </span>

                {/* ETIQUETAS DE ESTADO (Badges) */}
                {isCancelled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                    🚫 Suspendida
                  </span>
                )}
                {isCompleted && (
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                    ✅ Realizada
                   </span>
                )}
                {/* ETIQUETA PENDIENTE (NUEVA) */}
                {isPending && (
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-blue-700">
                    📅 Pendiente
                   </span>
                )}
              </div>

              {/* DESCRIPCIÓN O MOTIVO */}
              {isCancelled ? (
                 <p className="text-sm text-red-600/90 font-medium">
                   Motivo: {session.cancellationReason}
                 </p>
              ) : (
                 <p className="text-sm text-slate-500">
                   🎯 {session.objective || "Sin objetivo definido"}
                 </p>
              )}
            </div>

            {/* DERECHA: Call to Action */}
            <div className="flex items-center shrink-0 mt-2 sm:mt-0">
               {isCancelled ? (
                  <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    Ver detalles &rarr;
                  </span>
               ) : isCompleted ? (
                  <span className="text-sm font-medium text-green-600 group-hover:text-green-700">
                     Ver resumen &rarr;
                  </span>
               ) : (
                  <span className="text-sm font-bold text-slate-900 group-hover:underline underline-offset-4 decoration-slate-900">
                     Iniciar Sesión &rarr;
                  </span>
               )}
            </div>

          </div>
        </Link>
      </li>
    )
  })}
</ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}