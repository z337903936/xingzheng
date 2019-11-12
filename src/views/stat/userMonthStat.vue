<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="项目类型">
        <el-select v-model="listQuery.itemId">
          <el-option key="1" label="全部" value="-1"/>
          <el-option key="0" label="充值" value="0"/>
          <el-option key="1" label="超级短信" value="1"/>
          <el-option key="2" label="普通短信" value="2"/>
          <el-option key="3" label="视频云" value="3"/>
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
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名字">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.itemId==0">充值</span>
          <span v-else-if="scope.row.itemId==1">超级短信发送</span>
          <span v-else-if="scope.row.itemId==2">普通短信发送</span>
          <span v-else-if="scope.row.itemId==3">视频云</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="月份">
        <template slot-scope="scope">
          <span>{{ scope.row.month }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送数量">
        <template slot-scope="scope">
          <span>{{ scope.row.sendAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime   | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
  import { listUserMonthSendStat } from '@/api/stat'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'UserMonthStat',
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
          itemId: '-1',
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
        const parma = {}
        if (this.listQuery.uid) {
          parma.uid = this.listQuery.uid
        }
        if (this.listQuery.itemId) {
          parma.itemId = this.listQuery.itemId
        }
        if (this.listQuery.beginTime) {
          parma.beginTime = this.listQuery.beginTime
        }
        if (this.listQuery.endTime) {
          parma.endTime = this.listQuery.endTime
        }
        parma.page = this.listQuery.page
        listUserMonthSendStat(parma).then(data => {
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
