const mongoose = require('mongoose');
var Usuario = require('./Usuario');
var Libro = require('./Libro');

const ReservasSchema = new mongoose.Schema({
    realización: {
        type: Date,
        default: Date.now,
        required: true
    },
    disponibilidad: {
        type: Boolean,
        required: true
    },
    observaciones: {
        type: String
    },
    nombre: {
        type: String
    },
    idLibro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Libro',
        required: true
    },
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

module.exports = mongoose.model('Reservas', ReservasSchema);
