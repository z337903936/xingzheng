<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="职位:" prop="title" required>
                <el-input :rows="1" v-model="postForm.title" autosize placeholder="必填，请输入职位"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="人数:" prop="number" required>
                <el-input :rows="1" v-model="postForm.number" autosize placeholder="必填，请输入招聘人数"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="部门:" prop="partment" required>
                <el-input :rows="1" v-model="postForm.partment" autosize placeholder="必填，请输入招聘部门"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="经验要求:">
                <el-input :rows="1" v-model="postForm.experienceYear" autosize placeholder="选填，请输入经验要求"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="年龄要求:">
                <el-input :rows="1" v-model="postForm.ageDemand" autosize placeholder="选填，请输入年龄要求"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="学历要求:">
                <el-input :rows="1" v-model="postForm.educationBackground" autosize placeholder="选填，请输入学历要求"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="地点:" prop="place" required>
                <el-input :rows="1" v-model="postForm.place" autosize placeholder="必填，请输入工作地点"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="投递邮箱:" prop="mailto" required>
                <el-input :rows="1" v-model="postForm.mailto" autosize placeholder="必填，请输入投递邮箱"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="薪水:">
                <el-input :rows="1" v-model="postForm.salary" autosize placeholder="选填，请输入薪水"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item
                label-width="100px"
                label="发布时间:"
                class="postInfo-container-item"
                prop="publishDay"
                required>
                <el-date-picker
                  v-model="postForm.publishDay"
                  type="datetime"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择发布时间"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="100px" label="结束时间:" class="postInfo-container-item" prop="endDay" required>
                <el-date-picker
                  v-model="postForm.endDay"
                  type="datetime"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择结束时间"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="排序:">
                <el-input :rows="1" v-model="postForm.sort" autosize placeholder="选填，请输入排序数值，值越大越靠前"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="是否启用:">
                <el-select v-model="postForm.needShow">
                  <el-option key="true" label="启用" value="true"/>
                  <el-option key="false" label="停用" value="false"/>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="18">
              <div class="editor-container">
                <Tinymce ref="editor" :height="400" v-model="postForm.duty"/>
              </div>
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
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import { validateNumber, validateEmail } from '@/utils/validate'
import { fetchJob, updateJob, addJob } from '@/api/job'

const defaultForm = {
  title: '',
  number: '',
  partment: '',
  experienceYear: '',
  ageDemand: '',
  educationBackground: '',
  place: '',
  publishDay: undefined,
  endDay: undefined,
  sort: 1,
  id: 0,
  needShow: 'true'
}

export default {
  name: 'CarouselDetail',
  components: { Upload, Tinymce },
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
    const validateMail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        this.$message({
          message: '邮箱有误',
          type: 'error'
        })
        callback(new Error('邮箱有误'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        number: [{ validator: validateRequire }],
        partment: [{ validator: validateRequire }],
        place: [{ validator: validateRequire }],
        mailto: [{ validator: validateMail }],
        publishDay: [{ validator: validateRequire }],
        endDay: [{ validator: validateRequire }]
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

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchJob(id).then(data => {
        data.needShow = data.needShow.toString()
        data.publishDay = data.publishDay * 1000
        data.endDay = data.endDay * 1000
        this.postForm = data
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改职位' : 'Edit Carousel'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
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
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.publishDay = this.postForm.publishDay / 1000
          this.postForm.endDay = this.postForm.endDay / 1000

          var data = this.postForm
          data.needShow = (this.postForm.needShow === 'true')
          delete data.createdTime
          if (data.endDay < data.publishDay) {
            this.$message({
              message: '结束时间不能小于发布时间',
              type: 'error'
            })
            return
          }
          console.log(data)
          if (this.isEdit) {
            updateJob(data).then(data => {
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
            addJob(data).then(data => {
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
    },

    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
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
