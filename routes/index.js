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

module.exports = router;
