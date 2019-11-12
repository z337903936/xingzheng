<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="用户ID">
        <el-input v-model="listQuery.uid" placeholder="用户ID"/>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="listQuery.phoneNumber" placeholder="手机号码"/>
      </el-form-item>
      <el-form-item label="结算状态">
        <el-select v-model="listQuery.status">
          <el-option key="0" label="全部" value="0" />
          <el-option key="1" label="已提交" value="1" />
          <el-option key="2" label="发送成功" value="2"/>
          <el-option key="3" label="发送失败" value="3"/>
          <el-option key="4" label="延迟" value="4"/>
        </el-select>
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
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" stripe >
      <el-table-column align="center" label="用户ID" width="80px">
        <template slot-scope="scope">
          <span> {{scope.row.uid}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流水号">
        <template slot-scope="scope">
          <span>{{ scope.row.txId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="第三方流水号" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.seqId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumbers }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发送状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">已提交</span>
          <span v-else-if="scope.row.status === 2">发送成功</span>
          <span v-else-if="scope.row.status === 3">发送失败</span>
          <span v-else-if="scope.row.status === 4">延迟</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总数量">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="成功数量">
        <template slot-scope="scope">
          <span>{{ scope.row.successCount }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="失败数量">
        <template slot-scope="scope">
          <span>{{ scope.row.failCount }}</span>
        </template>
      </el-table-column>


    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
  import { listSMSBatchSendResult } from '@/api/stat'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'RMSSendResult',
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
          itemId: '2',
          beginTime: '',
          endTime: '',
          page: 1,
          phoneNumber:'',
          title:'',
          status:'',
          templateId:'',
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
        param.itemId = 1
        if (this.listQuery.beginTime) {
          param.beginTime = this.listQuery.beginTime / 1000
        }
        if (this.listQuery.endTime) {
          param.endTime = this.listQuery.endTime / 1000
        }
        if (this.listQuery.phoneNumber) {
          param.phoneNumber = this.listQuery.phoneNumber
        }
        if (this.listQuery.status) {
          param.status = this.listQuery.status
        }
        param.page = this.listQuery.page
        listSMSBatchSendResult(param).then(data => {
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
