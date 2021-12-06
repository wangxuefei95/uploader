const express = require('express')
const log4js = require('log4js')

const router = express.Router()
const logger = log4js.getLogger()

router.get('/', function(req, res) {
  res.render('index')
})

module.exports = router