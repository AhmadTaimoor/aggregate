'use strict'
const { mongoose } = require('./Mongoose')
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ParentCategoryId:
         {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Category'
         },
  Product: {
    type: mongoose.Schema.Types.ObjectId
  }
})
var Category = mongoose.model('Category', categorySchema)
module.exports = { Category }
