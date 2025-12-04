'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function agendarSesion(formData: FormData) {
  // 1. Extraer datos del formulario HTML
  const studentId = formData.get("studentId") as string
  const fechaStr = formData.get("date") as string // Viene como YYYY-MM-DD
  const objetivo = formData.get("objective") as string

  if (!studentId || !fechaStr) {
    throw new Error("Faltan datos obligatorios")
  }

  // 2. Buscar el Plan de Tratamiento del estudiante para este año
  // (Asumimos que existe por el seed. En un futuro haremos que se cree solo)
  const plan = await db.treatmentPlan.findFirst({
    where: { studentId: studentId }
  })

  if (!plan) {
    throw new Error("El estudiante no tiene un plan de tratamiento activo.")
  }

  // 3. Crear la Sesión
  // Convertimos el string de fecha a objeto Date y le sumamos horas para evitar problemas de zona horaria
  const fechaSesion = new Date(fechaStr + "T12:00:00")

  const nuevaSesion = await db.session.create({
    data: {
      date: fechaSesion,
      objective: objetivo,
      status: "SCHEDULED",
      treatmentPlanId: plan.id
    }
  })

  // 4. Actualizar el Dashboard y redirigir
  revalidatePath("/")
  redirect(`/sessions/${nuevaSesion.id}`)
}