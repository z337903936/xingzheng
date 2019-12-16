<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="9">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="分类名字:" required>
                <el-input :rows="1" v-model="postForm.name" autosize placeholder="必填项，请输入分类名字"/>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="是否显示:">
                <el-select :rows="1" v-model="postForm.status" clearable>
                  <el-option key="1" label="显示" value="1"/>
                  <el-option key="2" label="隐藏" value="2"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="备注:">
                <el-input :rows="1" v-model="postForm.note" autosize placeholder="选填，请输入备注"/>
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

      <div class="btn-container"/>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/singleImage3'
import { validateNumber } from '@/utils/validate'
import { fetchCategory, updateCategory, createCategory } from '@/api/category'

const defaultForm = {
  name: '',
  note: '',
  status: '1',
  sort: 1,
  id: 0
}

export default {
  name: 'CategoryDetail',
  components: { Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
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
        sort: [{ validator: validateOrder, trigger: 'blur' }]
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
      console.log(this.postForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchCategory(id).then(data => {
        data.categoryType = data.categoryType.toString()
        data.status = data.status.toString()
        this.postForm = data
      }).catch(err => {
        console.log(err)
      })
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
      this.loading = true
      var data = this.postForm
      if (this.isEdit) {
        updateCategory(data).then(data => {
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
        createCategory(data).then(data => {
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
