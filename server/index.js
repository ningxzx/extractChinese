const express = require("express");
const consola = require("consola");
const fs = require("fs");
var path = require("path");

const { Nuxt, Builder } = require("nuxt");
const app = express();
let multer = require("multer");
let upload = multer();
const { customs, customsCn, customsEn } = require("../constants/dictionary");

let DICTIONARY = {};
for (let key in customsCn) {
  DICTIONARY[customsCn[key]] = key;
}
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
};

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
config.dev = !(process.env.NODE_ENV === "production");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }
  app.use(express.static("sources"));

  app.post("/api/files", upload.any(), function(req, res) {
    const timestamp = new Date().getTime();
    //自己的路由
    let files = req.files;
    const { module } = req.body;
    let allArr = [];
    let json = files
      .filter(x => {
        let arr = x.originalname.split(".");
        let fileType = arr[arr.length - 1];
        return fileType === "js" || fileType === "vue" || fileType === "jsx";
      })
      .map((file, index) => {
        let obj = {};
        let chinese = uniqueArr(
          file.buffer
            .toString()
            .replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g,'')
            .match(
              /(?<!\/\/\s*.*)(?<!\<\!--\s*.*)[\u4e00-\u9fa5。？！，、；：“”（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏]+/gi
            )
        );
        allArr = [].concat(allArr, chinese);
        const filePath = path.join(
          __dirname,
          `../sources/${timestamp}_${index}_${file.originalname}`
        );
        const newStr = file.buffer
          .toString()
          .replace(
            /(?<!\/\/ .*)(?<!\<\!-- .*)(?<=("|').*)[\u4e00-\u9fa5。？！，、；：“”（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏]+(?=.*("|'))/gi,
            x =>
              DICTIONARY[x.replace("：", "")]
                ? `\$t(\\'${module}.${DICTIONARY[x.replace("：", "")].replace(
                    /[\' ']/gi,
                    ""
                  )}\\')`
                : x
          )
          .replace(
            /(?<!\/\/ .*)(?<!\<\!-- .*)[\u4e00-\u9fa5。？！，、；：“”（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏]+/gi,
            x =>
              DICTIONARY[x.replace("：", "")]
                ? `\{\{\$t("${module}.${DICTIONARY[x.replace("：", "")].replace(
                    /[\' ']/gi,
                    ""
                  )}")\}\}`
                : x
          );
        fs.writeFile(filePath, newStr, function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
        obj[file.fieldname || file.originalname] = chinese.map(x => ({
          chinese: x,
          english: module ? DICTIONARY[x.replace("：", "")] : ""
        }));
        obj.filePath = `http://localhost:${port}/${timestamp}_${index}_${
          file.originalname
        }`;
        return obj;
      });
    // 返回中文对应列表中增加所有中文对应及未翻译部分
    const allUnique = uniqueArr(allArr).map(x => ({
      chinese: x,
      english: module ? DICTIONARY[x.replace("：", "")] : ""
    }));
    json.push({
      all: allUnique
    });
    if (module) {
      json.push({
        rest: allUnique.filter(x => !x.english)
      });
    }
    res.json(json);
  });

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
