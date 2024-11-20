
const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();



const puerto = 3002;
const nombreHost = 'http://localhost';

app.use(express.json());

console.log("Inicia Mongo Nube");
const urlNube = "mongodb+srv://valecblanco23:ProyectoFinal299@pathlog.piyhz.mongodb.net/pathlog?retryWrites=true&w=majority";

mongoose.connect(urlNube,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).
then(() => console.log('Base de datos en la nube activa...'))
.catch((error) => console.log('Error: ' + error));
console.log("Fin Mongo Nube");


const EsquemaUsuarios = new mongoose.Schema(
    {
        id: Number,
        nombreUsuario: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true
        },
        contrasena: {
            type: String,
            required: true
        },
        nombreCompleto: String,
        biografia: String,
        fechaCreacion: {
            type: Date,
            default: Date.now
        }
    }
);

const Usuarios = mongoose.model('Usuarios', EsquemaUsuarios);

///obtener todos 
app.get('/usuarios', async (req, res) =>{
    try{
        const datosUsuarios = await Usuarios.find({}, '-contrasena');
        res.json(datosUsuarios);
    }catch(error){
        res.status(500).json({mensaje: "Error al obtener los datos " + error.message});
    }
}); 

//2-obtener por id
app.get('/usuarios/:id', async (req, res) =>{
    try {
        const usuario = await Usuarios.findById(req.params.id, '-contrasena');
        if (!usuario) {
            return res.status(404).json({mensaje: "El usuario no existe"});
        }
        res.json(usuario);
    } catch(error) {
        res.status(500).json({mensaje: "Error al buscar el usuario " + error.message});
    }
}); 

//3-post
app.post('/usuarios', async (req, res) =>{
    const {                   
        id,
        nombreUsuario,
        correo,
        contrasena,
        nombreCompleto,
        biografia
    } = req.body;

  
    const nuevoUsuario = new Usuarios({                   
        id,
        nombreUsuario,
        correo,
        contrasena,
        nombreCompleto,
        biografia
    });     
    
    try{
        const usuarioGuardado = await nuevoUsuario.save();
        const respuestaUsuario = { ...usuarioGuardado._doc };
        delete respuestaUsuario.contrasena;
        res.status(201).json(respuestaUsuario);
    }catch(error){
        res.status(500).json({mensaje: "Error al crear el usuario " + error.message});
    }
}); 

//4-put 
app.put('/usuarios/:id', async (req, res) =>{
    try {
        const usuarioActualizado = await Usuarios.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, select: '-contrasena' }
        );
        
        if (!usuarioActualizado) {
            return res.status(404).json({mensaje: "El usuario no existe"});
        }
        res.json(usuarioActualizado);
    } catch(error) {
        res.status(500).json({mensaje: "Error al actualizar el usuario " + error.message});
    }
}); 

//5-eliminar 
app.delete('/usuarios/:id', async (req, res) =>{
    try {
        const usuarioEliminado = await Usuarios.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({mensaje: "El usuario no existe"});
        }
        res.json({mensaje: "Usuario eliminado exitosamente"});
    } catch(error) {
        res.status(500).json({mensaje: "Error al eliminar el usuario " + error.message});
    }
}); 



app.listen(puerto,
    ()=>{
        console.log(`El servidor se esta ejecutando... ${nombreHost}:${puerto}`);
    }
);