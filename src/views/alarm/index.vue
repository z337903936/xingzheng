<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px">
      <div><el-date-picker
        v-model="searchTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="timestamp"
      />
        <el-select
          v-model="listQuery.leaderName"
          :filter-method="filterUserSearch"
          filterable
          placeholder="带班领导"
          center
          @visible-change="restUserSearch">
          <el-option
            v-for="item in userShowList"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
        <el-select
          v-model="listQuery.receiptName"
          :filter-method="filterUserSearch"
          filterable
          placeholder="接警人"
          center
          @visible-change="restUserSearch">
          <el-option
            v-for="item in userShowList"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
        <el-select
          v-model="listQuery.reporterName"
          :filter-method="filterUserSearch"
          filterable
          placeholder="报告人"
          center
          @visible-change="restUserSearch">
          <el-option
            v-for="item in userShowList"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
        <div style="margin-top: 10px">
          <el-input
                  v-model="listQuery.reporterOrg"
                  placeholder="报告单位"
                  style="width: 200px;"
                  @keyup.enter.native="handleFilter"/>

          <el-cascader
                  :options="caseCategoryList"
                  v-model="listQuery.caseCategory"
                  :filter-method="filterSearch"
                  :show-all-levels="false"
                  @change="countDict"
                  placeholder="案件类别"
                  filterable
          />
          <el-select
                  v-model="listQuery.status"
                  placeholder="状态"
                  center
          >
            <el-option
                    v-for="item in statusList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"/>
          </el-select>
          <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="float: right;margin-right: 20px">
            搜索
          </el-button>
          <router-link :to="'/alarm/create-alarm/'" style="float: right;margin-right: 10px">
            <el-button v-waves type="primary" icon="el-icon-edit">添加</el-button>
          </router-link>
        </div>


        <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">-->
        <!--导出-->
        <!--</el-button>-->
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="接警号" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接警时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.receiptTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报告人" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.reporter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报告单位" align="center" width="190">
        <template slot-scope="{row}">
          <span>{{ row.reportOrg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.contactPhoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案件类别" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="技术员" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.techName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/alarm/edit-alarm/'+row.id">
            <el-button v-waves type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button v-waves :disabled="judge(row)" type="primary" size="mini" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
          <el-button v-waves :disabled="judgeG(row)" type="primary" size="mini" style="width: 80px" v-if="row.status === 1"  @click="handleAcceptTask(row)">接收任务</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-count="pages"
      :current-page.sync="listQuery.page"
      :hide-on-single-page="paginationShow"
      background
      layout="prev, pager, next"
      @current-change="getList"
      @size-change="getList"
    />

    <el-dialog
      :visible.sync="dialogDelete"
      title="提示"
      width="30%"
    >
      <span>是否确定删除该条数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteData()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
import { alarmList, fetchAlarm, createAlarm, updateAlarm, deleteAlarm } from '@/api/alarm'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { fetchAdminMemberList } from '@/api/permissions'
import { fetchList } from '@/api/dictionary'
import { accetpTask } from '@/api/backlog'

const statusMap =[
  {
    id:0,
    title:'全部'
  },
  {
    id:1,
    title:'未领取'
  },{
    id:2,
    title:'进行中'
  },{
    id:3,
    title:'已完成'
  },
];


export default {
  name: 'Alarm',
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '未领取',
        2: '进行中',
        3: '已完成'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      statusList: statusMap,
      list: null,
      pages: 0,
      listLoading: true,
      paginationShow: true,
      dialogDelete: false,
      searchTime: '',
      limit: 20,
      listQuery: {
        page: 1,
        beginTime: undefined,
        endTime: undefined,
        leaderName: undefined,
        receiptName: undefined,
        reporterOrg: undefined,
        reporterName: undefined,
        caseCategoryId: undefined,
        status: 0
      },
      rules: {},
      userList: [],
      userShowList: [],
      caseCategoryList: [],
      downloadLoading: false,
      deleteId: '',
      userId: '',
      dialogFormAccept:false,
      acceptTaskFrom:{
        recordNo:'',
      },
    }
  },
  created() {
    this.getList()
    this.getUserList()
    this.userId = this.$store.getters.id

    this.search('案件类别').then(data => {
      this.caseCategoryList = this.processData(data.list)
    })
  },
  methods: {
    countDict(val){
      val = val.slice(-1)[0]
      const send={
        name:val
      };
      this.$store.dispatch('PostUserUseDict', send)
    },
    handleAcceptTask(task){
      let data = this.acceptTaskFrom;
      data.recordNo = task.recordNo;
      accetpTask(data).then(response=>{
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
          this.$router.push({
            path: '/search/update-search/'+response.evidenceId,
            query: {
              t: +new Date()
            }
          })
        } else {
          this.$message({
            message: response.reason,
            type: 'success',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    acceptTask(){

    },
    judge(data) {
      if (this.userId === data.createUid) { return false } else { return true }
    },
    judgeG(data) {
      if (this.$store.getters.groupName.indexOf('痕检') > -1) { return false } else { return true }
    },
    search(parentName, filter = null) {
      return new Promise((resolve, reject) => {
        const data = {
          filter: filter,
          parentName: parentName
        }
        resolve(fetchList(data))
      })
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
        this.userShowList = this.userList
      })
    },
    getList() {
      this.listLoading = true
      alarmList(this.listQuery).then(response => {
        this.list = response.list
        this.pages = response.pages

        // Just to simulate the time of the request

        this.listLoading = false

      })
    },
    filterSearch(node, value) {
      var p = /^[a-zA-Z]+$/
      if (p.test(value)) {
        if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return true }
      } else {
        if (node.data.label.indexOf(value) > -1) { return true }
      }
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
    filterUserSearch(value) {
      if (value) {
        this.userShowList = this.userList.filter(data => {
          var p = /^[a-zA-Z]+$/
          if (p.test(value)) {
            if (data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return data }
          } else {
            if (data.title.indexOf(value) > -1) { return data }
          }
        })
      } else {
        this.userShowList = this.userList
      }
    },
    restUserSearch(change) {
      if (!change) {
        this.userShowList = this.userList
      }
    },
    handleDelete(data) {
      this.dialogDelete = true
      this.deleteId = data.id
    },
    deleteData() {
      const data = {
        id: this.deleteId,
        operation: 'del'
      }
      deleteAlarm(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
          this.dialogDelete = false
          this.getList()
        } else {
          this.$message({
            message: response.reason,
            type: 'success',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    handleFilter() {
      if (this.searchTime) {
        if (this.searchTime[0].toString().length > 10) { this.listQuery.beginTime = this.searchTime[0] / 1000 }
        if (this.searchTime[1].toString().length > 10) { this.listQuery.endTime = this.searchTime[1] / 1000 }
      }
      this.listQuery.page = 1
      this.getList()
    },

    handleDownload() {
      this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                  const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
                  const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
                  const data = this.formatJson(filterVal, this.list)
                  excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: 'table-list'
                  })
                  this.downloadLoading = false
                })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }

  }
}
</script>
