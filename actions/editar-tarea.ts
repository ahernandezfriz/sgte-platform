'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function editarTarea(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  if (!id || !title) return

  await db.task.update({
    where: { id },
    data: {
      title,
      description
    }
  })

  revalidatePath("/tasks")
}