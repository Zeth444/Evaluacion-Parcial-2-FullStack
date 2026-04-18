const pool = require('./db');

const createTables = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            correo VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS perfiles (
            id SERIAL PRIMARY KEY,
            usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
            nombre VARCHAR(50) NOT NULL,
            apellido VARCHAR(50) NOT NULL,
            edad INTEGER NOT NULL,
            correo VARCHAR(100) NOT NULL,
            telefono VARCHAR(15) NOT NULL
        );
    `;

    try {
        console.log('Conectando a Azure para crear las tablas...');
        await pool.query(queryText);
        console.log('¡Tablas "usuarios" y "perfiles" creadas con éxito en Azure!');
    } catch (err) {
        console.error('Error creando las tablas:', err);
    } finally {
        pool.end();
    }
};

createTables();
