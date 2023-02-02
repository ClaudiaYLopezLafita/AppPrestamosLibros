const mongoose = require('mongoose');

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
            type: Schema.ObjectId,
            ref: 'Libro',
            default: null
    }],
    usuarioID:[{
        type: Schema.ObjectId,
        ref: 'Usuario',
        default: null
    }]
})

module.exports = mongoose.model('Prestamo', PrestamoSchema);
