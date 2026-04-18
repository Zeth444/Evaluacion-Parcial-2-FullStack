const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
// Importamos el archivo de rutas de autenticación
const authRoutes = require('./routes/auth.routes');

const app = express();



app.use(cors()); 
app.use(express.json());

// Le decimos a Express que use estas rutas base
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: '¡API del Parcial 2 funcionando al 100%!' });
});

// RUTA TEMPORAL PARA ACTUALIZAR LA TABLA EN AZURE
app.post('/api/setup-db', async (req, res) => {
    try {
        const sql = `
            ALTER TABLE usuarios 
            ADD COLUMN IF NOT EXISTS nombre VARCHAR(100),
            ADD COLUMN IF NOT EXISTS apellido VARCHAR(100),
            ADD COLUMN IF NOT EXISTS edad INTEGER,
            ADD COLUMN IF NOT EXISTS telefono VARCHAR(8);
        `;
        await pool.query(sql);
        res.json({ mensaje: ">> ESTRUCTURA_ACTUALIZADA: Columnas añadidas con éxito en Azure." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});