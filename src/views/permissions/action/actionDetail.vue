<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="权限中文:" prop="actionDesc" required>
                <el-input :rows="1" v-model="postForm.actionDesc" autosize placeholder="选填，请输入权限中文"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="权限英文:" prop="actionName" required>
                <el-input :rows="1" v-model="postForm.actionName" autosize placeholder="必填，请输入权限英文"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="模块英文:" prop="moduleName" required>
                <el-input :rows="1" v-model="postForm.moduleName" autosize placeholder="必填，请输入模块英文"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="模块中文:" prop="moduleDesc" required>
                <el-input :rows="1" v-model="postForm.moduleDesc" autosize placeholder="必填，请输入模块中文"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="排序值:">
                <el-input :rows="1" v-model="postForm.sortValue" autosize placeholder="选填，请输入排序值"/>
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
      <div class="btn-container"/>
    </el-form>
  </div>
</template>

<script>
import { validateURL, validateNumber } from '@/utils/validate'
import { fetchAction, updateAction, createAction } from '@/api/permissions'

const defaultForm = {
  actionName: '',
  actionDesc: '',
  moduleName: '',
  moduleDesc: '',
  sortValue: 0,
  id: ''
}

export default {
  name: 'RoleDetail',
  components: {},
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
      rules: {
        groupName: [{ validator: validateRequire }],
        actionDesc: [{ validator: validateRequire }],
        moduleName: [{ validator: validateRequire }],
        moduleDesc: [{ validator: validateRequire }]
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
      fetchAction(id).then(data => {
        this.postForm = data
        delete this.postForm.createdTime
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改权限' : 'Edit Action'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.actionDesc}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      var data = this.postForm
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateAction(data).then(data => {
              this.loading = false
              if (data.code == 200) {
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
          } else {
            createAction(data).then(data => {
              this.loading = false
              if (data.code == 200) {
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
