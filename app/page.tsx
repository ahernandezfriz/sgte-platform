import { db } from "@/lib/db";
import DashboardAgenda from "@/components/dashboard-agenda";
import { UserButton } from "@clerk/nextjs"; 
import { auth } from "@clerk/nextjs/server"; // <--- Importar auth
import { redirect } from "next/navigation";

export default async function PaginaInicio() {
  const { userId } = await auth(); // <--- Obtener ID del usuario logueado

  if (!userId) {
    redirect("/sign-in"); // Si no está logueado, lo mandamos al login
  }
  
  // 1. Obtener SOLO mis sesiones
  const sesiones = await db.session.findMany({
    where: {
      treatmentPlan: {
        student: {
          userId: userId // <--- FILTRO DE SEGURIDAD
        }
      }
    },
    orderBy: { date: 'asc' },
    include: {
      treatmentPlan: {
        include: { student: true }
      }
    }
  });

  // 2. Obtener SOLO mis estudiantes
  const estudiantes = await db.student.findMany({
    where: { userId: userId }, // <--- FILTRO DE SEGURIDAD
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="pb-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Sistema SGTE</h1>
            <p className="text-slate-500">Panel de Control</p>
          </div>
          <UserButton showName />
        </header>
        <DashboardAgenda sesiones={sesiones} estudiantes={estudiantes} />
      </div>
    </div>
  );
}