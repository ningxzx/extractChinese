const express = require('express')
const consola = require('consola')
const fs = require('fs')
var path = require('path')

const { Nuxt, Builder } = require('nuxt')
const app = express()
let multer = require('multer')
let upload = multer()
const DICTIONARY = require('../constants/dictionary')
const uniqueArr = array => {
  var temp = [] //一个新的临时数组
  if (array && array.length) {
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i])
      }
    }
  }
  return temp
}

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(express.static('sources'))

  app.post('/api/files', upload.any(), function(req, res) {
    const timestamp = new Date().getTime()
    //自己的路由
    let files = req.files
    const { module } = req.body
    let allArr = []
    let json = files.map((file, index) => {
      let obj = {}
      let chinese = uniqueArr(
        file.buffer
          .toString()
          .match(
            /(?<!\/\/ .*)(?<!\<\!-- .*)[\u4e00-\u9fa5。？！，、；：“”（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏]+/gi
          )
      )
      allArr = [].concat(allArr, chinese)
      const filePath = path.join(
        __dirname,
        `../sources/${timestamp}_${index}_${file.originalname}`
      )
      const newStr = file.buffer
        .toString()
        .replace(
          /(?<!\/\/ .*)(?<!\<\!-- .*)(?<=\>.*)[\u4e00-\u9fa5。？！，、；：“”（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏]+(?=.*\<)/gi,
          x =>
            DICTIONARY[x.replace('：', '')]
              ? `\{\{\$t("${module}.${DICTIONARY[x.replace('：', '')]}")\}\}`
              : x
        )
        .replace(
          /(?<!\/\/ .*)(?<!\<\!-- .*)[\u4e00-\u9fa5。？！，、；：“”（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏]+/gi,
          x =>
            DICTIONARY[x.replace('：', '')]
              ? `\$t('customs.${DICTIONARY[x.replace('：', '')]}')`
              : x
        )
      fs.writeFile(filePath, newStr, function(err) {
        if (err) {
          return console.log(err)
        }
        console.log('The file was saved!')
      })
      obj[file.fieldname || file.originalname] = chinese.map(x => ({
        chinese: x,
        english: DICTIONARY[x.replace('：', '')]
      }))
      obj.filePath = `http://localhost:${port}/${timestamp}_${index}_${
        file.originalname
      }`
      return obj
    })
    json.push({
      all: uniqueArr(allArr).map(x => ({
        chinese: x,
        english: DICTIONARY[x.replace('：', '')]
      }))
    })
    res.json(json)
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
