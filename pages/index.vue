<template>
  <section class="container">
    <section class="search-container">
      <h4>选择代码</h4>
      <label for="folder_input" class="file-input-label">点击选择文件夹</label>
      <input
        ref="inputRef"
        placeholder="请输入内容"
        type="file"
        id="folder_input"
        @change="showFolder"
        webkitdirectory
        directory
      >
    </section>
    <section class="chinese-wrapper">
      <section v-for="(fileChinese,index) in fileChineseArr" :key="index" class="file-chinese">
        <h5 v-show="fileChinese.fileName!=='all'">文件名称：{{fileChinese.fileName}}</h5>
        <h5 v-show="fileChinese.fileName==='all'" class="all-title">所有中文</h5>
        <div class="chinese">
          <p v-for="(chinese,index) in fileChinese.json" :key="index">
            {{chinese}}
          </p>
          </div>
      </section>
    </section>
  </section>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  },
  data() {
    return {
      fileChineseArr: [],
      totalChineseArr: []
    };
  },
  mounted() {},
  methods: {
    showFolder(e) {
      const files = e.currentTarget.files;
      const form = new FormData();
      Array.prototype.forEach.call(files, (file, index) => {
        form.append(file.webkitRelativePath, file);
      });
      const loading = this.$loading({
          lock: true,
          text: '文件分析中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios.post("/files", form).then(res => {
        this.fileChineseArr = res.data.map(x => {
          loading.close()
          let obj = {};
          for (let key in x) {
            obj.fileName = key;
            obj.json =x[key]
          }
          return obj;
        });
      });
    }
  }
};
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
  }
}
.chinese-wrapper {
  .file-chinese {
    padding: 0;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    margin-bottom: 30px;
    h5 {
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      padding: 0  10px;
      background-color: #f2f2f2;
      border-bottom: 1px solid #e5e5e5;
    }
    h5.all-title{
       color: red;
    }
    .chinese{
      padding: 10px;
      line-height: 1.4;
    }
  }
}
#folder_input {
  display: none;
}
</style>
