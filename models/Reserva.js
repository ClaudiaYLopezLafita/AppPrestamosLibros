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
