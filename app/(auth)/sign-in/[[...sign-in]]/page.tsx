import { SignIn } from "@clerk/nextjs";

export default function PaginaLogin() {
  return (
    // Diseño: Fondo gris suave, centrado vertical y horizontalmente
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      
      <div className="w-full max-w-md space-y-8 flex flex-col items-center">
        
        {/* Tu Branding Personalizado fuera del cuadro de Clerk */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Sistema SGTE</h1>
          <p className="text-slate-500 mt-2">Gestión de Terapias Educativas</p>
        </div>

        {/* Componente de Clerk (El formulario en sí) */}
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              footerActionLink: 'text-blue-600 hover:text-blue-700'
            }
          }}
        />

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Sistema Privado. Acceso restringido.
        </p>
      </div>
      
    </div>
  );
}