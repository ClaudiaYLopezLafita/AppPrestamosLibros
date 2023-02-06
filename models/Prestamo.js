const mongoose = require('mongoose');
var Usuario = require('./Usuario');
var Libro = require('./Libro');

const PrestamoSchema = new mongoose.Schema({
    fechaRetirada:{
        type: Date,
        default: Date.now,
        required: true
    },
    fechaDevolucion:{
        type: Date,
        default: Date.now,
        required: true
    },
    observaciones:{
        type: String,
    },
    libroID:[{
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Libro',
            default: null
    }],
    usuarioID:[{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    }]
})

module.exports = mongoose.model('Prestamo', PrestamoSchema);
