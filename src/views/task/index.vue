<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="mb10">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
        <el-input v-model="listQuery.caseNo" placeholder="案件编号" style="width: 200px;margin-left: 5px" @keyup.enter.native="handleFilter" />
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <router-link :to="'/permissions/edit-role/'">
          <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" >
            添加
          </el-button>
        </router-link>
      </div>

      <div>
        <!--<el-input v-model="listQuery.caseNo" placeholder="案件编号" style="width: 200px;" @keyup.enter.native="handleFilter" />-->
        <!--<el-input v-model="listQuery.status" placeholder="报告单位" style="width: 200px;" @keyup.enter.native="handleFilter" />-->
        <!--<el-input v-model="listQuery.title" placeholder="报告人" style="width: 200px;" @keyup.enter.native="handleFilter" />-->
        <!--<el-select v-model="listQuery.type" placeholder="案件类别" style="width: 140px">-->
        <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
        <!--</el-select>-->

        <!--<el-button style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleCreate">-->
        <!--删除-->
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
      <el-table-column label="案件编号" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.caseNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务编号" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.instanceNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="案件分类" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.caseCategoryId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案发地点" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案发摘要" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseDigest }}</span>
        </template>
      </el-table-column>
      <el-table-column label="损失情况" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lostDetails }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<style>
    .mb10{
        margin-bottom: 10px;
    }
</style>

<script>
import { fetchList, fetchArticle, createArticle, updateArticle } from '@/api/task'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Task',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        beginTime: undefined,
        endTime: undefined,
        caseNo: undefined,
        status: undefined
      },
      timeRange: '',

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    }

  }
}
</script>
