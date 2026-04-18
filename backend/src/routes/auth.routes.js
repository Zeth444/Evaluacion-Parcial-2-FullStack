const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt'); 

// 1. RUTA DE REGISTRO (La que perdimos y acabamos de recuperar)
router.post('/register', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await pool.query('INSERT INTO usuarios (correo, password) VALUES ($1, $2)', [correo, hash]);
        res.status(201).json({ mensaje: "Usuario creado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al registrar" });
    }
});

// 2. RUTA DE LOGIN (La puerta de entrada)
router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (user.rows.length === 0) return res.status(401).json({ mensaje: "Credenciales incorrectas" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ mensaje: "Credenciales incorrectas" });

        res.json({ id: user.rows[0].id, mensaje: "Login exitoso" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 3. RUTA DE ACTUALIZAR PERFIL (La conexión final del examen)
router.put('/update-perfil/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, telefono } = req.body;
    try {
        await pool.query(
            'UPDATE usuarios SET nombre = $1, apellido = $2, edad = $3, telefono = $4 WHERE id = $5',
            [nombre, apellido, parseInt(edad), telefono, id]
        );
        res.json({ mensaje: '>> DATOS_ACTUALIZADOS_CON_ÉXITO' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: '>> ERROR_EN_EL_SISTEMA' });
    }
});

module.exports = router;