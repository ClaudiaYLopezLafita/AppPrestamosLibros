var express = require('express');
var router = express.Router();
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');

// Devolver todos los usuarios
router.get('/', getAllUsers);

// Devolver Usuario
router.get('/:id', getUser);

// Crear Usuario
router.post('/', createUser);

// Actualizar Usuario
router.put('/:id', updateUser);

// Borrar Usuario
router.delete('/:id', deleteUser);

module.exports = router;