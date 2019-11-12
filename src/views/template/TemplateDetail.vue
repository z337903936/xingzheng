<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="120px" label="名字:" required>
                <el-input :rows="1" v-model="postForm.name" autosize placeholder="必填，请输入模板名字" required/>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item style="margin-bottom: 40px;" label-width="120px" label="标题:" required>
                <el-input :rows="1" v-model="postForm.title" autosize placeholder="必填，请输入模板标题" required/>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="120px" label="梦网ID:" required>
                <el-input :rows="1" v-model="postForm.thirdTemplateId" autosize placeholder="必填，梦网模板ID" required/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="120px" label="是否启用:">
                <el-select v-model="postForm.enable">
                  <el-option key="true" label="启用" value="true"/>
                  <el-option key="false" label="停用" value="false"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="120px" label="状态:">
                <el-select v-model="postForm.status">
                  <el-option key="1" label="草稿" value="1"/>
                  <el-option key="2" label="提交到平台审核" value="2"/>
                  <el-option key="3" label="平台拒绝" value="3"/>
                  <el-option key="4" label="正在提交到运营商审核" value="4"/>
                  <el-option key="5" label="已提交到运营商审核" value="5"/>
                  <el-option key="6" label="未通过运营商审核" value="6"/>
                  <el-option key="7" label="通过运营商审核" value="7"/>
                  <el-option key="8" label="模板被运营商禁用" value="8"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="选择归属用户" label-width="120px">
              <el-col :span="6">
                <el-input v-model="postForm.username" autocomplete="off" disabled></el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" icon="el-icon-money" style="margin-left: 20px"
                           @click="selectMembers()">选择用户
                </el-button>
                <el-button type="primary" icon="el-icon-money" @click="useSystem()">归属系统</el-button>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="绑定发送API帐号" label-width="120px">
              <el-col :span="6">
                <el-input v-model="postForm.apiAccountName" autocomplete="off" disabled></el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" icon="el-icon-money" style="margin-left: 20px"
                           @click="selectApiAccount()">选择帐号
                </el-button>
                <el-button type="primary" icon="el-icon-money" @click="useSystemApiAccount()">系统默认</el-button>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item style="margin-bottom: 40px;" label-width="120px" label="备注:">
                <el-input :rows="4" type="textarea" v-model="postForm.note" autosize placeholder="选填，请输入备注"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="120px" label="封面视频">
                <Upload v-model="postForm.shotImg"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="120px">
                <el-button v-loading="loading" :rows="1" style="width: 100%" type="primary" @click="submitForm">保存
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-dialog
          width="50%"
          title="选择用户"
          :visible.sync="innerVisible"
          append-to-body>
          <el-form :inline="true">
            <el-form-item label="用户ID" :label-width="memberFormLabelWidth">
              <el-input v-model="memberQuery.uid" placeholder="用户ID"/>
            </el-form-item>
            <el-form-item label="关键字" :label-width="memberFormLabelWidth">
              <el-input v-model="memberQuery.filter" placeholder="手机号码、姓名、昵称、"/>
            </el-form-item>
            <el-form-item :label-width="memberFormLabelWidth">
              <el-button type="primary" icon="el-icon-search" @click="listMembers">查询</el-button>
            </el-form-item>
          </el-form>
          <pagination v-show="memberQuery.total>0" :total="memberQuery.total" :page.sync="memberQuery.page"
                      hide-on-single-page
                      @pagination="listMembers"/>
          <el-table v-loading="listMemberLoading" :data="members" border fit highlight-current-row style="width: 100%"
                    highlight-current-row type="selection" ref="membersTable"
                    @current-change="handleCurrentSelect" @select="handleCurrentSelect">
            <el-table-column
              type="selection"
              width="55"></el-table-column>
            <el-table-column label="UID">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号码">
              <template slot-scope="scope">
                <span>{{ scope.row.phoneNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column label="会员姓名">
              <template slot-scope="scope">
                <span>{{ scope.row.realName ? scope.row.realName : scope.row.nickName }}</span>
              </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status == 1?'正常':'停用' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

        </el-dialog>
        <el-dialog
          width="50%"
          title="选择API帐号"
          :visible.sync="innerApiVisible"
          append-to-body>
          <el-table v-loading="listApiAccountLoading" :data="apiAccounts" border fit highlight-current-row
                    style="width: 100%"
                    highlight-current-row type="selection" ref="apiTable"
                    @current-change="handleSelectApiAccount" @select="handleSelectApiAccount">
            <el-table-column
              type="selection"
              width="55"></el-table-column>
            <el-table-column label="ID">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="帐号">
              <template slot-scope="scope">
                <span>{{ scope.row.accountId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="帐号类型">
              <template slot-scope="scope">
                <span>{{ showType(scope.row.accountType) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="帐号说明">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

          </el-table>

        </el-dialog>
      </div>

      <div class="btn-container"/>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/Upload/singleVideo'
  import { fetchMembersList } from '@/api/members'
  import { fetchAccountsList } from '@/api/api'
  import { validateURL, validateNumber } from '@/utils/validate'
  import { fetchTemplate, updateTemplate, addTemplate } from '@/api/template'
  import Pagination from '@/components/Pagination'

  const defaultForm = {
    name: '',
    title: '',
    uid: 0,
    enable: '', // 备注
    status: '',
    itemId: '1',
    apiAccountId: 0,
    apiAccountName: '',
    thirdTemplateId: '',
    note: 1,
    shotImg: '',
    username: '',
    id: 0
  }

  export default {
    name: 'TemplateDetail',
    components: { Upload, Pagination },
    filters: {
      statusFilter(status) {
        const statusMap = {
          true: 'success',
          false: 'danger'
        }
        return statusMap[status]
      }
    },
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
        memberFormLabelWidth: '80px',
        userListOptions: [],
        rules: {
          imgUrl: [{ validator: validateRequire }],
          mobileImgUrl: [{ validator: validateRequire }],
          displayOrder: [{ validator: validateOrder, trigger: 'blur' }]
        },
        tempRoute: {},
        dialogVisible: false,
        innerVisible: false,
        listMemberLoading: true,
        currentTemplate: {},
        members: [],
        show: true,
        count: '',
        timer: null,
        phoneNumbersToSend: '',
        innerApiVisible: false,
        listApiAccountLoading: false,
        apiAccounts: [],
        memberQuery: {
          uid: '',
          filter: '',
          total: 1,
          page: 1
        }
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
      showType(accountType) {
        if (accountType === 'experience') {
          return '体验帐号'
        } else if (accountType === 'normal') return '发送帐号'
        return '未分类'
      },
      handleCurrentSelect(currentRow) {
        var name = currentRow.realName
        if (!name) name = currentRow.nickName
        if (!name) name = currentRow.phoneNumber
        this.postForm.uid = currentRow.id
        this.postForm.username = name
        this.$refs.membersTable.clearSelection()
        this.$refs.membersTable.toggleRowSelection(currentRow)
      },
      handleSelectApiAccount(currentRow) {
        this.postForm.apiAccountId = currentRow.id
        this.postForm.apiAccountName = currentRow.note
        this.$refs.apiTable.clearSelection()
        this.$refs.apiTable.toggleRowSelection(currentRow)
      },
      useSystem() {
        this.postForm.uid = 0
        this.postForm.username = '系统'
      },
      useSystemApiAccount() {
        this.postForm.apiAccountId = 0
        this.postForm.apiAccountName = '由系统默认'
      },
      selectMembers() {
        this.innerVisible = true
        this.listMembers()
      },
      selectApiAccount() {
        this.innerApiVisible = true
        this.listApiAccount()
      },
      listApiAccount() {
        this.listApiAccountLoading = true
        var query = {
          itemId: 1,
          status: 1
        }
        fetchAccountsList(query).then(data => {
          this.apiAccounts = data.list
          this.listApiAccountLoading = false
        })
      },
      listMembers() {
        this.listMemberLoading = true
        fetchMembersList(this.memberQuery).then(data => {
          this.members = data.list
          this.memberQuery.total = data.pages
          this.listMemberLoading = false
        })
      },
      fetchData(id) {
        fetchTemplate(id).then(data => {
          data.enable = data.enable.toString()
          data.status = data.status.toString()
          this.postForm = data
          this.postForm.apiAccountId = data.accountId
          if (data.accountId === 0) {
            this.postForm.apiAccountName = '系统默认'
          } else {
            this.postForm.apiAccountName = data.note
          }
          if (data.uid === 0) {
            this.postForm.username = '系统'
          } else {
            this.postForm.username = data.userName
          }

          this.setTagsViewTitle()
        }).catch(err => {
          console.log(err)
        })
      },
      setTagsViewTitle() {
        const title = this.lang === 'zh' ? '修改模板' : 'Edit Carousel'
        const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
        this.$store.dispatch('updateVisitedView', route)
      },
      submitForm() {
        this.loading = true
        var data = this.postForm
        data.enable = (this.postForm.enable === 'true')
        if (this.isEdit) {
          updateTemplate(data).then(data => {
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
          addTemplate(data).then(data => {
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

  .pagination-container {
    padding: 2px 16px !important;
    margin-top: 2px !important;
    margin-bottom: 10px !important;
  }
</style>
