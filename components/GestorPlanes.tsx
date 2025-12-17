'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearPlan } from '@/actions/crear-planes';
import Modal from '@/components/Modal'; 

// Definimos la interfaz basada en lo que devuelve Prisma para TreatmentPlan
interface PlanProps {
  id: string;
  year: number;
  studentId: string;
}

export default function GestorPlanes({ planes, idEstudiante }: { planes: PlanProps[], idEstudiante: string }) {
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function alEnviar(formData: FormData) {
    setCargando(true);
    const resultado = await crearPlan(formData, idEstudiante);
    setCargando(false);

    if (resultado?.success) {
      setModalAbierto(false);
      router.refresh(); 
    } else {
      alert(resultado?.error || "Error desconocido");
    }
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Planes de Tratamiento</h2>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Plan Anual
        </button>
      </div>

      <div className="grid gap-4">
        {planes.map((plan) => (
          <div key={plan.id} className="border p-4 rounded flex justify-between bg-white shadow-sm items-center">
            <div>
              <h3 className="font-bold text-lg">Plan Año {plan.year}</h3>
              <p className="text-sm text-gray-500">ID: {plan.id.substring(0,8)}...</p>
            </div>
            <button 
              onClick={() => router.push(`/platform/students/${idEstudiante}/plans/${plan.id}`)}
              className="text-blue-600 font-medium hover:underline border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
            >
              Ver Sesiones &rarr;
            </button>
          </div>
        ))}
      </div>

      {/* Modal Ajustado al Schema */}
      <Modal abierto={modalAbierto} alCerrar={() => setModalAbierto(false)} titulo="Nuevo Plan de Tratamiento">
        <form action={alEnviar} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Año del Tratamiento</span>
            <input 
                name="anio" 
                type="number" 
                defaultValue={new Date().getFullYear()} // Por defecto el año actual
                min="2020" 
                max="2030"
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" 
            />
          </label>
          <button disabled={cargando} type="submit" className="bg-green-600 text-white py-2 rounded font-semibold">
            {cargando ? 'Guardando...' : 'Crear Plan'}
          </button>
        </form>
      </Modal>
    </div>
  );
}