const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido1: {
        type: String,
        required: true
    },
    apellido2: {
        type: String
    },
    contrasena: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: [String]
    },
    direccion: {
        type: String
    },
    municipio: {
        type: String
    }
});

// Middleware para encriptar las contraseñas con Bcrypt
UsuarioSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('contrasena')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => bcrypt.hash(user.contrasena, salt))
        .then(hash => {
            user.contrasena = hash;
            next();
        })
        .catch(err => next(err));
});

UsuarioSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.contrasena)
        .then(isMatch => isMatch)
        .catch(err => console.error(err))
}

module.exports = mongoose.model('User', UsuarioSchema);