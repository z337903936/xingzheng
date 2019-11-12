<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="用户ID:" prop="uid" required>
                <el-input :rows="1" v-model="postForm.uid" autosize placeholder="必填，请输入用户ID"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="业务类型:" prop="itemId" required>
                <el-select v-model="postForm.itemId">
                  <el-option key="1" label="富信" value="1"/>
                  <el-option key="2" label="短信" value="2"/>
                  <el-option key="3" label="营销短信" value="3"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="状态:" prop="status" required>
                <el-select v-model="postForm.status">
                  <el-option key="1" label="正常" value="1"/>
                  <el-option key="2" label="停用" value="2"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="API帐号ID:" prop="accountId" required>
                <el-input v-model="postForm.accountId" autosize placeholder="必填，请输入API帐号ID"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="API帐号密码:" prop="accountPwd"
                            required>
                <el-input v-model="postForm.accountPwd" type="password" autosize placeholder="帐号密码"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="确认密码:" prop="checkPass" required>
                <el-input v-model="postForm.checkPass" type="password" autosize placeholder="确认密码"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="备注:" prop="note">
                <el-input :rows="4" type="textarea" v-model="postForm.note" autosize placeholder="备注"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;">
                <el-button v-loading="loading" :rows="1" style="width: 100%" type="primary" @click="submitForm">保存
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="btn-container"/>
    </el-form>
  </div>
</template>

<script>
  import { fetchAccounts, updateAccounts, createAccounts } from '@/api/api'

  export default {
    name: 'LinksDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('该项必填'))
        } else {
          callback()
        }
      }
      return {
        postForm: {
          uid: '',
          itemId: '',
          accountId: '',
          accountPwd: '',
          checkPass: '',
          note: '',
          status: ''
        },
        loading: false,
        rules: {
          uid: [{ validator: validateRequire }],
          itemId: [{ validator: validateRequire }],
          accountId: [{ validator: validateRequire }]
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
      }
      this.tempRoute = Object.assign({}, this.$route)
    },
    methods: {
      fetchData(id) {
        fetchAccounts(id).then(data => {
          this.postForm = data
          this.postForm.itemId = this.postForm.itemId + ''
          this.postForm.status = this.postForm.status + ''
          this.postForm.accountPwd = ''
          delete this.postForm.createdTime
          this.setTagsViewTitle()
        }).catch(err => {
          console.log(err)
        })
      },
      setTagsViewTitle() {
        const title = this.lang === 'zh' ? '修改API账户' : 'Edit Links'
        const route = Object.assign({}, this.tempRoute, { title: `${title}` })
        this.$store.dispatch('updateVisitedView', route)
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            var data = this.postForm
            if (data.accountPwd !== data.checkPass) {
              this.$message({
                message: '两次输入密码不一致!',
                type: 'error',
                showClose: true,
                duration: 1000
              })
              return
            }
            if (this.isEdit) {
              updateAccounts(data).then(data => {
                this.loading = false
                if (data.code === 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                  })
                  this.$router.replace('/api/accounts/list')
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
            } else {
              createAccounts(data).then(data => {
                this.loading = false
                if (data.code === 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                  })
                  this.$router.replace('/api/accounts/list')
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
