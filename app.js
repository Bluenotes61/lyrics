/* global __dirname */

/**
 * Start module for the application
 */
const express = require('express')
const swig = require('swig')
const path = require('path')
const config = require('./config.js')
const routes = require('./routes/index.js')

const app = express()

const server = app.listen(config.serverport, function () {
  console.log('Listening on port %d', server.address().port)
})

global.appRoot = path.resolve(__dirname)

swig.setDefaults({
  autoescape: false
})
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'routes'))
app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  routes.index(req, res)
})
