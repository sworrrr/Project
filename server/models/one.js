const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  id: Number,
    Xstart: String,
    Function: String
  
})

const ProductModel = mongoose.model('one', productSchema)

module.exports = ProductModel