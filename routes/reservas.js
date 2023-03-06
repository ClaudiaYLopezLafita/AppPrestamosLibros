var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Libro = require('../models/Libro');
var Reserva = require('../models/Reserva');
var User = require('../models/Usuario');

const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    Reserva.find().exec()
        .then(reservas => res.status(200).json(reservas))
        .catch(err => res.status(500).json({ message: err }))
});

router.get('/:id', (req, res) => {
    const reservaID = req.params.id;
    Reserva.findById(reservaID).exec()
        .then(reserva => {
            if (reserva == null) return res.status(404).json({ message: 'Reserva no encontrada' });
            res.status(200).json(reserva)
        })
        
        .catch(err => res.status(500).json({ message: err }))
});

router.post('/', 
    body('realización').notEmpty().isDate(),
    body('disponibilidad').notEmpty(),
    body('observaciones').optional(),
    body('nombre').optional(),
    body('idLibro').isMongoId().exists(),
    body('idUsuario').isMongoId().exists(),
    (req, res) => {
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    Reserva.create(req.body)
    .then(reserva => {
        console.log(res);
        res.status(201).json({ message: `Reserva añadida satisfactoriamente` })
    })
    .catch(err => {
        //if (err.code == 11000) return res.status(401).json({ message: 'El id introducido ya existe' });
        res.status(500).json({ message: err });
    })
});
router.put('/:id', (req, res) => {
    const newReserva = req.body;
    const reservaId = req.params.id;
    Reserva.findByIdAndUpdate(reservaId, newReserva).exec()
        .then(oldReserva => res.status(200).json({ oldReserva, newReserva }))
        .catch(err => res.status(500).json({ message: err }))
});
router.delete('/:id', (req, res) => {
    const reservaId = req.params.id;
    Reserva.findByIdAndDelete(reservaId).exec()
        .then(reserva => {
            if (reserva == null) return res.status(404).json({ message: 'Reserva no encontrada' });
            res.status(200).json({ message: `Reserva eliminada satisfactoriamente` })
        })
        .catch(err => res.status(500).json({ message: err }))
});

module.exports = router;