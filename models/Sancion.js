const mongose = require('mongose')

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
    }

})

module.exports = mongoose.model('Sancion', SancionSchema);

