const express = require('express')
const consola = require('consola')
const fs = require('fs')
const {
  Nuxt,
  Builder
} = require('nuxt')
const app = express()
let multer = require('multer');
let upload = multer()

const uniqueArr = array => {
  var temp = []; //一个新的临时数组
  if (array && array.length) {
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
  }
  return temp;
}



// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host,
    port
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.post("/api/files", upload.any(), function (req, res) { //自己的路由
    let files = req.files
    let allArr = []
    let json = files.map(file => {
      let obj = {}
      let chinese = uniqueArr(file.buffer.toString().match(/(?<!\/\/ .*)(?<!\<\!-- .*)[\u4e00-\u9fa5。？！，、；：“”（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏]+/ig))
      allArr = [].concat(allArr, chinese)
      obj[file.fieldname] = chinese
      return obj
    })
    json.push({
      'all': uniqueArr(allArr)
    })
    res.json(json)
  });

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
