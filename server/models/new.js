const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  id: Number,
    Xstart: String,
    Function: String
  
})

const ProductModel = mongoose.model('new', productSchema)

module.exports = ProductModel