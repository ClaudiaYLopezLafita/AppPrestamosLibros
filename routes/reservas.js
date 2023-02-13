var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Sancion = require('../models/Sancion.js');
var User = require('../models/Usuario.js');

router.get('/', (req, res) => {
    res.send('resource');
});
router.get('/:id', (req, res) => {

});
router.post('/', (req, res) => {

});
router.put('/:id', (req, res) => {

});
router.delete('/:id', (req, res) => {

});

module.exports = router;
