/* src/components/pdf/documento-sesion.tsx */
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Definimos estilos parecidos a CSS pero para PDF
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 },
  title: { fontSize: 24, marginBottom: 5, color: '#1e293b' },
  subtitle: { fontSize: 12, color: '#64748b' },
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, backgroundColor: '#f1f5f9', padding: 5 },
  text: { fontSize: 11, marginBottom: 4, lineHeight: 1.5 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  col1: { width: '70%' },
  col2: { width: '30%', textAlign: 'right' },
  gradeBadge: { fontSize: 10, padding: 3, backgroundColor: '#e2e8f0', borderRadius: 4 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 10, textAlign: 'center', color: '#94a3b8' }
});

// Tipos de datos necesarios (puedes importarlos de prisma si prefieres)
interface PropsPDF {
  sesion: any; // Usamos any por simplicidad aquí, pero idealmente es el tipo SessionCompleta
}

const traducirNota = (nota: string | null) => {
  if (!nota) return '-';
  if (nota === 'ACHIEVED') return 'Logrado';
  if (nota === 'PARTIALLY_ACHIEVED') return 'En proceso';
  return 'No logrado';
};

export const DocumentoSesion = ({ sesion }: PropsPDF) => {
  const estudiante = sesion.treatmentPlan.student;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>{estudiante.name}</Text>
          <Text style={styles.subtitle}>
            Reporte de Sesión de Terapia - {format(new Date(sesion.date), "d 'de' MMMM, yyyy", { locale: es })}
          </Text>
        </View>

        {/* Detalles Generales */}
        <View style={styles.section}>
          <Text style={styles.text}><Text style={{fontWeight:'bold'}}>Objetivo:</Text> {sesion.objective}</Text>
          <Text style={styles.text}><Text style={{fontWeight:'bold'}}>Estado:</Text> {sesion.status}</Text>
        </View>

        {/* Tabla de Actividades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evaluación de Actividades</Text>
          {sesion.sessionLogs.length > 0 ? (
            sesion.sessionLogs.map((log: any) => (
              <View key={log.id} style={styles.row}>
                <View style={styles.col1}>
                  <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{log.taskTitle}</Text>
                  {log.taskDescription && <Text style={{ fontSize: 10, color: '#666' }}>{log.taskDescription}</Text>}
                </View>
                <View style={styles.col2}>
                  <Text style={styles.gradeBadge}>{traducirNota(log.grade)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No se registraron actividades en esta sesión.</Text>
          )}
        </View>

        {/* Observaciones */}
        {sesion.generalNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones Generales</Text>
            <Text style={styles.text}>{sesion.generalNotes}</Text>
          </View>
        )}

        {/* Pie de Página */}
        <Text style={styles.footer}>
          Documento generado automáticamente por Sistema SGTE - {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};