var express = require('express');
var mongoose = require('mongoose');
mongoose.connection;
var router = express.Router();
// 
const { body, validationResult } = require('express-validator');

//modelos
var Libro = require('../models/Libro.js');
var Prestamo = require('../models/Prestamo.js');
var User = require('../models/Usuario.js');

// GET del listado de prestamos ordenados por fecha de creación 
router.get('/', (req, res, next) => {
    Prestamo.find()
    .sort('-fechaRetirada')
    .populate(
        [{
            path: 'usuarioID',
            model: 'User',
            select: '-_id username' // atributos que queremos ver
        }, {
            path: 'libroID',
            model: 'Libro',
            select: '-_id titulo'
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
    Prestamo.find({ 'libroID': req.params.idLibro})
    .sort('-fechaDevolucion')
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
//usando querystrings: prestamos/find?estado=status
router.get('/find', (req, res, next) => {
    let status = req.query.estado

    // realizamos una busqueda 
    Prestamo.find({estado:status}).populate(
        [{
            path: 'usuarioID',
            model: 'User',
            select: '-_id name surname1 email' //Fields you want to return in this populate
        }, {
            path: 'libroID',
            model: 'Libro',
            select: '-_id titulo' //Fields you want to return in this populate
        }]
    ).exec(function(err,prestamos){
        if(err)res.status(500).send(err);

        if(prestamos != null){
            res.status(200).json(prestamos);
        } else {
            res.status(404).send(err)
        }
    })

})

var MAX_LIBROS = 3;

// POST de un nuevo prestamo 
router.post('/', 
    //el campo fechaDevolucion debe de ser requerido, de tipo fecha y mayor que la fechaRetirada 
    body('fechaDevolucion').exists().isISO8601()
    .custom((value, {req}) =>{
        //creamos un validacion personalizada para la comparación de las fechas
        if(req.body.fechaRetirada >= value){
            throw new Error('La fecha de retirada debe de ser anterior a la devolución');
        }
        return true
    }),
    //el campo libroID deber de ser requerido, un array de máxmimo tres libros y minimo un
    body('libroID').isArray()
    .custom((value) =>{
        // validacion personalizada comporbacion de un minimo de 1 libro y máximo de 3 libros
        if(value.length < 1 || value.length > MAX_LIBROS){
            
            throw new Error('Requerido con un máximo de tres libros');
        }
        return true
    }),
    //el campo usuarioID debe de ser requerido y de tipo objeto id de mongo
    body('usuarioID').isMongoId().exists().withMessage('Debe ser el ObjectId del usuario y obligatorio'),
    //el campo observaciones debe tener un rango de caracteres entre 10 y 100
    body('observaciones').isLength({min:10, max:100}).withMessage('Rango de caracteres inválido'),
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        //comprobamos que el usuario existe
        User.findById(req.body.usuarioID, function(err, userinfo) {
            if (err) res.status(500).send(err);
            else {
                Libro.findById(req.body.libroID, function(err, libroinfo){
                    if(err) res.status(500).setDefaultEncoding(err);
                    else{
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
    Prestamo.findByIdAndDelete(req.params.id, function(err) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

module.exports = router;