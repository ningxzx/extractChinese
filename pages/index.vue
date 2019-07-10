<template>
  <section class="container">
    <section class="search-container">
      <h4>选择代码</h4>
      <label for="folder_input" class="file-input-label">点击选择文件夹</label>
      <input ref="inputRef" placeholder="请输入内容" type="file" id="folder_input" @change="showFolder" webkitdirectory directory>
      <label for="file_input" class="file-input-label">点击选择文件</label>
      <input ref="inputRef" placeholder="请输入内容" type="file" id="file_input" @change="showFolder" multiple>
      <el-input class="module_input" size="small" placeholder="请输入i18n对应模块" v-model="module" />
    </section>
    <section class="chinese-wrapper">
      <section v-for="(fileChinese,index) in fileChineseArr" :key="index" class="file-chinese">
        <h5 v-if="fileChinese.fileName==='all'" class="all-title">所有中文</h5>
        <h5 v-else-if="fileChinese.fileName==='rest'" class="all-title">尚未翻译</h5>
        <h5 v-else>文件名称：{{fileChinese.fileName}}
          <el-button size="small" class="download-btn" @click="()=>download(fileChinese.filePath)">下载修改后的文件</el-button>
        </h5>
        <div class="chinese">
          <p v-for="({chinese,english},index) in fileChinese.json" :key="index">
            <span>{{chinese}}</span>
            <span class="english-str">{{english}}</span>
          </p>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      fileChineseArr: [],
      totalChineseArr: [],
      module: ''
    }
  },
  methods: {
    showFolder(e) {
      const files = e.currentTarget.files
      if(!files.length){
        return false
      }
      const form = new FormData()
      form.append('module', this.module)
      Array.prototype.forEach.call(files, (file, index) => {
        form.append(file.webkitRelativePath, file)
      })
      const loading = this.$loading({
        lock: true,
        text: '文件分析中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$axios.post('/files', form).then(res => {
        if (!this.module) {
          this.$message({
            message:
              '未指定对应i18n语言模块，无法显示对应的英文及筛选出对应的中文（建立统一语言库后将不再需要此参数）',
            type: 'warning'
          })
        }
        this.fileChineseArr = res.data.map(x => {
          loading.close()
          let obj = {}
          for (let key in x) {
            if (key != 'filePath') {
              obj.fileName = key
              obj.json = x[key]
            }
          }
          obj.filePath = x.filePath
          return obj
        }).filter(x=>x.json&&x.json.length)
      })
    },
    download(path) {
      window.open(path)
    }
  }
}
</script>
<style lang="less">
.container {
  margin: 0 auto;
  min-height: 100vh;
  section {
    padding: 20px;
    box-sizing: border-box;
    h4 {
      margin-bottom: 30px;
    }
  }
}
.search-container {
  border-bottom: 1px solid #e5e5e5;
  .file-input-label {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #409eff;
    border: 1px solid #409eff;
    color: #fff;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-right: 30px;
  }
  .module_input {
    width: 300px;
  }
}
.chinese-wrapper {
  .file-chinese {
    float: left;
    width: 600px;
    margin-left: 20px;
    margin-bottom: 20px;
    padding: 0;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    h5 {
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      background-color: #f2f2f2;
      border-bottom: 1px solid #e5e5e5;
    }
    h5.all-title {
      color: red;
    }
    .chinese {
      padding: 10px;
      line-height: 1.4;
      p {
        font-size: 14px;
        margin-bottom: 6px;
        .english-str {
          font-size: 13px;
          float: right;
        }
      }
    }
    .download-btn {
      float: right;
      margin-top: 9px;
    }
  }
}
#file_input,
#folder_input {
  display: none;
}
</style>
