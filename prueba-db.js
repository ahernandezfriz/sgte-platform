import { Client } from 'pg';

// --- TUS DATOS QUE SI FUNCIONAN ---
const config = {
  user: 'postgres', 
  password: 'VM060419a.', // <--- PON AQUI LA QUE FUNCIONO
  host: '127.0.0.1',             // <--- IMPORTANTE: USAR IP, NO LOCALHOST
  port: 5432,
  database: 'sgte_db',           // El nombre de la DB que queremos crear
};

// ----------------------------------

const client = new Client({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: 'postgres' // Conectamos a postgres default para probar
});

async function generateConnectionUrl() {
  console.log('🔄 Verificando credenciales y generando URL...');
  try {
    await client.connect();
    console.log('✅ Credenciales correctas.');
    
    // Aquí ocurre la magia: Codificamos la contraseña para que sea válida en una URL
    const encodedPassword = encodeURIComponent(config.password);
    
    // Construimos la URL segura
    const connectionString = `postgresql://${config.user}:${encodedPassword}@${config.host}:${config.port}/${config.database}?schema=public`;
    
    console.log('\n👇 COPIA Y PEGA ESTA LÍNEA EXACTA EN TU ARCHIVO .env 👇\n');
    console.log(`DATABASE_URL="${connectionString}"`);
    console.log('\n☝️ -------------------------------------------------- ☝️\n');
    
    await client.end();
  } catch (err) {
    console.error('❌ Las credenciales en este script siguen fallando:', err.message);
    await client.end();
  }
}

generateConnectionUrl();