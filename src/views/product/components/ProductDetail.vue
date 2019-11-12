<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="项目名:" prop="title" required>
                <el-input :rows="1" v-model="postForm.title" autosize placeholder="必填，请输入项目名"/>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item
                style="margin-bottom: 40px;"
                label-width="100px"
                label="项目地址:"
                prop="productAddress"
                required>
                <el-input :rows="1" v-model="postForm.productAddress" autosize placeholder="必填，请输入项目地址"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="销楼部地址:" prop="sellAddress" required>
                <el-input :rows="1" v-model="postForm.sellAddress" autosize placeholder="必填，请输入销楼部地址"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="联系电话:" prop="telephone" required>
                <el-input :rows="1" v-model="postForm.telephone" autosize placeholder="必填，请输入联系电话"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="业务归属:" prop="categoryId" required>
                <el-select v-model="postForm.categoryId" placeholder="请选择">
                  <el-option
                    v-for="item in businessCategories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="开发商:" prop="developer" required>
                <el-input :rows="1" v-model="postForm.developer" autosize placeholder="必填，请输入开发商"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产权类型:" prop="houseType" required>
                <el-input :rows="1" v-model="postForm.houseType" autosize placeholder="必填，请输入产权类型"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                style="margin-bottom: 40px;"
                label-width="100px"
                label="物业公司:"
                prop="propertyCompany"
                required>
                <el-input :rows="1" v-model="postForm.propertyCompany" autosize placeholder="必填，请输入物业公司"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="绿化率:" prop="green" required>
                <el-input :rows="1" v-model="postForm.green" autosize placeholder="必填，请输入绿化率"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="物业费:" prop="propertyFee" required>
                <el-input :rows="1" v-model="postForm.propertyFee" autosize placeholder="必填，请输入物业费"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                style="margin-bottom: 40px;"
                label-width="100px"
                label="产权年限:"
                prop="propertyRightDuration"
                required>
                <el-input :rows="1" v-model="postForm.propertyRightDuration" autosize placeholder="必填，请输入产权年限"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="建筑面积:" prop="area" required>
                <el-input :rows="1" v-model="postForm.area" autosize placeholder="必填，请输入建筑面积"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="规划户数:" prop="totalHouse" required>
                <el-input :rows="1" v-model="postForm.totalHouse" autosize placeholder="必填，请输入规划户数"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="建筑形式:" prop="archType" required>
                <el-input :rows="1" v-model="postForm.archType" autosize placeholder="必填，请输入建筑形式"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="装修情况:" prop="decoration" required>
                <el-input :rows="1" v-model="postForm.decoration" autosize placeholder="必填，请输入装修情况"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="容积率:" prop="volumn" required>
                <el-input :rows="1" v-model="postForm.volumn" autosize placeholder="必填，请输入容积率"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="突出业态:" prop="flag" required>
                <el-input :rows="1" v-model="postForm.flag" autosize placeholder="必填，楼盘突出的优点"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="项目状态:" prop="process" required>
                <el-select v-model="postForm.process">
                  <el-option key="0" label="留空" value="0"/>
                  <el-option key="1" label="在售" value="1"/>
                  <el-option key="2" label="售罄" value="2"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="status" label="是否启用:">
                <el-select v-model="postForm.status">
                  <el-option key="1" label="启用" value="1"/>
                  <el-option key="2" label="禁用" value="2"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="排序:">
                <el-input :rows="1" v-model="postForm.sort" autosize placeholder="选填，请输入排序数值，值越大越靠前"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="项目坐标经度:">
                <el-input
                  :rows="1"
                  v-model="postForm.longitude"
                  autosize
                  placeholder="选填，请输入项目坐标经度，查询地址：http://api.map.baidu.com/lbsapi/getpoint/index.html"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="项目坐标纬度:">
                <el-input
                  :rows="1"
                  v-model="postForm.latitude"
                  autosize
                  placeholder="选填，请输入项目坐标纬度，查询地址：http://api.map.baidu.com/lbsapi/getpoint/index.html"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="项目简介:" prop="digest" required>
                <el-input :rows="4" v-model="postForm.digest" type="textarea" placeholder="必填，请输入项目简介"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                style="margin-bottom: 40px;"
                label-width="100px"
                label="项目首图 560*345"
                prop="headPic"
                required>
                <Upload v-model="postForm.headPic"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
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
import { fetchProduct, updateProduct, createProduct, listBusinessCategory } from '@/api/product'

const defaultForm = {
  title: '',
  process: '0',
  telephone: '',
  productAddress: '',
  sellAddress: '',
  flag: '',
  categoryId: '1',
  status: '1',
  sort: 1,
  content: '',
  digest: '',
  headPic: '',
  developer: '',
  houseType: '',
  propertyCompany: '',
  green: '',
  propertyFee: '',
  propertyRightDuration: '',
  area: '',
  totalHouse: '',
  archType: '',
  decoration: '',
  volumn: '',
  longitude: 0.000000,
  latitude: 0.000000,
  id: 0

}

export default {
  name: 'ProductDetail',
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
      businessCategories: [],
      rules: {
        title: [{ validator: validateRequire }],
        process: [{ validator: validateRequire }],
        partment: [{ validator: validateRequire }],
        telephone: [{ validator: validateRequire }],
        productAddress: [{ validator: validateRequire }],
        sellAddress: [{ validator: validateRequire }],
        flag: [{ validator: validateRequire }],
        categoryId: [{ validator: validateRequire }],
        status: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        digest: [{ validator: validateRequire }],
        headPic: [{ validator: validateRequire }]
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
    // 获取业务列表
    listBusinessCategory().then(data => {
      this.businessCategories = []
      data.categories.map(each => {
        this.businessCategories.push({
          id: each.id + '',
          name: each.name
        })
      })
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
      fetchProduct(id).then(data => {
        data.process = data.process + ''
        data.status = data.status + ''
        this.postForm = data
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改项目' : 'Edit Project'
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
          if (this.isEdit) {
            updateProduct(data).then(data => {
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
            createProduct(data).then(data => {
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
