'use server'

import { db } from "@/lib/db"

/**
 * Obtiene los detalles completos de una sesión y el banco de tareas disponible.
 * @param idSesion - El UUID de la sesión a consultar
 */
export async function obtenerSesionPorId(idSesion: string) {
  // 1. Buscamos la sesión con sus relaciones necesarias
  const sesion = await db.session.findUnique({
    where: { id: idSesion },
    include: {
      treatmentPlan: {
        include: {
          student: true // Necesitamos datos del estudiante (nombre, curso)
        }
      },
      sessionLogs: true, // Historial de tareas ya guardadas en esta sesión
    }
  })

  // Si no existe, retornamos null para manejar el error 404 en la vista
  if (!sesion) return null

  // 2. Obtenemos el banco de tareas del profesional
  // Usamos el ID del usuario dueño del estudiante para filtrar las tareas
  const bancoTareas = await db.task.findMany({
    where: { userId: sesion.treatmentPlan.student.userId }
  })

  // Retornamos un objeto con nombres en español
  return { sesion, bancoTareas }
}