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
              <el-form-item  label-width="100px" label="内容:" prop="content" required>
              <div class="editor-container">
                <Tinymce ref="editor" :height="400" v-model="postForm.content"/>
                <!--<editor v-model="postForm.content"></editor>-->
                <!--<ckeditor :editor="editor" v-model="postForm.content" :config="editorConfig"></ckeditor>-->
              </div>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="文章首图 560*345">
                <Upload v-model="postForm.headPic"/>
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
  // import ClassicEditor  from '@ckeditor/ckeditor5-build-classic'
  import Upload from '@/components/Upload/singleImage3'
  import Tinymce from '@/components/Tinymce'
  import { validateNumber } from '@/utils/validate'
  import { createForum,updateForum } from '@/api/forum'
  import { fetchAllCateList } from '@/api/category'

  const defaultForm = {
    title: '',
    categoryId: '',
    content: '',
    digest: '',
    headPic: '',
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
      const validateContentRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '请输入内容',
            type: 'error'
          })
          callback(new Error('请输入内容'))
        } else {
          callback()
        }
      }
      return {
        // editor: ClassicEditor,
        // editorConfig: {
        //   language: 'zh-cn',
        //   ckfinder: {
        //     uploadUrl: `/v1/cp/upload/`,
        //     // 后端处理上传逻辑返回json数据,包括uploaded 上传的字节数 和url两个字段
        //   },
        // },
        postForm: Object.assign({}, defaultForm),
        loading: false,
        userListOptions: [],
        categories: [],
        rules: {
          title: [{ validator: validateRequire }],
          categoryId: [{ validator: validateRequire }],
          content: [{ validator: validateContentRequire }],
          headPic: [{ validator: validateRequire }],
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
        // if (data.list.length > 0) {
        //   var first = data.list[0]
        //   this.postForm.categoryId = first.id + ''
        //   if (this.isEdit) {
        //     const id = this.$route.params && this.$route.params.id
        //     this.postForm.id = id
        //     this.fetchData(id)
        //   } else {
        //     this.postForm = Object.assign({}, defaultForm)
        //   }
        // }
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

          this.postForm = data

        }).catch(err => {
          console.log(err)
        })
      },

      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            var data = this.postForm
            delete data.updateTime
            delete data.createdTime
            // data.publishTime = data.publishTime / 1000
            data.categoryId = data.categoryId + ''
            if (this.isEdit) {
              updateForum(data).then(data => {
                this.loading = false
                if (data.code == 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                  })
                  this.$store.dispatch('delView', this.$route)
                  this.$router.push({
                    path: '/forum/index',
                    query: {
                      t: +new Date()
                    }
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
              createForum(data).then(data => {
                this.loading = false
                if (data.code == 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                  })
                  this.$router.push({
                    path: '/forum/index',
                    query: {
                      t: +new Date()
                    }
                  })
                  this.$store.dispatch('delView', this.$route)
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
  .ck-editor__editable { min-height: 400px !important; }
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
        /*min-height: 500px;*/
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
