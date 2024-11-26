const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();
const puerto = 3005;
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

const EsquemaMultimedia = new mongoose.Schema({
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tipoArchivo: {
        type: String,
        required: true,
        enum: ['imagen', 'video']
    },
    url: {
        type: String,
        required: true
    },
    descripcion: String,
    ubicacion: String,
    etiquetas: [String],
    fechaSubida: {
        type: Date,
        default: Date.now
    }
});

const Multimedia = mongoose.model('Multimedia', EsquemaMultimedia);

// Obtener todos los archivos multimedia
app.get('/multimedia', async (req, res) => {
    try {
        const datosMultimedia = await Multimedia.find();
        res.json(datosMultimedia);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los archivos multimedia " + error.message });
    }
});

// Obtener archivo multimedia por ID
app.get('/multimedia/:id', async (req, res) => {
    try {
        const multimedia = await Multimedia.findById(req.params.id);
        if (!multimedia) {
            return res.status(404).json({ mensaje: "El archivo multimedia no existe" });
        }
        res.json(multimedia);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar el archivo multimedia " + error.message });
    }
});

// Crear nuevo archivo multimedia
app.post('/multimedia', async (req, res) => {
    const nuevoMultimedia = new Multimedia(req.body);
    try {
        const multimediaGuardado = await nuevoMultimedia.save();
        res.status(201).json(multimediaGuardado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el archivo multimedia " + error.message });
    }
});

// Actualizar archivo multimedia
app.put('/multimedia/:id', async (req, res) => {
    try {
        const multimediaActualizado = await Multimedia.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!multimediaActualizado) {
            return res.status(404).json({ mensaje: "El archivo multimedia no existe" });
        }
        res.json(multimediaActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el archivo multimedia " + error.message });
    }
});

// Eliminar archivo multimedia
app.delete('/multimedia/:id', async (req, res) => {
    try {
        const multimediaEliminado = await Multimedia.findByIdAndDelete(req.params.id);
        if (!multimediaEliminado) {
            return res.status(404).json({ mensaje: "El archivo multimedia no existe" });
        }
        res.json({ mensaje: "Archivo multimedia eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el archivo multimedia " + error.message });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor se esta ejecutando... ${nombreHost}:${puerto}`);
});