<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="标题:" prop="title" required>
                <el-input :rows="1" v-model="postForm.title" autosize placeholder="必填，请输入标题"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="文章分类:" prop="categoryId" required>
                <el-select v-model="postForm.categoryId" placeholder="请选择">
                  <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="作者:" prop="author">
                <el-input :rows="1" v-model="postForm.author" autosize placeholder="选填，请输入作者"/>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="是否置顶:">
                <el-select v-model="postForm.placeTop">
                  <el-option key="true" label="是" value="true"/>
                  <el-option key="false" label="否" value="false"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="是否推荐:">
                <el-select v-model="postForm.recommend">
                  <el-option key="true" label="是" value="true"/>
                  <el-option key="false" label="否" value="false"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="摘要:" prop="digest" required>
                <el-input :rows="4" v-model="postForm.digest" type="textarea" placeholder="必填，请输入摘要"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <div class="editor-container">
                <Tinymce ref="editor" :height="400" v-model="postForm.content"/>
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
import { validateNumber } from '@/utils/validate'
import { fetchArticle, updateArticle, createArticle } from '@/api/article'
import { fetchAllCateList } from '@/api/category'

const defaultForm = {
  title: '',
  author: '',
  categoryId: '',
  content: '',
  digest: '',
  placeTop: 'false',
  recommend: 'false',
  id: 0
}

export default {
  name: 'ArticleDetail',
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
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      categories: [],
      rules: {
        title: [{ validator: validateRequire }],
        categoryId: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        placeTop: [{ validator: validateRequire }],
        recommend: [{ validator: validateRequire }]
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
    // 获取业务列表
    fetchAllCateList().then(data => {
      this.categories = []
      data.list.map(each => {
        this.categories.push({
          id: each.id + '',
          name: each.name
        })
      })
      if (data.list.length > 0) {
        var first = data.list[0]
        this.postForm.categoryId = first.id + ''
        if (this.isEdit) {
          const id = this.$route.params && this.$route.params.id
          this.postForm.id = id
          this.fetchData(id)
        } else {
          this.postForm = Object.assign({}, defaultForm)
        }
      }
    }).catch(err => {
      console.log(err)
    })
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(data => {
        data.status = data.status + ''
        data.publishTime = data.publishTime * 1000
        data.categoryId = data.categoryId + ''
        this.postForm = data
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改文章' : 'Edit Article'
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
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          var data = this.postForm
          delete data.updateTime
          delete data.createdTime
          data.publishTime = data.publishTime / 1000
          data.categoryId = data.categoryId + ''
          if (this.isEdit) {
            updateArticle(data).then(data => {
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
            createArticle(data).then(data => {
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
