import mongoose from "mongoose"

const koderSchema = new mongoose.Schema({ //recibirá un objeto
    name: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 100,
        trim: true //si este nombre viene con espacios al principio y al final que los borre
    },
    lastName: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 100,
        trim: true 
    },
    age: {
        type: Number, 
        required: true,
        min: 1,
        max: 100,
    },
    gender: {
        type: String, 
        required: true,
        enum: ['h', 'm'] //este campo solo podrá recibir h o m -> solo estos dos valores son válidos
    },
    isGraduated: {
        type: Boolean,
        default: false //si yo no pongo nada en este campo arrojará false 
    }
})

const Koder = mongoose.model('koders', koderSchema)
export {Koder}
