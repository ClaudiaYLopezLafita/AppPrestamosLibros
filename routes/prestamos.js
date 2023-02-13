var express = require('express');
var mongoose = require('mongoose');
mongoose.connection;
var router = express.Router();

//modelos
var Libro = require('../models/Libro.js');
var Prestamo = require('../models/Prestamo.js');
var User = require('../models/Usuario.js');

// GET del listado de prestamos ordenados por fecha de publicación
// mostramos el nombre del usuario y libro
router.get('/', (req, res, next) => {
    Prestamo.find()
    .sort('-fechaRetirada')
    .populate('usuarioID',{_id:0,username:1}).populate('libroID',{_id:0,titulo:1})
    .exec(function(err, prestamos) {
        if (err) res.status(500).send(err);
        else res.status(200).json(prestamos);
    });
});

// GET de todos los prestamos de un usuario dado (identificado por su Id)  .sort('-fechaRetirada')
router.get('/all/:id', function(req, res, next) {
    console.log(req.params.id)
    Prestamo.find({ 'usuarioID':req.params.id})
    .populate('usuarioID',{_id:0,username:1})
    .populate('libroID',{_id:0,titulo:1})
    .exec(function(err, prestamos){
        console.log(prestamos)
        if (err) res.status(500).send(err);
        else res.status(200).json(prestamos);
    });
});

// GET de todos los prestamos de un libro dado (identificado por su Id)
router.get('/all/:id', function(req, res, next) {
    Prestamo.find({ 'libroID': req.params.id}).sort('-fechaRetirada')
    .populate('libroID',{_id:0,titulo:1})
    .populate('usuarioID',{_id:0,fullname:1})
    .exec(function(err, posts){
        if (err) res.status(500).send(err);
        else res.status(200).json(posts);
    });
});

//GET prestamos dependiendo del estado pasando por url el parámetro
//usando querystrings
router.get('/', function(req, res, next){
    let estado = req.params.estado;
    console.log(estado);
    Prestamo.find({'estado':estado}).exec()
        .then(prestamos => res.status(200).json(prestamos))
        .catch(err => res.status(500).json({ message: err }))
})

// POST de un nuevo prestamo
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

// PUT: actualización de un prestamo existente (identificado por su Id)
router.put('/:id', function(req, res, next) {
    Prestamo.findByIdAndUpdate(req.params.id,req.body, function(err,  prestamoinfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

// DELETE de un prestamo existente (identificado por su Id)
router.delete('/:id', function(req, res, next) {
    Prestamo.findByIdAndDelete(req.params.id, function(err, prestamoinfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

module.exports = router;