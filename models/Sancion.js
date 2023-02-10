const mongose = require('mongose')

var Usuario = require('./Usuario');


const SancionSchema = mongose.Schema({
    numReferencia:{
        type: String,
        required:true
    },

    f_inicio:{
        type: Date,
        required: true
    },

    f_fin:{
        type: Date,
        required: true
    },

    motivo:{
        type: String,
        required:false
    },
    prorrogable:{
        type:Boolean,
        required:false
    },
    usuarioID:[{
        type: Schema.ObjectId,
        ref: 'Usuario',
        default: null
    }]

})

module.exports = mongoose.model('Sancion', SancionSchema);

