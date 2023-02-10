const mongoose = require('mongoose');
var Usuario = require('./Usuario');
var Libro = require('./Libro');

const ReservasSchema = new mongoose.Schema({
    idReserva: {
        type: String,
        required: true,
        unique: true
    },
    realización: {
        type: Date,
        required: true
    },
    disponibilidad: {
        type: Boolean,
        required: true
    },
    observaciones: {
        type: String
    },
    idLibro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Libro',
        default: null
    },
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    }
})

module.exports = mongoose.model('Reservas', ReservasSchema);
