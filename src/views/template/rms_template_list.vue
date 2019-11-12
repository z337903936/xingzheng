<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="用户ID">
        <el-input v-model="listQuery.uid" placeholder="用户ID" size="small"/>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="listQuery.title" placeholder="标题" size="small"/>
      </el-form-item>
      <el-form-item label="模板ID">
        <el-input v-model="listQuery.selfTemplateId" placeholder="模板ID" size="small"/>
      </el-form-item>
      <el-form-item label="梦网ID">
        <el-input v-model="listQuery.thirdTemplateId" placeholder="梦网ID" size="small"/>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="listQuery.beginTime"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="请选择开始时间" size="small"/>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="listQuery.endTime"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="请选择结束时间" size="small"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="4" v-for="(each, index) in list" :key="index" :offset="1">
        <el-card :body-style="{ padding: '10px' }" shadow="hover">
          <!--<img :src="each.shotImg" class="image"/>-->
          <d-player ref="player" :options="{
                    video: {
                            url: each.shotImg,
                     }}">
          </d-player>
          <div style="padding: 14px;">
            <span>{{each.title}}</span>
            <div class="bottom clearfix">
              <time class="time">模板ID：{{ each.thirdTemplateId }}</time>
            </div>
            <div class="bottom clearfix btnDiv">
              <el-button type="primary" class="button" @click="goToEditPage(each)">编辑</el-button>
              <el-button type="success" class="button" @click="showSendDialog(each)">发送</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="currentTemplate.title"
      :visible.sync="dialogVisible"
      width="80%">
      <el-form :model="postForm">
        <el-form-item label="要发送的模板" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input v-model="postForm.title" autocomplete="off" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="模板ID" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input v-model="postForm.thirdTemplateId" autocomplete="off" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选择扣费用户" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input v-model="postForm.username" autocomplete="off" disabled></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="small" icon="el-icon-money" style="margin-left: 20px"
                       @click="selectMembers()">选择用户
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-money" @click="useSystem()">由系统发送</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="操作员密码" :label-width="formLabelWidth" required>
          <el-col :span="8">
            <el-input v-model="postForm.password" autocomplete="off" required></el-input>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label="短信验证码" prop="vCode" required :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input v-model="postForm.vCode" autosize placeholder="短信验证码" required/>
          </el-col>
          <el-col :span="8">
            <el-button :disabled="disabled=!show" icon="el-icon-mobile-phone" type="success" style="margin-left: 20px"
                       @click="requestVCode">
              <span v-show="show">获取验证码</span>
              <span v-show="!show" class="count">{{ count }} s</span>
            </el-button>
          </el-col>

        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" required>
          <el-col :span="16">
            <el-input :rows="4" type="textarea" v-model="postForm.phoneNumber" autosize
                      placeholder="请输入要发送的电话号码，多个号码，以英文逗号隔开，一次最多5000个电话号码" required/>
          </el-col>

        </el-form-item>
      </el-form>

      <el-dialog
        width="40%"
        title="选择用户"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form inline>
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
        <pagination v-show="memberQuery.total>0" :total="memberQuery.total" :page.sync="memberQuery.page" small
                    hide-on-single-page
                    @pagination="listMembers"/>
        <el-table v-loading="listMemberLoading" :data="members" border fit highlight-current-row style="width: 100%"
                  type="selection" ref="membersTable"
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

      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">返 回</el-button>
            <el-button type="primary" @click="handleSendTemplate">发 送</el-button>
      </span>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
  import { listTemplate, sendByTemplate } from '@/api/template'
  import { fetchMembersList } from '@/api/members'
  import { requestSMS } from '@/api/sms'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import VueDPlayer from 'vue-dplayer'
  import 'vue-dplayer/dist/vue-dplayer.css'

  export default {
    name: 'TemplateList',
    components: { Pagination, 'd-player': VueDPlayer },
    filters: {
      statusFilter(status) {
        const statusMap = {
          true: 'success',
          false: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        currentDate: new Date(),
        dialogVisible: false,
        innerVisible: false,
        listMemberLoading: true,
        currentTemplate: {},
        members: [],
        show: true,
        count: '',
        timer: null,
        phoneNumbersToSend: '',
        formLabelWidth: '150px',
        memberFormLabelWidth: '80px',

        uid: 0,
        listQuery: {
          uid: '',
          itemId: '1',
          beginTime: '',
          endTime: '',
          page: 1
        },
        memberQuery: {
          uid: '',
          filter: '',
          total: 1,
          page: 1
        },
        postForm: {
          phoneNumber: '',
          vCode: '',
          password: '',
          templateId: '',
          title: '',
          uid: '0',
          username: '系统'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      goToEditPage(each) {
        this.$router.push({ path: '/template/edit/' + each.id })
      },
      showSendDialog(template) {
        this.currentTemplate = template
        this.dialogVisible = true
        this.postForm.title = this.currentTemplate.title
        this.postForm.templateId = this.currentTemplate.selfTemplateId
      },
      handleCurrentSelect(currentRow) {
        var name = currentRow.realName
        if (!name) name = currentRow.nickName
        if (!name) name = currentRow.phoneNumber
        this.postForm.uid = currentRow.id
        this.postForm.username = name
        this.$refs.membersTable.clearSelection();
        this.$refs.membersTable.toggleRowSelection(currentRow);
      },
      useSystem() {
        this.postForm.uid = 0
        this.postForm.username = '系统'
      },
      selectMembers() {
        this.innerVisible = true
        this.listMembers()
      },
      handleSendTemplate() {
        this.loading = true
        var data = this.postForm
        sendByTemplate(data).then(data => {
          this.loading = false
          if (data.code === 200) {
            this.$message({
              message: '发送成功',
              type: 'success',
              showClose: true,
              duration: 1000
            })
          } else {
            this.$message({
              message: data.reason,
              type: 'error',
              showClose: true,
              duration: 2000
            })
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      },
      getList() {
        this.listLoading = true
        listTemplate(this.listQuery).then(data => {
          this.list = data.list
          this.list.map(each => {
            if (!each.shotImg) each.shotImg = 'https://img.wanl.com.cn/defalut-template-img.jpg'
          })
          this.total = data.pages
          this.listLoading = false
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
      requestVCode() {
        requestSMS().then(data => {
          this.loading = false
          if (data.code == 200) {
            this.$message({
              message: '短信已发送，请注意查收',
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
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .carousel_img {
    width: 30%;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .pre-button {
    margin: 0 10px;
  }

  .btnDiv {
    display: flex;
  }

  .button {
    width: 25%;
    flex: 1 0 auto;
    padding: 5px 5px;
    margin: 0 10px;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .pagination-container {
    padding: 2px 16px !important;
    margin-top: 2px !important;
    margin-bottom: 10px !important;
  }
</style>
