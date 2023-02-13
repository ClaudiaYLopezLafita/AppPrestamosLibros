const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    titulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        enum: ['realismo', 'terror', 'teatro', 'drama', 'sci-fi', 'histórica', 'aventuras', 'fantasía', 'relatos', 'filosofía', 'amor']
    },
    editorial: {
        type: String
    },
    anioPublicacion: {
        type: Date
    },
    codigoBarra: {
        type: String
    },
    estado: {
        type: String,
        enum: ['Disponible', 'No disponible'],
        default: 'Disponible'
    }
});

module.exports = mongoose.model('Libro', LibroSchema);