'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// 1. Eliminar Sesión
export async function eliminarSesion(idSesion: string) {
  // Primero borramos los logs (tareas) asociados para evitar errores de restricción
  await db.sessionLog.deleteMany({
    where: { sessionId: idSesion }
  })

  // Luego borramos la sesión
  await db.session.delete({
    where: { id: idSesion }
  })

  revalidatePath("/")
  // Como la sesión ya no existe, no podemos quedarnos en su página. Redirigimos al inicio.
  redirect("/")
}

// 2. Eliminar Tarea del Banco
export async function eliminarTareaBanco(idTarea: string) {
  try {
    await db.task.delete({
      where: { id: idTarea }
    })
    revalidatePath("/tasks")
  } catch (error) {
    // Si la tarea está siendo usada en una sesión antigua, podría fallar.
    // Por ahora lo manejamos silenciosamente o podríamos lanzar error.
    console.error("No se pudo eliminar la tarea, quizás está en uso.", error)
  }
}