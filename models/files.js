const mongoose = require('mongoose')

const File = new mongoose.Schema({
    path:{
        type: String,
        required: true
    },
    fileName:{
        type: String,
        required: true
    },
    level:{
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    edition:{
        type: String,
        required: true,
        min: [1962, 'Edition non valide'],
        max: new Date().getFullYear()
    },
    typeEnseignement: String,
    section: String,
    uploaderName:String,
    email:String,
    description: String

})

module.exports= mongoose.model("files",File)