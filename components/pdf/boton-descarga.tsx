'use client'

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { DocumentoSesion } from './documento-sesion';

// Ya no necesitamos useState ni useEffect porque el padre ya usa dynamic import con { ssr: false }
export default function BotonDescargaPDF({ sesion }: { sesion: any }) {

  return (
    <PDFDownloadLink
      document={<DocumentoSesion sesion={sesion} />}
      fileName={`Reporte_${sesion.treatmentPlan.student.name.replace(/\s+/g, '_')}.pdf`}
    >
      {/* El componente PDFDownloadLink maneja internamente su estado de "loading".
         Simplemente usamos sus props para cambiar el texto del botón.
      */}
      {/* @ts-ignore */}
      {({ blob, url, loading, error }: any) => (
        <Button 
          variant="outline" 
          disabled={loading} 
          className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
        >
          {loading ? 'Generando...' : '📄 Descargar PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}