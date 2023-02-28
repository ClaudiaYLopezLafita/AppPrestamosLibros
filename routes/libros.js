const express = require('express');
const router = express.Router();
const Libro = require('../models/Libro');
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    // Búsqueda por ISBN, titulo y autor
    const { isbn, titulo, autor } = req.query;
    const query = {};

    if (isbn) query.isbn = isbn;
    if (titulo) query.titulo = titulo;
    if (autor) query.autor = autor;

    Libro.find(query).exec()
        .then(libros => res.status(200).json(libros))
        .catch(err => res.status(500).json({ message: err }))
});

router.get('/:id', (req, res) => {
    const libroId = req.params.id;
    Libro.findById(libroId).exec()
        .then(libro => {
            if (libro == null) return res.status(404).json({ message: 'Libro no encontrado' });
            res.status(200).json(libro)
        })
        .catch(err => res.status(500).json({ message: err }))
});

router.post('/',
    body('isbn').isISBN(),
    body('titulo').notEmpty(),
    body('autor').notEmpty(),
    body('anioPublicacion').optional().isDate(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        Libro.create(req.body)
            .then(libro => {
                console.log(res);
                res.status(201).json({ message: `Libro ${libro.titulo} añadido satisfactoriamente` })
            })
            .catch(err => {
                if (err.code == 11000) return res.status(401).json({ message: 'El ISBN introducido ya existe' });
                res.status(500).json({ message: err });
            })
    });

router.put('/:id', (req, res) => {
    const libroNew = req.body;
    const libroId = req.params.id;
    Libro.findByIdAndUpdate(libroId, libroNew).exec()
        .then(libroOld => res.status(200).json({ libroOld, libroNew }))
        .catch(err => res.status(500).json({ message: err }))
});

router.delete('/:id', (req, res) => {
    const libroId = req.params.id;
    Libro.findByIdAndDelete(libroId).exec()
        .then(libro => {
            if (libro == null) return res.status(404).json({ message: 'Libro no encontrado' });
            res.status(200).json({ message: `Libro ${libro.titulo} eliminado satisfactoriamente` })
        })
        .catch(err => res.status(500).json({ message: err }))
});

module.exports = router;