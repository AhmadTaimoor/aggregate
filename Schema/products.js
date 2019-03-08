/* eslint-disable no-unused-vars */
'use strict'
const { mongoose } = require('./mongoose')
const { Category } = require('./categories')
var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number
    },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category' }
  }
)
let Product = mongoose.model('Product', productSchema)
module.exports = { Product }
