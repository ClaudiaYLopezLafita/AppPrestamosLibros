var express = require('express');
var router = express.Router();
const User = require('../models/Usuario');

router.get('/', (req, res) => {
    const { name, surname1, surname2, location } = req.query;
    const query = {};

    if (name) query.name = name;
    if (surname1) query.surname1 = surname1;
    if (surname2) query.surname2 = surname2;
    if (location) query.location = location;

    User.find(query).select('-password').exec()
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
});

router.post('/', (req, res) => {
    const user = req.body;
    User.create(user)
        .then(() => res.status(201).json({ message: `Usuario ${user.username} añadido satisfactoriamente` }))
        .catch(err => res.status(500).json({ message: err }))
});

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
                    res.status(200).json({ message: 'ok', id: user._id });
                } else {
                    res.status(200).json({ message: 'la contraseña no coincide' });
                }
            })
        })
        .catch(err => res.status(500).json({ message: 'Error comprobando el usuario' }));
})

module.exports = router;