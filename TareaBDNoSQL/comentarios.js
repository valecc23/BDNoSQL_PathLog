const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();
const puerto = 3007;
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

const EsquemaComentarios = new mongoose.Schema({
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idPublicacion: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fechaComentario: {
        type: Date,
        default: Date.now
    }
});

const Comentarios = mongoose.model('Comentarios', EsquemaComentarios);

// Obtener todos los comentarios
app.get('/comentarios', async (req, res) => {
    try {
        const datosComentarios = await Comentarios.find();
        res.json(datosComentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los comentarios " + error.message });
    }
});

// Obtener comentario por ID
app.get('/comentarios/:id', async (req, res) => {
    try {
        const comentario = await Comentarios.findById(req.params.id);
        if (!comentario) {
            return res.status(404).json({ mensaje: "El comentario no existe" });
        }
        res.json(comentario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar el comentario " + error.message });
    }
});

// Crear nuevo comentario
app.post('/comentarios', async (req, res) => {
    const nuevoComentario = new Comentarios(req.body);
    try {
        const comentarioGuardado = await nuevoComentario.save();
        res.status(201).json(comentarioGuardado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el comentario " + error.message });
    }
});

// Actualizar comentario
app.put('/comentarios/:id', async (req, res) => {
    try {
        const comentarioActualizado = await Comentarios.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!comentarioActualizado) {
            return res.status(404).json({ mensaje: "El comentario no existe" });
        }
        res.json(comentarioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el comentario " + error.message });
    }
});

// Eliminar comentario
app.delete('/comentarios/:id', async (req, res) => {
    try {
        const comentarioEliminado = await Comentarios.findByIdAndDelete(req.params.id);
        if (!comentarioEliminado) {
            return res.status(404).json({ mensaje: "El comentario no existe" });
        }
        res.json({ mensaje: "Comentario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el comentario " + error.message });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor se esta ejecutando... ${nombreHost}:${puerto}`);
});