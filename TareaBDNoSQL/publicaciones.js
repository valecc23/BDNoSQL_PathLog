const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();
const puerto = 3004;
const nombreHost = 'http://localhost';

app.use(express.json());

console.log("Inicia Mongo Nube");
const urlNube = "mongodb+srv://valecblanco23:ProyectoFinal299@pathlog.piyhz.mongodb.net/pathlog?retryWrites=true&w=majority";

mongoose.connect(urlNube, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Base de datos en la nube activa...'))
.catch((error) => console.log('Error: ' + error));

const EsquemaPublicaciones = new mongoose.Schema({
    idViaje: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    ubicacion: String,
    etiquetas: [String],
    fechaPublicacion: {
        type: Date,
        default: Date.now
    }
});

const Publicaciones = mongoose.model('Publicaciones', EsquemaPublicaciones);

// Obtener todas las publicaciones
app.get('/publicaciones', async (req, res) => {
    try {
        const datosPublicaciones = await Publicaciones.find();
        res.json(datosPublicaciones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las publicaciones " + error.message });
    }
});

// Obtener publicación por ID
app.get('/publicaciones/:id', async (req, res) => {
    try {
        const publicacion = await Publicaciones.findById(req.params.id);
        if (!publicacion) {
            return res.status(404).json({ mensaje: "La publicación no existe" });
        }
        res.json(publicacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar la publicación " + error.message });
    }
});

// Crear nueva publicación
app.post('/publicaciones', async (req, res) => {
    const nuevaPublicacion = new Publicaciones(req.body);
    try {
        const publicacionGuardada = await nuevaPublicacion.save();
        res.status(201).json(publicacionGuardada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la publicación " + error.message });
    }
});

// Actualizar publicación
app.put('/publicaciones/:id', async (req, res) => {
    try {
        const publicacionActualizada = await Publicaciones.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!publicacionActualizada) {
            return res.status(404).json({ mensaje: "La publicación no existe" });
        }
        res.json(publicacionActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la publicación " + error.message });
    }
});

// Eliminar publicación
app.delete('/publicaciones/:id', async (req, res) => {
    try {
        const publicacionEliminada = await Publicaciones.findByIdAndDelete(req.params.id);
        if (!publicacionEliminada) {
            return res.status(404).json({ mensaje: "La publicación no existe" });
        }
        res.json({ mensaje: "Publicación eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la publicación " + error.message });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor se esta ejecutando... ${nombreHost}:${puerto}`);
});