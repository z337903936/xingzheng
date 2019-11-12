<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="名称:" prop="name" required>
                <el-input :rows="1" v-model="postForm.name" autosize placeholder="必填，请输入名称"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="logo图片 134*51">
                <Upload v-model="postForm.logoImg"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="描述:" prop="alt">
                <el-input :rows="1" v-model="postForm.alt" autosize placeholder="请输入描述"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="显示顺序:" prop="sort" required>
                <el-input :rows="1" v-model="postForm.sort" autosize placeholder="必填，请输入显示顺序"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="状态:" prop="enable" required>
                <el-select v-model="postForm.enable">
                  <el-option key="true" label="显示" value="true"/>
                  <el-option key="false" label="隐藏" value="false"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
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
import Upload from '@/components/Upload/singleImage3'
import { validateNumber } from '@/utils/validate'
import { fetchPartner, updatePartner, createPartner } from '@/api/partner'

export default {
  name: 'LinksDetail',
  components: { Upload },
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
        name: '',
        logoImg: '',
        alt: '',
        sort: 1,
        enable: 'true'
      },
      loading: false,
      rules: {
        name: [{ validator: validateRequire }],
        alt: [{ validator: validateRequire }],
        sort: [{ validator: validateRequire }],
        enable: [{ validator: validateRequire }]
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
      fetchPartner(id).then(data => {
        data.enable = data.enable + ''
        this.postForm = data
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改合作伙伴' : 'Edit Links'
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      if (!this.postForm.sort) {
        if (!validateNumber(this.postForm.sort)) {
          this.$message({
            message: '排序值必须为数字',
            type: 'warning'
          })
          return
        }
      }
      if (!this.postForm.logoImg) {
        this.$message({
          message: '请上传logo图片',
          type: 'warning'
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          var data = this.postForm
          if (this.isEdit) {
            updatePartner(data).then(data => {
              this.loading = false
              if (data.code === 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  showClose: true,
                  duration: 1000
                })
                this.$router.replace('/partner/list')
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
            createPartner(data).then(data => {
              this.loading = false
              if (data.code === 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  showClose: true,
                  duration: 1000
                })
                this.$router.replace('/partner/list')
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
