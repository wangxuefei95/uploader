const express = require('express')
const log4js = require('log4js')
const path = require('path')

const routes = require('./routes/index')
const upload = require('./routes/upload')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', routes)
app.use('/upload', upload)

console.log(app.get('env'))

module.exports = app