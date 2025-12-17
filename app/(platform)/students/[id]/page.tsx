/*
Perfil del estudiante
En este archivo se muestra el perfil del estudiante y sus planes de tratamiento, 
tambien es donde se crea un nuevo plan de tratamiento desde el boton nuevo Plan anual
------------------------------------------------------------------------------------------
*/

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Usaremos Dialog para el plan ya que es un formulario pequeño
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { crearPlan } from "@/actions/crear-plan"; // Importamos la action

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PerfilEstudiante(props: Props) {
  const params = await props.params;
  const { id } = params;

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const estudiante = await db.student.findUnique({
    where: { id: id, userId },
    include: {
      treatmentPlans: {
        orderBy: { year: 'desc' },
        include: {
          _count: { select: { sessions: true } }
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
        
        {/* MODAL PARA CREAR NUEVO PLAN */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Nuevo Plan Anual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Plan de Tratamiento</DialogTitle>
              <DialogDescription>
                Define el año para este nuevo ciclo de tratamiento.
              </DialogDescription>
            </DialogHeader>

            {/* FORMULARIO DIRECTO A SERVER ACTION */}
            <form action={crearPlan} className="space-y-4 mt-4">
              {/* Input Oculto para enviar el ID del estudiante */}
              <input type="hidden" name="studentId" value={estudiante.id} />
              
              <div className="space-y-2">
                <Label>Año del Tratamiento</Label>
                <Input 
                  name="year" 
                  type="number" 
                  defaultValue={new Date().getFullYear()} 
                  required 
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Crear Plan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Planes */}
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

       
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/students/${estudiante.id}/plans/${plan.id}`}>
              <Calendar className="w-4 h-4 mr-2" />
              Ver Sesiones del Plan
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}