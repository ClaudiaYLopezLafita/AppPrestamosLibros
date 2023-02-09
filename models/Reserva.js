const mongoose = require('mongoose');

const reservas = new mongoose.Schema({
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
        ref: 'libro'
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'libro'
    }
})

module.exports = mongoose.model('Reservas', reservas);
