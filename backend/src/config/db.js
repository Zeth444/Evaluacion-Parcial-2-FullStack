const { Pool } = require('pg');

// Creamos el "Pool" de conexiones con las credenciales de Azure
const pool = new Pool({
    host: 'server-parcial2-zeth.postgres.database.azure.com',
    user: 'Zeth',
    password: 'Admin1234',
    database: 'db_parcial2',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test rápido para verificar que el puente funciona
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error conectando a Azure. Revisa tus credenciales o el Firewall de red:\n', err.stack);
    } else {
        console.log('¡Conexión exitosa a PostgreSQL en Azure!');
    }
    // Liberamos el cliente de prueba para no dejar la conexión colgada
    if(release) release();
});

// Exportamos el pool para que el resto del backend (como init-db.js o los controladores) lo puedan usar
module.exports = pool;
