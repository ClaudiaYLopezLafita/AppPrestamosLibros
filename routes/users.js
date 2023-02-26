var express = require('express');
var router = express.Router();
const User = require('../models/Usuario');
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    User.find({}).exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ message: err }));
});

router.get('/:id', (req, res) => {
        const userId = req.params.id;
        User.findById(userId).exec()
            .then(user => {
                if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
                res.status(200).json(user);
            })
            .catch(err => res.status(500).json({ message: err }))
    }
);

router.post('/',
    //nombre de usuario con expresion regular,  ejemplo válido: ACA@1234
    body('username', 'Nombre de usuario incorrecto').isString()
    .custom((value, {req}) =>{
        let rex = /^([A-Z]{3}.[0-9]{4})$/
        if(rex.test(value) === false){
            throw new Error('Nombre de usuario incorrecto');
        }
        return true
    }),
    // email debe de ser de tipo email
    body('email','La contraseña no es válida').isEmail().withMessage('Tipo Email'),
    //la password debe seguir unos criterios. 
    body('password').isString().isLength({ min: 8 })
    .not().isLowercase().not().isUppercase()
    .not().isNumeric().not().isAlpha(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const user = req.body;
        User.create(user)
            .then(() => res.status(201).json({ message: `Usuario ${user.username} añadido satisfactoriamente` }))
            .catch(err => res.status(500).json({ message: err }))
    }
);

router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const user = req.body;
    User.findByIdAndUpdate(userId, user).exec()
        .then(() => res.status(200).json({ message: `Usuario ${user.username} actualizado satisfactoriamente` }))
        .catch(err => res.status(500).json({ message: err }))
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId).exec()
        .then(user => {
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
            res.status(200).json({ message: `Usuario ${user.username} eliminado satisfactoriamente` })
        })
        .catch(err => res.status(500).json({ message: err }))
});

router.post('/signin', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username: username }).exec()
        .then(user => {
            console.log(user);
            if (!user) return res.status(401).json({ message: `Usuario ${username} no registrado` });

            user.comparePassword(password, function (err, isMatch) {
                if (err) return next(err);
                if (isMatch) {
                    res.status(200).json({ message: `Bienvenido ${user.username}`});
                } else {
                    res.status(200).json({ message: 'La contraseña no coincide' });
                }
            })
        })
        .catch(err => res.status(500).json({ message: 'Error comprobando el usuario' }));
})

module.exports = router;