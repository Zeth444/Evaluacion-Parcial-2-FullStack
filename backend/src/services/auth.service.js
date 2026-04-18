const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Función extra para registrar un usuario y poder probar el login
const registrarUsuario = async (correo, password) => {
    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(password, saltRounds);
    
    // Consulta parametrizada
    const query = 'INSERT INTO usuarios (correo, password) VALUES ($1, $2) RETURNING id, correo';
    const values = [correo, passwordEncriptada];
    
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Función principal del Login
const validarLogin = async (correo, password) => {
    // 1. Buscar si el correo existe
    const query = 'SELECT * FROM usuarios WHERE correo = $1';
    const result = await pool.query(query, [correo]);
    
    if (result.rows.length === 0) {
        return null; // El correo no existe
    }

    const usuario = result.rows[0];

    // 2. Comparar la contraseña ingresada con la encriptada en la BD
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
        return null;
    }

    return usuario;
};

module.exports = {
    registrarUsuario,
    validarLogin
};