'use server'

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function crearSesionDesdeDashboard(formData: FormData) {
  // 1. Seguridad: Verificar usuario
  const { userId } = await auth()
  if (!userId) {
    throw new Error("No autorizado")
  }

  // 2. Obtener datos del formulario
  const studentId = formData.get("studentId") as string
  // Si usas un input type="date", el valor viene como string YYYY-MM-DD
  const rawDate = formData.get("date") as string 

  if (!studentId || !rawDate) {
    return { error: "Faltan datos requeridos" }
  }

  // Convertir string a objeto Date
  // Agregamos "T12:00:00" para evitar problemas de zona horaria (que reste un día)
  const dateObj = new Date(rawDate + "T12:00:00")
  const currentYear = dateObj.getFullYear() // Usamos el año de la sesión, no el actual

  try {
    // 3. LÓGICA DE NEGOCIO: Buscar Plan de Tratamiento
    // Buscamos si ya existe un plan para ese estudiante en ese año específico
    let plan = await db.treatmentPlan.findFirst({
      where: {
        studentId: studentId,
        year: currentYear
      }
    })

    // 4. Si no existe el plan, lo creamos automáticamente (AUTO-CREACIÓN)
    if (!plan) {
      console.log(`ℹ️ No existe plan ${currentYear} para estudiante. Creando automático...`)
      plan = await db.treatmentPlan.create({
        data: {
          studentId: studentId,
          year: currentYear
        }
      })
    }

    // 5. Crear la sesión vinculada a ese plan
    await db.session.create({
      data: {
        date: dateObj,
        status: "SCHEDULED",
        treatmentPlanId: plan.id // <--- VINCULACIÓN JERÁRQUICA
      }
    })

    // 6. Actualizar la vista
    revalidatePath("/")
    revalidatePath(`/students/${studentId}`)
    return { success: true }

  } catch (error) {
    console.error("Error al crear sesión:", error)
    return { error: "Error interno al crear la sesión" }
  }
}