const pool = require('./db');

const check = async () => {
    try {
        console.log('🔎 Consultando la base de datos en Azure...');
        const res = await pool.query('SELECT id, correo FROM usuarios');
        
        if (res.rows.length === 0) {
            console.log('❌ LA TABLA ESTÁ VACÍA. No hay nadie registrado aún.');
        } else {
            console.log('✅ USUARIOS ENCONTRADOS:');
            console.table(res.rows); // Esto te sacará una tablita nítida en la consola
        }
    } catch (err) {
        console.error('❌ Error de conexión:', err.message);
    } finally {
        pool.end();
    }
};

check();