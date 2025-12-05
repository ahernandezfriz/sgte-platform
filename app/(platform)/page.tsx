import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardAgenda from "@/components/dashboard-agenda";
import { ModalNuevaSesion } from "@/components/modal-nueva-sesion"; // <--- IMPORTAMOS EL COMPONENTE NUEVO

export default async function PaginaInicio() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 1. Verificar si tiene estudiantes (Validación Empty State)
  const totalEstudiantes = await db.student.count({
    where: { userId }
  });

  if (totalEstudiantes === 0) {
    // ... (Mantén aquí tu código de bienvenida/empty state que hicimos antes) ...
    return (
       <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="max-w-md space-y-6 bg-white p-10 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-bold">¡Bienvenido!</h2>
            <p>Crea tu primer estudiante para comenzar.</p>
            <Link href="/students">
                <Button>Crear Estudiante</Button>
            </Link>
        </div>
       </div>
    )
  }

  // 2. Obtener datos para el Dashboard
  const sesiones = await db.session.findMany({
    where: { treatmentPlan: { student: { userId } } },
    include: { treatmentPlan: { include: { student: true } } },
    orderBy: { date: 'asc' }
  });

  // 👇 ESTO ES IMPORTANTE: Necesitamos la lista simple para el select del modal
  const listaEstudiantes = await db.student.findMany({
    where: { userId },
    select: { id: true, name: true }, // Solo traemos lo necesario para optimizar
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
       {/* Encabezado con Botón de Acción */}
       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Resumen de tu agenda clínica.</p>
        </div>

        {/* 👇 AQUÍ USAMOS EL MODAL NUEVO */}
        <ModalNuevaSesion estudiantes={listaEstudiantes} />
      </div>

      {/* Componente de Agenda (Calendario/Lista) */}
      <DashboardAgenda sesiones={sesiones} estudiantes={listaEstudiantes} />
    </div>
  );
}