'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
//ELIMINAMOS LA IMPORTACIÓN QUE FALLABA:

// 1. Cambiar el estado de la sesión
// Ahora "nuevoEstado" recibe un string simple
export async function actualizarEstadoSesion(idSesion: string, nuevoEstado: string) {
  await db.session.update({
    where: { id: idSesion },
    data: { status: nuevoEstado }
  })
  revalidatePath(`/sessions/${idSesion}`)
}

// 2. Calificar una actividad (Log)
export async function calificarActividad(idLog: string, nota: string) {
  await db.sessionLog.update({
    where: { id: idLog },
    data: { grade: nota }
  })
  revalidatePath("/") // Revalidamos genéricamente para asegurar actualización
}

// 3. Guardar observación general
export async function guardarObservacionGeneral(idSesion: string, texto: string) {
  await db.session.update({
    where: { id: idSesion },
    data: { generalNotes: texto }
  })
  revalidatePath(`/sessions/${idSesion}`)
}

// 4. Agregar tarea a la sesión (Snapshot)
export async function agregarTareaASesion(idSesion: string, idTareaBanco: string) {
  // a. Buscar la tarea original para copiar sus datos
  const tareaOriginal = await db.task.findUnique({
    where: { id: idTareaBanco }
  })

  if (!tareaOriginal) return

  // b. Crear el Log (La copia en la sesión)
  await db.sessionLog.create({
    data: {
      sessionId: idSesion,
      taskTitle: tareaOriginal.title,
      taskDescription: tareaOriginal.description,
      // No guardamos grade todavía
    }
  })

  revalidatePath(`/sessions/${idSesion}`)
}