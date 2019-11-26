<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="9">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="key:" prop="key" required>
                <el-input :rows="1" v-model="postForm.key" autosize placeholder="必填，请输入key" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="9">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="值:" prop="value" required>
                <el-input :rows="1" v-model="postForm.value" autosize placeholder="必填，请输入值" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="备注:" prop="note">
                <el-input :rows="4" v-model="postForm.note" type="textarea" placeholder="选填，请输入摘要"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;">
                <el-button v-loading="loading" :rows="1" style="width: 100%" type="primary" @click="submitForm">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="btn-container" />
    </el-form>
  </div>
</template>

<script>
import { fetchInfo, updateInfo, createInfo } from '@/api/paramConfig'

const defaultForm = {
  key: '',
  value: '',
  note: ''
}

export default {
  name: 'Detail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '该项必填',
          type: 'error'
        })
        callback(new Error('该项必填'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        key: [{ validator: validateRequire }],
        value: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.postForm.id = id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchInfo(id)
        .then(data => {
          this.postForm = data
          this.setTagsViewTitle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改配置' : 'Edit'
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          var data = this.postForm
          delete data.code
          delete data.updateTime
          if (this.isEdit) {
            updateInfo(data)
              .then(data => {
                this.loading = false
                if (data.code === 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                  })
                  this.$router.replace('/system/paramConfigList')
                } else {
                  this.$message({
                    message: data.reason,
                    type: 'error',
                    showClose: true,
                    duration: 1000
                  })
                }
              })
              .catch(err => {
                console.log(err)
                this.loading = false
              })
          } else {
            createInfo(data)
              .then(data => {
                this.loading = false
                if (data.code === 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                  })
                  this.$router.replace('/system/paramConfigList')
                } else {
                  this.$message({
                    message: data.reason,
                    type: 'error',
                    showClose: true,
                    duration: 1000
                  })
                }
              })
              .catch(err => {
                console.log(err)
                this.loading = false
              })
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
