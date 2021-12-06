const express = require('express')
const fs = require('fs')
const log4js = require('log4js')
const multiparty = require('multiparty')
const path = require('path')

const router = express.Router()
const logger = log4js.getLogger('upload')

const staticDir = '/Users/wangxuefei/static'

router.get('/', function(req, res) {
  res.render('upload')
})

router.post('/', function(req, res, next) {

  const form = new multiparty.Form({
    encoding: 'utf-8',
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      logger.error('解析文件发生错误，信息如下\n', err)
      res.json({ code: 500, msg: '文件解析错误' })
    }

    Promise.all(files.files.map(file => {
      return copy(file.path, path.join(staticDir, file.originalFilename))
    }))
    .then(() => {
      res.render('result', { success: true, message: '上传成功' })
    })
    .catch(() => {
      res.render('result', { success: false, message: '上传失败' })
    })
  })
})

function copy(sourcePath, targetPath) {
  return new Promise(function (resolve, reject) {
    const readstream = fs.createReadStream(sourcePath)
    const writestream = fs.createWriteStream(targetPath)
    readstream.on('error', function(err) {
      logger.error('文件读取失败 ' + sourcePath)
      reject(err)
    })
    readstream.on('end', function() {
      logger.info('文件读取完成 ' + sourcePath)
    })
    writestream.on('finish', function() {
      logger.info('文件写入完成 ' + sourcePath + ' -> ' + targetPath)
      resolve()
    })
    writestream.on('error', function(err) {
      logger.error('文件写入失败 ' + sourcePath + ' -> ' + targetPath)
      reject(err)
    })
    readstream.pipe(writestream)
  })
}

module.exports = router