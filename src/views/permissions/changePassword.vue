<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="旧密码:">
                <el-input v-model="postForm.oldPassword" :rows="1" type="password" autocomplete="off" placeholder="选填" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="新密码:">
                <el-input v-model="postForm.newPassword" :rows="1" type="password" autocomplete="off" placeholder="选填" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="确认密码:">
                <el-input v-model="postForm.checkPass" :rows="1" type="password" autocomplete="off" placeholder="选填" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px">
                <el-button v-loading="loading" :rows="1" style="width: 100%" type="primary" @click="submitForm">保存
                </el-button>
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
import { changePassword } from '@/api/permissions'

const defaultForm = {
  oldPassword: '',
  newPassword: '',
  checkPass: '',
  id: 0
}

export default {
  name: 'ChangePassword',
  components: {},
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '为必传项',
          type: 'error'
        })
        callback(new Error('为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      roles: [],
      tempRoute: {}
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
  },
  methods: {
    submitForm() {
      var data = this.postForm
      if (data.newPassword !== data.checkPass) {
        this.$message({
          message: '两次输入密码不一致!',
          type: 'error',
          showClose: true,
          duration: 1000
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          changePassword(data).then(data => {
            this.loading = false
            if (data.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                showClose: true,
                duration: 1000
              })
            } else {
              this.$message({
                message: data.reason,
                type: 'error',
                showClose: true,
                duration: 1000
              })
            }
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
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
