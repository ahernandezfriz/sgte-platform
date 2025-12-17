'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function crearPlan(formData: FormData) {
  
  // 1. Auth
  const { userId } = await auth()
  if (!userId) return

  // 2. Extraer datos
  const studentId = formData.get("studentId") as string
  const yearStr = formData.get("year") as string

  if (!studentId || !yearStr) return

  // 3. Crear en BD
  await db.treatmentPlan.create({
    data: {
      studentId: studentId,
      year: parseInt(yearStr), // Convertimos a entero según el schema
    }
  })

  // 4. Revalidar la vista del estudiante para que aparezca el nuevo plan
  revalidatePath(`/students/${studentId}`)
}