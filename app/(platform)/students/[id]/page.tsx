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
import { PlusCircle, Calendar, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { crearPlan } from "@/actions/crear-plan"; // Importamos la action
import { EditarEstudianteDialog } from "@/components/EditarEstudianteDialog";


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
  <div className="p-6 space-y-8">
    
    {/* 1. SECCIÓN: DATOS DEL ESTUDIANTE */}
    <div>
      {/* Fila: Nombre + Botón Editar */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-slate-900">
          {estudiante.name}
        </h1>
        {/* El botón de editar aparece justo al lado del nombre */}
        <EditarEstudianteDialog student={estudiante} />
      </div>

      {/* Detalles del estudiante */}
      <div className="text-slate-600 space-y-1">
        <p className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Curso:</span> 
          {estudiante.course || "Sin registrar"}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Diagnóstico:</span> 
          {estudiante.diagnosis || "Sin diagnóstico"}
        </p>
      </div>
    </div>

    {/* Separador visual (opcional) */}
    <hr className="border-slate-200" />

    {/* 2. SECCIÓN: HISTORIAL DE TRATAMIENTOS */}
    <div className="space-y-4">
      {/* Cabecera de la sección con el botón de Crear Plan a la derecha */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Historial de Tratamientos
        </h2>
        
        {/* Aquí va tu botón de crear plan que ya tenías */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Plan</DialogTitle>
              <DialogDescription>
                Define el año para el nuevo plan de tratamiento.
              </DialogDescription>
            </DialogHeader>
            <form action={crearPlan} className="space-y-4 mt-4">
              <input type="hidden" name="studentId" value={estudiante.id} />
              <div className="space-y-2">
                <Label>Año del Tratamiento</Label>
                <Input 
                  name="year" 
                  type="number" 
                  defaultValue={new Date().getFullYear()} 
                  min={2020} 
                  max={2030} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Crear Plan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 3. LISTA DE PLANES (Lo que ya tenías) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {estudiante.treatmentPlans.length === 0 ? (
           <div className="col-span-full text-center p-8 border-2 border-dashed rounded-lg text-slate-400">
             No hay planes de tratamiento registrados.
           </div>
        ) : (
          estudiante.treatmentPlans.map((plan) => (
            <Link key={plan.id} href={`/students/${estudiante.id}/plans/${plan.id}`}>
              <div className="border p-6 rounded-xl hover:shadow-md transition cursor-pointer bg-white group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition">
                    Plan {plan.year}
                  </h3>
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">
                  Click para ver sesiones y evolución
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  </div>
);
}