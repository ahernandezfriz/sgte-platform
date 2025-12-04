'use server'

import { db } from "@/lib/db"
import { SessionStatus, TaskGrade } from "@prisma/client"
import { revalidatePath } from "next/cache"

// 1. Cambiar el estado de la sesión (Agendada -> Realizada)
export async function actualizarEstadoSesion(idSesion: string, nuevoEstado: SessionStatus) {
  await db.session.update({
    where: { id: idSesion },
    data: { status: nuevoEstado }
  })
  
  // Recargamos la ruta para que el usuario vea el cambio inmediato
  revalidatePath(`/sessions/${idSesion}`)
  revalidatePath(`/`)
}

// 2. Guardar/Actualizar la nota de una tarea
export async function calificarActividad(idLog: string, nota: TaskGrade) {
  await db.sessionLog.update({
    where: { id: idLog },
    data: { grade: nota }
  })
  revalidatePath(`/sessions/[id]`)
}

// 3. Guardar el comentario general final
export async function guardarObservacionGeneral(idSesion: string, texto: string) {
  await db.session.update({
    where: { id: idSesion },
    data: { generalNotes: texto }
  })
  revalidatePath(`/sessions/${idSesion}`)
}

// --- NUEVA FUNCIÓN: AGREGAR TAREA ---
export async function agregarTareaASesion(idSesion: string, idTareaBanco: string) {
  
    // 1. Buscamos la tarea original en el banco para copiar sus datos
    const tareaOriginal = await db.task.findUnique({
      where: { id: idTareaBanco }
    })
  
    if (!tareaOriginal) {
      throw new Error("La tarea seleccionada no existe en el banco.")
    }
  
    // 2. PATRÓN SNAPSHOT: Creamos el registro en la sesión COPIANDO los textos
    await db.sessionLog.create({
      data: {
        sessionId: idSesion,
        taskTitle: tareaOriginal.title,             // Copia fija
        taskDescription: tareaOriginal.description, // Copia fija
        // grade se deja en null inicialmente
      }
    })
  
    // 3. Recargamos la página para ver la nueva tarea en la lista
    revalidatePath(`/sessions/${idSesion}`)
  }