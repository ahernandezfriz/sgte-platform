'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function crearTareaEnBanco(formData: FormData) {
  
  const { userId } = await auth() // <--- Obtener usuario

  if (!userId) return

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  // Por ahora, asignamos las tareas al primer usuario que encontremos (en el futuro será al usuario logueado)
  //const user = await db.user.findFirst()

  if (!title) return

  await db.task.create({
    data: {
      title,
      description,
      userId: userId
    }
  })

  revalidatePath("/tasks") // Recargaremos la página de tareas
  revalidatePath("/")      // Y el dashboard por si acaso
}