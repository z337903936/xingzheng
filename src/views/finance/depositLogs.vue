<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="项目类型">
        <el-select v-model="listQuery.itemId">
          <el-option key="1" label="超级短信" value="1" />
          <el-option key="2" label="普通短信" value="2"/>
          <el-option key="3" label="营销短信" value="3"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="listQuery.uid" placeholder="用户ID"/>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="listQuery.beginTime"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="请选择开始时间"/>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="listQuery.endTime"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="请选择结束时间"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="流水号" >
        <template slot-scope="scope">
          <span>{{ scope.row.txId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}(uid:{{ scope.row.uid }})</span>
        </template>
      </el-table-column>

      <el-table-column label="业务类型" align="center" >
        <template slot-scope="scope">
          <span v-if="scope.row.itemId==1">富信</span>
          <span v-else-if="scope.row.itemId==2">短信</span>
          <span v-else-if="scope.row.itemId==3">营销短信</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实收金额">
        <template slot-scope="scope">
          <span>{{ scope.row.paidMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单条均价">
        <template slot-scope="scope">
          <span>{{ scope.row.averagePrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态 ">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">未付款</span>
          <span v-else-if="scope.row.status==2">已付款</span>
          <span v-else-if="scope.row.status==3">已审核上帐</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作员">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
import { fetchDepositLogs } from '@/api/finance'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'DepositLogs',
  components: { Pagination },
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
      listQuery: {
        uid: '',
        itemId: '',
        beginTime: '',
        endTime: '',
        page: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const param = {}
      if (this.listQuery.uid) {
        param.uid = this.listQuery.uid
      }
      if (this.listQuery.itemId) {
        param.itemId = this.listQuery.itemId
      }
      if (this.listQuery.beginTime) {
        param.beginTime = this.listQuery.beginTime
      }
      if (this.listQuery.endTime) {
        param.endTime = this.listQuery.endTime
      }
      param.page = this.listQuery.page
      fetchDepositLogs(param).then(data => {
        this.list = data.list
        this.total = data.pages
        this.listLoading = false
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
</style>
