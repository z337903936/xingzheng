<template>
  <div class="app-container">
    <div class="filter-container">
      <div><el-date-picker
        v-model="searchTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        style="width: 405px;"
      />

        <el-cascader
          :options="caseHappenRegionList"
          v-model="listQuery.caseHappenRegion"
          :filter-method="filterSearch"
          :show-all-levels="false"
          :props="emitProps"
          placeholder="案发区划"
          filterable
          style="width: 200px"
          @change="countDict($event,'行政区划')"
        />

        <el-cascader
          :options="caseTypeList"
          v-model="listQuery.caseCategory"
          :filter-method="filterSearch"
          :show-all-levels="false"
          :props="emitProps"
          placeholder="案件类别"
          filterable
          style="width: 200px"
          @change="countDict($event,'案件类别')"
        />
        <div style="margin-top: 15px">
          <el-select
            v-model="listQuery.mainChargerName"
            :filter-method="filterUserSearch"
            filterable
            placeholder="主办人"
            center
            @visible-change="restUserSearch">
            <el-option
              v-for="item in userShowList"
              :key="item.id"
              :label="item.title"
              :value="item.id"/>
          </el-select>
          <el-select
            v-model="listQuery.supporterName"
            :filter-method="filterUserSearch"
            filterable
            placeholder="协办人"
            center
            @visible-change="restUserSearch">
            <el-option
              v-for="item in userShowList"
              :key="item.id"
              :label="item.title"
              :value="item.id"/>
          </el-select>
          <el-input
            v-model="listQuery.filters"
            placeholder="关键字"
            style="width: 200px;"
            @keyup.enter.native="handleFilter"/>
          <el-button v-waves :loading="downloadLoading" style="float: right;margin-right: 10px" type="primary" icon="el-icon-download" @click="handleExportExcel">
            导出
          </el-button>
          <el-button
            v-waves
            type="primary"
            icon="el-icon-refresh"
            style="float: right;margin-right: 20px"
            @click="reset">
            清空搜索条件
          </el-button>
          <el-button v-waves type="primary" icon="el-icon-search" style="float: right;margin-right: 20px" @click="handleFilter">
            搜索
          </el-button>
          <router-link :to="'/search/create-search/'" style="float: right;margin-right: 10px">
            <el-button type="primary" icon="el-icon-edit">添加</el-button>
          </router-link>
        </div>

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
      <el-table-column label="勘查号" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.selfEvidenceNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发案日期" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发案地址" width="350" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发案区划" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseHappenRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案件类别" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主办" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.mainChargerName.replace(/,/g," ") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协办" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.supporterName.replace(/,/g," ") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法医" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.medicalName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否死亡" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.isDeathCase?'是':'否' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="380" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--<router-link :to="'/search/update-search/'+row.id" >-->
          <!--</router-link>-->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button :disabled="Disable(row)" type="primary" size="mini" icon="el-icon-edit" @click="gotoUpdate(row)"/>

          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <router-link :to="'/search/show-search/'+row.id">
              <el-button type="primary" plain size="mini" icon="el-icon-zoom-in" />
            </router-link>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="物证去向" placement="top">
            <router-link :to="'/transferLog/index/'+row.id">
              <el-button type="success" size="mini" icon="el-icon-document"/>
            </router-link>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="导出现勘详情" placement="top">
            <el-button size="mini" type="warning" icon="el-icon-download" @click="handleExportExcelAlone(row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="导出分析报告" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-notebook-2"
              style="margin-left: 0"
              @click="handleExportAnalysisReport(row)"/>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-count="pages"
      :current-page.sync="listQuery.page"
      :hide-on-single-page="paginationShow"
      background
      layout="prev, pager, next"
      style="float: right;margin-top: 15px"
      @current-change="getList"
      @size-change="getList"
    />

  </div>
</template>

<script>
import { searchList, exportExcelAlone, exportAnalysisReport, exportExcel } from '@/api/search'
import waves from '@/directive/waves' // waves directive
import { fetchList } from '@/api/dictionary'
import { parseTime } from '@/utils'
import { fetchAdminMemberList } from '@/api/permissions'

export default {
  name: 'Search',

  directives: { waves },
  filters: {
    // statusFilter(status) {
    //     const statusMap = {
    //         1: '未领取',
    //         2: '进行中',
    //         3: '已完成'
    //     }
    //     return statusMap[status]
    // }
  },
  data() {
    return {
      emitProps: {
        emitPath: false
      },
      tableKey: 0,
      list: null,
      pages: 0,
      listLoading: true,
      paginationShow: true,
      searchTime: '',
      limit: 20,
      listQuery: {
        page: 1,
        caseHappenRegion: undefined,
        caseCategory: undefined,
        mainChargerName: undefined,
        supporterName: undefined,
        beginTime: undefined,
        endTime: undefined,
        filters: undefined,
        status: 0
      },
      caseTypeList: [],
      userShowList: [],
      caseHappenRegionList: [],

      calendarTypeOptions: {},
      downloadLoading: false,
      userId: ''
    }
  },
  created() {
    this.getList()
    this.getUserList()
    this.search('案件类别').then(response => {
      this.caseTypeList = this.processData(response.list)
    })
    this.search('行政区划').then(data => {
      this.caseHappenRegionList = this.processData(data.list)
    })
    this.userId = this.$store.getters.id
  },
  methods: {
    gotoUpdate(row) {
      this.$router.push({ path: '/search/update-search/' + row.id })
    },
    Disable(row) {
      return this.userId !== row.createUid
    },
    handleExportExcelAlone(row) {
      exportExcelAlone(row.id).then(response => {
        var blob = new Blob([response], { type: 'data:application/vnd.ms-excel' })
        var downloadUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = downloadUrl
        a.download = '现勘' + row.selfEvidenceNo + '.xls'
        document.body.appendChild(a)
        a.click()
        // let blob = new Blob([response], {type: "application/vnd.ms-excel;charset=utf-8"});
        // let url = window.URL.createObjectURL(blob);
        // window.location.href = url;
      })
    },
    handleExportAnalysisReport(row) {
      exportAnalysisReport(row.id).then(response => {
        var blob = new Blob([response], { type: 'data:application/vnd.ms-excel' })
        var downloadUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = downloadUrl
        a.download = '现勘分析报告' + row.selfEvidenceNo + '.xls'
        document.body.appendChild(a)
        a.click()
        // let blob = new Blob([response], {type: "application/vnd.ms-excel;charset=utf-8"});
        // let url = window.URL.createObjectURL(blob);
        // window.location.href = url;
      })
    },
    handleExportExcel() {
      this.downloadLoading = true
      if (this.searchTime) {
        if (this.searchTime[0].toString().length > 10) {
          this.listQuery.beginTime = this.searchTime[0] / 1000
        }
        if (this.searchTime[1].toString().length > 10) {
          this.listQuery.endTime = this.searchTime[1] / 1000
        }
      }
      exportExcel(this.listQuery).then(response => {
        var blob = new Blob([response], { type: 'data:application/vnd.ms-excel' })
        var downloadUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = downloadUrl
        a.download = '现勘报告.xls'
        document.body.appendChild(a)
        a.click()
        this.downloadLoading = false
      })
    },
    reset() {
      this.listQuery = {
        page: 1,
        caseHappenRegion: undefined,
        caseCategory: undefined,
        mainChargerName: undefined,
        supporterName: undefined,
        beginTime: undefined,
        endTime: undefined,
        filters: undefined,
        status: 0
      }
      this.searchTime = ''
    },
    countDict(val, type) {
      if (val) {
        if (val.constructor === Array) {
          val.map(data => {
            const send = {
              name: data,
              cateName: type
            }
            this.$store.dispatch('PostUserUseDict', send)
          })
        } else {
          const send = {
            name: val,
            cateName: type
          }
          this.$store.dispatch('PostUserUseDict', send)
        }
      }
    },
    getList() {
      this.listLoading = true
      searchList(this.listQuery).then(response => {
        this.list = response.list
        this.pages = response.pages

        // Just to simulate the time of the request

        this.listLoading = false
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    remoteSearch(node, value) {
      var p = /^[a-zA-Z]+$/
      if (p.test(value)) {
        if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return true }
      } else {
        if (node.data.label.indexOf(value) > -1) { return true }
      }
    },
    filterSearch(node, value) {
      var p = /^[a-zA-Z]+$/
      if (p.test(value)) {
        if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          return true
        }
      } else {
        if (node.data.label.indexOf(value) > -1) {
          return true
        }
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
            if (data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              return data
            }
          } else {
            if (data.title.indexOf(value) > -1) {
              return data
            }
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
    }

  }
}
</script>

<style scoped>

</style>
