const Libro = require('../models/Libro');

const getAllLibros = (req, res) => {
    // Búsqueda por ISBN, titulo y autor
    const { isbn, titulo, autor } = req.query;
    const query = {};

    if (isbn) query.isbn = isbn;
    if (titulo) query.titulo = titulo;
    if (autor) query.autor = autor;

    Libro.find(query).exec()
        .then(libros => res.status(200).json(libros))
        .catch(err => res.status(500).json({ message: err }))
}

const getLibro = (req, res) => {
    const libroId = req.params.id;
    Libro.findById(libroId).exec()
        .then(libro => {
            if (libro == null) return res.status(404).json({ message: 'Libro no encontrado' });
            res.status(200).json(libro)
        })
        .catch(err => res.status(500).json({ message: err }))
}

const createLibro = (req, res) => {
    const libro = req.body;
    Libro.create(libro)
        .then(() => res.status(201).json({ message: 'Libro añadido satisfactoriamente' }))
        .catch(err => {
            if (err.code == 11000) return res.status(401).json({ message: 'El ISBN introducido ya existe' });
            res.status(500).json({ message: err });
        })
}

const updateLibro = (req, res) => {
    const libro = req.body;
    const libroId = req.params.id;
    Libro.findByIdAndUpdate(libroId).exec()
        .then(libroOld => res.status(200).json({ libroOld, libro }))
        .catch(err => res.status(500).json({ message: err }))
}

const deleteLibro = (req, res) => {
    const libroId = req.params.id;
    Libro.findByIdAndDelete(libroId).exec()
        .then(libro => {
            if (libro == null) return res.status(404).json({ message: 'Libro no encontrado' });
            res.status(200).json({ message: 'Success', libro })
        })
        .catch(err => res.status(500).json({ message: err }))
}

module.exports = { getAllLibros, getLibro, createLibro, updateLibro, deleteLibro }