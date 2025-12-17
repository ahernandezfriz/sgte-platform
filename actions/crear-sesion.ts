'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation" // Opcional si quieres redirigir al detalle de la sesión

export async function crearSesion(formData: FormData) {
  
  // 1. Seguridad
  const { userId } = await auth()
  if (!userId) return

  // 2. Extraer datos del formulario HTML
  const planId = formData.get("planId") as string // ID del Plan (TreatmentPlan)
  const studentId = formData.get("studentId") as string // Solo para el redirect/revalidate
  const fechaStr = formData.get("date") as string 
  const objetivo = formData.get("objective") as string
  const notas = formData.get("generalNotes") as string

  if (!planId || !fechaStr) {
    throw new Error("Faltan datos obligatorios")
  }

  // 3. Crear la Sesión
  // Ajuste de fecha para guardar correctamente
  const fechaSesion = new Date(fechaStr + "T12:00:00")

  await db.session.create({
    data: {
      date: fechaSesion,
      objective: objetivo,
      generalNotes: notas,
      status: "SCHEDULED",
      treatmentPlanId: planId
    }
  })

  // 4. Actualizar la vista del listado de sesiones
  revalidatePath(`/students/${studentId}/plans/${planId}`)
  
  // Opcional: Si quieres ir al detalle de esa sesión específica:
  // redirect(`/sessions/${nuevaSesion.id}`) 
}