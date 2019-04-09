'use strict'
//* **********************imported Modules********************************************
var express = require('express')
var path = require('path')
var api = require('./Route/api')
// var mongoose = require('mongoose');
var config = require('./config.json')
var app = express()
const mongoose = require('./Schema/mongoose')
app.listen(config.PORT, function () {
  console.log(`Server is listening on ${config.PORT}`)
  mongoose.connect()
}).on('error', function () {
  console.log('Something went wrong')
  console.log(Error)
})
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
//app.use(express.urlencoded({ extended: false }))
//* ***********************Routing********************************************
app.use('', api)
