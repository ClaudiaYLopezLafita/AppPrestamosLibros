var express = require('express');
var mongoose = require('mongoose');
mongoose.connection;
var router = express.Router();

//modelos
var Libro = require('../models/Libro.js');
var Sancion = require('../models/Sancion.js');
var User = require('../models/Usuario.js');

// GET del listado de sanciones ordenadas por fecha de publicación
// mostramos el nombre del usuario y libro
router.get('/', (req, res, next) => {
    Sancion.find()
    .sort('-f_inicio')
    .populate('usuarioID',{_id:0,username:1}).populate('libroID',{_id:0,titulo:1})
    .exec(function(err, sanciones) {
        if (err) res.status(500).send(err);
        else res.status(200).json(sanciones);
    });
});

// GET de todas los sanciones de un usuario dado (identificado por su Id)  .sort('-f_inicio')
router.get('/all/:id', function(req, res, next) {
    console.log(req.params.id)
    Sancion.find({ 'usuarioID':req.params.id})
    .populate('usuarioID',{_id:0,username:1})
    .populate('libroID',{_id:0,titulo:1})
    .exec(function(err, sanciones){
        console.log(sanciones)
        if (err) res.status(500).send(err);
        else res.status(200).json(sanciones);
    });
});

// GET de todas las sanciones de un libro dado (identificado por su Id)
router.get('/all/:id', function(req, res, next) {
    Sancion.find({ 'libroID': req.params.id}).sort('-f_inicio')
    .populate('libroID',{_id:0,titulo:1})
    .populate('usuarioID',{_id:0,fullname:1})
    .exec(function(err, posts){
        if (err) res.status(500).send(err);
        else res.status(200).json(posts);
    });
});

//GET sanciones dependiendo del estado pasando por url el parámetro
//usando querystrings
router.get('/', function(req, res, next){
    let estado = req.params.estado;
    console.log(estado);
    Sancion.find({'estado':estado}).exec()
        .then(sanciones => res.status(200).json(sanciones))
        .catch(err => res.status(500).json({ message: err }))
})

// POST de una nueva Sancion
router.post('/', function(req, res, next) {
    //comprobamos que el usuario existe
    User.findById(req.body.usuarioID, function(err, userinfo) {
        if (err) res.status(500).send(err);
        else {
            Libro.findById(req.body.libroID, function(err, libroinfo){
                if(err) res.status(500).setDefaultEncoding(err);
                else{
                    // let Sancion = new Sancion({
                    //     f_inicio: req.body.f_inicio,
                    //     f_fin: req.body.f_fin,
                    //     estado: req.body.estado,
                    //     observaciones: req.body.observaciones,
                    //     libroID: req.body.libroID,
                    //     usuarioID: req.body.usuarioID
                    // })
                    // salvar el post en las colecciones users y sanciones y libros
                    Sancion.create(req.body, function(err, Sancioninfo) {
                        if (err) res.status(500).send(err);
                        else res.sendStatus(200);
                    });
                    
                }
            })
        }
    });
});

// PUT: actualización de una Sancion existente (identificada por su Id)
router.put('/:id', function(req, res, next) {
    Sancion.findByIdAndUpdate(req.params.id,req.body, function(err,  Sancioninfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

// DELETE de una Sancion existente (identificada por su Id)
router.delete('/:id', function(req, res, next) {
    Sancion.findByIdAndDelete(req.params.id, function(err, Sancioninfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

module.exports = router;

