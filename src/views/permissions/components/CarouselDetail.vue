<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="名字:">
                <el-input v-model="postForm.name" :rows="1" autosize placeholder="选填，请输入名字" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="大标题:">
                <el-input v-model="postForm.title1" :rows="1" autosize placeholder="选填，这是轮播图向上弹出的大标题" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="小标题:">
                <el-input v-model="postForm.title2" :rows="1" autosize placeholder="选填，这是轮播图向上弹出的小标题" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="备注:">
                <el-input v-model="postForm.description" :rows="1" autosize placeholder="选填，请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="9">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="是否启用:">
                <el-select v-model="postForm.needShow">
                  <el-option key="true" label="启用" value="true" />
                  <el-option key="false" label="停用" value="false" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="9">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="排序:">
                <el-input v-model="postForm.displayOrder" :rows="1" autosize placeholder="选填，请输入排序数值，值越大越靠前" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="PC端链接:">
                <el-input v-model="postForm.linkUrl" :rows="1" autosize placeholder="选填，请输入PC端目标链接地址" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="手机端链接:">
                <el-input v-model="postForm.mobileLinkUrl" :rows="1" autosize placeholder="选填，请输入手机端目标链接地址" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="PC端图片 1920*1000" required>
                <Upload v-model="postForm.imgUrl" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="手机端图片 1366*600" required>
                <Upload v-model="postForm.mobileImgUrl" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
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
import Upload from '@/components/Upload/singleImage3'
import { validateURL, validateNumber } from '@/utils/validate'
import { fetchCarousel, updateCarousel, createCarousel } from '@/api/carousel'

const defaultForm = {
  name: '',
  title1: '', // 大标题
  title2: '', // 小标题
  description: '', // 备注
  imageUrl: '',
  mobileImgUrl: '',
  linkUrl: '',
  mobileLinkUrl: '',
  displayOrder: 1,
  id: 0,
  needShow: 'true'
}

export default {
  name: 'CarouselDetail',
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
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateOrder = (rule, value, callback) => {
      if (value) {
        if (validateNumber(value)) {
          callback()
        } else {
          this.$message({
            message: '排序值必须为数字',
            type: 'error'
          })
          callback(new Error('排序值填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        imgUrl: [{ validator: validateRequire }],
        mobileImgUrl: [{ validator: validateRequire }],
        displayOrder: [{ validator: validateOrder, trigger: 'blur' }]
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
      fetchCarousel(id).then(data => {
        data.needShow = data.needShow.toString()
        this.postForm = data
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改轮播图' : 'Edit Carousel'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      if (!this.postForm.imgUrl || !this.postForm.mobileImgUrl) {
        this.$message({
          message: '图片不能为空',
          type: 'warning'
        })
        return
      }
      if (!this.postForm.displayOrder) {
        if (!validateNumber(this.postForm.displayOrder)) {
          this.$message({
            message: '排序值必须为数字',
            type: 'warning'
          })
          return
        }
      }
      this.loading = true
      var data = this.postForm
      data.needShow = (this.postForm.needShow === 'true')
      if (this.isEdit) {
        updateCarousel(data).then(data => {
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
      } else {
        createCarousel(data).then(data => {
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
    },

    getRemoteUserList(query) {
      // userSearch(query).then(response => {
      //   if (!response.data.items) return
      //   this.userListOptions = response.data.items.map(v => v.name)
      // })
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
