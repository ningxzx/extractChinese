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
        <h5>{{fileChinese.fileName}}</h5>
        <div>{{fileChinese.json}}</div>
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
      this.$axios.post("/files", form).then(res => {
        this.fileChineseArr = res.data.map(x => {
          let obj = {};
          for (let key in x) {
            obj.fileName = key;
            obj.json = JSON.stringify(x[key]);
          }
          return obj
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
#folder_input {
  display: none;
}
</style>
