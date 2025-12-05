import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Calendar } from "lucide-react";

// Definimos el tipo de Props explícitamente para Next.js 15+
type Props = {
  params: Promise<{ id: string }>;
};

export default async function PerfilEstudiante(props: Props) {
  // 1. Resolvemos la promesa de params antes de usar sus valores
  const params = await props.params;
  const { id } = params;

  // 2. Verificamos autenticación
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 3. Consulta a base de datos usando el ID ya resuelto
  const estudiante = await db.student.findUnique({
    where: { 
      id: id, // Ahora 'id' es un string válido, no una promesa
      userId 
    },
    include: {
      treatmentPlans: {
        orderBy: { year: 'desc' }, // El más reciente primero
        include: {
          _count: { select: { sessions: true } } // Contamos cuántas sesiones tiene
        }
      }
    }
  });

  if (!estudiante) return <div>Estudiante no encontrado</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{estudiante.name}</h1>
          <p className="text-slate-500">Historial de Tratamientos</p>
        </div>
        {/* Este botón podría abrir un Modal para crear un Plan Nuevo (Ej: 2025) */}
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Nuevo Plan Anual
        </Button>
      </div>

      {/* Lista de Planes (La Jerarquía) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {estudiante.treatmentPlans.map((plan) => (
          <div key={plan.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                Año {plan.year}
              </div>
              <span className="text-xs text-slate-400">
                {plan._count.sessions} sesiones
              </span>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              Objetivos y sesiones vinculadas a este periodo.
            </p>

            {/* 👇 ESTE LINK ES CLAVE: Entramos AL PLAN, no solo al estudiante */}
            <Link href={`/students/${estudiante.id}/plans/${plan.id}`}>
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Sesiones del Plan
              </Button>
            </Link>
          </div>
        ))}

        {estudiante.treatmentPlans.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500 border-2 border-dashed rounded-xl">
            No hay planes de tratamiento creados. Crea uno para comenzar a agendar sesiones.
          </div>
        )}
      </div>
    </div>
  );
}