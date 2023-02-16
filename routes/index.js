var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'App Prestamos Libros' });
});

// Ruta para el login de usuario
router.get('/login', (req, res) => {
  res.render('login', { title: 'App Prestamos Libros' });
})

// Ruta para el register de usuario
router.get('/register', (req, res) => {
  res.render('register', {title: 'Register'});
})

// Ruta para el register de LIbro
router.get('/registerLibro', (req, res) => {
  res.render('registerLibro', {title: 'Register Libro'});
})

module.exports = router;
