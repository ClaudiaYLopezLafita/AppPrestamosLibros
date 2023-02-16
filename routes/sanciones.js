var express = require('express');
var mongoose = require('mongoose');
mongoose.connection;
var router = express.Router();

//modelos
var Libro = require('../models/Libro.js');
var Sancion = require('../models/Sancion.js');
var User = require('../models/Usuario.js');

router.get('/', (req, res, next) => {
    Sancion.find()
    .sort('-f_inicio')
    .populate('usuarioID',{_id:0,username:1}).populate('libroID',{_id:0,titulo:1})
    .exec(function(err, sanciones) {
        if (err) res.status(500).send(err);
        else res.status(200).json(sanciones);
    });
});

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

router.get('/all/:id', function(req, res, next) {
    Sancion.find({ 'libroID': req.params.id}).sort('-f_inicio')
    .populate('libroID',{_id:0,titulo:1})
    .populate('usuarioID',{_id:0,fullname:1})
    .exec(function(err, posts){
        if (err) res.status(500).send(err);
        else res.status(200).json(posts);
    });
});


router.get('/', function(req, res, next){
    let estado = req.params.estado;
    console.log(estado);
    Sancion.find({'estado':estado}).exec()
        .then(sanciones => res.status(200).json(sanciones))
        .catch(err => res.status(500).json({ message: err }))
})

router.post('/', function(req, res, next) {
    User.findById(req.body.usuarioID, function(err, userinfo) {
        if (err) res.status(500).send(err);
        else {
            Libro.findById(req.body.libroID, function(err, libroinfo){
                if(err) res.status(500).setDefaultEncoding(err);
                else{}})
                    Sancion.create(req.body, function(err, Sancioninfo) {
                        if (err) res.status(500).send(err);
                        else res.sendStatus(200);
                    });
                    
                }
            })
        }
    )
router.put('/:id', function(req, res, next) {
    Sancion.findByIdAndUpdate(req.params.id,req.body, function(err,  Sancioninfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

router.delete('/:id', function(req, res, next) {
    Sancion.findByIdAndDelete(req.params.id, function(err, Sancioninfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

module.exports = router;
