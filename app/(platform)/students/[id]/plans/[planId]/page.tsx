import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Asegúrate de tener este componente ui
// Usamos Sheet para el formulario de sesión
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";
import { crearSesion } from "@/actions/crear-sesion"; // Importamos la action

type Props = {
  params: Promise<{
    id: string;      // ID del estudiante
    planId: string;  // ID del plan
  }>;
};

export default async function DetallePlan(props: Props) {
  const params = await props.params;
  const { id: studentId, planId } = params; 

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  if (!planId) return <div>Error: URL mal formada.</div>;

  const plan = await db.treatmentPlan.findUnique({
    where: { id: planId },
    include: {
      student: true,
      sessions: {
        orderBy: { date: "desc" }
      }
    }
  });

  if (!plan) return <div>Plan de tratamiento no encontrado</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Navegación y Encabezado */}
      <div className="flex flex-col space-y-4">
        <Link 
          href={`/students/${studentId}`} 
          className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al estudiante
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Plan de Tratamiento {plan.year}
            </h1>
            <p className="text-slate-500">
              Estudiante: <span className="font-medium text-slate-700">{plan.student.name}</span>
            </p>
          </div>
          
          {/* SHEET (PANEL LATERAL) PARA AGENDAR SESIÓN */}
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Sesión
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Agendar Nueva Sesión</SheetTitle>
                <SheetDescription>
                  Ingresa los detalles para la próxima sesión de terapia.
                </SheetDescription>
              </SheetHeader>

              {/* FORMULARIO */}
              <form action={crearSesion} className="space-y-4 mt-6">
                {/* Inputs ocultos para pasar IDs */}
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

      {/* Listado de Sesiones */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 font-medium text-slate-700">
          Sesiones Realizadas ({plan.sessions.length})
        </div>
        
        {plan.sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay sesiones registradas en este plan todavía.
          </div>
        ) : (
          <ul className="divide-y">
            {plan.sessions.map((session) => (
              <li key={session.id} className="p-4 hover:bg-slate-50 transition flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900" suppressHydrationWarning>
                      {new Date(session.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-slate-500 truncate max-w-md">
                      {session.objective}
                    </p>
                  </div>
                </div>
               
               
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/sessions/${session.id}`}>
                    Ver detalle &rarr;
                  </Link>
                </Button>
              
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}