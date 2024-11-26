const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();
const puerto = 3003;
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

const EsquemaViajes = new mongoose.Schema({
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: String,
    fechaInicio: Date,
    fechaFin: Date,
    ubicacion: String,
    etiquetas: [String],
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Viajes = mongoose.model('Viajes', EsquemaViajes);

// Obtener todos los viajes
app.get('/viajes', async (req, res) => {
    try {
        const datosViajes = await Viajes.find();
        res.json(datosViajes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los viajes " + error.message });
    }
});

// Obtener viaje por ID
app.get('/viajes/:id', async (req, res) => {
    try {
        const viaje = await Viajes.findById(req.params.id);
        if (!viaje) {
            return res.status(404).json({ mensaje: "El viaje no existe" });
        }
        res.json(viaje);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar el viaje " + error.message });
    }
});

// Crear nuevo viaje
app.post('/viajes', async (req, res) => {
    const nuevoViaje = new Viajes(req.body);
    try {
        const viajeGuardado = await nuevoViaje.save();
        res.status(201).json(viajeGuardado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el viaje " + error.message });
    }
});

// Actualizar viaje
app.put('/viajes/:id', async (req, res) => {
    try {
        const viajeActualizado = await Viajes.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!viajeActualizado) {
            return res.status(404).json({ mensaje: "El viaje no existe" });
        }
        res.json(viajeActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el viaje " + error.message });
    }
});

// Eliminar viaje
app.delete('/viajes/:id', async (req, res) => {
    try {
        const viajeEliminado = await Viajes.findByIdAndDelete(req.params.id);
        if (!viajeEliminado) {
            return res.status(404).json({ mensaje: "El viaje no existe" });
        }
        res.json({ mensaje: "Viaje eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el viaje " + error.message });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor se esta ejecutando... ${nombreHost}:${puerto}`);
});