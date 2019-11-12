<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.itemId==0">充值</span>
          <span v-else-if="scope.row.itemId==1">超级短信发送</span>
          <span v-else-if="scope.row.itemId==2">普通短信发送</span>
          <span v-else-if="scope.row.itemId==3">营销短信</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量/金额">
        <template slot-scope="scope">
          <span>{{ scope.row.sendAmount }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import { listPlatformTotalSendStat } from '@/api/stat'

  export default {
    name: 'PlatformTotalSendStat',
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
          itemId: '0',
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

        listPlatformTotalSendStat().then(data => {
          this.list = []
          this.list.push(data)
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
