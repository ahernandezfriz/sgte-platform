'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function crearEstudiante(formData: FormData) {

  // 1. OBTENEMOS EL ID DEL USUARIO LOGUEADO
  const { userId } = await auth()

  if (!userId) {
    throw new Error("No autorizado")
  }


  // 1. Extraer datos
  const name = formData.get("name") as string
  const rut = formData.get("rut") as string
  const diagnosis = formData.get("diagnosis") as string
  const course = formData.get("course") as string
  const guardianName = formData.get("guardianName") as string
  const guardianPhone = formData.get("guardianPhone") as string
  
  // Obtenemos el primer usuario profesional (en el futuro será el logueado)
  //const user = await db.user.findFirst()

  if (!name ) return

  // 2. Crear Estudiante
  const nuevoEstudiante = await db.student.create({
    data: {
      name,
      rut,
      diagnosis,
      course,
      guardianName,
      guardianPhone,
      userId: userId
    }
  })

  // 3. Crear automáticamente un Plan de Tratamiento para el año actual
  // Sin esto, no podrías agendarle sesiones (porque la sesión requiere un plan)
  await db.treatmentPlan.create({
    data: {
      year: new Date().getFullYear(),
      studentId: nuevoEstudiante.id
    }
  })

  revalidatePath("/students")
  revalidatePath("/") // Para que aparezca en el selector de "Agendar Sesión"
}