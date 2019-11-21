<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="left" label-width="120px"
             style="width: 50%;margin: auto;padding-bottom: 20px">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="委托人" prop="delegateOrg">
                <el-input v-model="postForm.delegateOrg"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="委托单位" prop="delegateName">
                <el-input v-model="postForm.delegateName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="委托目的" prop="delegateTarget">
                <el-input v-model="postForm.delegateTarget"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件类别" prop="caseCategory">
                <el-input v-model="postForm.caseCategory"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="鉴定人" prop="refereeName">

                <el-input v-model="postForm.refereeName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文书号" prop="documentNo">
                <el-input v-model="postForm.documentNo"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="协办" prop="supportName" >
                <el-input v-model="postForm.supportName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="鉴定结论" prop="delegateResult">
                <el-input v-model="postForm.delegateResult" :autosize="{ minRows: 2, maxRows: 4}"   type="textarea"/>
              </el-form-item>

            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="简要案情" prop="digest">
                <el-input v-model="postForm.digest" :autosize="{ minRows: 2, maxRows: 4}"   type="textarea"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="伤者情况" prop="injure">
                <el-input v-model="postForm.injure" :autosize="{ minRows: 2, maxRows: 4}"   type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>


          <el-form-item label="是否移交" prop="hasTransfered">
            <el-checkbox v-model="postForm.hasTransfered"></el-checkbox>

          </el-form-item>

          <el-row>
            <el-col :span="8" :offset="16">
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
  import {fetchMedicalList, fetchMedical, createMedical, updateMedical} from '@/api/medical'
  import { fetchAdminMemberList} from '@/api/permissions'

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
      postForm: {
        id: undefined,
        delegateOrg: '',
        delegateName: '',
        digest: '',
        injure: '',
        delegateTarget: '',
        delegateResult: '',
        refereeName: '',
        documentNo: '',
        supportName: '',
        caseCategory: "",
        hasTransfered: '',
      },
      userList: [],
      rules:{},
      loading:false,
      smsContentChange:'',
    }
  },
  computed: {
  },
  watch : {

  },
  created() {
    this.getUserList()
    this.restForm();
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.postForm.id = id;
      this.fetchData(id)
    }
  },
  methods: {
    restForm(){
      this.postForm={
        id: undefined,
        delegateOrg: '',
        delegateName: '',
        digest: '',
        injure: '',
        delegateTarget: '',
        delegateResult: '',
        refereeName: '',
        documentNo: '',
        supportName: '',
        caseCategory: "",
        hasTransfered: '',
      }
    },
    getUserList(){
      fetchAdminMemberList({}).then(response => {
        this.userList = response.list.map(data => {
          return {
            id: data.id,
            title: data.realName
          }
        })
      })
    },

    fetchData(id) {
      fetchMedical(id).then(data => {
       this.postForm =  Object.assign({}, data);

      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      var data = this.postForm;
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateMedical(data).then(data => {
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
            createMedical(data).then(data => {
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
