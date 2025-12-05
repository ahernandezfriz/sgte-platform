import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
// Importa tu componente de Modal o Formulario para crear sesión aquí

export default async function DetallePlan({ params }: { params: { id: string, planId: string } }) {
  const { userId } = await auth();
  
  // Buscamos el plan específico y sus sesiones
  const plan = await db.treatmentPlan.findUnique({
    where: { id: params.planId },
    include: {
      student: true,
      sessions: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!plan || plan.student.userId !== userId) redirect("/");

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-sm text-slate-500 mb-1">
           Estudiante: {plan.student.name}
        </div>
        <h1 className="text-2xl font-bold">Plan de Tratamiento {plan.year}</h1>
      </div>

      {/* Aquí iría la lista de sesiones SOLO de este plan */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Sesiones Realizadas y Programadas</h3>
          
          {/* Botón que abre el modal de crear sesión, 
              PASANDO AUTOMÁTICAMENTE EL ID DE ESTE PLAN */}
          <Button>Agendar en este Plan</Button>
        </div>

        <div className="divide-y">
            {plan.sessions.map(session => (
                <div key={session.id} className="p-4 hover:bg-slate-50 flex justify-between">
                    <div>
                        <p className="font-medium">{session.date.toLocaleDateString()}</p>
                        <p className="text-sm text-slate-500">{session.status}</p>
                    </div>
                    {/* Botón para entrar a la sesión interactiva */}
                    <Button variant="ghost" size="sm">Ver Detalles</Button>
                </div>
            ))}
            {plan.sessions.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    No hay sesiones en este plan anual todavía.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}