import { SignUp } from "@clerk/nextjs";

export default function PaginaRegistro() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Crear Cuenta Profesional</h1>
        </div>
        <SignUp />
      </div>
    </div>
  );
}