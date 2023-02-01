const express = require('express');
const router = express.Router();
const { getAllLibros, getLibro, createLibro, updateLibro, deleteLibro } = require('../controllers/libros');

router.get('/', getAllLibros);
router.get('/:id', getLibro);
router.post('/', createLibro);
router.put('/:id', updateLibro);
router.delete('/:id', deleteLibro);

module.exports = router;