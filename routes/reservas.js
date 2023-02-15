var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Libro = require('../models/Libro');
var Reserva = require('../models/Reserva');
var User = require('../models/Usuario');

router.get('/', (req, res) => {
    const { idReserva, realización, disponibilidad } = req.query;
    const query = {};

    if (idReserva) query.idReserva = idReserva;
    if (realización) query.realización = realización;
    if (disponibilidad) query.disponibilidad = disponibilidad;

    Reserva.find(query).exec()
        .then(reservas => res.status(200).json(reservas))
        .catch(err => res.status(500).json({ message: err }))
});
router.get('/:id', (req, res) => {
    const reservaId = req.params.id;
    Reserva.findById(reservaId).exec()
        .then(reserva => {
            if (reserva == null) return res.status(404).json({ message: 'Reserva no encontrada' });
            res.status(200).json(reserva)
        })
        .catch(err => res.status(500).json({ message: err }))
});
router.post('/', (req, res) => {
    Reserva.create(req.body)
    .then(reserva => {
        console.log(res);
        res.status(201).json({ message: `Reserva ${reserva.idReserva} añadida satisfactoriamente` })
    })
    .catch(err => {
        if (err.code == 11000) return res.status(401).json({ message: 'El id introducido ya existe' });
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
            res.status(200).json({ message: `Reserva ${reserva.idReserva} eliminada satisfactoriamente` })
        })
        .catch(err => res.status(500).json({ message: err }))
});

module.exports = router;
