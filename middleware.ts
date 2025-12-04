import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definimos que las rutas de login y registro SON PÚBLICAS
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Si NO es pública, la protegemos
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Excluir archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecutar para API
    '/(api|trpc)(.*)',
  ],
};