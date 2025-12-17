'use server'

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function cancelarSesion(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("No autorizado")

  const sessionId = formData.get("sessionId") as string
  const reason = formData.get("reason") as string
  // Necesitamos el studentId y planId para redirigir correctamente, los pasamos hidden
  const planId = formData.get("planId") as string 
  const studentId = formData.get("studentId") as string

  if (!sessionId || !reason) throw new Error("Faltan datos")

  await db.session.update({
    where: { id: sessionId },
    data: {
      status: "CANCELLED",
      cancellationReason: reason
    }
  })

  // Revalidamos y redirigimos de vuelta al plan
  revalidatePath(`/students/${studentId}/plans/${planId}`)
  redirect(`/students/${studentId}/plans/${planId}`)
}