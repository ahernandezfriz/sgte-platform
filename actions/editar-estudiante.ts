'use server'

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function editarEstudiante(formData: FormData) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("No autorizado")
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const rut = formData.get("rut") as string
  const course = formData.get("course") as string
  const diagnosis = formData.get("diagnosis") as string
  const guardianName = formData.get("guardianName") as string
  const guardianPhone = formData.get("guardianPhone") as string

  if (!id || !name) {
    throw new Error("Faltan datos requeridos")
  }

  await db.student.update({
    where: {
      id: id,
      userId: userId, // Importante: Aseguramos que el usuario sea dueño del registro
    },
    data: {
      name,
      rut,
      course,
      diagnosis,
      guardianName,
      guardianPhone,
    },
  })

  revalidatePath(`/students/${id}`) // Actualiza el perfil
  revalidatePath(`/dashboard`)    // Actualiza la lista en el dashboard por si cambió el nombre
}