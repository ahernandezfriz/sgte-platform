import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Definimos un ID falso para simular un usuario de Clerk
// NOTA: Cuando te loguees con tu cuenta real, NO verás estos datos 
// porque tu ID de Clerk será diferente. Estos datos son solo para probar la DB.
const MOCK_USER_ID = "user_2mock123456" 

async function principal() {
  console.log('🌱 Iniciando la siembra de datos (Modo Clerk)...')

  // 1. Limpieza de tablas (Orden inverso a las dependencias)
  // Nota: Ya no borramos 'user' porque no existe tabla local
  await prisma.sessionLog.deleteMany()
  await prisma.session.deleteMany()
  await prisma.treatmentPlan.deleteMany()
  await prisma.student.deleteMany()
  await prisma.task.deleteMany()

  // 2. Crear Banco de Tareas (Asignadas al ID falso)
  await prisma.task.createMany({
    data: [
      {
        userId: MOCK_USER_ID, // <--- Ahora es un string directo
        title: 'Ejercicios de respiración diafragmática',
        description: 'Inhalar en 3 tiempos, mantener 2, exhalar en 4.',
      },
      {
        userId: MOCK_USER_ID,
        title: 'Pronunciación de fonema /R/',
        description: 'Repetición de palabras: Ratón, Ropa, Ferrocarril.',
      },
      {
        userId: MOCK_USER_ID,
        title: 'Lectura de pictogramas',
        description: 'Identificar emociones básicas en tarjetas visuales.',
      },
    ],
  })
  
  console.log(`📚 Tareas agregadas al banco virtual.`)

  // 3. Crear Estudiante
  const estudiante = await prisma.student.create({
    data: {
      name: 'Martín González (Seed)',
      rut: '22.333.444-5',
      course: '2° Básico A',
      diagnosis: 'Trastorno Específico del Lenguaje (TEL) Mixto',
      guardianName: 'María González',
      guardianPhone: '+56912345678',
      userId: MOCK_USER_ID, // <--- String directo
    },
  })

  console.log(`🎓 Estudiante creado: ${estudiante.name}`)

  // 4. Crear Plan de Tratamiento
  const planTratamiento = await prisma.treatmentPlan.create({
    data: {
      year: 2024,
      studentId: estudiante.id,
    },
  })

  // 5. Crear Sesión
  const manana = new Date()
  manana.setDate(manana.getDate() + 1)

  await prisma.session.create({
    data: {
      date: manana,
      objective: 'Mejorar articulación de fonemas rotacistas',
      status: 'SCHEDULED', 
      treatmentPlanId: planTratamiento.id,
    },
  })

  console.log('✅ Siembra finalizada con éxito.')
}

principal()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })