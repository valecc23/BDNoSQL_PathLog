const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();
const puerto = 3006;
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

const EsquemaWishlist = new mongoose.Schema({
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: String,
    ubicacionDeseada: {
        type: String,
        required: true
    },
    etiquetas: [String],
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Wishlist = mongoose.model('Wishlist', EsquemaWishlist);

// Obtener todas las wishlists
app.get('/wishlist', async (req, res) => {
    try {
        const datosWishlist = await Wishlist.find();
        res.json(datosWishlist);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las wishlists " + error.message });
    }
});

// Obtener wishlist por ID
app.get('/wishlist/:id', async (req, res) => {
    try {
        const wishlist = await Wishlist.findById(req.params.id);
        if (!wishlist) {
            return res.status(404).json({ mensaje: "La wishlist no existe" });
        }
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar la wishlist " + error.message });
    }
});

// Crear nueva wishlist
app.post('/wishlist', async (req, res) => {
    const nuevaWishlist = new Wishlist(req.body);
    try {
        const wishlistGuardada = await nuevaWishlist.save();
        res.status(201).json(wishlistGuardada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la wishlist " + error.message });
    }
});

// Actualizar wishlist
app.put('/wishlist/:id', async (req, res) => {
    try {
        const wishlistActualizada = await Wishlist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!wishlistActualizada) {
            return res.status(404).json({ mensaje: "La wishlist no existe" });
        }
        res.json(wishlistActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la wishlist " + error.message });
    }
});

// Eliminar wishlist
app.delete('/wishlist/:id', async (req, res) => {
    try {
        const wishlistEliminada = await Wishlist.findByIdAndDelete(req.params.id);
        if (!wishlistEliminada) {
            return res.status(404).json({ mensaje: "La wishlist no existe" });
        }
        res.json({ mensaje: "Wishlist eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la wishlist " + error.message });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor se esta ejecutando... ${nombreHost}:${puerto}`);
});