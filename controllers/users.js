const User = require('../models/User');

const getAllUsers = (req, res) => {
    User.find({}).exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ message: err }));
}

const getUser = (req, res) => {
    const userId = req.params.id;
    User.findById(userId).exec()
        .then(user => {
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.status(200).json(user);
        })
        .catch(err => res.status(500).json({ message: err }))
}

const createUser = (req, res) => {
    const user = req.body;
    User.create(user)
        .then(() => res.status(201).json({ message: `Usuario ${user.nombre} añadido satisfactoriamente` }))
        .catch(err => res.status(500).json({ message: err }))
}

const updateUser = (req, res) => {
    const userId = req.params.id;
    const user = req.body;
    User.findByIdAndUpdate(userId, user).exec()
        .then(() => res.status(200).json({ message: `Usuario ${user.nombre} actualizado satisfactoriamente` }))
        .catch(err => res.status(500).json({ message: err }))
}

const deleteUser = (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId).exec()
        .then(user => {
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
            res.status(200).json({ message: `Usuario ${user.nombre} eliminado satisfactoriamente` })
        })
        .catch(err => res.status(500).json({ message: err }))
}

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };