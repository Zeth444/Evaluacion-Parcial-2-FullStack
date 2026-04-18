const authService = require('../services/auth.service');

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Validación 1: Campos obligatorios
        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        const usuario = await authService.validarLogin(correo, password);

        // Validación 2: Credenciales incorrectas
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // Si es exitoso, enviamos status 200 y el ID
        res.status(200).json({ 
            mensaje: 'Login exitoso',
            usuarioId: usuario.id 
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const register = async (req, res) => {
    try {
        const { correo, password } = req.body;
        const nuevoUsuario = await authService.registrarUsuario(correo, password);
        res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar, revisa si el correo ya existe' });
    }
};

module.exports = {
    login,
    register
};