<template>
  <div class="createPost-container">

    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-position="left"
      label-width="120px"
      style="width: 50%;margin: auto;padding-bottom: 20px">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="委托人" prop="delegateName">
                <el-input v-model="postForm.delegateName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="委托单位" prop="delegateOrg">
                <!-- <el-input v-model="postForm.delegateOrg"/> -->
                <el-cascader
                  :options="delegateOrgList"
                  v-model="postForm.delegateOrg"
                  :filter-method="remoteSearch"
                  :show-all-levels="false"
                  filterable
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="委托目的" prop="delegateReason">
                <el-input v-model="postForm.delegateReason"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件类别" prop="caseCategory">
                <el-cascader
                  :options="caseCategoryList"
                  v-model="postForm.caseCategory"
                  :filter-method="remoteSearch"
                  :show-all-levels="false"
                  filterable
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="鉴定人" prop="examName">

                <el-input v-model="postForm.examName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="受理时间" prop="delegateTime2">
                <el-date-picker
                  v-model="postForm.delegateTime2"
                  type="date"
                  timestamp
                  placeholder="选择日期"
                  style="width: 100%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="受理人" prop="supportName" >
                <el-select v-model="postForm.supportName" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出具鉴定书时间" prop="documentDate2">
                <el-date-picker
                  v-model="postForm.documentDate2"
                  type="date"
                  timestamp
                  placeholder="选择日期"
                  style="width: 100%"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="简要案情" prop="digest">
                <el-input v-model="postForm.digest" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="伤者情况" prop="deathDetail">
                <el-input v-model="postForm.deathDetail" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">

              <el-form-item label="文书号" prop="documentNo">
                <el-input v-model="postForm.documentNo"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="鉴定结论" prop="conclusion">
                <el-select
                  v-model="postForm.conclusion"
                  filterable
                  clearable
                  class="filter-item"
                  value-key="id"
                  style="width: 100%"
                  @change="selectUpdate">
                  <el-option
                    v-for="item in delegateResultList"
                    :key="item.title"
                    :label="item.title"
                    :value="item.title"/>
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>

          <el-form-item label="是否移交" prop="hasTransfered">
            <el-checkbox v-model="postForm.hasTransfered"/>

          </el-form-item>
          <el-form-item style="margin-bottom: 40px;text-align: center;" label-width="100px">
            <el-button v-loading="loading" style="width: 200px" type="primary" @click="submitForm">保存
            </el-button>
          </el-form-item>

        </div>
      </div>

      <div class="btn-container"/>
    </el-form>
  </div>
</template>

<script>
import { fetchMedicalList, fetchMedical, createMedical, updateMedical } from '@/api/medical'
import { fetchAdminMemberList } from '@/api/permissions'
import { fetchList } from '@/api/dictionary'

export default {
  name: 'Detail',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      delegateResultList: [
        {
          title: '轻微伤'
        }, {
          title: '轻伤二级 '
        }, {
          title: '轻伤一级'
        }, {
          title: '重伤二级'
        }, {
          title: '重伤一级'
        }, {
          title: '未构成轻微伤'
        }, {
          title: '不予评定'
        }, {
          title: '不予受理'
        }, {
          title: '评伤残等级'
        }
      ],
      postForm: {
        id: undefined,
        // 委托单位
        delegateOrg: '',
        // 委托人
        delegateName: '',
        // 简要案情
        digest: '',
        // 伤者情况
        deathDetail: '',
        injure: '',
        // 委托目的
        delegateReason: '',
        delegateTarget: '',
        // 鉴定结论
        conclusion: '',
        delegateResult: '',
        // 鉴定人
        examName: '',
        refereeName: '',
        // 文书号
        documentNo: '',
        // 协办
        supportName: '',
        // 案件类别
        caseCategory: '',
        // 是否移交
        hasTransfered: false,
        delegateTime: '',
        delegateTime2: '',
        documentDate: '',
        documentDate2: ''
      },
      userList: [],
      rules: {},
      loading: false,
      smsContentChange: '',
      caseCategoryList: [],
      delegateOrgList: []
    }
  },
  computed: {
  },
  watch: {

  },
  created() {
    this.getUserList()
    this.restForm()
    this.search('案件类别')
    this.search('报告单位')
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.postForm.id = id
      this.fetchData(id)
    }
    this.postForm.supportName22 = this.$store.getters.id
    // this.postForm.time = (new Date()).toLocaleDateString();
    // this.postForm.documentNo22 = new Date();
  },
  methods: {
    restForm() {
      // this.postForm = {
      //   id: undefined,
      //   delegateOrg: '',
      //   delegateName: '',
      //   digest: '',
      //   injure: '',
      //   delegateTarget: '',
      //   delegateResult: '',
      //   refereeName: '',
      //   documentNo: '',
      //   supportName: '',
      //   caseCategory: '',
      //   hasTransfered: ''
      // }
    },
    getUserList() {
      fetchAdminMemberList({}).then(response => {
        this.userList = response.list.map(data => {
          return {
            id: data.id,
            title: data.realName,
            py: data.pinyinAbbr
          }
        })
      })
    },
    selectUpdate(val) {
      this.$forceUpdate()
    },
    remoteSearch(node, value) {
      var p = /^[a-zA-Z]+$/
      if (p.test(value)) {
        if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return true }
      } else {
        if (node.data.label.indexOf(value) > -1) { return true }
      }
    },
    search(parentName, filter = null) {
      const data = {
        filter: filter,
        parentName: parentName
      }
      fetchList(data).then(response => {
        if (parentName === '案件类别') {
          this.caseCategoryList = this.processData(response.list)
        }
        if (parentName === '报告单位') {
          this.delegateOrgList = this.processData(response.list)
        }
      })
    },
    processData(data) {
      return data.map(item => {
        var sendData = {
          value: item.name,
          label: item.name,
          py: item.pinyinAbbr
        }
        if (item.children.length > 0) {
          sendData.children = this.processData(item.children)
        }

        return sendData
      })
    },

    fetchData(id) {
      fetchMedical(id).then(data => {
        if (data.delegateTime < 1) {
          data.delegateTime2 = Math.round(new Date().getTime())
        } else {
          data.delegateTime2 = data.delegateTime * 1000
        }
        if (data.documentDate < 1) {
          data.documentDate2 = Math.round(new Date().getTime())
        } else {
          data.documentDate2 = data.documentDate * 1000
        }
        this.postForm = Object.assign({}, data)
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      var param = this.postForm
      if (typeof param.caseCategory === 'object') {
        param.caseCategory = param.caseCategory[param.caseCategory.length - 1]
      }
      if (typeof param.delegateOrg === 'object') {
        param.delegateOrg = param.delegateOrg[param.delegateOrg.length - 1]
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            param.documentDate = Math.round(param.documentDate2 / 1000)
            param.delegateTime = Math.round(param.delegateTime2 / 1000)
            param.injure = param.deathDetail
            param.delegateTarget = param.delegateReason
            param.delegateResult = param.conclusion
            param.refereeName = param.examName
            updateMedical(param).then(data => {
              this.loading = false
              if (data) {
                if (data.code === 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                  })
                  this.$store.dispatch('delView', this.$route)
                  this.$router.push({
                    path: '/medical/index',
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
              }
            }).catch(err => {
              console.log(err)
              this.loading = false
            })
          } else {
            createMedical(param).then(data => {
              this.loading = false
              if (data.code === 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  showClose: true,
                  duration: 1000
                })
                this.$store.dispatch('delView', this.$route)
                this.$router.push({
                  path: '/medical/index',
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
