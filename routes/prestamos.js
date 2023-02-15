var express = require('express');
var mongoose = require('mongoose');
mongoose.connection;
var router = express.Router();

//modelos
var Libro = require('../models/Libro.js');
var Prestamo = require('../models/Prestamo.js');
var User = require('../models/Usuario.js');

// GET del listado de prestamos ordenados por fecha de publicación -- FUNCIONA
router.get('/', (req, res, next) => {
    Prestamo.find()
    .sort('-fechaRetirada')
    .populate(
        [{
            path: 'usuarioID',
            model: 'User',
            select: '-_id username' //Fields you want to return in this populate
        }, {
            path: 'libroID',
            model: 'Libro',
            select: '-_id titulo' //Fields you want to return in this populate
        }]
    )
    .exec(function(err, prestamos) {
        if (err) res.status(500).send(err);
        else res.status(200).json(prestamos);
    });
});

// GET de todos los prestamos de un usuario dado (identificado por su Id)  --- FUNCIONA
router.get('/all/:idUser', function(req, res, next) {
    Prestamo.find({ 'usuarioID':req.params.idUser})
    .populate(
        [{
            path: 'usuarioID',
            model: 'User',
            select: '-_id username' 
        },{
            path: 'libroID',
            model: 'Libro',
            select: '-_id titulo'
        }]
    )
    .exec(function(err, prestamos){
        if (err) res.status(500).send(err);
        else res.status(200).json(prestamos);
    });
});

// GET de todos los prestamos de un libro dado (identificado por su Id) --- FUNCIONA
router.get('/alls/:idLibro', function(req, res, next) {
    //¿como poner find si esta dentro de un array?
    console.log(req.params.idLibro)
    Prestamo.find({ 'libroID': req.params.idLibro}).sort('-fechaDevolucion')
    .populate(
        [{
            path: 'usuarioID',
            model: 'User',
            select: '-_id username' //Fields you want to return in this populate
        }, {
            path: 'libroID',
            model: 'Libro',
            select: '-_id titulo' //Fields you want to return in this populate
        }]
    )
    .exec(function(err, prestamos){
        console.log(prestamos)
        if (err) res.status(500).send(err);
        else res.status(200).json(prestamos);
    });
});

//GET prestamos dependiendo del estado pasando por url el parámetro
//usando querystrings: prestamos?estado=status
router.get('/', (req, res) => {
    let status = req.query.estado;
    console.log(status);
    Prestamo.find({estado:status},function(err,prestamos){
        console.log(prestamos);
        if(err)res.status(500).send(err);
        console.log(prestamos);
        if(prestamos != null){
            res.status(200).json(prestamos);
        } else {
            res.status(404).send(err)
        }
    })
})

// POST de un nuevo prestamo -- FUNCIONA
router.post('/', function(req, res, next) {
    //comprobamos que el usuario existe
    User.findById(req.body.usuarioID, function(err, userinfo) {
        if (err) res.status(500).send(err);
        else {
            Libro.findById(req.body.libroID, function(err, libroinfo){
                if(err) res.status(500).setDefaultEncoding(err);
                else{
                    // let prestamo = new Prestamo({
                    //     fechaRetirada: req.body.fechaRetirada,
                    //     fechaDevolucion: req.body.fechaDevolucion,
                    //     estado: req.body.estado,
                    //     observaciones: req.body.observaciones,
                    //     libroID: req.body.libroID,
                    //     usuarioID: req.body.usuarioID
                    // })
                    // salvar el post en las colecciones users y prestamos y libros
                    Prestamo.create(req.body, function(err, prestamoinfo) {
                        if (err) res.status(500).send(err);
                        else res.sendStatus(200);
                    });
                    
                }
            })
        }
    });
});

// PUT: actualización de un prestamo existente (identificado por su Id) -- FUNCIONA
router.put('/:id', function(req, res, next) {
    Prestamo.findByIdAndUpdate(req.params.id,req.body, function(err,  prestamoinfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

// DELETE de un prestamo existente (identificado por su Id) -- FUNCIONA
router.delete('/:id', function(req, res, next) {
    Prestamo.findByIdAndDelete(req.params.id, function(err, prestamoinfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

module.exports = router;