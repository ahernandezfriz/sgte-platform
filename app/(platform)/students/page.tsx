import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { crearEstudiante } from "@/actions/crear-estudiante"
import Link from "next/link"
// 👇 IMPORTANTE: Importamos el componente que tiene el buscador
import { ListaEstudiantes } from "@/components/lista-estudiantes"

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PaginaEstudiantes() {

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 1. Obtenemos los datos del servidor
  const estudiantes = await db.student.findMany({
    where: { userId: userId }, // <--- SOLO MIS ESTUDIANTES
    orderBy: { name: 'asc' },
    include: { treatmentPlans: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ENCABEZADO Y FORMULARIO DE CREACIÓN */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Directorio de Estudiantes</h1>
            <p className="text-slate-500">Gestión de fichas clínicas.</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">+ Nuevo Estudiante</Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Ficha de Ingreso</SheetTitle>
                  <SheetDescription>Ingresa los datos del nuevo paciente.</SheetDescription>
                </SheetHeader>
                
                <form action={crearEstudiante} className="space-y-4 mt-6">
                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                    <h3 className="font-semibold text-sm text-slate-700">Datos del Alumno</h3>
                    <div className="space-y-2">
                      <Label>Nombre Completo</Label>
                      <Input name="name" required placeholder="Ej: Ana López" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>RUT</Label>
                        <Input name="rut" placeholder="12.345.678-9" />
                      </div>
                      <div className="space-y-2">
                        <Label>Curso</Label>
                        <Input name="course" placeholder="Ej: 3° Básico" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Diagnóstico</Label>
                      <Input name="diagnosis" placeholder="Ej: TEL Mixto" />
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-sm text-blue-800">Contacto Apoderado</h3>
                    <div className="space-y-2">
                      <Label>Nombre Apoderado</Label>
                      <Input name="guardianName" placeholder="Ej: Madre / Padre" />
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input name="guardianPhone" placeholder="+569..." />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Guardar Ficha
                  </Button>
                </form>

              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* 👇 AQUI ESTÁ LA CLAVE: Usamos el componente interactivo en lugar de pintar la lista directo */}
        <ListaEstudiantes estudiantesIniciales={estudiantes} />

      </div>
    </div>
  )
}