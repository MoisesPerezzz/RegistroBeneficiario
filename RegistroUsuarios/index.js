// Importar dependencias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json()); // Permite que Express maneje datos JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Configuración de la conexión a MySQL
const conexion = mysql.createConnection({
    host: '127.0.0.1',    
     port: 3306,        // Cambia si usas otro host
    user: 'root',     // Tu usuario de MySQL (ejemplo: 'root')
    password: 'root', // Tu contraseña de MySQL
    database: 'usuarios'  // Nombre de tu base de datos
});

// Conectarse a MySQL
conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL: ', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});


app.post('/registro', (req, res) => {
    const { correo, contraseña } = req.body;

    // Log de los datos recibidos
    console.log('Datos recibidos:', req.body);

    // Validar que el correo y la contraseña no estén vacíos
    if (!correo || !contraseña) {
        console.log('Error: Correo o contraseña vacíos');
        return res.status(400).send('Correo y contraseña son obligatorios');
    }

    // Validar que el correo tenga el formato correcto
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        console.log('Error: Formato del correo no válido');
        return res.status(400).send('El formato del correo no es válido');
    }

    // Validación de la contraseña
    const erroresContraseña = [];
    if (contraseña.length < 8) {
        erroresContraseña.push('La contraseña debe tener al menos 8 caracteres.');
    }
    if (!/[A-Z]/.test(contraseña)) {
        erroresContraseña.push('La contraseña debe tener al menos una letra mayúscula.');
    }
    if (!/[a-z]/.test(contraseña)) {
        erroresContraseña.push('La contraseña debe tener al menos una letra minúscula.');
    }
    if (!/\d/.test(contraseña)) {
        erroresContraseña.push('La contraseña debe tener al menos un número.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(contraseña)) {
        erroresContraseña.push('La contraseña debe tener al menos un carácter especial.');
    }

    // Si hay errores en la validación de la contraseña, devolver el mensaje con todos los errores
    if (erroresContraseña.length > 0) {
        console.log('Error: Problemas en la validación de la contraseña');
        return res.status(400).send(erroresContraseña.join(' '));
    }

    // Consulta SQL para insertar los datos en la tabla 'beneficiario'
    const consulta = 'INSERT INTO beneficiario (correo, contraseña) VALUES (?, ?)';

    // Ejecutar la consulta
    conexion.query(consulta, [correo, contraseña], (err, result) => {
        if (err) {
            console.error('Error al insertar los datos: ', err);
            res.status(500).send('Error al registrar el usuario');
            return;
        }

        res.send('Usuario registrado con éxito');
    });
});


// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;

    // Log de los datos recibidos
    console.log('Datos de login recibidos:', req.body);

    // Validar que el correo y la contraseña no estén vacíos
    if (!correo || !contraseña) {
        console.log('Error: Correo o contraseña vacíos');
        return res.status(400).send('Usuario no encontrado, verifique sus datos');
    }

    // Validación del formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        console.log('Error: Formato de correo no válido');
        return res.status(400).send('Usuario no encontrado, verifique sus datos');
    }

    // Consulta SQL para buscar al usuario por correo
    const consulta = 'SELECT * FROM beneficiario WHERE correo = ?';

    // Ejecutar la consulta
    conexion.query(consulta, [correo], (err, result) => {
        if (err) {
            console.error('Error al consultar el usuario: ', err);
            return res.status(500).send('Error al iniciar sesión');
        }

        // Si el usuario no existe o la contraseña no coincide, mostrar mensaje genérico
        if (result.length === 0 || result[0].contraseña !== contraseña) {
            console.log('Error: Usuario o contraseña incorrectos');
            return res.status(401).send('Usuario no encontrado, verifique sus datos');
        }

        console.log('Inicio de sesión exitoso para:', correo);
        res.send('Inicio de sesión exitoso');
    });
});




app.post('/guardar-ninos', (req, res) => {
    const {
        id_beneficiario,
        nombre,
        apellido_paterno,
        apellido_materno,
        edad,
        sexo,
        fecha_nacimiento,
        curp,
        domicilio_calle_numero,
        colonia,
        municipio,
        estado,
        codigo_postal,
        referencia,
        nivel_estudios,
        telefono_fijo,
        telefono_fijo_extra,
        telefono_movil,
        telefono_movil_extra,
        servicios_vivienda,
        servicios_comunitarios,
        antecedentes_patologicos,
        servicios_salud,
        comprobante_domicilio,
        curp_documento,
        documento_identidad,
        informe_medico,
        historial_medico,
        certificados_tratamientos_paliativos,
        declaracion_impuestos,
        comprobante_ingresos,
        carta_antecedentes_no_penales,
        referencias_personales_profesionales,
        foto_perfil,
        descripcion_apoyo
    } = req.body;

    const sql = `INSERT INTO niños_etapa_terminal (
        id_beneficiario,
        nombre,
        apellido_paterno,
        apellido_materno,
        edad,
        sexo,
        fecha_nacimiento,
        curp,
        domicilio_calle_numero,
        colonia,
        municipio,
        estado,
        codigo_postal,
        referencia,
        nivel_estudios,
        telefono_fijo,
        telefono_fijo_extra,
        telefono_movil,
        telefono_movil_extra,
        servicios_vivienda,
        servicios_comunitarios,
        antecedentes_patologicos,
        servicios_salud,
        comprobante_domicilio,
        curp_documento,
        documento_identidad,
        informe_medico,
        historial_medico,
        certificados_tratamientos_paliativos,
        declaracion_impuestos,
        comprobante_ingresos,
        carta_antecedentes_no_penales,
        referencias_personales_profesionales,
        foto_perfil,
        descripcion_apoyo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        id_beneficiario,
        nombre,
        apellido_paterno,
        apellido_materno,
        edad,
        sexo,
        fecha_nacimiento,
        curp,
        domicilio_calle_numero,
        colonia,
        municipio,
        estado,
        codigo_postal,
        referencia,
        nivel_estudios,
        telefono_fijo,
        telefono_fijo_extra,
        telefono_movil,
        telefono_movil_extra,
        JSON.stringify(servicios_vivienda),
        JSON.stringify(servicios_comunitarios),
        JSON.stringify(antecedentes_patologicos),
        JSON.stringify(servicios_salud),
        comprobante_domicilio,
        curp_documento,
        documento_identidad,
        informe_medico,
        historial_medico,
        certificados_tratamientos_paliativos,
        declaracion_impuestos,
        comprobante_ingresos,
        carta_antecedentes_no_penales,
        referencias_personales_profesionales,
        foto_perfil,
        descripcion_apoyo
    ];

    conexion.query(sql, values, (error, result) => {
        if (error) {
            console.error("Error al guardar los datos:", error);
            return res.status(500).json({ error: "Error al guardar los datos" });
        }
        res.status(201).json({ message: "Datos guardados correctamente" });
    });
});








// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});

