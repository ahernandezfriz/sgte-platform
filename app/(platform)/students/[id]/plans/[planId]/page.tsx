import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";

// Definimos los tipos de los parámetros esperados en la URL
// NOTA: Renombra tu carpeta de '[id]' a '[planId]' para que coincida con esto
type Props = {
  params: Promise<{
    id: string;      // ID del estudiante (viene de la carpeta superior)
    planId: string;  // ID del plan (debe coincidir con el nombre de la carpeta actual)
  }>;
};

export default async function DetallePlan(props: Props) {
  // 1. Await de los params (CRÍTICO para Next.js 15/16)
  const params = await props.params;
  const { id: studentId, planId } = params; 

  // 2. Verificación de sesión
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 3. Consulta segura usando el planId desestructurado
  // Validación preventiva
  if (!planId) return <div>Error: URL mal formada. Faltan parámetros.</div>;

  const plan = await db.treatmentPlan.findUnique({
    where: { 
      id: planId, // Ahora sí enviamos un string, no undefined
    },
    include: {
      student: true,
      sessions: {
        orderBy: {
          date: "desc"
        }
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
          
          {/* Botón para agendar nueva sesión en este plan */}
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Sesión
          </Button>
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
                    <p className="font-medium text-slate-900">
                      {/* Formateo simple de fecha, idealmente usar date-fns */}
                      {new Date(session.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-slate-500 truncate max-w-md">
                      {session.notes || "Sin notas registradas"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Ver detalle</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}