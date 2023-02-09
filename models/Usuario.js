const mongoose = require('mongoose');
///hoaisd
//Para la encriptación del password
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        index: { unique: true }
    },
    password: { 
        type: String, 
        required: true 
    },
    name:{
        type: String, 
        required: true 
    },
    surname1:{
        type: String, 
        required: true 
    },
    surname2:{
        type: String, 
        required: true 
    },
    fullname:String,
    email: { 
        type: String, 
        required: true },
    phone: { 
        type: Number, 
        min: 9, max: 9
    },
    creationdate: { 
        type: Date, 
        default: Date.now 
    },
    location:{
        type:String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'subscriber'],
        default: 'subscriber'
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    // solo aplica una función hash al password si ha sido modificado(o es nuevo)
    if (!user.isModified('password')) return next();
    // genera la salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // aplica una función hash al password usando la nueva salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // sobrescribe el password escrito con el “hasheado”
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword,
    this.password,
    function(err,isMatch) {
        if (err) return cb(err);
            cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
