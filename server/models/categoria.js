const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema

let categoriaSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, 'La descripcion es necesaria']
  },
  usuario: {
    type: String,
    required: [true, 'El usuario es necesario']
  }
})

categoriaSchema.plugin(uniqueValidator, {
  message: '{PATH} debe ser único'
})

module.exports = mongoose.model('Categoria', categoriaSchema)
